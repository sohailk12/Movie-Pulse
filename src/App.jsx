import { useEffect, useState } from "react"
import { useDebounce } from "react-use";
import Search from "./components/Search"
import Spinner from "./components/Spinner";
import MovieCard from "./components/MovieCard";
import { getTrendingMovies, updateSearchCount } from "./appwrite";

const API_BASE_URL = 'https://api.themoviedb.org/3';
const API_KEY = import.meta.env.VITE_TMDB_API_KEY;

const API_OPTIONS = {
  method: 'GET',
  headers: {
    accept: 'application/json'
  }
};


const App = () => {
  const [searchTerm,setSearchTerm] = useState('');
  const [movies, setMovies] = useState([]);
  const [isloading, setIsLoading] = useState(false);
  const [errorMessage,setErrorMessage] = useState('');

  const [debouncedSearchTerm,setDebouncedSearcTerm] = useState('');

  const [trendingMovies,setTrendingMovies] = useState([]);
  console.log('trendingMovies',trendingMovies);
  useDebounce(() => {
    setDebouncedSearcTerm(searchTerm);
  },1000,[searchTerm]);

  const fetchMovies = async (query='',signal) => {
    setIsLoading(true);
    setErrorMessage('');
    try {
      const normalizedQuery = query.trim();
      const endpoint = normalizedQuery ? 
      `${API_BASE_URL}/search/movie?query=${encodeURIComponent(normalizedQuery)}&api_key=${API_KEY}`
      :
      `${API_BASE_URL}/discover/movie?sort_by=popularity.desc&api_key=${API_KEY}`;
      const response = await fetch(endpoint, { ...API_OPTIONS,signal });
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      const data = await response.json();
      if (data.success === false) {
        setMovies([]);
        throw new Error(data.status_message || 'Failed to fetch movies.');
      }
      setMovies(Array.isArray(data.results) ? data.results : []);
      setErrorMessage('');
      if(normalizedQuery && data.results.length > 0){
          await updateSearchCount(normalizedQuery,data.results[0]);
      }
    } catch (error) {
      if (error.name === 'AbortError') return;
      console.error('Error fetching movies:', error);
      setErrorMessage(error.message || 'An error occurred while fetching movies.');
    } finally {
      setIsLoading(false);
    }
  };

  const loadTrendingMovies = async ()=>{
    try {
      const movies = await getTrendingMovies();
      setTrendingMovies(movies);

    } catch (error) {
      console.error('Error Fetching Trending Movies',error);
    }
  }
  useEffect(() => {
    const controller = new AbortController();
    fetchMovies(debouncedSearchTerm,controller.signal);
    return () => controller.abort();
  }, [debouncedSearchTerm]);

  useEffect(()=>{
    loadTrendingMovies();
  },[])
  return (
    <main>
      <div className="pattern" />
      <div className="wrapper">
        <header>
          <img src="/hero-img.png" alt="Hero Banner" />
          <h1>Find <span className="text-gradient">Movies</span> You'll Enjoy Without the Hassle</h1>
        <Search searchTerm ={searchTerm} setSearchTerm={setSearchTerm} />
        </header>
{trendingMovies.length > 0 && ( <section className="trending">
          <h2>Trending Movies</h2>
          <ul>
            {trendingMovies.map((movie, index) => (
              <li key={movie.$id}>
                <p>{index + 1}</p>
                <img src={movie.poster_url} alt={movie.title} />
              </li>
            ))}
          </ul>
        </section>)}
        <section className="all-movies">
          <h2>All Movies</h2>
          <ul>
            {isloading ? (
              <Spinner />
            ) : errorMessage ? (
              <p className="error-message">{errorMessage}</p>
            ) : (
              movies.map((movie) => (
                <MovieCard key={movie.id} movie={movie} />
              ))
            )}
          </ul>
        </section>
      </div>
    </main>
  )
}

export default App