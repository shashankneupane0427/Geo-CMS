# GeoCMS

<img src="/client/public/banner.png">
GeoCMS is a map-based Content Management System (CMS) built using the MERN stack. It provides an interactive map where users can explore various locations marked with pins. Clicking on a marker reveals relevant information. The platform supports role-based authentication with different access levels for super admins, province users, and district users.

## Features

- **Interactive Map** – Displays locations with markers and pins.
- **CMS Functionality** – Manage and update location data.
- **Role-Based Access** – User roles include:
- **Super Admin** – Full access to manage users and content.
- **Province User** – Can manage locations within their assigned province.
- **District User** – Can manage locations within their assigned district.
- **MERN Stack** – Built with MongoDB, Express.js, React, and Node.js.

## Tech Stack

- **Frontend:** React, Leaflet (for map), Tailwind CSS
- **Backend:** Node.js, Express.js
- **Database:** MongoDB
- **Authentication:** JWT, bcrypt
- **State Management:** Redux or Context API
- **Deployment:** Vercel (Frontend), Render/Heroku (Backend)

## Installation

1. **Clone the repository**
   ```bash
   git clone https://github.com/yourusername/GeoCMS.git
   cd GeoCMS
   ```

2. **Instal necessary Dependencies**
   For Client:
   ```bash
   cd client
   npm install
   ```
   For Server:
   ```bash
   cd server
   npm install
   ```
3. **Add .env Files in client & server directory**
   For Client:
   .env.example
   ```bash
   VITE_BACKEND_URI=your-backend-uri-here
   ```

   For Server:
   .env.example
   ```bash
   DB_URI=your-mongodb-connection-string
   JWT_SECRET=your-jwt-secret
   PORT=5001
   ```
4. **Run the development server
   For Server:
   ```bash
   npm run dev
   ```

   For Client:
   ```bash
   npm run dev
   ```

## Using Docker
   ```bash
   docker-compose up --build
   ```
  - Frontend runs on port 80 via Nginx reverse proxy.
  - Backend runs on port 5001.
  - Nginx handles routing between frontend and backend.


### Live Link : https://geocmsproject.vercel.app/

## Contributors:
- Shashank Neupane
- Saimon Neupane



