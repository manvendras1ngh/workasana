import jwt from "jsonwebtoken";

const verifyJWT = (req, res, next) => {
  const authToken = req.cookies?.access_token;
  if (!authToken)
    return res.status(401).json({ message: "No access token provided" });

  try {
    const decoded = jwt.verify(authToken, process.env.SECRET_KEY);
    req.user = decoded; // contains sub (user id), role, iat, exp
    return next();
  } catch (err) {
    return res
      .status(401)
      .json({ message: "Invalid or expired token", error: err });
  }
};

export default verifyJWT;
