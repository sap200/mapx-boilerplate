# MAPX - Technical Documentation

---

## 🧭 Overview

MAPX is a modular, interactive 3D globe platform for visualizing historical and geopolitical data across time. It enables users to draw custom polygons, write contextual notes, and filter map overlays by year via a discrete slider.

This document details the **technical implementation**, including detailed microservice-based frontend and backend architecture, API specifications, database design, and rationale behind implementation choices.

---

## 🔍 Design Philosophy

While designing MAPX, the aim was to keep the system **modular**, **extensible**, and **historically accurate**. The platform had to support:

- Interactive 3D navigation
- Custom polygon creation
- Rich contextual notes and versioned overlays
- A timeline slider to represent temporal changes

This called for a **clean separation of services**, so each responsibility could be scaled or modified independently. The frontend had to offer seamless UX across visualization, annotation, and interaction, while the backend had to be optimized for fast geo-data delivery and user-generated content persistence.

---

## 📐 Microservice Architecture

### 📦 System Overview

```plaintext
        ┌──────────── Frontend Services ─────────────┐             ┌──────────── Backend Services ─────────────┐
        │                                             │             │                                           │
        │ ┌────────────┐   ┌───────────────────────┐  │   REST API  │ ┌──────────────┐  ┌────────────────────┐ │
        │ │ Globe View │◄──┤  Year Timeline Slider │◄─┼────────────►│ GeoJSON Svc   │  │ Notes/Projects Svc │ │
        │ └────────────┘   └───────────────────────┘  │             │ └──────────────┘  └────────────────────┘ │
        │     ▲   ▲                  ▲                │             │          ▲                  ▲            │
        │     │   └─────┐       ┌────┴────┐           │             │          │                  │            │
        │     │         └──────▶│ CKEditor│           │             │   ┌────────────┐     ┌──────────────┐    │
        │     │                  └────────┘           │             │   │ Auth Svc   │◄────┤ MongoDB + S3 │    │
        │     └─────────────────────────────► Polygon │             │   └────────────┘     └──────────────┘    │
        │                         Drawing Tool        │             │                                           │
        └─────────────────────────────────────────────┘             └───────────────────────────────────────────┘
```

---

## 🧩 Frontend Microservices

### 🌍 1. Globe Rendering (React + CesiumJS)

- **Purpose**: 3D earth view with historical overlays
- **Role**:
  - Displaying `.geojson` shapes for selected years
  - Handling user-drawn polygons
- **Design Reasoning**: CesiumJS was chosen over Leaflet or Mapbox due to its support for 3D terrain, historical layers, and large geospatial datasets.
- The coordinates marked by the polygon can be retrieved using a code like this.

```javascript
const polygonEntity = polygons[0];
const positions = polygonEntity.polygon.hierarchy.getValue(
  Cesium.JulianDate.now()
).positions;
positions.forEach((pos, index) => {
  const carto = Cesium.Cartographic.fromCartesian(pos);
  const lat = Cesium.Math.toDegrees(carto.latitude).toFixed(6);
  const lon = Cesium.Math.toDegrees(carto.longitude).toFixed(6);
  console.log(`Point ${index + 1}: Lat = ${lat}, Lon = ${lon}`);
});
```

- Follow this link for a boilerplate implementation of MAPX-Frontend - https://github.com/sap200/mapx-boilerplate

### 📝 2. Notes Editor (CKEditor)

- **Purpose**: Add rich-text notes linked to polygons or years
- **Interaction**:
  - Attached to polygons or general year-based context
  - Media-upload integrated

### 🎚 3. Timeline Slider

- **Purpose**: Snap to discrete years and load corresponding overlays
- **Design**: Custom React slider with debounce queries
- **Output**: Triggers API call to `GET /api/shapes/:year`

---

## 🛠 Backend Microservices

### ⚙️ Core Stack

- **Language**: Java
- **Framework**: Spring Boot (Microservice Mode)
- **Storage**: MongoDB for structured data, S3/MinIO for media

### 🔐 1. Authentication Service

- **Tech**: Firebase or Pangea (custom flows)
- **Endpoints**:
  - `/signup`
  - `/login`
  - `/2fa/setup`
- **Rationale**: Pangea allows more control for enterprise users

### 🗂 2. GeoJSON Microservice

- **Responsibility**:
  - Serves `.geojson` overlays based on year
  - Stores metadata in MongoDB
  - Auto-syncs new uploads

```bash
POST /sync/shapes
BODY: {
  "filepath": "empires/1900/british_empire.json",
  "year": 1900,
  "label": "British Empire"
}
```

### 📝 3. Notes & Projects Service

- **Purpose**: Manage user notes and collaborative projects
- **Media** stored in object storage

---

## 🧱 Database Design (MongoDB)

### 🗺 Shapes Collection

```json
{
  "_id": ObjectId,
  "year": 1900,
  "label": "British Empire",
  "filePath": "geojson/empires/1900/british_empire.json"
}
```

### 📝 Notes Collection

```json
{
  "_id": ObjectId,
  "userId": "user123",
  "projectId": "proj567",
  "lat": 22.34,
  "long": 221.34,
  "text": "Colonial territory...",
  "timestamp": ISODate,
  "media": ["s3://bucket/note123-img1.png"]
}
```

### 📂 Projects Collection

```json
{
  "_id": ObjectId,
  "userId": "user123",
  "name": "WWI Empires",
  "noteRefs": ["note123", "note456"]
}
```

---

## 🧮 API Endpoints

| Method | Endpoint              | Description                  |
| ------ | --------------------- | ---------------------------- |
| GET    | `/api/shapes/:year`   | Get all shapes for a year    |
| POST   | `/api/notes/`         | Create new note              |
| GET    | `/api/notes/:project` | Get all notes for a project  |
| POST   | `/api/projects`       | Create new project           |
| POST   | `/api/auth/signup`    | Signup new user              |
| POST   | `/api/auth/login`     | Login existing user          |
| POST   | `/api/sync/shapes`    | Sync geojson file to MongoDB |

---

## 🧪 Usage Flow (End-to-End)

1. **Login** via Firebase/Pangea
2. Select year → `/api/shapes/:year` returns overlays
3. Draw polygon → coordinates computed with Cesium
4. Launch CKEditor and write a note
5. Submit note → saved via `/api/notes/`
6. Notes linked to user and project via `/api/projects`
7. Admins add new files via `/api/sync/shapes`

**The request body of the API is not designed to provide flexibility to the developer to research on the most efficient and optimized parameters. It is assumed by default, that all the apis are controlled using an account (authentication token). No API returns success response or performs any operations without the access token. The authentication for each API should be integrated in the last sprints.**

---

## 🏗 Future Enhancements

- Admin dashboard for shapefile upload
- Shared Notebook + version control on notes
- 2D map switch via Leaflet

---
