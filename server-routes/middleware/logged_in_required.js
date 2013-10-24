/*
 * Route Middleware: if user is NOT logged in/authenticated, generate a
 * 401 HTTP 'Not authorised' response.
 */

function logged_in_required (req, res, next) {
  if (!req.session.user_authenticated) {
    //user is NOT authenticated to access route handler.
    //res.send('UNAUTHORISED ACCESS: You are permitted to be in this area. Get out.', 401);
    res.redirect('#/login');
  } else {
    //user is authenticated to access route handler.
    next();
  }
}

module.exports = logged_in_required;
