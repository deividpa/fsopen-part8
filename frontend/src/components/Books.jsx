import { useState } from 'react';
import { useQuery, gql, useSubscription } from "@apollo/client";
import { BOOK_ADDED } from '../queries';

const ALL_BOOKS = gql`
  query getAllBooks($genre: String) {
    allBooks(genre: $genre) {
      title
      author {
        name
      }
      published
      genres
      id
    }
  }
`;

const Books = (props) => {
  const [genre, setGenre] = useState(null);
  const { loading: booksLoading, error: booksError, data: booksData, refetch } = useQuery(ALL_BOOKS, {
    variables: { genre },
    fetchPolicy: "cache-and-network",
  });

  useSubscription(BOOK_ADDED, {
    onData: ({ data, client }) => {
      const addedBook = data.data.bookAdded;
      const dataInStore = client.readQuery({ query: ALL_BOOKS, variables: { genre: null } });

      if (!dataInStore.allBooks.some(book => book.id === addedBook.id)) {
        client.writeQuery({
          query: ALL_BOOKS,
          data: {
            allBooks: [...dataInStore.allBooks, addedBook]
          },
          variables: { genre: null }
        });
      }
    },
  });

  if (!props.show) {
    return null;
  }

  if (booksLoading) return <p>Loading...</p>;
  if (booksError) return <p>Error: {booksError.message}</p>;

  const books = booksData ? booksData.allBooks : [];
  const allGenres = [...new Set(books.flatMap(book => book.genres))];

  return (
    <div>
      <h2>books</h2>
      <h3>
        Showing books {genre ? `in genre: ${genre}` : 'from all genres'}
      </h3>
      {books.length === 0 ? (
        <p>No books available for the selected genre.</p>
      ) : (
        <table>
          <tbody>
            <tr>
              <th>Title</th>
              <th>author</th>
              <th>published</th>
            </tr>
            {books.map((book) => (
              <tr key={book.id}>
                <td>{book.title}</td>
                <td>{book.author.name}</td>
                <td>{book.published}</td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
      <div>
        <h3>Filter by genre</h3>
        <button onClick={() => setGenre(null)}>All Genres</button>
        {allGenres.map(genre => (
          <button key={genre} onClick={() => setGenre(genre)}>{genre}</button>
        ))}
      </div>
    </div>
  );
}

export default Books;
