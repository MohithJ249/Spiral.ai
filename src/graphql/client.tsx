import { ApolloClient, InMemoryCache } from '@apollo/client';
import { loadErrorMessages, loadDevMessages } from "@apollo/client/dev";
loadErrorMessages();

const client = new ApolloClient({
  uri: 'https://spiral-backend-9793e325e89f.herokuapp.com',
  cache: new InMemoryCache(),
});

export default client;