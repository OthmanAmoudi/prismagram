const jwt = require("jsonwebtoken");
require("dotenv").config();
const { AuthenticationError } = require("apollo-server-express");

const authorize = (req) => {
  const authorizationHeader = req.headers.authorization || "";
  if (!authorizationHeader) {
    req.isAuth = false;
    throw new AuthenticationError("Authentication Error 1");
  }
  const token = authorizationHeader.replace("Bearer ", "");
  if (!token) {
    req.isAuth = false;
    throw new AuthenticationError("Authentication Error 2");
  }
  ////
  let decodedJWT;
  try {
    decodedJWT = jwt.verify(token, process.env.JWT_SECRET);
    if (!decodedJWT) {
      req.isAuth = false;
      throw new AuthenticationError("Authentication Error 3");
    }
    console.log(decodedJWT);
    req.isAuth = true;
    req._id = decodedJWT._id;
    req.email = decodedJWT.email;
  } catch (e) {
    req.isAuth = false;
    throw new AuthenticationError("Authentication Error 4");
  }
  return req;
};

module.exports = authorize;
