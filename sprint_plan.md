# Project Plan: Interactive Historical Map System

### Procedure

For each user story in the sprints below, we follow a three-step lifecycle:  
**Development → QA → Complete**

We do the deployment in the end month, after we have 70% of our product ready.

We will mostly require 4 interns in total
2 interns - for backend development
1 intern - to assist varun with front-end development
1 intern - to do Quality assurance. (To optimize resources Testing and QA can sometimes be done by Sankalp, and Me as well.)

---

## Month 1: Core Foundations

### Sprint 1: Project Initialization

**Goal**: Set up backend services, frontend Cesium globe, and basic API structure.

**Backend Tasks**

- Intern A: Initialize Spring Boot project for the `shapes-service`. Create a basic endpoint `/api/shapes/:year` that returns a static `.geojson` object.
- Intern B: Set up scaffolding for `notes-service` and `projects-service`. Ensure MongoDB connectivity is working.

**Frontend Tasks**

- Intern C: Set up the React project and integrate Cesium. Display a static globe on screen.

**User Stories**

- As a user, I can see a 3D globe when I open the app.
- As a developer, I can retrieve shape data for a year through an API.

---

### Sprint 2: Year-Based Shape Display

**Goal**: Display year-specific `.geojson` data fetched from the backend.

**Backend Tasks**

- Intern A: Implement logic to fetch `.geojson` files based on the year requested. Serve actual files instead of hardcoded responses.
- Intern B: Create MongoDB schema for notes and projects. Seed some test data.

**Frontend Tasks**

- Intern C: Build a basic year slider (UI only). Connect the slider to the shape-fetching API.

**User Stories**

- As a user, I can move a slider to choose a year and see shape data update accordingly.
- As a developer, I can prepare test data for notes and projects in the database.

---

### Sprint 3: File Sync and Shape Metadata

**Goal**: Build syncing logic for shapes and display metadata.

**Backend Tasks**

- Intern A: Create a `/sync/shapes` endpoint that scans a directory and registers new `.geojson` files.
- Intern B: Store synced shapes in MongoDB with fields like source, name, and ID.

**Frontend Tasks**

- Intern C: Show a list of shapes available for the selected year. Display basic metadata on hover.

**User Stories**

- As an admin, I can trigger a sync to register all available shape files.
- As a user, I can see metadata when hovering over shapes on the globe.

---

### Sprint 4: Notes System Integration

**Goal**: Add support for notes linked to shapes and years.

**Backend Tasks**

- Intern B: Implement endpoints to fetch and post notes per year. Notes should include fields like shape ID, year, user ID, content, lat, and long.
- Intern A: Add support for unique shape identifiers inside `.geojson`.

**Frontend Tasks**

- Intern C: Integrate CKEditor into the sidebar for note writing. Load existing notes on year change.

**User Stories**

- As a user, I can write a note for a selected shape and year.
- As a user, I can view existing notes for any given year.

---

## Month 2: Interactivity and Organization

### Sprint 5: Drawing and Editing Shapes

**Goal**: Allow users to create and label their own polygons.

**Backend Tasks**

- Intern A: Build a `POST /api/custom-shapes` endpoint to save user-drawn polygons along with project ID and year.
- Intern B: Store custom shape metadata and manage shape versioning.

**Frontend Tasks**

- Intern C: Allow users to draw polygons on the map and attach labels and notes.

**User Stories**

- As a user, I can draw a polygon on the globe and give it a name and label.

---

### Sprint 6: Fully Integrated Timeline

**Goal**: Finalize timeline behavior and make data update smoothly on slider movement.

**Backend Tasks**

- Intern A: Add basic caching for shape fetches per year to reduce server load.

**Frontend Tasks**

- Intern C: Implement debounce on year slider changes. Combine shape and note loading in one update per year.

**User Stories**

- As a user, I can scroll the timeline and instantly see both shapes and notes update for the selected year.

---

### Sprint 7: Authentication

**Goal**: Add authentication to the platform.

**Backend Tasks**

- Intern B: Add user login and registration using Firebase Auth or Pangea APIs. Implement middleware to protect endpoints.
- Intern A: Update shape and note endpoints to associate content with user ID.

**Frontend Tasks**

- Intern C: Build login and registration UI. Handle session storage and logout.

**User Stories**

- As a user, I must be logged in to create notes or draw shapes.
- As an admin, I can manage which content belongs to which user.

---

### Sprint 8: Project Management

**Goal**: Let users group notes and shapes under named projects.

**Backend Tasks**

- Intern B: Add endpoints to create, list, and select projects. Each note and shape should be linked to a project.
- Intern A: Modify shape and note endpoints to filter based on selected project.

**Frontend Tasks**

- Intern C: Add a dropdown to create/select projects. Automatically filter visible data by selected project.

**User Stories**

- As a user, I can group my work into projects and switch between them to see relevant content.

---

## Month 3: Enhancements and Finalization

### Sprint 9: Media Uploads in Notes

**Goal**: Enable file uploads (images, audio) in notes.

**Backend Tasks**

- Intern B: Create an upload endpoint for media files. Save file paths and serve URLs.

**Frontend Tasks**

- Intern C: Add CKEditor plugin to upload and insert media files into notes.

**User Stories**

- As a user, I can attach images or audio to my notes and view them inside the note editor.

---

### Sprint 10: Search and Filters

**Goal**: Add ability to search through notes and filter shapes.

**Backend Tasks**

- Intern B: Implement filtering and search across notes by keyword, shape, year, and project.
- Intern A: Add shape filters by source, type, or tag.

**Frontend Tasks**

- Intern C: Add search and filtering UI to notes and shape panels.

**User Stories**

- As a user, I can search for specific notes and filter shapes to narrow down results.

---

### Sprint 11 and 12: Testing, Deployment, Documentation

**Goal**: Final polish, documentation, and deployment of the project.

**Backend Tasks**

- All interns: Write tests for endpoints. Finalize Postman collections or OpenAPI docs.

**Frontend Tasks**

- Intern C: Final UI adjustments. Test for responsive/mobile layouts. Deploy app (e.g., GitHub Pages or Vercel).

**User Stories**

- As a user, I can use a stable, working version of the application with all features in place.
- As a developer, I have documentation available to extend or maintain the system.

---

## Final Deliverables

By the end of 12 sprints (3 months), we aim to deliver:

- A Cesium-based interactive 3D globe
- Shape display system based on year and project
- Timeline slider with smooth updates
- Polygon drawing and tagging
- Notes system with media support
- Authentication and per-user project management
- Search and filter functionalities
- Stable and deployed frontend and backend with documentation

---
