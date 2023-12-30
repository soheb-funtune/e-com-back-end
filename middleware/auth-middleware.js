// authMiddleware.js

const jwt = require("jsonwebtoken");

const isAuthenticated = (req, res, next) => {
  // Get the token from the request headers or cookies
  let token;

  // Check if the Authorization header is present and starts with "Bearer "
  // console.log("{ token }", req.headers);
  const authHeader = req.headers.authorization;
  if (authHeader && authHeader.startsWith("Bearer ")) {
    token = authHeader.slice(7); // Extract the token after "Bearer "
  } else {
    // If Authorization header is not present, check for token in cookies
    token = req.cookies.token;
  }

  if (!token) {
    return res
      .status(401)
      .json({ message: "Unauthorized - No token provided" });
  }

  // Verify the token
  jwt.verify(
    token,
    "my-32-character-ultra-secure-and-ultra-long-secret",
    (err, decoded) => {
      if (err) {
        return res
          .status(401)
          .json({ message: "Unauthorized - Invalid token" });
      }

      // Attach the decoded user information to the request object for further use
      req.user = decoded;
      next();
    }
  );
};

module.exports = isAuthenticated;
