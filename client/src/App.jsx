import './App.css';
import { Outlet } from 'react-router-dom';
import Navbar from './components/Navbar';

import { ApolloClient, ApolloProvider, createHttpLink, InMemoryCache } from '@apollo/client';
const httpLink = createHttpLink({
  uri: '/graphql',
    // Set the 'Authorization' header with your token here
    headers: {
      Authorization: `Bearer ${localStorage.getItem('id_token')}`,
    },
});


const client = new ApolloClient({
  link: httpLink,
  cache: new InMemoryCache(),
});

function App() {
  return (
    <ApolloProvider client={client}>
      <Navbar />
      <Outlet />
    </ApolloProvider>
  );
}

export default App;
