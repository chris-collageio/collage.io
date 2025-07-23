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

  const axios = require('axios');
  const qs = require('qs');
  let data = qs.stringify({
    'client_id': '1525277',
    'client_secret': 'dd1fff7697f7afc6cef9d121c5ea8055b13b5245',
    'redirect_uri': 'https://collageio.web.app/',
    'code': '544064a5acafceb3fb897e642ebb4b6837f56655',
    'grant_type': 'authorization_code' 
  });

  let config = {
    method: 'post',
    maxBodyLength: Infinity,
    url: 'https://api.pinterest.com/v5/oauth/token?client_id=1525277&client_secret=dd1fff7697f7afc6cef9d121c5ea8055b13b5245&redirect_uri=https://collageio.web.app/&code=' + code + '&grant_type=authorization_code',
    headers: { 
      'Authorization': 'Basic MTUyNTI3NzpkZDFmZmY3Njk3ZjdhZmM2Y2VmOWQxMjFjNWVhODA1NWIxM2I1MjQ1', 
      'Content-Type': 'application/x-www-form-urlencoded', 
      'Cookie': '_ir=0'
    },
    data : data
  };

  axios.request(config)
  .then((response) => {
    console.log(JSON.stringify(response.data));
  })
  .catch((error) => {
    console.log(error);
  });


  // let data = qs.stringify({
  //   'client_id': process.env.PINTEREST_CLIENT_ID,
  //   'client_secret': process.env.PINTEREST_CLIENT_SECRET,
  //   'redirect_uri': process.env.PINTEREST_REDIRECT_URI,
  //   'code': code,
  //   'grant_type': 'authorization_code' 
  // });

  // let config = {
  //   method: 'post',
  //   maxBodyLength: Infinity,
  //   url: 'https://api.pinterest.com/v5/oauth/token?client_id=' + process.env.PINTEREST_CLIENT_ID
  //     + '&client_secret=' + process.env.PINTEREST_CLIENT_ID 
  //     + '&redirect_uri=https://collageio.web.app/&code=' + code 
  //     + '&grant_type=authorization_code',
  //   headers: { 
  //     'Authorization': 'Basic' + btoa(process.env.PINTEREST_CLIENT_ID + ':' + process.env.PINTEREST_CLIENT_SECRET), 
  //     'Content-Type': 'application/x-www-form-urlencoded', 
  //     'Cookie': '_ir=0'
  //   },
  //   data : data
  // };

  // axios.request(config)
  // .then((response) => {
  //   console.log(JSON.stringify(response.data));
  // })
  // .catch((error) => {
  //   console.log(error);
  // });

  res.json({ access_token: response.data.access_token });

});


const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`✅ Pinterest auth server running on port ${PORT}`);
});