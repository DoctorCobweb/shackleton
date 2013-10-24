/*
 * Route Middleware: if user IS logged in/authenticated, generate a
 * 401 HTTP 'Not authorised' response.
 */

function not_logged_in_required (req, res, next) {
  if (!req.session.user_authenticated) {
    //user is authenticated to access route handler.
    next();
  } else {
    //user IS  authenticated, but we dont want to give access to users who are logged in.
    res.send('UNAUTHORISED ACCESS: Need to be NOT logged in to access the route.', 401);
  }
}

module.exports = not_logged_in_required;
