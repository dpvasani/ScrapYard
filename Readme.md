# Scrapyard

This repository provides a production-grade backend template for a **web scraper** using Node.js, Express.js, and MongoDB. The system automates searches based on priority keywords, extracts relevant data, and allows for manual approval of results before storing them in a verified database.

## Features

- **Automated Web Scraping**: Fetches top 150 search results based on prioritized keywords.
- **Express.js Backend**: Handles API requests, authentication, and data processing.
- **MongoDB Database**: Stores scraped links, titles, and descriptions.
- **Approval System**: Allows admin to review and approve relevant links for permanent storage.
- **Scalable Design**: Supports multiple searches and keyword prioritization.
- **Data Enrichment**: Optionally fetches additional metadata from social media (e.g., Facebook).

## Use Case

1. **User Enters Keywords** (Up to 10, ranked by priority)
2. **System Scrapes the Web** and fetches **150 results per search**
3. **Data is Stored in `SearchResults` Collection**
4. **Admin Reviews & Approves** relevant links
5. **Approved Links Move to `VerifiedResults` Collection**

For example, searching for **"Zakir Hussain, Tabla Player, Music Producer"** will return ranked results prioritizing "Zakir Hussain" while also considering "Tabla Player" and "Music Producer" as secondary keywords.

## Folder Structure

```bash
Scrapyard/
├── public/                    # Public assets (if any)
│   └── temp/                  # Temporary files or uploads
├── src/                       # Main application code
│   ├── controllers/           # Route controllers (business logic)
│   ├── models/                # Mongoose models (database schema)
│   ├── routes/                # Route definitions (API endpoints)
│   ├── middlewares/           # Custom middleware (e.g., authentication)
│   ├── config/                # Configuration files (e.g., database setup)
│   ├── services/              # Service logic (e.g., web scraping, external API calls)
│   └── app.js                 # Main application file
├── .env                       # Environment variables (not included in the repo)
├── .gitignore                 # Ignored files for version control
├── package.json               # Project dependencies and scripts
├── package-lock.json          # Lockfile for consistent dependency versions
└── README.md                  # Project documentation
```

## Getting Started

### Prerequisites

- Node.js (v14 or later)
- MongoDB (local or cloud instance)
- Environment variables configured in a `.env` file

### Environment Variables

Create a `.env` file in the root directory and add the following:

```bash
PORT=4000
MONGODB_URL=your_mongodb_connection_string
CORS_ORIGIN=*
ACCESS_TOKEN_SECRET=your_secret_key
ACCESS_TOKEN_EXPIRY=1d
REFRESH_TOKEN_SECRET=your_refresh_secret
REFRESH_TOKEN_EXPIRY=10d
CLOUDINARY_CLOUD_NAME=your_cloudinary_name
CLOUDINARY_API_KEY=your_cloudinary_key
CLOUDINARY_API_SECRET=your_cloudinary_secret

GOOGLE_API_KEY=your_google_api_key
GOOGLE_CX_ID=your_google_cx_id
```

### Installation

1. Clone the repository:
   ```bash
   git clone https://github.com/dpvasani/Scrapyard.git
   cd Scrapyard
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Set up your MongoDB connection in the `.env` file.

4. Start the server:
   ```bash
   npm run dev
   ```

## Database Schema

### **SearchResults Collection**
Stores raw search results before approval.
```json
{
  "searchId": 1,
  "keywords": ["Zakir Hussain", "Tabla Player", "Music Producer"],
  "links": [
    {
      "title": "Zakir Hussain - The Tabla Maestro",
      "description": "A brief history of Zakir Hussain and his contribution to music...",
      "url": "https://example.com/zakir-hussain",
      "approved": false
    }
  ],
  "createdAt": "2025-03-08T12:00:00Z"
}
```

### **VerifiedResults Collection**
Stores approved links for verified resources.
```json
{
  "searchId": 1,
  "title": "Zakir Hussain - The Tabla Maestro",
  "description": "A brief history of Zakir Hussain and his contribution to music...",
  "url": "https://example.com/zakir-hussain",
  "verifiedAt": "2025-03-08T15:00:00Z"
}
```

## API Endpoints

### **1. Initiate a Search**
`POST /api/v1/search`
```json
{
  "keywords": ["Zakir Hussain", "Tabla Player", "Music Producer"]
}
```
_Response:_
```json
{
  "message": "Search initiated",
  "searchId": 1
}
```

### **2. Get Search Results**
`GET /api/v1/search/:searchId`
_Response:_
```json
{
  "searchId": 1,
  "keywords": ["Zakir Hussain", "Tabla Player", "Music Producer"],
  "links": [{ "title": "Zakir Hussain - The Tabla Maestro", "description": "A brief history...", "url": "https://example.com/zakir-hussain", "approved": false }]
}
```

### **3. Approve a Link**
`PATCH /api/v1/approve/:searchId/:linkIndex`
```json
{
  "approved": true
}
```
_Response:_
```json
{
  "message": "Link approved",
  "searchId": 1,
  "approvedLink": { "title": "Zakir Hussain - The Tabla Maestro", "url": "https://example.com/zakir-hussain" }
}
```

## Contributing

Feel free to open issues or create pull requests if you have suggestions for improvements!

## License

This project is licensed under the MIT License.

