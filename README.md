# auth_explained

# Authentication Project (Fully explained)
This project is a simple authentication system that allows users to register, login, and access protected routes using JWT authentication.

## Getting Started
Prerequisites
* Node.js (v12 or higher)
* npm or yarn package manager
* A database management system (such as PostgreSQL, MySQL, or SQLite)

## Installing
* Clone the repository to your local machine.
* Run npm install or yarn install to install all dependencies.

## Running the server
* To start the server, run npm start or yarn start.

## Endpoints
* /register (POST): Allows users to register with a unique email and password.
* /login (POST): Allows registered users to log in with their email and password and receive a JWT token.
* /protected (GET): A protected route that requires a valid JWT token to access.

## Built With
* Node.js
* Express.js
* PostgreSQL
* Sequelize ORM
* JSON Web Tokens (JWT)
* Bcrypt.js
* Passport.js
