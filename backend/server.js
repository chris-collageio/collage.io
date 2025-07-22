const axios = require("axios");
const express = require("express");
const cors = require("cors");
require("dotenv").config();

const app = express();
app.use(cors({ origin: "https://collageio.web.app" }));
app.use(express.json());

app.post("/auth/pinterest/exchange", async (req, res) => {
  const { code } = req.body;

  try {
    const params = new URLSearchParams();
    params.append("grant_type", "authorization_code");
    params.append("code", code);
    params.append("client_id", process.env.PINTEREST_CLIENT_ID);
    params.append("client_secret", process.env.PINTEREST_CLIENT_SECRET);
    params.append("redirect_uri", process.env.PINTEREST_REDIRECT_URI);

    const response = await axios.post(
      "https://api.pinterest.com/v5/oauth/token",
      params.toString(),
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