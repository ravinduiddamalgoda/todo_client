import bodyParser from 'body-parser';
import express from 'express';
import userRouter from './src/routes/user.route';
import { connect } from './src/utils/db';
import { ApolloServer } from 'apollo-server-express';
import { typeDefs } from './src/graphql/typeDefs';
import { resolvers } from './src/graphql/resolver';
import { expressjwt } from 'express-jwt';
const http = require('http');
const isAuth = require('./src/middleware/isauth');

const app = express();
app.use(bodyParser.json());

app.use(userRouter);

app.use(isAuth);

let apolloServer = null;
async function startServer() {
  apolloServer = new ApolloServer({
    typeDefs,
    resolvers,
    context: ({ res, req }) => ({
      req,
      res,
    }),
  });
  await apolloServer.start();
  apolloServer.applyMiddleware({ app });
}
startServer();
const httpserver = http.createServer(app);

connect()
  .then(() => {
    console.log('Database Connected');
    app.listen(5000, () => {
      console.log('Server 01 Started');
    });
  })
  .catch(err => {
    console.error('Connection ERROR', err);
  });
