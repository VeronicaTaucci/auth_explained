//! This code is setting up Passport, a middleware for authentication in Node.js. Passport is being used to implement both local authentication using a 
//! username and password, and JSON Web Token (JWT) authentication.
const passport = require("passport"); // imports the Passport library.
const LocalStrategy = require("passport-local").Strategy; //allows you to authenticate users using JSON Web Tokens with the Passport authentication middleware.
const JwtStrategy = require("passport-jwt").Strategy; //imports the Strategy object for the JWT authentication strategy.
const ExtractJwt = require("passport-jwt").ExtractJwt;// extract a JSON Web Token (JWT) from an HTTP request in a specified location.
const db = require("../models"); //imports the database models to be used for authentication.
const bcrypt = require("bcryptjs"); //library for hashing passwords in JavaScript.
const secrets = require("../secrets"); //contains the secret key used for JWT authentication.

let options = { //The usernameField option specifies that the email field should be used as the username.
    usernameField: "email",
};
let localLogin = new LocalStrategy(options, async (email, password, done) => { //creates a new instance of the LocalStrategy object with the specified options and a callback function to handle authentication.
    try { //The verify function is defined inline as an async function that takes three arguments:email: the email submitted by the user. password: the password submitted by the user. done: a function to call when the verification process is complete.
        let records = await db.user.findAll({ where: { email } }); // find all records that match the specified email address
        if (records !== null) {
            //*if the email was found,
            bcrypt.compare(password, records[0].password, (err, isMatch) => { // If the email is found, the stored password hash is compared with the submitted password using bcrypt.compare. 
                //The verify function retrieves the user record from the database based on the submitted email address, and compares the submitted password with the stored password hash using bcrypt.
                if (err) { //If an error occurs during the verification process, the done function is called with the error object.
                    return done(err);
                }
                if (!isMatch) { // If the email address is not found or the password is incorrect, done is called with false to indicate that authentication failed.
                    return done(null, false);
                }
                return done(null, records[0]); // If the passwords match, the user object is returned via the done callback, indicating that the authentication was successful.
            });
        } else { //If the email is not found in the database, the callback function is called with false to indicate that authentication failed
            return done(null, false);
        }
    } catch (error) {
        return done(error);
    }
});

passport.use(localLogin); //This line registers the local authentication strategy with Passport.
let jwtOptions = { 
    jwtFromRequest: ExtractJwt.fromHeader("authorization"),//The jwtFromRequest option specifies that the JWT should be extracted from the authorization header of the request. 
    secretOrKey: secrets.secrets, //The secretOrKey option specifies the secret key used to sign the JWT.
};

let jwtLogin = new JwtStrategy(jwtOptions, async (payload, done) => { //creates a new instance of the JwtStrategy object with the specified options and a callback function to handle authentication.
    //The JwtStrategy constructor takes two arguments: jwtOptions and a callback function to handle authentication. 
    //The jwtOptions object specifies how to extract the JWT from the request and the secret key to verify the token's signature.
    //?
    //The callback function takes two arguments: payload and done. 
    //payload is the decoded JWT payload and done is a function to call when the verification process is complete.
    try { //The try block in the callback function retrieves 
        //the user ID from the JWT payload and uses it to look up the corresponding user in the database using the db.user.findByPk method. 
        let userID = payload.sub;
        let user = await db.user.findByPk(userID); //{}
        if (user) { //If the user is found, the user object is returned via the done callback, indicating that the authentication was successful.
            return done(null, user);
        } else {// If the user is not found, the callback function is called with false to indicate that authentication failed.
            return done(null, false);
        }
    } catch (error) {
        //If an error occurs during the verification process, the catch block will catch it and call the done function with the error object. 
        //This will signal that the authentication process has failed due to an error.
        return done(error);
    }
});

passport.use(jwtLogin); //This line registers the JWT authentication strategy with Passport.
