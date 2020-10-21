require("dotenv").config();
const express = require("express");
const { ApolloServer } = require("apollo-server-express");
const mongoose = require("mongoose");

//grahql typeds
const typeDefs = require("./graphql/schema");
const { Query } = require("./graphql/resolvers/query");
const { Mutation } = require("./graphql/resolvers/mutation");
const app = express();
const server = new ApolloServer({
  typeDefs,
  resolvers: {
    Query,
    Mutation,
  },
  context: ({ req }) => {
    req.headers.authorization =
      "Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJfaWQiOiI1ZjdmZjhkMjI0ODNiYjA5NzFmMGQ5MjEiLCJlbWFpbCI6InJlZEBmYW42LmNvbSIsImlhdCI6MTYwMjY3NjI0MiwiZXhwIjoxNjAzMjgxMDQyfQ.tJrbmEgnLcoQ7ARwhDqgcPLb2x007HmS6BPn5RRzdXs";
    return { req };
  },
});

server.applyMiddleware({ app });

const PORT = process.env.PORT || 5000;

let url = process.env.DB_CONSTR.replace(
  "<DB_USERNAME>",
  process.env.DB_USERNAME
)
  .replace("<DB_PASSWORD>", process.env.DB_PASSWORD)
  .replace("<DB_NAME>", process.env.DB_NAME);

mongoose
  .connect(url, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
    useFindAndModify: false,
    useCreateIndex: true,
  })
  .then(() =>
    app.listen(PORT, () => console.log(`server started on port ${PORT}`))
  )
  .catch((e) => console.log("---DB ERROR---", e));
