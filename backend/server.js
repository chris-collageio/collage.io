const express = require("express");
const cors = require("cors");
const axios = require("axios");
const qs = require("querystring");
require("dotenv").config();

const app = express();
app.use(cors({ origin: "https://collageio.web.app" }));
app.use(express.json());

app.post("/auth/pinterest/exchange", async (req, res) => {
  const { code } = req.body;

  if (!code) {
    return res.status(400).json({ error: "Missing authorization code" });
  }

  const json = JSON.stringify(
    {
      grant_type: "authorization_code",
      code: code,
      client_id: process.env.PINTEREST_CLIENT_ID,
      client_secret: process.env.PINTEREST_CLIENT_SECRET,
      redirect_uri: process.env.PINTEREST_REDIRECT_URI,
    }
  );

  try {
    res = await axios.post("https://api.pinterest.com/v5/oauth/token", json, {
      headers: {
        'Authorization': 'Basic ' + btoa(process.env.PINTEREST_CLIENT_ID + ":" + process.env.PINTEREST_CLIENT_SECRET),
        'Content-Type': 'application/x-www-form-urlencoded'
      }
    });
  } catch (err) {
    console.error("Pinterest token exchange failed:", err.response?.data || err.message);
    res.status(400).json({
      error: "Token exchange failed",
      details: err.response?.data || err.message,
    });
  }
  res.json({ access_token: response.data.access_token });

});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`✅ Pinterest auth server running on port ${PORT}`);
});