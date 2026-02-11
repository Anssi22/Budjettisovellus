// backend/server.js

// Tuodaan Node.js-kirjastot, express=palvelin, mongoose=tietokanta, cors=CORS-kirjasto, dotenv=ympäristömuuttujat
const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const dotenv = require("dotenv");

// Ladataan .env-tiedoston muuttujat process.env:iin
dotenv.config();
const app = express();

app.use(cors({ origin: "http://localhost:4200" }));  // Frontend-portti
app.use(express.json());

// Reitit
app.use("/api/transactions", require("./routes/transactions"));

// MongoDB-yhteys 
const MongoDB = async () => {
    try {
        await mongoose.connect(process.env.MONGO_URI);
        console.log("✅ MongoDB yhteys onnistui!");
    } catch (error) {
        console.error("❌ MongoDB yhteys epäonnistui:", error.message);
        process.exit(1);  // Lopeta prosessi kriittisessä virheessä
    }
};

// Käynnistä DB ensin, sitten serveri
MongoDB().then(() => {
    app.listen(process.env.PORT, () => {
        console.log("Backend käynnissä: http://localhost:" + process.env.PORT);
        console.log("CORS: http://localhost:4200");
    });
});