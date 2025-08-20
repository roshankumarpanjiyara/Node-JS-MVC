async function auth(req, res, next) {
  const user = req.session.user;
  const isAuth = req.session.isAuthenticated;

  if (!user || !isAuth) {
    return next();
  }

  res.locals.isAuth = isAuth;

  next();
}

function protectRoute(req, res, next) {
  if (!res.locals.isAuth) {
    return res.redirect("/401");
  }
  next();
}

module.exports = {
  auth: auth,
  protectRoute: protectRoute,
};
