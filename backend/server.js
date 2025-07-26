const express = require("express");
const cors = require("cors");
const axios = require("axios");
const qs = require("qs");
require("dotenv").config();

const app = express();
app.use(cors({ origin: "https://collageio.web.app" }));
app.use(express.json());

app.post("/auth/pinterest/exchange", async (req, res) => {
  const { code } = req.body;

  if (!code) {
    return res.status(400).json({ error: "Missing authorization code" });
  }

  let data = qs.stringify({
    'client_id': process.env.PINTEREST_CLIENT_ID,
    'client_secret': process.env.PINTEREST_CLIENT_SECRET,
    'redirect_uri': process.env.PINTEREST_REDIRECT_URI,
    'code': code,
    'grant_type': 'authorization_code' 
  });

  let config = {
    method: 'post',
    maxBodyLength: Infinity,
    url: 'https://api.pinterest.com/v5/oauth/token?client_id=' + process.env.PINTEREST_CLIENT_ID 
    + '&client_secret=' + process.env.PINTEREST_CLIENT_SECRET
    + '&redirect_uri=' + process.env.PINTEREST_REDIRECT_URI 
    + 'https://collageio.web.app/&code=' + code 
    + '&grant_type=authorization_code',
    headers: { 
      'Authorization': "Basic " + btoa( process.env.PINTEREST_CLIENT_ID  + ":" +  process.env.PINTEREST_CLIENT_SECRET ), 
      'Content-Type': 'application/x-www-form-urlencoded', 
      'Cookie': '_ir=0'
    },
    data : data
  };

  axios.request(config)
  .then((response) => {
    // res.json({ access_token: response.data.access_token, refresh_token: response.data.refresh_token });
    res.json({ access_token: response.data.access_token });
    console.log(JSON.stringify(response.data));
  })
  .catch((error) => {
    console.log(error);
  });  
});


app.get("/auth/pinterest/boards", async (req, res) => {
  const { token } = req.query;

  if (!token) {
    return res.status(400).json({ error: "Missing access token" });
  }

  let config = {
    method: 'get',
    maxBodyLength: Infinity,
    url: 'https://api.pinterest.com/v5/boards/',
    headers: { 
      'Authorization': 'Bearer ' + token, 
      'Cookie': '_ir=0'
    }
  };

  axios.request(config)
  .then((response) => {
    res.json(response.data);
  })
  .catch((error) => {
    console.log(error);
    res.status(500).json({ error: "Failed to fetch boards" });
  });
});

// app.get("/auth/pinterest/pins", async (req, res) => {
// });


const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`✅ Pinterest auth server running on port ${PORT}`);
});