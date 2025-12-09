const jwt = require("jsonwebtoken");

module.exports = (req, res, next) => {
  try {
    const authorizationHeader = req.headers["authorization"];
    
    if (!authorizationHeader) {
      // Correctly send a 401 if the header is missing
      return res.status(401).send({
        message: "Authorization header missing",
        success: false,
      });
    }

    const token = authorizationHeader.split(" ")[1];

    // FIX HERE: Use the correct, consistent environment variable for the secret
    // Assuming your .env file defines JWT_SECRET
    jwt.verify(token, process.env.JWT_SECRET, (err, decode) => { 
      if (err) {
        // Correctly send a 401 if the token is invalid
        return res.status(401).send({
          message: "Token is not valid",
          success: false,
        });
      }

      req.userId = decode.id;
      // If verification succeeds, call next() to hit the controller
      next();
    });
  } catch (error) {
    console.error("Authentication Error:", error);
    res.status(401).send({ 
      message: "Authentication failed. Please log in again.", 
      success: false 
    });
  }
};