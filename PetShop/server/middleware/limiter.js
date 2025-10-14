import rateLimit from "express-rate-limit";

const whitelist = ["127.0.0.1", "::1", "localhost"];

const limiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 100,
  message: "Too many requests from this IP, please try again later.",
  standardHeaders: true,
  legacyHeaders: false,
  skip: (req) => {
    const ip = req.ip || req.connection.remoteAddress;
    return (
      process.env.NODE_ENV === "development" || whitelist.includes(ip)
    );
  },
});

export default limiter;
