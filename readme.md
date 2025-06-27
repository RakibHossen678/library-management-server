# Library Management System

A simple Node.js + Express + MongoDB library management system.

## Features

- Add, update, delete, and fetch books
- Borrow books and track borrowed quantities
- View summary of borrowed books

## Project Structure

```
.
├── src/
│   ├── app.ts
│   ├── server.ts
│   └── app/
│       ├── controllers/
│       │   ├── books.controller.ts
│       │   └── borrow.controller.ts
│       ├── interface/
│       │   ├── books.interface.ts
│       │   └── borrow.model.ts
│       ├── models/
│       │   ├── books.models.ts
│       │   └── borrow.models.ts
│       └── utils/
│           └── appError.ts
├── package.json
├── tsconfig.json
├── .env
├── .gitignore
└── vercel.json
```

## Getting Started

### Prerequisites

- Node.js
- MongoDB database (Atlas or local)

### Installation

1. Clone the repository
2. Run `npm install`
3. Create a `.env` file with your MongoDB credentials:
    ```
    DB_USER=your_db_user
    DB_PASS=your_db_password
    PORT=7000
    ```
4. Start the development server:
    ```
    npm start
    ```

## API Endpoints

### Books

- `POST /api/books` - Create a new book
- `GET /api/books` - Get all books (supports `filter`, `sortBy`, `sort`, `limit` query params)
- `GET /api/books/:bookId` - Get a single book by ID
- `PUT /api/books/:bookId` - Update a book by ID
- `DELETE /api/books/:bookId` - Delete a book by ID

### Borrow

- `POST /api/borrow` - Borrow a book
- `GET /api/borrow` - Get summary of borrowed books

