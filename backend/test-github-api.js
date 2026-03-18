const OAuth2 = require('oauth').OAuth2;

const oauth2 = new OAuth2(
  'dummy_client_id',
  'dummy_secret',
  '',
  'https://github.com/login/oauth/authorize',
  'https://github.com/login/oauth/access_token',
  { 'User-Agent': 'CodePilot-AI' }
);
oauth2.useAuthorizationHeaderforGET(true);

console.log('Fetching user profile...');
oauth2.get('https://api.github.com/user', 'dummy_access_token', function (err, body, res) {
  if (err) {
    console.error('------- GITHUB FETCH PROFILE ERROR -------');
    console.error(err);
  } else {
    console.log('Success:', body);
  }
});
