require('dotenv').config();
const express = require('express');
const axios = require('axios');
const cors = require('cors');

const app = express();
app.use(cors({
  origin: "https://collageio.web.app",
  credentials: true
}));
app.use(express.json());

const PORT = 3000;

// Exchange code for access token
app.post('/auth/pinterest/exchange', async (req, res) => {
  const { code } = req.body;
  const { PINTEREST_CLIENT_ID, PINTEREST_CLIENT_SECRET, PINTEREST_REDIRECT_URI } = process.env;

  if (!code) return res.status(400).json({ error: 'Missing code' });

  try {
    const tokenResponse = await axios.post('https://api.pinterest.com/v5/oauth/token', {
      grant_type: 'authorization_code',
      code,
      client_id: PINTEREST_CLIENT_ID,
      client_secret: PINTEREST_CLIENT_SECRET,
      redirect_uri: PINTEREST_REDIRECT_URI,
    });

    res.json({ access_token: tokenResponse.data.access_token });
  } catch (error) {
    console.error(error.response?.data || error.message);
    res.status(500).json({ error: 'Token exchange failed' });
  }
});

app.get('/', (req, res) => {
  res.send('✅ Backend is running!');
});

app.listen(PORT, () => {
  console.log(`Backend running at http://localhost:${PORT}`);
});