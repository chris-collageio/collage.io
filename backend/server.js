const express = require("express");
const cors = require("cors");
const axios = require("axios");

const app = express();
app.use(cors({ origin: "https://collageio.web.app" }));
app.use(express.json());

app.post("/auth/pinterest/exchange", async (req, res) => {
  const { code } = req.body;

  try {
    const response = await axios.post(
      "https://api.pinterest.com/v5/oauth/token",
      new URLSearchParams({
        grant_type: "authorization_code",
        code,
        client_id: process.env.PINTEREST_CLIENT_ID,
        client_secret: process.env.PINTEREST_CLIENT_SECRET,
        redirect_uri: process.env.PINTEREST_REDIRECT_URI,
      }).toString(),
      {
        headers: {
          "Content-Type": "application/x-www-form-urlencoded",
        },
      }
    );

    return res.json({ access_token: response.data.access_token });
  } catch (err) {
    console.error("Token exchange failed:", err.response?.data || err.message);
    return res.status(400).json({
      error: "Token exchange failed",
      details: err.response?.data || err.message,
    });
  }
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`✅ Pinterest auth server running on port ${PORT}`);
});