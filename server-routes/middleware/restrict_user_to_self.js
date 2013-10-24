/*
 * Route Middleware: restrict user to self */

function restrict_user_to_self (req, res, next) {
  if (req.session.user_id === req.params.id) {

    //user is self.
    next();
  } else {
    res.send('UNAUTHORISED ACTION: this route is restricted to your OWN account.', 401);
  }
}

module.exports = restrict_user_to_self;

