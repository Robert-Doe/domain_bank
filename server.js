const express = require("express");
const fs = require("fs");
const cors = require("cors");

const app = express();
const PORT = process.env.PORT || 80;
const LOG_FILE = "tracked_domains.json";

// Middleware to parse JSON requests and enable CORS
app.use(express.json());
app.use(cors());

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

// API endpoint to receive tracking data
app.post("/track", (req, res) => {
    const { domain } = req.body;

    if (!domain) {
        return res.status(400).json({ error: "Missing domain" });
    }

    console.log(`Received domain: ${domain}`);

    // Save domain with timestamp
    saveData({ domain, timestamp: new Date().toISOString() });

    res.status(200).json({ message: "Domain logged successfully" });
});

// API endpoint to display all tracked domains
app.get("/logs", (req, res) => {
    if (fs.existsSync(LOG_FILE)) {
        const data = fs.readFileSync(LOG_FILE);
        return res.json(JSON.parse(data));
    }

    res.json([]);
});

// Start the server
app.listen(PORT, () => {
    console.log(`Server running at http://localhost:${PORT}`);
});
