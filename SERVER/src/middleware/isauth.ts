import jwt from "jsonwebtoken";

module.exports = (req: any, res: any, next: any) => {
  interface JwtPayload {
    user_id: string;
  }

  const authHeader = req.get("Authorization");

  if (!authHeader) {
    req.isAuth = false;
    return next();
  }

  const token = authHeader.split(" ")[1];

  if (!token || token === "") {
    req.isAuth = false;
    return next();
  }
  let decodedToken;

  try {
    decodedToken = jwt.verify(token, "SUPER_SECRET");
  } catch (err) {
    req.isAuth = false;
    console.log(err);
    return next();
  }

  if (!decodedToken) {
    req.isAuth = false;
    return next();
  }

  req.isAuth = true;
  const { user_id } = decodedToken as JwtPayload;
  req.user_id = user_id;
  next();
};
