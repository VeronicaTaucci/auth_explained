const router = require('express').Router();
const passport = require('passport');


// This code sets up a route for a protected endpoint that requires authentication using JWT. When a GET request is made to this route, Passport's 
// authenticate method with the 'jwt' strategy is called, which verifies the token sent with the request. The { session: false } option is included to 
// prevent Passport from creating a session for the user.

// If the token is successfully verified, the callback function is executed and the response is sent with the message "This route requires authentication".
//  If the token is not verified or missing, Passport will send an unauthorized response (HTTP 401 status code).
router.get('/protected', passport.authenticate('jwt', { session: false }), (req, res) => {
  res.send('This route requires authentication');
});
module.exports = router;


/*
passport.authenticate is a middleware function in Passport.js that can be used to authenticate a request. It takes one or more strategies as 
arguments and returns a middleware function that can be used in a route to authenticate requests. The authentication strategy is determined by the 
first argument passed to passport.authenticate. For example, passport.authenticate('local') would use the LocalStrategy to authenticate the request.

The middleware function returned by passport.authenticate takes three arguments: req, res, and next. If authentication is successful, next is called and
 the next middleware function in the stack is executed. If authentication fails, an error is thrown and the next middleware function is not executed.

By default, passport.authenticate will attempt to establish a session after authentication, which may not be desired in certain situations. To prevent 
Passport from creating a session, you can pass { session: false } as an option when calling passport.authenticate.
*/