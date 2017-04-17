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
This API Endpoint is intended for validation of user's token. The token needs to be specified in 'x-viciauth-auth-token' header.

* **Success Response:**<br />
**Code:** 200 <br />
**Content:** `{ appId: 1, userId: 1, token: 'blablabla-some-token' }`

### POST /auth/local/login
Allows authentification with password (local strategy).

* **Request payload:**<br />
'x-viciauth-api-key' and 'x-viciauth-app-key' headers required.
```
    {
        email: 'test@vq-labs.com',
        password: 'super-secret'
    }
```

* **Success Response:**<br />
**Code:** 200 <br />
**Content:** `{ appId: 1, userId: 1, token: 'blablabla-some-token' }`

* **Error Response:**<br />
**Code:** 400 <br />
**Content:** ```
{
    code: 'EMAIL_NOT_FOUND' 
}
```

### POST /auth/local/signup



### POST /auth/networks/facebook

## What is used?
ExpressJS, Sequelize

## Author
adrianbarwicki[@]gmail.com<br />
VQ-Labs<br />
[https://vq-labs.com/](http://vq-labs.com/)