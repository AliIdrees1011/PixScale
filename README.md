# PixScale

PixScale is a scalable cloud-native photo sharing web application with dedicated creator and viewer experiences.

## Core features
- Creator login and dashboard
- Photo upload with required metadata:
  - Title
  - Caption
  - Location
  - People Present
- Viewer gallery
- Search and filter
- Photo detail view
- Comments
- Ratings

## Advanced features included
- Role-aware protected creator routes
- REST backend starter
- Real file upload path
- Local file fallback
- Azure Blob Storage readiness
- Azure Cosmos DB readiness
- AI tag endpoint placeholder
- Thumbnail endpoint placeholder
- GitHub workflow files

## Run locally

### Backend
```bash
cd backend
npm install
npm run dev
```

### Frontend
```bash
cd frontend
npm install
npm run dev
```

Then open:
`http://localhost:5173`
