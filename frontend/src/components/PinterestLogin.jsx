// import { useEffect } from "react";
// import { useNavigate, useLocation } from "react-router-dom";
// import axios from "axios";

// const PinterestLogin = () => {
//   const navigate = useNavigate();
//   const location = useLocation();

//   const PINTEREST_CLIENT_ID = "1525277";
//   const REDIRECT_URI = "https://collageio.web.app/";
//   const BACKEND_URL = "http://localhost:3000/auth/pinterest/exchange";

//   const scope = "boards:read boards:read_secret pins:read pins:read_secret";

//   const loginWithPinterest = () => {
//     const authUrl = `https://www.pinterest.com/oauth/?response_type=code&client_id=${PINTEREST_CLIENT_ID}&redirect_uri=${encodeURIComponent(
//       REDIRECT_URI
//     )}&scope=${encodeURIComponent(scope)}`;

//     window.location.href = authUrl;
//   };

//   // ⬅️ Handle Pinterest callback with ?code=...
//   useEffect(() => {
//     const params = new URLSearchParams(location.search);
//     const code = params.get("code");

//     if (code) {
//         console.log(code);
//       // Send code to backend
//       axios
//         .post(BACKEND_URL, { code })
//         .then((res) => {
//           console.log("Access token:", res.data.access_token);
//           alert("Logged in!");
//           navigate("/"); // Redirect wherever
//         })
//         .catch((err) => {
//           console.error("Error exchanging code:", err);
//           alert("Login failed");
//         });

//         axios.post('http://localhost:3000/auth/pinterest/exchange', { code })
//         .then(res => {
//           const accessToken = res.data.access_token;
//           localStorage.setItem('pinterest_token', accessToken);
//           // Now you can use this token to make API requests
//         });

//     }
//   }, [location.search, navigate]);
  
//   return (
//     <div className='pinterest-button'>
//         <button className="button-55" role="button" onClick={loginWithPinterest}>Connect to Pinterest</button>
//     </div>
//   );
// };

// export default PinterestLogin;

import { useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import axios from "axios";

const PinterestLogin = () => {
  const navigate = useNavigate();
  const location = useLocation();

  const PINTEREST_CLIENT_ID = "1525277";
  const REDIRECT_URI = "https://collageio.web.app/";
  const BACKEND_URL = "http://localhost:3000/auth/pinterest/exchange";

  const scope = "boards:read boards:read_secret pins:read pins:read_secret";


  const loginWithPinterest = () => {
    const authUrl = `https://www.pinterest.com/oauth/?response_type=code&client_id=${PINTEREST_CLIENT_ID}&redirect_uri=${encodeURIComponent(
      REDIRECT_URI
    )}&scope=${encodeURIComponent(scope)}`;

    window.location.href = authUrl;
  };

  return (
    <div className='pinterest-button'>
        <button className="button-55" role="button" onClick={loginWithPinterest}>Connect to Pinterest</button>
    </div>
  );
};

export default PinterestLogin;