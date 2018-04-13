import React from "react";
import ReactDOM from "react-dom";
import { ApolloClient, ApolloProvider, createNetworkInterface } from "react-apollo";
import { CookiesProvider } from "react-cookie";
import App from "./App";

const networkInterface = createNetworkInterface({
    uri: process.env.REACT_APP_GRAPHQL_URL
});

const client = new ApolloClient({
    networkInterface: networkInterface
});

const Root = () => (
    <ApolloProvider client={client}>
        <CookiesProvider>
            <App />
        </CookiesProvider>
    </ApolloProvider>
);

ReactDOM.render(<Root />, document.getElementById("root-elm"));
