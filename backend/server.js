require("dotenv").config();
const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");

const app = express();
app.use(cors());
app.use(express.json());

// CONFIGURATION
const PORT = process.env.PORT || 5000;
const GEMINI_API_KEY = process.env.GEMINI_API_KEY;
const MODEL_NAME = "gemini-2.5-flash"; // UPDATED FOR 2026

// MONGODB
if (process.env.MONGO_URL) {
    mongoose.connect(process.env.MONGO_URL)
      .then(() => console.log("✅ MongoDB Connected"))
      .catch(err => console.log("❌ MongoDB Error:", err));
} else {
    console.log("⚠️  No MONGO_URL found in .env - Database features disabled");
}

// IMPORT ROUTES
const authRoutes = require("./routes/auth");

// MOUNT ROUTES
app.use("/api/auth", authRoutes);

// CHAT ENDPOINT
app.post("/api/chat", async (req, res) => {
  try {
    const { message } = req.body;
    if (!message) return res.status(400).json({ error: "Message is required" });
    if (!GEMINI_API_KEY) return res.status(500).json({ error: "API Key missing" });

    // Endpoint for Gemini 2.5/3
    const apiUrl = `https://generativelanguage.googleapis.com/v1beta/models/${MODEL_NAME}:generateContent?key=${GEMINI_API_KEY}`;

    const response = await fetch(apiUrl, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        contents: [{
          parts: [{ text: `You are a women's health assistant. Question: ${message}` }]
        }],
        generationConfig: {
          temperature: 0.7,
          maxOutputTokens: 800,
        }
      }),
    });

    const data = await response.json();

    if (!response.ok) {
      console.error("❌ Google API Error Details:", JSON.stringify(data, null, 2));
      return res.status(response.status).json({
        error: "Google API Error",
        details: data.error?.message || "Check if the model is retired or your API key is active."
      });
    }

    const aiResponse = data.candidates?.[0]?.content?.parts?.[0]?.text;
    res.json({ reply: aiResponse || "I'm sorry, I couldn't generate a response." });

  } catch (error) {
    console.error("💥 Server Error:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
});

app.listen(PORT, () => {
  console.log(`🚀 Server running on http://localhost:${PORT} | Using: ${MODEL_NAME}`);
});