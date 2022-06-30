const { expressjwt: jwt } = require("express-jwt");

// Instantiate the JWT token validation middleware
const isAuthenticated = (req, res, next) => {
  console.log("checking auth");
  console.log(req.cookies);

  if (req.user) {
    console.log("req.user found", req.user);
    return next();
  }

  console.log("req.user not found, checking JWT");

  return jwt({
    secret: process.env.TOKEN_SECRET,
    algorithms: ["HS256"],
    requestProperty: "user",
    getToken: getTokenFromHeaders,
  });
};

// Function used to extract the JWT token from the request's 'Authorization' Headers
function getTokenFromHeaders(req) {
  // Check if the token is available on the request Headers
  if (
    req.headers.authorization &&
    req.headers.authorization.split(" ")[0] === "Bearer"
  ) {
    // Get the encoded token string and return it
    const token = req.headers.authorization.split(" ")[1];
    return token;
  }

  return null;
}

// Export the middleware so that we can use it to create protected routes
module.exports = isAuthenticated;
