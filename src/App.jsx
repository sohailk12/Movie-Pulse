import { useEffect, useState } from "react"
import Search from "./components/Search"

const API_BASE_URL = 'https://api.themoviedb.org/3';
const API_KEY = import.meta.env.VITE_TMDB_API_KEY;

const API_OPTIONS = {
  method: 'GET',
  headers: {
    accept: 'application/json',
    Authorization: `Bearer ${API_KEY}`
  }
};


const App = () => {
  const [searchTerm,setSearchTerm] = useState('');
  const [movies, setMovies] = useState([]);
  const [isloading, setIsLoading] = useState(false);
  const [errorMessage,setErrorMessage] = useState('');

  const fetchMovies = async () => {
    setIsLoading(true);
    setErrorMessage('');
    try {
      const endpoint = `${API_BASE_URL}/discover/movie?sort_by=popularity.desc`;
      const response = await fetch(endpoint, API_OPTIONS);
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      const data = await response.json();
      if(data.response === 'False') {
        throw new Error(data.error || 'Failed to fetch movies.');
        setMovies([]);
        return;
      }
      setMovies(data.results || []);
      setErrorMessage('');
    } catch (error) {
      console.error('Error fetching movies:', error);
      setErrorMessage(error.message || 'An error occurred while fetching movies.');
    } finally {
      setIsLoading(false);
    }
  };
  useEffect(() => {
    fetchMovies();
  }, []);

  return (
    <main>
      <div className="pattern" />
      <div className="wrapper">
        <header>
          <img src="/hero-img.png" alt="Hero Banner" />
          <h1>Find <span className="text-gradient">Movies</span> You'll Enjoy Without the Hassle</h1>
        <Search searchTerm ={searchTerm} setSearchTerm={setSearchTerm} />
        </header>
        <section className="all-movies">
          <h2 className="mt-10">All Movies</h2>
          <ul>
            {isloading ? (
              <p className="text-white">Loading movies...</p>
            ) : errorMessage ? (
              <p className="error-message">{errorMessage}</p>
            ) : (
              movies.map((movie) => (
                <p key={movie.id} className="text-white">{movie.title}</p>
              ))
            )}
          </ul>
        </section>
      </div>
    </main>
  )
}

export default App