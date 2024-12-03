# Social Media Project

A full-stack social media web application where users can create accounts, follow others, and share posts and stories.

## Features
- User registration and authentication.
- Follow and unfollow functionality.
- Post and Story creation and deletion.
- Comment on others posts.
- Like and unlike posts functionality.
- Friend Suggestions and Adding Friends.
- Profile updates and customization.

## Tech Stack

### Frontend
- React.js
- React Query
- Axios
- Material-UI icons

### Backend
- Node.js
- Express.js
- PostgreSQL
- RESTful API

## Dependencies

### Backend Dependencies (`/api`)

- **express**: Web framework for Node.js.
- **pg**: PostgreSQL client for Node.js.
- **dotenv**: Loads environment variables from `.env` files.
- **cors**: Enables cross-origin resource sharing.
- **bcryptjs**: For hashing passwords.
- **jsonwebtoken**: For user authentication tokens.
- **cookie-parser**: Parses cookies for better session management.
- **multer**: Handles file uploads.
- **moment**: For date and time formatting.
- **nodemon** (dev): Automatically restarts the server on file changes.

### Frontend Dependencies (`/client`)

- **react**: Frontend framework.
- **react-dom**: Rendering React components.
- **react-query**: Data fetching and caching.
- **axios**: HTTP client for API requests.
- **react-router-dom**: Navigation and routing for React apps.
- **@mui/icons-material**: Material-UI icons for user interface elements.
- **moment**: For date and time formatting.
- **sass**: Preprocessor for styling.

## Installation

### Prerequisites
Before you begin, ensure you have the following installed:
- Node.js (v16 or later)
- PostgreSQL

### Getting Started

1. **Setup Backend:**
- Install dependencies:
   ```bash
   cd api
   npm install
- Create a .env file in the api folder with the following content:
   ```bash
   CLIENT_URL=http://localhost:3000
   PG_USER=postgres
   PG_HOST=localhost
   PG_DATABASE=socialmedia
   PG_PASSWORD=your_password
   PG_PORT=5432
- Run the backend server
  ```bash
  npm start

2. **Setup Frontend:**
   ```bash
   cd api
   npm install
- Create a .env file in the client folder with the following content
   ```bash
   REACT_APP_API_URL=http://localhost:5000
- Start the frontend development server
   ```bash
   npm start

3. **Database:**
- Run the SQL querys in the /api/database folder to initialize your PostgreSQL database.

4. **Access the App:**
- Open your browser and navigate to http://localhost:3000.

Folder Structure
   ```bash
   /api
    /controllers  - Backend logic and API endpoints
    /database     - SQL scripts for database setup
    /routes       - Express routes
    .env          - Environment variables (ignored by Git)
    postgres.js   - Database connection configuration

   /client
    /public       - Static assets
    /src          - React components and logic
    .env         - Environment variables (ignored by Git)
