import {
  CastMember,
  Movie,
  MovieDetail,
  TMDBCastMember,
  TMDBMovie,
  TMDBMovieChangesResponse,
  TMDBMovieDetail,
  TMDBMovieResponse,
  TMDBVideo,
} from "@/types/movie";

export const BASE_URL = process.env.EXPO_PUBLIC_TMDB_BASE_URL!;
export const API_KEY = process.env.EXPO_PUBLIC_TMDB_API_KEY!;
const IMAGE_BASE_URL = "https://image.tmdb.org/t/p";
const YOUTUBE_WATCH_URL = "https://www.youtube.com/watch?v=";
const DEFAULT_DISCOVER_PARAMS =
  "include_adult=false&include_video=false&language=en-US&page=1";
const CHANGED_MOVIES_PAGE_SIZE = 20;

function mapMovie(movie: TMDBMovie): Movie {
  return {
    id: movie.id,
    title: movie.title,
    backdrop: movie.backdrop_path
      ? `${IMAGE_BASE_URL}/original${movie.backdrop_path}`
      : "",
    poster: movie.poster_path
      ? `${IMAGE_BASE_URL}/w500${movie.poster_path}`
      : "",
    rating: movie.vote_average,
    releaseDate: movie.release_date,
    overview: movie.overview,
  };
}

function mapCastMember(member: TMDBCastMember): CastMember {
  return {
    id: member.id,
    name: member.name,
    character: member.character,
    avatar: member.profile_path
      ? `${IMAGE_BASE_URL}/w185${member.profile_path}`
      : "",
  };
}

function getPreferredYouTubeVideo(videos: TMDBVideo[] = []) {
  const youtubeVideos = videos.filter((video) => video.site === "YouTube");
  const preferred =
    youtubeVideos.find((video) => video.official && video.type === "Trailer") ??
    youtubeVideos.find((video) => video.type === "Trailer") ??
    youtubeVideos.find((video) => video.official && video.type === "Teaser") ??
    youtubeVideos[0];

  return preferred?.key;
}

function withYouTubeKey(movie: Movie, youtubeKey?: string): Movie {
  if (!youtubeKey) {
    return movie;
  }

  return {
    ...movie,
    youtubeKey,
    youtubeUrl: `${YOUTUBE_WATCH_URL}${youtubeKey}`,
  };
}

async function getMovieYouTubeKey(movieId: number) {
  const url = `${BASE_URL}/movie/${movieId}/videos?api_key=${API_KEY}&language=en-US`;
  const response = await fetch(url);

  if (!response.ok) {
    return undefined;
  }

  const data = (await response.json()) as { results?: TMDBVideo[] };

  return getPreferredYouTubeVideo(data.results);
}

async function enrichMoviesWithYouTubeKeys(
  movies: Movie[],
  limit = movies.length,
) {
  const featuredMovies = movies.slice(0, limit);
  const rest = movies.slice(limit);
  const enrichedFeaturedMovies = await Promise.all(
    featuredMovies.map(async (movie) => {
      const youtubeKey = await getMovieYouTubeKey(movie.id);

      return withYouTubeKey(movie, youtubeKey);
    }),
  );

  return [...enrichedFeaturedMovies, ...rest];
}

export async function getNowPlayingMovies(): Promise<Movie[]> {
  const url = `${BASE_URL}/movie/now_playing?api_key=${API_KEY}&language=en-US&page=1`;
  const response = await fetch(url);
  const data = await response.json();

  if (!data.results) {
    return [];
  }

  return enrichMoviesWithYouTubeKeys(data.results.map(mapMovie), 5);
}

async function getDiscoverMovies(query: string): Promise<Movie[]> {
  const url = `${BASE_URL}/discover/movie?api_key=${API_KEY}&${DEFAULT_DISCOVER_PARAMS}&${query}`;
  const response = await fetch(url);

  if (!response.ok) {
    throw new Error("Failed to fetch movies");
  }

  const data = await response.json();

  if (!data.results) {
    return [];
  }

  return data.results.map(mapMovie);
}

function formatDate(date: Date) {
  return date.toISOString().split("T")[0];
}

export async function getPopularMovies(): Promise<Movie[]> {
  return getDiscoverMovies("sort_by=popularity.desc");
}

