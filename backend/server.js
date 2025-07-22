const express = require("express");
const cors = require("cors");
const axios = require("axios");
const qs = require("querystring");
require("dotenv").config();

const app = express();
app.use(cors({ origin: "https://collageio.web.app" }));
app.use(express.json());

// app.post("/auth/pinterest/exchange", async (req, res) => {
//   const { code } = req.body;

//   if (!code) {
//     return res.status(400).json({ error: "Missing authorization code" });
//   }

//   const data = qs.stringify({
//     grant_type: "authorization_code",
//     code,
//     client_id: process.env.PINTEREST_CLIENT_ID,
//     client_secret: process.env.PINTEREST_CLIENT_SECRET,
//     redirect_uri: process.env.PINTEREST_REDIRECT_URI,
//   });

//   try {
//     const response = await axios.post(
//       "https://api.pinterest.com/v5/oauth/token",
//       data,
//       {
//         headers: {
//           "Content-Type": "application/x-www-form-urlencoded",
//         },
//       }
//     );

//     res.json({ access_token: response.data.access_token });
//   } catch (err) {
//     console.error("Pinterest token exchange failed:", err.response?.data || err.message);
//     res.status(400).json({
//       error: "Token exchange failed",
//       details: err.response?.data || err.message,
//     });
//   }
// });

app.get("/auth/pinterest/exchange", async (req, res) => {
  let params = new URL(document.location.toString()).searchParams;
  let code = params.get("code");
  console.log(code);
});


// fetch('https://api.pinterest.com/v5/oauth/token', {
//   method: "POST",
//   headers: {
//     // Customize request header here
//     "Content-Type": "application/json",
//   },
//   body: JSON.stringify({
//     foo: "bar",
//     bar: "foo",
//   }),
// })
//   .then((res) => res.json())
//   .then((data) => {
//     console.log("Response data:", data);
//   })
//   .catch((err) => {
//     console.log("Unable to fetch -", err);
//   });

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`✅ Pinterest auth server running on port ${PORT}`);
});