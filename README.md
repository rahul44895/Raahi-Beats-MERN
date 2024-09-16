# Raahi Beats - MERN Stack Music Website 🎶

**Raahi Beats** is a modern music platform that offers users the ability to listen to music, create and share playlists, and chat with friends in real time. Users can share the link of any music page with others and even enjoy a chat feature for a more interactive experience.

## Features

- 🎧 **Listen to Music**: Stream music directly on the website.
- 📋 **Create Playlists**: Users can create and share public playlists.
- 🔗 **Shareable Music Links**: Share direct links to music pages with friends.
- 💬 **Chat Functionality**: Chat with friends while listening to your favorite tracks.

## Tech Stack

- **Frontend**: React, React Router, Socket.IO (Client)
- **Backend**: Node.js, Express.js, MongoDB (Mongoose), Socket.IO (Server)
- **Authentication**: JWT (JSON Web Tokens) and Cookies
- **Storage**: MongoDB (via Mongoose)
- **File Uploads**: Multer (for profile avatars, etc.)

## Project Setup

### 1. Clone the repository

```bash
git clone https://github.com/rahul44895/Raahi-Beats-MERN.git
cd Raahi-Beats-MERN
```

### 2. Install dependencies

#### Install Frontend Dependencies

```bash
npm install --prefix client
```

#### Install Backend Dependencies

```bash
npm install
```

### 3. Set up environment variables

Create a `.env` file in the root of your project and add the necessary environment variables for your MongoDB connection, JWT secret, and other settings.

Example `.env`:

```
MONGO_URI=your_mongo_db_connection_string
JWT_SECRET=your_jwt_secret_key
```

### 4. Run the project

#### Start the Frontend

```bash
npm run client
```

#### Start the Backend

```bash
npm run server
```

The frontend will be running on `http://localhost:3000` and the backend on `http://localhost:8000`.

## Available Scripts

### Frontend

- `npm start`: Runs the app in development mode.
- `npm run build`: Builds the app for production.

### Backend

- `npm run server`: Starts the server with **nodemon** for development.
- `npm run client`: Starts the React frontend.

## Folder Structure

```
Raahi-Beats-MERN/
│
├── client/               # React frontend
│   ├── public/           # Public assets
│   ├── src/              # Source files
│   ├── package.json      # Frontend dependencies
│
├── server/               # Node.js backend
│   ├── models/           # Mongoose models
│   ├── routes/           # Express routes
│   ├── controllers/      # Route logic
│   ├── index.js          # Entry point for the server
│
├── .env                  # Environment variables (to be created)
├── package.json          # Backend dependencies
└── README.md             # Project documentation
```

## Frontend Dependencies

```json
{
  "react": "^18.3.1",
  "react-router-dom": "^6.26.0",
  "socket.io-client": "^4.7.5",
  "react-fast-marquee": "^1.6.5",
  "react-beautiful-dnd": "^13.1.1",
  "react-lazy-load-image-component": "^1.6.2",
  "js-cookie": "^3.0.5",
  "uuid": "^10.0.0"
}
```

## Backend Dependencies

```json
{
  "express": "^4.19.2",
  "bcryptjs": "^2.4.3",
  "cors": "^2.8.5",
  "dotenv": "^16.4.5",
  "jsonwebtoken": "^9.0.2",
  "mongoose": "^8.5.2",
  "multer": "^1.4.5-lts.1",
  "socket.io": "^4.7.5",
  "uuid": "^10.0.0"
}
```

## License

This project is licensed under the MIT License.

---
