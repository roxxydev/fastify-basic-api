An example api server using [Fastify](https://www.fastify.io/). This uses JWT (JSON Web Token) for authorization and has implemented RBAC (Role-Based Access Control) for restrict and control what resources can only access. It has a fastify plugin `store` which allows server to switch between ORM/ODM ([Knex](http://knexjs.org/), [Mongoose](https://mongoosejs.com/)) giving option of using either SQL databases supported by [Knex](http://knexjs.org/) or MongoDB of [Mongoose](https://mongoosejs.com/).

## Project setup
```
npm install
```

#### `npm start`
Start fastify server config values set in .env file

#### `npm test`
Create database named `testdb` in Postgres. Run test script. By default the test script uses the [Lab](https://github.com/hapijs/lab) of Hapi. To use [Tap](https://node-tap.org/) in test script, simply declare `TEST_USE_TAP` in `.env` file and set to true.

---

### Structure

* _**server.js**_ - Creates fastify server instance.
* _**routes/services/**_ - Contains logic needed of routes.
* _**routes/api/**_ - Routes of fastify.
* _**routes/api/*/schemas.js**_ - Contains validation schemas using fluent-schema.
* _**utils**_ - Contains utility methods.
* _**setup**_ - Script setup before starting server. Initially contain setup for creating data like roles and scopes to database.
* _**enviroment**_ - Configuration values.
* _**plugins**_ - Contains fastify plugins.
* _**plugins/store.js**_ - Fastify plugin creting `store` server property that have interface for database CRUD operations wrapper for either using Knex or Mongoose.
* _**models**_ - Contains database related schemas, properties and operations.
* _**models/model.js**_ - Contains property name and values used in database schema.
* _**models/roles.js**_ - Initial roles used in this API.
* _**models/scope.js**_ - Initial scopes used in this API.
* _**models/operations/**_ - Interface implementation of CRUD database transactions. Each filename represent the name of the table/schema which also matches the model name defined in model.js.
* _**migrations**_ - Contains migration scripts used in knex.
* _**schemas**_ - Contains model schemas for moongose.

---

### API Documentation

The project implements `fastify-swagger` for creating [Swagger](https://swagger.io/) documentation to route `/documentation`.

---

### Example

Create account passing basic account information.

```curl
curl --header "Content-Type: application/json" --request POST --data '{"username":"foo10001","password":""}' http://localhost:8088/api/v0/account/register
```

* Request:
```json
POST /api/v0/account HTTP/1.1
Accept: application/json
Content-Type: application/json

{
    "username": "foo10001",
    "password": "P@ssw0rd"
}
```
* Response:
```json
HTTP/1.1 200 OK
Content-Type: application/json

{
   "id": 1,
   "username": "foo10001",
   "created_at": "2020-10-04T16:00:07.726Z"
}
```
