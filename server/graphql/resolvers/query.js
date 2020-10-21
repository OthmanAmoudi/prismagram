const User = require("../../models/user");
const authorize = require("../../utils/isAuth");
const {
  UserInputError,
  AuthenticationError,
  ApolloError,
} = require("apollo-server-express");

module.exports = {
  Query: {
    hello: async (parent, args, context, info) => {
      return "hello back";
    },

    getUser: async (parent, args, context, info) => {
      try {
        const req = authorize(context.req);
        const user = await User.findOne({ _id: args.id });
        // console.log({ req });
        if (user._id.toString() !== req._id.toString()) {
          throw new AuthenticationError("Not Authorized");
        }
        return user;
        // return {
        //   name: user.name,
        //   email: user.email,
        // };
      } catch (e) {
        throw new AuthenticationError(e);
      }
    },
  },
};
