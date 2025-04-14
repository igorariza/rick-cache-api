# Rick and Morty API

This project is an API that allows users to search for characters from the popular animated series "Rick and Morty". It utilizes GraphQL for querying character data and implements caching with Redis to enhance performance. The character information is stored in a relational database using Sequelize ORM.

## Features

- Search for Rick and Morty characters by:
  - Status
  - Species
  - Gender
  - Name
  - Origin
- Caching of search results using Redis
- Initial population of the database with 15 characters from the Rick and Morty API
- Middleware for logging request information
- Optional cron job for updating character data every 12 hours
- Optional method decorator for logging query execution time
- Optional unit tests for character search queries
- Optional TypeScript implementation

## Getting Started

### Prerequisites

- Node.js (version 14 or higher)
- npm (Node package manager)
- A relational database (MySQL or PostgreSQL)
- Redis

### Installation

1. Clone the repository:
   ```
   git clone https://github.com/igorariza/rick-cache-api.git
   cd rick-cache-api
   ```
2. Docker compose (Recommended):
   If you want to run the database and Redis using Docker, you can use the provided `docker-compose.yml` file. Make sure you have Docker installed.

   To start the services, run:
   ```
   docker-compose up -d
   ```

3. Install the dependencies: (Local)
   ```
   npm install
   ```

3. Set up your environment variables in the `.env` file:
   ```
   DATABASE_URL=mysql://root:admin@127.0.0.1:3306/admin
   DB_NAME=admin
   DB_USER=root
   DB_PASSWORD=admin
   DB_HOST=localhost
   DB_PORT=3306
   DB_DRIVER=mysql
   DB_DIALECT=mysql
   REDIS_URL=redis://localhost:6379
   PORT=4000
   CACHE_EXPIRATION=3600
   ```

5. Start the server:
   ```
   npm start
   ```

### Usage

Once the server is running, you can access the GraphQL endpoint at POST `http://localhost:4000/cronjob/run`. You can use tools like Postman or GraphQL Playground to interact with the API.

### Example Postman Request

You can import the provided Postman collection to test the API endpoints. The collection is located in the `Postman.json` file. To import it:
   ./Postman.json

## License



This project is licensed under the MIT License. See the LICENSE file for details.