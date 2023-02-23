import User from '../models/user.model';
import Todo from '../models/todo.model';
import { ApolloError } from 'apollo-server-errors';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';

interface JwtPayload {
  user_id: any;
}

export const resolvers = {
  Query: {
    async getUsers() {
      return await User.find();
    },

    async getUserById(_: any, { ID }: any) {
      return await User.findById(ID);
    },

    async getTodo() {
      return await Todo.find();
    },
  },

  Mutation: {
    async registerUser(
      _: any,
      { userInput: { fname, lname, password, email, role } }: any
    ) {
      const oldeUser = await User.findOne({ email });

      if (oldeUser) {
        throw new ApolloError(
          'A user is alrady registered with the email' + email,
          'USER_ALRADY_EXSITS'
        );
      }

      var encryptedPassword = await bcrypt.hash(password, 10);

      const newUser = new User({
        fname: fname,
        lname: lname,
        password: encryptedPassword,
        email: email.toLowerCase(),
        role: role,
      });

      await newUser.save();

      return newUser;
    },

    async userLogin(_: any, { loginInput: { email, password } }: any) {
      const user = await User.findOne({ email });

      if (user && (await bcrypt.compare(password, user.password))) {
        var token = jwt.sign({ user_id: user._id, email }, 'SUPER_SECRET', {
          expiresIn: '3000',
        });
        user.token = token;

        return user;
      } else {
        throw new ApolloError('Incorrect password', 'INCORRECT_PASSOWRD');
      }
    },

    createTodo: async (_: any, { todoInput: { title } }: any, { req }: any) => {
      if (!req.isAuth) {
        throw new Error('Unauthenticated');
      }
      const newTodo = new Todo({
        title: title,
      });

      await newTodo.save();

      return newTodo;
    },

    async editTodo(_: any, { _id, editInput }: any, { req }: any) {
      if (!req.isAuth) {
        throw new Error('Unauthenticated');
      }

      return await Todo.findOneAndUpdate({ _id }, editInput, { new: true });
    },

    async deleteTodo(_: any, { _id }: any, { req }: any) {
      if (!req.isAuth) {
        throw new Error('Unauthenticated');
      }
      return await Todo.findByIdAndRemove({ _id });
    },
  },
};

module.exports = { resolvers };
