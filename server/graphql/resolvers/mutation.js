const User = require("../../models/user");
const {
  UserInputError,
  AuthenticationError,
  ApolloError,
} = require("apollo-server-express");

module.exports = {
  Mutation: {
    authUser: async (parent, args, context, info) => {
      try {
        const user = await User.findOne({ email: args.fields.email });
        if (!user) {
          throw new AuthenticationError("User not found");
        }
        const checkPassword = await user.comparePassword(args.fields.password);
        if (!checkPassword) {
          throw new AuthenticationError("passwords does not match");
        }
        const getToken = await user.generateToken();
        if (!getToken) {
          throw new AuthenticationError("something went wrong");
        }
        return {
          _id: user._id,
          email: user.email,
          name: user.name,
          token: getToken.token,
        };
      } catch (e) {
        console.log(e);
      }
    },
    signUp: async (parent, args, context, info) => {
      try {
        const user = new User({
          email: args.fields.email,
          password: args.fields.password,
        });

        const getToken = await user.generateToken();
        if (!getToken) {
          throw new AuthenticationError(
            "Something went wrong with authentication"
          );
        }
        const result = await user.save();
        return { ...result._doc };
      } catch (err) {
        if (err.code === 11000) {
          throw new AuthenticationError("Sorry, email already in use");
        }
        throw err;
      }
    },
  },
};
