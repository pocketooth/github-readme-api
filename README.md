# GitHub README Fetcher API

This project provides a simple Express.js server that fetches the README.md content of a GitHub repository and serves it via a protected API endpoint. Users must log in to obtain a JWT, then use that token to access the README content.

## Features

- **Login Endpoint**: `POST /login` - Validates email and password against a simple JSON file and returns a JWT on success.
- **Protected README Endpoint**: `GET /readme?url=<repo>` - Returns the raw README markdown for the specified repository, requiring a valid JWT.

## Setup

1. Clone or copy the project files to your machine.
2. Install dependencies:
   ```sh
   npm install
   ```
3. Run the server:
   ```sh
   npm start
   ```
   The server listens on port 3000 by default. You can override this by setting the `PORT` environment variable.

## Usage

### 1. Authenticate and obtain a token

Send a `POST` request to `/login` with JSON body containing an `email` and `password` that match one in `data/users.json`.

```
POST /login
Content-Type: application/json

{
  "email": "testuser@example.com",
  "password": "password123"
}
```

A successful response returns a JWT:

```
{
  "token": "<your_token_here>"
}
```

### 2. Fetch a repository’s README

Call the `/readme` endpoint with a `url` query parameter and include the token in the `Authorization` header:

```
GET /readme?url=https://github.com/owner/repo
Authorization: Bearer <your_token_here>
```

The response will contain the raw Markdown content of the repository’s README, if it exists.

## Notes

- This API only works with public repositories. To access private repositories you would need to provide a GitHub API token.
- Passwords in `data/users.json` are stored in plain text for demonstration. In a production app you should hash passwords and use a real database.
- Tokens are signed with a secret defined in `config.js`. You can override this with the `JWT_SECRET` environment variable.