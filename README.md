# Inventory Management Dashboard

A full-stack inventory management application built with React and Node.js/Express, backed by MongoDB.

## Workshop Reference

This project is part of the PM Onboarding Technical Workshop:
[PM Onboarding Technical Workshop](https://www.notion.so/PM-Onboarding-Technical-Workshop-2e668aa8ba0a80e3a988f32e45ed64bd?source=copy_link)

## Features

- **View Inventory Items** - Display all items in table or card view
- **Add New Items** - Create inventory items with name, category, quantity, and status
- **Dashboard Stats** - Track total items and available items at a glance
- **Category & Status Badges** - Visual indicators for Hardware/Software and Available/Unavailable
- **Responsive Dark Theme UI** - Modern design with gradient backgrounds

## Tech Stack

**Frontend:**
- React 19
- CSS (custom dark theme)

**Backend:**
- Node.js with Express 5
- MongoDB with Mongoose
- CORS enabled for cross-origin requests

## Project Structure

```
OP_TechnicalWorkshop/
├── backend/
│   ├── server.js        # Express server & API routes
│   ├── package.json
│   └── .env             # MongoDB connection (not committed)
│
├── frontend/
│   ├── src/
│   │   ├── App.js       # Main React component
│   │   ├── App.css      # Styling
│   │   └── index.js     # Entry point
│   ├── public/
│   └── package.json
│
└── README.md
```

## Getting Started

### Prerequisites
- Node.js installed
- MongoDB connection string

### Backend Setup
```bash
cd backend
npm install
npm run dev
```
The server runs on `http://localhost:3001`

### Frontend Setup
```bash
cd frontend
npm install
npm start
```
The app runs on `http://localhost:3000`

## API Endpoints

| Method | Endpoint     | Description              |
|--------|--------------|--------------------------|
| GET    | /inventory   | Fetch all inventory items|
| POST   | /inventory   | Create a new item        |

## Item Schema

| Field    | Type   | Options                      |
|----------|--------|------------------------------|
| name     | String | Required                     |
| category | String | "Hardware" or "Software"     |
| quantity | Number | Default: 0                   |
| status   | String | "Available" or "Unavailable" |
