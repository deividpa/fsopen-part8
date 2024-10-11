import { gql } from '@apollo/client';

export const LOGIN = gql`
  mutation login($username: String!, $password: String!) {
    login(username: $username, password: $password)  {
      value
    }
  }
`;

export const BOOK_ADDED = gql`
  subscription {
    bookAdded {
      title
      author {
        name
      }
      published
      genres
    }
  }
`;
