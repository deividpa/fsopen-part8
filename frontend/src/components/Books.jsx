import React, { useState } from 'react'
import { useQuery, gql } from "@apollo/client";


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
`

const Books = (props) => {

  const [genre, setGenre] = useState(null)

  const { loading, error, data } = useQuery(ALL_BOOKS, {
    variables: { genre },
  })

  if (!props.show) {
    return null
  }

  if (loading) return <p>Loading...</p>;
  if (error) return <p>Error: {error.message}</p>;

  const books = data.allBooks;
  const allGenres = [...new Set(books.flatMap(book => book.genres))]

  return (
    <div>
      <h2>books</h2>
      <table>
        <tbody>
          <tr>
            <th>Title</th>
            <th>author</th>
            <th>published</th>
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
      <div>
        <h3>Filter by genre</h3>
        <button onClick={() => setGenre(null)}>All Genres</button>
        {allGenres.map(g => (
          <button key={g} onClick={() => setGenre(g)}>{g}</button>
        ))}
      </div>
    </div>
  )
}

export default Books
