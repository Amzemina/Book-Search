const jwt = require('jsonwebtoken');
const { GraphQLError } = require('graphql');

// set token secret and expiration date
const secret = 'mysecretsshhhhh';
const expiration = '2h';

module.exports = {
  AuthenticationError: new GraphQLError('Could not authenticate user.', {
    extensions: {
      code: 'UNAUTHENTICATED',
    },
  }),

  authMiddleware: async ({ req }) => {
    if (req.headers.authorization && req.headers.authorization !== 'Bearer null') {
      const user = jwt.verify(req.headers.authorization.split(' ').pop().trim(), secret, { maxAge: expiration });
      
      return { token: req.headers.authorization.split(' ').pop().trim(), user: user };
    } else {
      return { token: req.headers.authorization.split(' ').pop().trim(), user: null };
    }
  },
  
  signToken: function ({ username, email, _id }) {
    const payload = { username, email, _id };

    return jwt.sign({ data: payload }, secret, { expiresIn: expiration });
  },
};
