Example api using Fastify.

## Project setup
```
npm install
```

#### `npm start`
Start fastify server config values set in .env file

---

### Account

***Register***

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

***Get Account***

Fetch account details.

```curl
curl http://localhost:8088/api/v0/account/1
```

* Request:
```json
GET /api/v0/account/:accountId HTTP/1.1
Accept: application/json
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

---

### Profile

***Create Profile***

Add account profile details.

```curl
curl --header "Content-Type: application/json" --request POST --data '{ "accountId": 1, "firstName": "John", "lastName": "Doe", "middleName": "Foo", "gender": "male", "birthday": "1990-07-20" }' http://localhost:8088/api/v0/profile
```

* Request:
```json
POST /api/v0/profile HTTP/1.1
Accept: application/json
Content-Type: application/json

{
    "accountId": 1,
    "firstName": "John",
    "lastName": "Doe",
    "middleName": "Foo",
    "gender": "male",
    "birthday": "1990-07-20"
}
```
* Response:
```json
HTTP/1.1 200 OK
Content-Type: application/json

{
    "id": 1,
    "account_id": 1,
    "firstName":"John",
    "lastName":"Doe",
    "middleName":"Foo",
    "gender":"male",
    "birthday":"1990-07-19T16:00:00.000Z",
    "created_at":"2020-10-04T16:11:08.242Z",
    "updated_at":"2020-10-04T16:11:08.242Z"
}
```

***GET Profile***

Fetch profile details.

```curl
curl http://localhost:8088/api/v0/profile/1
```

* Request:
```json
GET /api/v0/profile/:profileId HTTP/1.1
Accept: application/json
```
* Response:
```json
HTTP/1.1 200 OK
Content-Type: application/json

{
    "id": 1,
    "account_id": 1,
    "firstName":"John",
    "lastName":"Doe",
    "middleName":"Foo",
    "gender":"male",
    "birthday":"1990-07-19T16:00:00.000Z",
    "created_at":"2020-10-04T16:11:08.242Z",
    "updated_at":"2020-10-04T16:11:08.242Z"
}
```
