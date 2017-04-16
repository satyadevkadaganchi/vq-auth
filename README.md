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

**POST /auth/local/signup**

**POST /auth/local/login**

**POST /auth/token**

**POST /auth/networks/facebook**

## What is used?
ExpressJS, Sequelize

## Author
adrianbarwicki[@]gmail.com<br />
VQ-Labs<br />
[https://vq-labs.com/](http://vq-labs.com/)