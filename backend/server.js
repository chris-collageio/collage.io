require('dotenv').config();
const express = require('express');
const axios = require('axios');
const cors = require('cors');
const app = express();

app.use(cors({
  origin: "https://collageio.web.app"
}));
app.use(express.json());


// Exchange code for access token
// app.post('/auth/pinterest/exchange', async (req, res) => {
//   const { code } = req.body;
//   const { PINTEREST_CLIENT_ID, PINTEREST_CLIENT_SECRET, PINTEREST_REDIRECT_URI } = process.env;

//   if (!code) return res.status(400).json({ error: 'Missing code' });

//   try {
//     const tokenResponse = await axios.post('https://api.pinterest.com/v5/oauth/token', {
//       grant_type: 'authorization_code',
//       code,
//       client_id: PINTEREST_CLIENT_ID,
//       client_secret: PINTEREST_CLIENT_SECRET,
//       redirect_uri: PINTEREST_REDIRECT_URI,
//     });

//     res.json({ access_token: tokenResponse.data.access_token });
//   } catch (error) {
//     console.error(error.response?.data || error.message);
//     res.status(500).json({ error: 'Token exchange failed' });
//   }
// });

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
    console.error("Pinterest token exchange failed:", err.response?.data || err.message);
    return res.status(400).json({ error: "Token exchange failed" });
  }
});



app.get('/', (req, res) => {
  res.send('✅ Backend is running!');
});


const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
  console.log(`Backend running at http://localhost:${PORT}`);
});