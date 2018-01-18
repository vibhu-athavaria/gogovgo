import React from "react";
import ReactDOM from "react-dom";
import { ApolloClient, ApolloProvider, createNetworkInterface } from "react-apollo";
import { CookiesProvider } from "react-cookie";
import App from "./App";

const networkInterface = createNetworkInterface({
    uri:
        process.env.NODE_ENV === "development"
            ? "http://localhost:8030/graphql"
            : "https://rateyourpolitician.org/graphql"
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
