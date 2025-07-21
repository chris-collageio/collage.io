# import requests

# headers = {
#     'Authorization': 'Bearer 9320d6a370a0615ddbcaadc2ab3a6ae76bd26af2',
#     'Content-Type': 'application/json',
#     'Accept': 'application/json',
# }

# response = requests.get('https://api.pinterest.com/v5/user_account', headers=headers)
# print(response.content)

import json
from requests_oauthlib import OAuth2Session

client_id = u'1525277'
client_secret = u'dd1fff7697f7afc6cef9d121c5ea8055b13b5245'
redirect_uri = 'https://collageio.web.app/'

oauth = OAuth2Session(client_id, redirect_uri=redirect_uri,
    scope="boards:read boards:read_secret pins:read pins:read_secret"
)

authorization_url, state = oauth.authorization_url(
    'https://www.pinterest.com/oauth/'
)

print('Please go here and authorize', authorization_url)

authorization_response = input("\nEnter the callback URL: ")

token = oauth.fetch_token(
    'https://api.pinterest.com/v5/oauth/token',
    client_secret=client_secret,
    authorization_response=authorization_response
)

print(token['access_token'])

token_formatted_str = json.dumps(token, indent=2)
print(token_formatted_str)
print("\n\n")

response = oauth.get('https://api.pinterest.com/v5/boards/')
boards = response.json()
boards_formatted_str = json.dumps(boards, indent=2)
print(boards_formatted_str)
print("\n\n")

# response = oauth.get('https://api.pinterest.com/v5/pins/')
# pins = response.json()
# print(pins)