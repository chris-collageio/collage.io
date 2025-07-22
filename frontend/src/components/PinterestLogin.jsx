const PinterestLogin = () => {
  const PINTEREST_CLIENT_ID = "1525277";
  const REDIRECT_URI = "https://collageio.web.app/";
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