
# Artemis Backend

This is the backend part of the Artemis task, built with Express and MongoDB.

## Prerequisites

- Node.js
- MongoDB

## Dependecies

- CORS
- Express
- Mongoose

## Installation

1. Clone the repository:
   ```bash
   git clone https://github.com/sana2k/task-artemis-backend.git
   cd task-artemis-backend
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Start the server:
   ```bash
   npm start or node server.js
   ```

4. The API will run at `http://localhost:3001`.

## Features

- Dynamic blocks.
- Single selection for `single` type blocks.
- Multiple selection for `groupped` type blocks.
- Selections saved and persisted in the backend.
- Selection Validation.
- MongoDB.

## MongoDB Configuration

Ensure your MongoDB connection string in `mongoose.connect` matches your MongoDB instance. For example:
```
mongoose.connect("mongodb://localhost:27017/artemis_blocks");
```

Replace `artemis_blocks` with your database name or create one with same name.

## Blocks Seeder

Initial blocks will be seeded when server is started.
