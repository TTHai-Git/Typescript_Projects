// middleware/csrf.js
export const csrfMiddleware = (req, res, next) => {
  const csrfCookie = req.cookies["XSRF-TOKEN"];
  const csrfHeader = req.headers["x-csrf-token"];

  // console.log("CSRF Cookie:", csrfCookie);
  // console.log("CSRF Header:", csrfHeader);

  if (!csrfCookie || !csrfHeader || csrfCookie !== csrfHeader) {
    return res.status(403).json({ message: "Invalid CSRF token" });
  }

  next();
};
