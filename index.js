const { ApolloServer} = require('apollo-server');
const { PubSub } = require('graphql-subscriptions');
const gql = require('graphql-tag');
const mongoose = require('mongoose');

const typeDefs = require('./graphql/typeDefs');
const resolvers = require('./graphql/resolvers');
const {MONGO_URI} = require('./config');

const pubsub = new PubSub();

const server = new ApolloServer({
    typeDefs,
    resolvers,
    context: ({req})=>({req, pubsub})
});

mongoose
    .connect(MONGO_URI,{useNewUrlParser: true, useUnifiedTopology: true})
    .then(()=>{
        console.log("MongoDB connected!")
        return server.listen({port: process.env.PORT || 5000});
    })
    .then(res => {
        console.log(`Server running at ${res.url}`);
    })
    .catch(err => {
        console.error(err);
    })