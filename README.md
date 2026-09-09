````md
# Lost & Found

A full-stack Lost & Found web application built with React, Vite, Node.js, and Express.
Backend by me
Took AI and Youtube help for jsx and connection

## Features

- Report lost or found items
- View all reported items
- Filter by Lost / Found
- Search by place
- Hide claimed items
- Claim an item
- Edit and delete reports
- Server-side filtering using query parameters
- Responsive UI

## Tech Stack

- React + Vite
- Node.js + Express
- JSON file for data storage
- CSS

## Run Locally

### Backend

```bash
cd backend
npm install
node index.js
````

Runs on `http://localhost:8080`.

### Frontend

```bash
cd frontend
npm install
npm run dev
```

Runs on `http://localhost:5173`.

## API

| Method | Endpoint               | Purpose      |
| ------ | ---------------------- | ------------ |
| GET    | `/api/items`           | Get items    |
| GET    | `/api/items/:id`       | Get one item |
| POST   | `/api/items`           | Create item  |
| PUT    | `/api/items/:id`       | Edit item    |
| PATCH  | `/api/items/:id/claim` | Claim item   |
| DELETE | `/api/items/:id`       | Delete item  |

## Filtering

Filters are handled by the backend:

```text
GET /api/items?type=lost
GET /api/items?type=found
GET /api/items?status=open
GET /api/items?place=library
```

Multiple filters can be combined.

## Project Structure

```text
lost-found/
├── backend/
│   ├── database/
│   │   └── items.json
│   └── index.js
│
├── frontend/
│   └── src/
│       ├── App.jsx
│       └── App.css
│
└── README.md
```

```
```
