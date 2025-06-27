import requests

headers = {
    'Authorization': 'Bearer pina_AMASQQQXAADXQBAAGBAM4DIV7XSLDFYBQBIQDMT6EUAPLY2LCPIWUULOZGQS56T4FQANB7G3YIFIOC44HDPZT4ORMHDXO5IA',
    'Content-Type': 'application/json',
    'Accept': 'application/json',
}

response = requests.get('https://api.pinterest.com/v5/user_account', headers=headers)
print(response.content)
