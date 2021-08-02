const { sign, verify } = require("jsonwebtoken");

const createTokens = (response) => {
  const accessToken = sign({ username: response.username }, "secure", {
    expiresIn: "1h",
  });

  return accessToken;
};

//Create middleware
const validateToken = (req, res, next) => {
  //Grab token from cookies
  const accessToken = req.cookies["access-token"];

  //Check if token exists and verify it
  if (accessToken) {
    if (!accessToken) res.redirect("/");

    try {
      //Check if token is valid
      const validToken = verify(accessToken, "secure");
      if (validToken) {
        req.authenticated = true;
        return next();
      }
    } catch (err) {
      console.log(err);
      res.redirect("/");
    }
  }
};

module.exports = { createTokens, validateToken };
