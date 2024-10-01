import { useState } from 'react';
import { useQuery, useMutation, gql } from '@apollo/client';


const ALL_AUTHORS = gql`
  query {
    allAuthors {
      name
      born
      bookCount
    }
  }
`;

const EDIT_AUTHOR = gql`
  mutation EditAuthor($name: String!, $setBornTo: Int!) {
    editAuthor(name: $name, setBornTo: $setBornTo) {
      name
      born
    }
  }
`;

const SetBirthYear = () => {
  const { data, loading, error } = useQuery(ALL_AUTHORS);
  const [editAuthor] = useMutation(EDIT_AUTHOR, {
    refetchQueries: [{ query: ALL_AUTHORS }],
    onError: (error) => {
      console.error('Error updating birth year:', error.message);
    }
  });

  const [name, setName] = useState('');
  const [born, setBorn] = useState('');

  if (loading) return <p>Loading...</p>;
  if (error) return <p>Error: {error.message}</p>;

  const submit = async (event) => {
    event.preventDefault();
    editAuthor({ variables: { name, setBornTo: parseInt(born) } });

    setName('');
    setBorn('');
  };

  return (
    <div>
      <h2>Set birth year</h2>
      <form onSubmit={submit}>
        <div>
          <label>Author</label>
          <select value={name} onChange={({ target }) => setName(target.value)}>
            <option value="">Select author</option>
            {data.allAuthors.map((author) => (
              <option key={author.name} value={author.name}>
                {author.name}
              </option>
            ))}
          </select>
        </div>
        <div>
          <label>Year of birth</label>
          <input
            type="number"
            value={born}
            onChange={({ target }) => setBorn(target.value)}
          />
        </div>
        <button type="submit">Update author</button>
      </form>
    </div>
  );
};

export default SetBirthYear;
