import { useState, useEffect } from 'react';
import { useQuery, gql } from '@apollo/client';

const ALL_BOOKS = gql`
  query getAllBooks($genre: String) {
    allBooks(genre: $genre) {
      title
      author {
        name
      }
      published
      genres
    }
  }
`;

const ME = gql`
  query {
    me {
      favoriteGenre
    }
  }
`;

const RecommendedBooks = ({ show }) => {
  const [genre, setGenre] = useState(null);

  const { data: userData, loading: userLoading } = useQuery(ME);
  const { loading: booksLoading, error: booksError, data: booksData } = useQuery(ALL_BOOKS, {
    variables: { genre },
    skip: !genre,
    fetchPolicy: "cache-and-network",
  });

  useEffect(() => {
    if (userData && userData.me) {
      setGenre(userData.me.favoriteGenre);
    }
  }, [userData]);

  if (!show) {
    return null;
  }

  if (userLoading || booksLoading) return <p>Loading...</p>;
  if (booksError) return <p>Error: {booksError.message}</p>;

  const books = booksData?.allBooks || [];

  return (
    <div>
      <h2>Recommended Books</h2>
      <h3>Books in your favorite genre: {genre}</h3>

      {books.length === 0 ? (
        <p>No books available for the selected genre.</p>
      ) : (
        <table>
          <tbody>
            <tr>
              <th>Title</th>
              <th>Author</th>
              <th>Published</th>
            </tr>
            {books.map((book) => (
              <tr key={book.title}>
                <td>{book.title}</td>
                <td>{book.author.name}</td>
                <td>{book.published}</td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
};

export default RecommendedBooks;
