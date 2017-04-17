# vq-auth
Token-based authentification microservice

## Configuration
### Database
You need to specify a connection to a mySQL database in your env. variables:

```
export VQ_VA_DB = mysql://<user>:<password>@<host>:3306/<dbname>
```

Sequelize library will create the DB tables if they do not exist the first time you start the server.

## API
### POST /auth/token
This API Endpoint is intended for validation of user's token. The token need to be specified in 'X-Auth-Token' header.

* **Success Response:**
 * **Code:** 200 <br />
 * **Content:** `{ appId: 1, userId: 1, 'blablabla-some-token' }`

###POST /auth/local/signup

###POST /auth/local/login

###POST /auth/networks/facebook

## What is used?
ExpressJS, Sequelize

## Author
adrianbarwicki[@]gmail.com<br />
VQ-Labs<br />
[https://vq-labs.com/](http://vq-labs.com/)