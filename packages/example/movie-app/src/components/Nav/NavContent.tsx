import {
  FireIcon,
  HomeIcon,
  SearchIcon,
  TrendingIcon,
  UpcomingIcon,
} from "../../icons";
import { NavSection } from "./NavSection";
import { NavTitle } from "./NavTitle";
import { SearchForm } from "./SearchForm";
import { NavMovieList } from "./NavMovieList";
import { Alert } from "../Alert";
import { getNavBarMovies } from "../../getData";

export function NavContentSkeleton() {
  return (
    <div className="animate-pulse flex flex-col gap-4">
      <div className="h-11 bg-zinc-900 rounded-lg" />
      <div className="flex flex-col gap-2">
        <div className="h-24 bg-zinc-900 rounded-lg" />
        <div className="h-24 bg-zinc-900 rounded-lg" />
        <div className="h-24 bg-zinc-900 rounded-lg" />
        <div className="h-24 bg-zinc-900 rounded-lg" />
        <div className="h-24 bg-zinc-900 rounded-lg" />
        <div className="h-24 bg-zinc-900 rounded-lg" />
        <div className="h-24 bg-zinc-900 rounded-lg" />
      </div>
    </div>
  );
}

export async function NavContent() {
  if (!process.env.THEMOVIEDB_API_KEY) {
    return (
      <Alert>
        You need to set the <code>THEMOVIEDB_API_KEY</code> environment variable
        in a `.env` file.
      </Alert>
    );
  }

  const [popularMovies, topRatedMovies, upcomingMovies] =
    await getNavBarMovies();

  if (!popularMovies || !topRatedMovies || !upcomingMovies) {
    return <Alert>No movies found</Alert>;
  }

  return (
    <nav className="flex flex-col gap-10 mt-8 p-4">
      <NavSection>
        <a href="/">
          <NavTitle>
            <HomeIcon />
            Home
          </NavTitle>
        </a>
      </NavSection>
      <NavSection>
        <NavTitle>
          <SearchIcon />
          Search
        </NavTitle>
        <SearchForm />
      </NavSection>
      <NavSection>
        <NavTitle>
          <FireIcon />
          Popular Movies
        </NavTitle>
        <NavMovieList movies={popularMovies.results} />
      </NavSection>
      <NavSection>
        <NavTitle>
          <TrendingIcon />
          Top rated Movies
        </NavTitle>
        <NavMovieList movies={topRatedMovies.results} />
      </NavSection>
      <NavSection>
        <NavTitle>
          <UpcomingIcon />
          Upcoming Movies
        </NavTitle>
        <NavMovieList movies={upcomingMovies.results} />
      </NavSection>
    </nav>
  );
}
