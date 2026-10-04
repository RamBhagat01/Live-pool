# Live Polling App

A real-time polling application built using **React, TypeScript, Node.js, and WebSockets**.

Users can join a room, select an option in a live poll, and see the poll percentages update in real time for everyone in the same room.

## Features

- Create/join a polling room
- Multiple users can join the same room
- Real-time room member count
- Real-time poll percentage updates
- Users can select one of four options
- Users can leave a room without disconnecting the WebSocket
- Prevents a user from joining multiple rooms simultaneously
- Real-time communication using WebSockets
- No database required for the current version

## Tech Stack

### Frontend

- React
- TypeScript
- Vite
- Tailwind CSS
- WebSocket (main AIM to create this)

### Backend

- Node.js
- TypeScript
- `ws` WebSocket library

## How the Project Works

The application has two parts:

```text
Frontend (React)
       |
       | WebSocket
       ↓
Backend (Node.js)
       |
       ↓
Users / Rooms / Poll Data
```

The frontend establishes a WebSocket connection with the backend.

When a user joins a room, the backend stores:

```text
socket
room
option
```

For example:

```text
User 1 → Room A → Option 1
User 2 → Room A → Option 3
User 3 → Room A → Option 1
```

The backend calculates the percentage of votes for each option and sends the updated results to all users in that room.

## Project Structure

A typical project structure looks like:

```text
project/
│
├── frontend/
│   ├── src/
│   │   ├── components/
│   │   │   ├── Unit.tsx
│   │   │   └── laoding.tsx
│   │   │
│   │   ├── App.tsx
│   │   └── main.tsx
│   │
│   ├── package.json
│   └── ...
│
├── backend/
│   ├── src/
│   │   └── index.ts
│   │
│   ├── package.json
│   └── ...
│
└── README.md
```

## Requirements

Before running the project, make sure you have:

- Node.js installed
- npm installed
- Git installed (optional)

You can check Node.js and npm using:

```bash
node -v
npm -v
```

## Running the Project Locally

### 1. Clone the repository

```bash
git clone <YOUR_GITHUB_REPOSITORY_URL>
```

Move into the project directory:

```bash
cd <PROJECT_FOLDER>
```

## 2. Start the Backend

Open a terminal and move into the backend folder:

```bash
cd backend
```

Install dependencies:

```bash
npm install
```

Start the WebSocket server:

```bash
npm run dev
```

The backend should start on:

```text
ws://localhost:8080
```

You should see something similar to:

```text
WebSocket server running on port 8080
```

## 3. Start the Frontend

Open another terminal.

Move into the frontend folder:

```bash
cd frontend
```

Install dependencies:

```bash
npm install
```

Start the development server:

```bash
npm run dev
```

Vite will provide a local URL, usually:

```text
http://localhost:5173
```

Open that URL in your browser.

## Using the Application

### Step 1: Enter a Room

Enter a room name, for example:

```text
Room: 123
```

Click:

```text
ENTER ROOM
```

The frontend sends a `join` message to the backend.

The backend checks whether the user is already in a room.

If the join is successful, the backend sends:

```json
{
  "type": "joinSuccess"
}
```

The poll is then displayed.

### Step 2: Select an Option

Select one of the available options.

For example:

```text
Pav Bhaji
Chole
Paneer Aloo Paratha
Masala Bhindi
```

The frontend sends:

```json
{
  "type": "chat",
  "payload": {
    "option": 1
  }
}
```

The backend updates the user's selected option and recalculates the percentages.

The updated percentages are then sent to all users in the room.

### Step 3: Leave the Room

Click:

```text
EXIT ROOM
```

The frontend sends:

```json
{
  "type": "exitRoom"
}
```

The backend removes the user from the room by setting:

```text
room = ""
option = ""
```

The WebSocket connection itself remains open.

Therefore, the same user can join another room without reconnecting.

## WebSocket Messages

The application currently uses the following message types.

### Join

Frontend → Backend

```json
{
  "type": "join",
  "payload": {
    "room": "123"
  }
}
```

### Join Success

Backend → Frontend

```json
{
  "type": "joinSuccess",
  "payload": {
    "room": "123"
  }
}
```

### Already in Room

Backend → Frontend

```json
{
  "type": "alreadyInRoom"
}
```

### Select Option

Frontend → Backend

```json
{
  "type": "chat",
  "payload": {
    "option": 1
  }
}
```

### Room Count

Backend → Frontend

```json
{
  "type": "count",
  "payload": {
    "count": 3
  }
}
```

### Updated Percentages

Backend → Frontend

```json
{
  "type": "fetchPercent",
  "payload": {
    "content": {
      "percent1": 33.3,
      "percent2": 33.3,
      "percent3": 33.3,
      "percent4": 0
    }
  }
}
```

### Exit Room

Frontend → Backend

```json
{
  "type": "exitRoom"
}
```

### Exit Success

Backend → Frontend

```json
{
  "type": "exitSuccess"
}
```

