const jsonwebtoken = require("jsonwebtoken");
const { getPayloadForUserId } = require("../helpers/userPayload");

// Instantiate the JWT token validation middleware
const isAuthenticated = async (req, res, next) => {
  if (req.user) {
    console.log("req.user found", req.user);
    return next();
  }

  if (
    !req.headers.authorization ||
    req.headers.authorization.split(" ")[0] !== "Bearer"
  ) {
    res.status(401).json({ message: "Invalid Authorization header" });
    return;
  }

  try {
    const token = req.headers.authorization.replace("Bearer ", "");
    const decodedJwt = jsonwebtoken.verify(token, process.env.TOKEN_SECRET);
    const { _id } = decodedJwt;

    // req is the same object for each middleware/route handler
    // over the course of a request's lifetime
    req.user = await getPayloadForUserId(_id);
  } catch (error) {
    // invalid token
    res.status(401).json({ message: "Invalid token" });
    return;
  }

  // If the user is authenticated, run next
  next();
};

// Function used to extract the JWT token from the request's 'Authorization' Headers
function getTokenFromHeaders(req) {
  // Check if the token is available on the request Headers
  if (
    req.headers.authorization &&
    req.headers.authorization.split(" ")[0] === "Bearer"
  ) {
    // console.log("authorization found", req.headers.authorization);
    // Get the encoded token string and return it
    const token = req.headers.authorization.split(" ")[1];
    return token;
  }

  // console.log("tokens not found, returning null");
  return null;
}

// Export the middleware so that we can use it to create protected routes
module.exports = isAuthenticated;
