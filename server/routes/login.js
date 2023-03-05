
//! This is an implementation of a simple authentication system using Node.js, Express.js, Passport.js, JSON Web Tokens (JWT), and bcrypt.js.const express = require("express");
const express = require('express')
const router = express.Router();
const jwt = require('jwt-simple'); //allows us to create a jwt token
const db = require('../models'); //access to all db models
const bcrypt = require('bcryptjs'); //used to encrypt passwords

const secrets = require('../secrets'); // secrets object inside of secrets.js file in root directory

const passport = require('passport');

//must initialize passport for it to work 
router.use(passport.initialize());
require('../auth/passAuth');

let requireLogin = passport.authenticate('local', { session: false })
// requireLogin is a middleware function that uses the LocalStrategy defined in passAuth.js to authenticate a user's email and password, and returns a 
//JSON Web Token (JWT) if the authentication is successful. The session: false option is set to prevent Passport from creating a session.
let requireJwt = passport.authenticate('jwt', { session: false })
//requireJwt is a middleware function that uses the JwtStrategy defined in passAuth.js to authenticate a user's JWT. The session: false option is also 
//set here to prevent Passport from creating a session.

router.use(express.urlencoded({ extended: false }))
router.use(express.json())


const token = (userRecord) => { //The token function creates a new JWT token using the jwt-simple library, and the bcrypt library is used to hash and compare passwords.
    //The token function is responsible for creating a JWT token for the user. It takes a user record as input and generates a token using the jwt-simple library.
    let timestamp = new Date().getTime(); // current time
    return jwt.encode({ sub: userRecord.id, iat: timestamp }, secrets.secrets)
}


router.get('/', (req, res) => {
    res.send('home page')
})


router.post('/register', async (req, res) => { //creates a new user record in the database and generates a JWT token for the user. 
    let { email, password } = req.body;
    try {
        let records = await db.user.findAll({ where: { email } })
        if (records.length === 0) { //no record exits, must create new user record
            password = bcrypt.hashSync(password, 8)//hashes the provided password using the bcrypt algorithm with a salt of 8 rounds. 
            //The result of the function is the hash value of the password, which can then be stored securely in a database
            let newUserRecord = await db.user.create({ email, password }) //user is an object that we just created
            let jwtToken = token(newUserRecord) //Once the new user record is created, the token function is called with the newly created user record as the argument to generate a new JWT token. 
            //Finally, the generated token is sent back to the client in the response object.
            return res.json({ token: jwtToken })
        }
        else {
            return res.status(422).json({ error: "Email already exists" })
        }
    }
    catch (err) {
        return res.status(423).json({ error: "Can't access database" })
    }
})


router.post('/login', requireLogin, (req, res) => { // uses Passport.js to authenticate the user and generates a new JWT token.
    res.json({ token: token(req.user) })
})


router.get('/protected', requireJwt, (req, res) => {//example of a protected route that requires a valid JWT token for access. 
    //requireJwt middleware function uses Passport.js to authenticate the user's JWT token before allowing access to the route.
    console.log('passed protected page');
    console.log(req.user.id);
    res.json({ isValid: true })
})

module.exports = router;