export async function getTopRatedMovies(): Promise<Movie[]> {
  return getDiscoverMovies(
    "sort_by=vote_average.desc&without_genres=99,10755&vote_count.gte=200",
  );
}

export async function getUpcomingMovies(): Promise<Movie[]> {
  const minDate = new Date();
  const maxDate = new Date();
  maxDate.setMonth(maxDate.getMonth() + 3);

  return getDiscoverMovies(
    `sort_by=popularity.desc&with_release_type=2%7C3&release_date.gte=${formatDate(
      minDate,
    )}&release_date.lte=${formatDate(maxDate)}`,
  );
}

export async function getMovieDetails(movieId: number): Promise<MovieDetail> {
  const url = `${BASE_URL}/movie/${movieId}?api_key=${API_KEY}&language=en-US&append_to_response=credits,videos`;
  const response = await fetch(url);

  if (!response.ok) {
    throw new Error("Failed to fetch movie details");
  }

  const movie = (await response.json()) as TMDBMovieDetail;

  const youtubeKey = getPreferredYouTubeVideo(movie.videos?.results);

  return {
    ...withYouTubeKey(mapMovie(movie), youtubeKey),
    genres: movie.genres,
    runtime: movie.runtime,
    tagline: movie.tagline,
    status: movie.status,
    cast: movie.credits?.cast.slice(0, 8).map(mapCastMember) ?? [],
  };
}

async function getMovieSummary(movieId: number): Promise<Movie | null> {
  const url = `${BASE_URL}/movie/${movieId}?api_key=${API_KEY}&language=en-US`;
  const response = await fetch(url);

  if (!response.ok) {
    return null;
  }

  const movie = (await response.json()) as TMDBMovie;

  if (!movie.title || (!movie.poster_path && !movie.backdrop_path)) {
    return null;
  }

  return mapMovie(movie);
}

export async function getChangedMovies(page = 1) {
  const url = `${BASE_URL}/movie/changes?api_key=${API_KEY}&page=${page}`;
  const response = await fetch(url);

  if (!response.ok) {
    throw new Error("Failed to fetch changed movies");
  }

  const data = (await response.json()) as TMDBMovieChangesResponse;
  const movieIds = data.results
    .filter((change) => !change.adult)
    .slice(0, CHANGED_MOVIES_PAGE_SIZE)
    .map((change) => change.id);

  const settledMovies = await Promise.allSettled(
    movieIds.map((movieId) => getMovieSummary(movieId)),
  );

  return {
    page: data.page,
    totalPages: data.total_pages,
    movies: settledMovies
      .map((result) => (result.status === "fulfilled" ? result.value : null))
      .filter((movie): movie is Movie => Boolean(movie)),
  };
}

export async function getSimilarMovies(movieId: number): Promise<Movie[]> {
  const url = `${BASE_URL}/movie/${movieId}/similar?api_key=${API_KEY}&language=en-US&page=1`;
  const response = await fetch(url);

  if (!response.ok) {
    throw new Error("Failed to fetch similar movies");
  }

  const data = await response.json();

  if (!data.results) {
    return [];
  }

  return data.results.map(mapMovie);
}

export async function discoverMovies(page = 1) {
  const url = `${BASE_URL}/discover/movie?api_key=${API_KEY}&include_adult=false&include_video=false&language=en-US&page=${page}&sort_by=popularity.desc`;
  const response = await fetch(url);

  if (!response.ok) {
    throw new Error("Failed to discover movies");
  }

  const data = (await response.json()) as TMDBMovieResponse;

  return {
    page: data.page,
    totalPages: data.total_pages,
    movies: (data.results || []).map(mapMovie),
  };
}

export async function searchMovies(query: string, page = 1) {
  const url = `${BASE_URL}/search/movie?api_key=${API_KEY}&query=${encodeURIComponent(query)}&include_adult=false&language=en-US&page=${page}`;
  const response = await fetch(url);

  if (!response.ok) {
    throw new Error("Failed to search movies");
  }

  const data = (await response.json()) as TMDBMovieResponse;

  return {
    page: data.page,
    totalPages: data.total_pages,
    movies: (data.results || []).map(mapMovie),
  };
}
