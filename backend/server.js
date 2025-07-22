const express = require("express");
const cors = require("cors");
const axios = require("axios");
const qs = require("querystring");
require("dotenv").config();

const app = express();
app.use(cors({ origin: "https://collageio.web.app" }));
app.use(express.json());


const querystring = require("querystring"); // ✅ Built-in module

app.post("/auth/pinterest/exchange", async (req, res) => {
  const { code } = req.body;

  if (!code) {
    return res.status(400).json({ error: "Missing authorization code" });
  }

  const formData = querystring.stringify({
    grant_type: "authorization_code",
    code: code,
    client_id: process.env.PINTEREST_CLIENT_ID,
    client_secret: process.env.PINTEREST_CLIENT_SECRET,
    redirect_uri: process.env.PINTEREST_REDIRECT_URI,
  });

  try {
    const response = await axios.post(
      "https://api.pinterest.com/v5/oauth/token",
      formData,
      {
        headers: {
          "Content-Type": "application/x-www-form-urlencoded",
        },
      }
    );

    res.json({ access_token: response.data.access_token });
  } catch (err) {
    console.error("Pinterest token exchange failed:", err.response?.data || err.message);
    res.status(400).json({
      error: "Token exchange failed",
      details: err.response?.data || err.message,
    });
  }
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`✅ Pinterest auth server running on port ${PORT}`);
});