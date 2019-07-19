# [JSON Web Token Authentication Service](https://github.com/qkudev/jwt-authentication-service)


Dead-simple [JSON Web Token](https://auth0.com/docs/jwt) Authentication Service with two types of
tokens for accessing resources and refreshing authentication status.

Create service local identities, generate `access`/`refresh` token pairs, verify, refresh or invalidate them
with token blacklisting system.


### Description

Authentication of a request service provides with a special local model. `Identity` is an entity with unique ID
for service to authenticate the user or request. After creating a new identity it is useful to save identity
ID to your user model to make [one-to-one]( https://en.wikipedia.org/wiki/One-to-one_\(data_model\)) relation.

To mark request as authenticated there is an `access token` – a *short-living* key, often placed in an authorization
header like `authorization: Bearer {access_token}`. It is used for accessing resources on your other services
and can be *used as many times as you need* until it is expired.

The `refresh token` on the other hand is a *long-living* token. It is used to obtain new one token pair and
can be *used only once*. So if user left using service for a few days and his access token's time is up, 
he still can continue the session without signing-in again.

Since the tokens are not saved on the servers and are valid for the full living time even if 
the user logs-out, service has mechanics to *blacklist* any token by ID to invalidate it before it will be expired.


### Getting  started

  1. clone the [repo](https://github.com/qkudev/jwt-authentication-service) then go to the project dir.

  2. install dependencies with `yarn` or `npm i`.

  3. run `cp .env.example .env` and configure project with `.env` variables.

  4. `yarn start:dev` or `npm run start:dev` to start in development mode.

Other scripts You may check out in `package.json`.


## Running with Docker

#### Development

1. build container with `docker-compose build --no-cache`.

2. run `cp .env.example .env` and configure project with `.env` variables.

3. Up service with `docker-compose up -d`.


#### Production

1. build container with `docker-compose -f docker-compose.production.yml build --no-cache`.

2. run `cp .env.example .env.production` and configure project with `.env.production` variables.

3. Up service with `docker-compose -f docker-compose.production.yml up -d`.


## Tests

 * `yarn test` – run all unit tests.
 * `yarn test:e2e` –  e2e tests.
 * `yarn test:cov` – unit tests with coverage.

To run tests use `yarn test`. To run tests with coverage – `yarn test:coverage`, 
e2e tests – `yarn test:e2e`.


## Licence

License [MIT](https://github.com/qkudev/jwt-authentication-service/blob/master/LICENSE.md)
