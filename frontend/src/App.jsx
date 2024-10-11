import { useState, useEffect } from "react";
import { useApolloClient, useSubscription } from "@apollo/client";
import Authors from "./components/Authors";
import Books from "./components/Books";
import NewBook from "./components/NewBook";
import LoginForm from './components/LoginForm';
import RecommendedBooks from "./components/RecommendedBooks";
import { BOOK_ADDED } from './queries';

const App = () => {
  const [token, setToken] = useState(null);
  const [errorMessage, setErrorMessage] = useState(null);
  const [page, setPage] = useState("authors");
  const client = useApolloClient();

  // Suscribirse a nuevos libros añadidos
  useSubscription(BOOK_ADDED, {
    onData: ({ data }) => {
      const addedBook = data.data.bookAdded;
      window.alert(`New book added: ${addedBook.title} by ${addedBook.author.name}`);
    },
  });

  useEffect(() => {
    const token = localStorage.getItem('library-user-token');
    if (token) {
      setToken(token);
    }
  }, []);

  const logout = () => {
    setToken(null);
    localStorage.clear();
    client.resetStore();
  }

  if (!token) {
    return (
      <div>
        <h2>Login</h2>
        <LoginForm setToken={setToken} setError={setErrorMessage} />
        {errorMessage && <div style={{ color: 'red' }}>{errorMessage}</div>}
      </div>
    );
  }

  return (
    <div>
      <div>
        <button onClick={() => setPage("authors")}>authors</button>
        <button onClick={() => setPage("books")}>books</button>
        <button onClick={() => setPage("add")}>add book</button>
        <button onClick={() => setPage("recommended")}>recommended</button>
        <button onClick={logout}>logout</button>
      </div>

      <Authors show={page === "authors"} />
      <Books show={page === "books"} />
      <NewBook show={page === "add"} />
      <RecommendedBooks show={page === "recommended"} />
    </div>
  );
};

export default App;