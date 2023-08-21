![Group 1 (3)](https://github.com/RevoU-FSSE-2/week-9-audiprevio/assets/126348614/5f5434bb-26a6-46b1-b922-d4efcd34f181)

# Banking User Transactions API a.k.a BUTS API
This is BUTS API, a simple Express.js API for managing mBanking app's user transactions using MySQL as the database backend. The API allows you to retrieve user information, create, update, and delete transactions. In this repository there are two version of the API: LIVE & LOCAL. 


### Versions:
### GLOBAL BUTS (SQL-only & online)
With GLOBAL version you can try out the API live on the server (fly.io). But there has yet to be redis integration.

### LOCAL BUTS (SQL & REDIS)
With LOCAL you can access try out the redis version locally. Local file is: index-with-redis-and-sql-local-run.js.

____________________________________

# Table of Contents

- [Banking User Transactions API a.k.a BUTS API](#buildable-user-transactions-api-aka-buts-api)
  - [Versions](#versions)
    - [GLOBAL BUTS (SQL-only & online)](#global-buts-sql-only--online)
    - [LOCAL BUTS (SQL & REDIS)](#local-buts-sql--redis)
- [Section 1: GLOBAL BUTS](#section-1-global-buts)
  - [Live Link - https://mbankapiv1.fly.dev](#live-link---httpsmbankapiv1flydev)
  - [Fly.io Set-up](#flyio-set-up)
  - [Additional Notes](#additional-notes)
  - [SQL Set-up](#sql-set-up)
  - [Installation and Setup](#installation-and-setup)
  - [API Endpoints](#api-endpoints)
- [Section 2 - LOCAL BUTS](#section-2---local-buts)
  - [Redis-Enabled Local Version: How Redis Enhances the API](#redis-enabled-local-version-how-redis-enhances-the-api)
    - [1. Initializing Redis](#1-initializing-redis)
    - [2. Connecting to Redis](#2-connecting-to-redis)
    - [3. Caching with Redis](#3-caching-with-redis)
    - [4. Cache Miss and Database Query](#4-cache-miss-and-database-query)
    - [5. Storing in Redis Cache](#5-storing-in-redis-cache)
  - [Benefits of Redis Integration](#benefits-of-redis-integration)
    - [1. Redis Cache Expiry](#1-redis-cache-expiry)
    - [2. Consistency and Data Integrity](#2-consistency-and-data-integrity)
  - [In Summary](#in-summary)
- [License](#license)
_________________________________________

# Section 1: GLOBAL BUTS

## Live Link - https://mbankapiv1.fly.dev

The User Transactions API is already live and accessible at https://mbankapiv1.fly.dev. You can start using it right away to manage user transactions effectively. Use the CRUD operations below. I have already provide the populated data.

(click here to skip to the SQL and Fly.io set-up and jump to the API operations)


## Fly.io Set-up
# High-Level Setup Guide for User Transactions API using fly.io

This guide outlines the steps to set up the User Transactions API project on fly.io, including deploying the MySQL database and the Express.js API. 

- Step #1: Create, launch, and deploy mySQL App in fly.io
- Step #2: Launch the SQL deployed in fly.io locally  through proxy and create database file (+sample data) in SQL deployed to fly.io
- Step #3: Set up the ipv6 from the SQL to DBMS (Dbeaver) and in the Node JS file for the API
- Step #4: Deploy the Node JS to fly.io
- Step #5: Test using postman or similar apps

## Additional Notes

- Make sure to refer to the fly.io documentation for any specific configuration or deployment details.
- Consider implementing proper security measures and authentication for your API to ensure data integrity and user access control.
- Regularly monitor and maintain your deployed application to ensure its availability and performance.

## SQL Set-up

BUTS LIVE is already populated with pre-existing data, through the following SQL operations:

### Table Creation
```sql
CREATE TABLE User (
    id INT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    address VARCHAR(255) NOT NULL
);

CREATE TABLE Transaction (
    id INT AUTO_INCREMENT PRIMARY KEY,
    user_id INT NOT NULL,
    type ENUM('income', 'expense') NOT NULL,
    amount DOUBLE NOT NULL,
    FOREIGN KEY (user_id) REFERENCES User(id)
);
```

### Data Population
```sql
INSERT INTO User (name, address) VALUES
    ('Agus Budi', 'Jalan Merdeka 123'),
    ('Rina Setiawan', 'Jalan Raya Barat 456'),
    ('Siti Rahayu', 'Jalan Pohon Indah 789'),
    ('Hendra Wijaya', 'Jalan Jenderal Sudirman 234'),
    ('Rani Putri', 'Jalan Kenanga 567'),
    ('Ahmad Hidayat', 'Jalan Ahmad Yani 890'),
    ('Dewi Anggraeni', 'Jalan Siliwangi 123'),
    ('Budi Santoso', 'Jalan Veteran 456'),
    ('Nina Permata', 'Jalan Mawar Indah 789'),
    ('Eko Prabowo', 'Jalan Raya Selatan 234'),
    ('Linda Handayani', 'Jalan Pahlawan 567'),
    ('Rudi Kusuma', 'Jalan Cendana 890');
```

```sql
INSERT INTO Transaction (user_id, type, amount) VALUES
    (1, 'income', 1000.00),
    (1, 'expense', 300.00),
    (2, 'income', 1500.00),
    (2, 'expense', 500.00),
    (3, 'income', 800.00),
    (3, 'expense', 200.00),
    (4, 'expense', 100.00),
    (5, 'income', 1200.00),
    (6, 'income', 700.00),
    (7, 'expense', 450.00),
    (8, 'expense', 50.00),
    (9, 'income', 900.00),
    (10, 'expense', 75.00);
```



## Installation and Setup

1. Clone the repository:

```
git clone <repository_url>
cd user-transactions-api
```

2. Install dependencies using npm:
```
npm install
```

3. Run the server:
```
npm start
```

The server will start on port 3000 by default. You can access the API at http://localhost:3000.

## API Endpoints

### Get User Information
Endpoint: GET /users/:id


Description: Retrieve user information including balance and expenses.


Parameters:
```json
id (path parameter): User ID
```

Response Format:
```json
{
  "success": true,
  "data": {
    "id": 1,
    "name": "John Doe",
    "address": "123 Main St",
    "balance": 5000,
    "expense": 2000
  }
}
```

Error Response:

```json
{
  "success": false,
  "error": "User not found"
}
```

### Create Transaction
Endpoint: POST /transactions

Description: Create a new transaction for a user.

Request Body Format:
```json
{
  "user_id": 1,
  "type": "income",
  "amount": 1000
}
```
Response Format:
```json
{
  "success": true,
  "data": {
    "id": 1
  }
}
```
Error Response:
```json
{
  "success": false,
  "error": "User not found"
}
```
### Update Transaction
Endpoint: PUT /transactions/:id

Description: Update an existing transaction.

Parameters:

```id (path parameter): Transaction ID```


Request Body Format:
```json
{
  "type": "expense",
  "amount": 500
}
```
Response Format:
```json
{
  "success": true,
  "data": {
    "message": "Transaction updated successfully"
  }
}
```
Error Response:
```json
{
  "success": false,
  "error": "Server error"
}
```
### Delete Transaction
Endpoint: DELETE /transactions/:id

Description: Delete a transaction.

Parameters:

```id (path parameter): Transaction ID```


Response Format:
```json
{
  "success": true,
  "data": {
    "message": "Transaction deleted successfully"
  }
}
```
Error Response:
```json
{
  "success": false,
  "error": "Server error"
}
```
### Dependencies
- express: Web application framework
- mysql2: MySQL database client
- body-parser: Middleware to parse JSON request bodies


__________________________

# Section 2 - LOCAL BUTS

## Redis-Enabled Local Version: How Redis Enhances the API

The BUTS LOCAL version introduces Redis, a powerful in-memory data store, to optimize the performance of your User Transactions API. This section will delve into how Redis is integrated into the code and how it significantly improves response times and efficiency.

```**note: to run the local version you need to modify the js name and you cannot run it with the global version.**```

### Redis Integration Explained

Redis acts as a cache layer between your API and the MySQL database. It stores frequently accessed data in memory, allowing subsequent requests for the same data to be served faster by directly retrieving it from memory, rather than querying the database again.

In your code, Redis is utilized using the [`ioredis`](https://github.com/luin/ioredis) library. Here's how Redis is integrated step by step:

### 1. Initializing Redis: 
The code starts by importing the required dependencies, including `ioredis`, and initializing a Redis connection:

```js
   const redis = require('ioredis');
   const redisCon = new redis();
```

### 2. Connecting to Redis: 
The ioredis package connects to a locally running Redis server, providing access to Redis commands and functionalities:

### 3. Caching with Redis: 
When a request is made to the /user/:id endpoint, the code checks if the user's data is present in the Redis cache. If the data exists in the cache (a "cache hit"), it's directly served, saving the database query:
```js
const cacheData = await redisCon.hgetall(userKey);

if (cacheData && Object.keys(cacheData).length > 0) {
    console.log("Cache hit:", cacheData);
    return response.status(200).json(commonResponse(cacheData, null));
}
```

### 4. Cache Miss and Database Query: 
If the requested data isn't found in the Redis cache (a "cache miss"), the code fetches the data from the MySQL database:
```js
const dbData = await query(/* SQL Query */, [id]);
```

### 5. Storing in Redis Cache: 
After fetching the data from the database, the code stores it in the Redis cache for future requests:
```js
await redisCon.hmset(userKey, responseData);
await redisCon.expire(userKey, CACHE_EXPIRATION_TIME);
```

## Benefits of Redis Integration
The Redis integration significantly enhances API performance and reduces the load on the MySQL database. By caching frequently accessed user data, Redis reduces the response time for subsequent requests, making the API more responsive and efficient.

### 1. Redis Cache Expiry
The cached data is set to expire after a certain duration (CACHE_EXPIRATION_TIME), which ensures that the cache remains fresh and reflects recent updates to user transactions. This balance between cache persistence and data freshness is crucial for maintaining data accuracy.

### 2. Consistency and Data Integrity
The Redis cache automatically updates when a transaction is created, updated, or deleted, ensuring data consistency between the cache and the database.

## In Summary
The Redis integration in the GLOBAL BUTS version revolutionizes the User Transactions API by optimizing data access and response times. By minimizing database queries and improving data retrieval efficiency, Redis enhances user experience and API performance


## License
This project is licensed under the MIT License. See the LICENSE file for details.

## Credits
Big thanks to Kak Dion, Team-Lead of Team 4 and fellow friends from Team 4 for the assistance and discussion. 
