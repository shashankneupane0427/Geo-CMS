# GeoCMS

<img src="/client/public/banner.png">
GeoCMS is a map-based Content Management System (CMS) built using the MERN stack. It provides an interactive map where users can explore various locations marked with pins. Clicking on a marker reveals relevant information. The platform supports role-based authentication with different access levels for super admins, province users, and district users.

## Features

- 📍 **Interactive Map** – Displays locations with markers and pins.
- 🏢 **CMS Functionality** – Manage and update location data.
- 🔐 **Role-Based Access** – User roles include:
  - **Super Admin** – Full access to manage users and content.
  - **Province User** – Can manage locations within their assigned province.
  - **District User** – Can manage locations within their assigned district.
- 🛠 **MERN Stack** – Built with MongoDB, Express.js, React, and Node.js.
- 🔍 **Search & Filter** – Users can search for specific locations or filter by category.
- 📊 **Data Visualization** – Possible integration of charts and analytics for insights.

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
