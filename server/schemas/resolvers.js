const { User } = require('../models');
const { signToken } = require('../utils/auth');

const resolvers = {
    Query: {
        me: async (parent, args, context) => {
            if (context.user) {
                const userData =  await User.findOne({ _id: context.user.data._id }); 
                 return userData;
            }

            throw new Error('Not logged in');
        },
    },

    Mutation: {
        login: async (parent, { email, password }) => {
            const user = await User.findOne({ email });

            if(!user) {
                throw new Error('Incorrect credentials');
            }

            const correctPw = await user.isCorrectPassword(password);

            if(!correctPw) {
                throw new Error('Incorrect credentials');
            }

            const token = signToken(user);
            return { token, user };
        },

        addUser: async (parent, args) => {
            
            const user = await User.create(args);
            const token = signToken(user);
            return { token, user };
             
        },

        saveBook: async (parent, args, context) => {
            console.log(parent, args, context  )
            if(context.user) {
                const updatedUser = await User.findByIdAndUpdate(
                    { _id: context.user.data._id },
                    { $push: { savedBooks: args.input, } },
                    { new: true }
                );

                return updatedUser;
            }

            throw new Error('You need to be logged in!');
        },

        removeBook: async (parent, { bookId }, context) => {
            if(context.user) {
                const updatedUser = await User.findOneAndUpdate(
                    { _id: context.user.data._id },
                    { $pull: { savedBooks: { bookId } } },
                    { new: true }
                );

                return updatedUser;
            }

            throw new Error('You need to be logged in!');
        },
    },
};

module.exports = resolvers;