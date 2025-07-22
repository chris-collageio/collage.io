const axios = require("axios");
const express = require("express");
const cors = require("cors");
require("dotenv").config();

const app = express();
app.use(cors({ origin: "https://collageio.web.app" }));
app.use(express.json());


const qs = require("querystring"); // ✅ Built-in

app.post("/auth/pinterest/exchange", async (req, res) => {
  const { code } = req.body;

  const data = qs.stringify({
    grant_type: "authorization_code",
    code,
    client_id: process.env.PINTEREST_CLIENT_ID,
    client_secret: process.env.PINTEREST_CLIENT_SECRET,
    redirect_uri: process.env.PINTEREST_REDIRECT_URI,
  });

  try {
    const response = await axios.post(
      "https://api.pinterest.com/v5/oauth/token",
      data,
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
  console.log(`✅ Backend running on port ${PORT}`);
});