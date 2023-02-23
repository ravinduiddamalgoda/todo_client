import { gql } from 'apollo-server';

export const typeDefs = gql`
  type User {
    fname: String!
    lname: String!
    password: String!
    email: String!
    role: String!
    token: String!
  }

  type Todo {
    title: String!
    status: String!
  }

  input UserInput {
    fname: String!
    lname: String!
    password: String!
    email: String!
    role: String!
  }

  input LoginInput {
    email: String!
    password: String!
  }

  input TodoInput {
    title: String!
  }

  input EditInput {
    title: String!
    status: String!
  }

  type Query {
    getUsers: [User!]!
    getTodo: [Todo]!
    getUserById(ID: ID!): User!
  }

  type Mutation {
    registerUser(userInput: UserInput): User!
    userLogin(loginInput: LoginInput): User!
    createTodo(todoInput: TodoInput): Todo!
    editTodo(_id: ID!, editInput: EditInput): Todo!
    deleteTodo(_id: ID!): Todo!
  }
`;
module.exports = { typeDefs };
