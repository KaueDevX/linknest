const helmet = require("helmet");
const cors = require("cors");

const securityMiddleware = (req, res, next) => {
  helmet.hidePoweredBy()(req, res, () => {});
  helmet.frameguard({ action: "deny" })(req, res, () => {});
  helmet.noSniff()(req, res, () => {});
  helmet.referrerPolicy({ policy: "no-referrer" })(req, res, () => {});
  cors()(req, res, () => {});
  if (process.env.NODE_ENV === "production") {
    helmet.hsts({
      maxAge: 31536000, // 1 ano
      includeSubDomains: true,
      preload: true,
    })(req, res, () => {});
  }
  next();
};

module.exports = securityMiddleware;
