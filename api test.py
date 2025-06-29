import requests

headers = {
    'Authorization': 'Bearer <YOUR_ACCESS_TOKEN>',
    'Content-Type': 'application/json',
    'Accept': 'application/json',
}

response = requests.get('https://api.pinterest.com/v5/user_account', headers=headers)
print(response.content)
