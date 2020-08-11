# %%
import pandas as pd
import json
from bs4 import BeautifulSoup, NavigableString, Tag
import requests as req

with open('kenesh_VI_links.json') as f:
  data = json.load(f)
with open('kenesh_IV_links.json') as f:
  data2 = json.load(f)

df1 = pd.DataFrame(data['archived_urls'])
df1.date = pd.to_datetime(df1.date, format='%Y-%m-%d')
df1 = df1.groupby(pd.DatetimeIndex(df1.date).to_period('M')).nth(0)
for row in df1.values:
  get_data(row[0], str(row[1].to_period('M')), 'VI')

#%%
with open('kenesh_IV_links.json') as f:
  data = json.load(f)
df1 = pd.DataFrame(data['archived_urls'])
df1.date = pd.to_datetime(df1.date, format='%Y-%m-%d')
df1 = df1.groupby(pd.DatetimeIndex(df1.date).to_period('M')).nth(0)
for row in df1.values:
  get_data(row[0], str(row[1].to_period('M')), 'IV')

# %%
def get_data(link, dt, sozyv):
    result = []
    resp = req.get(link)
    soup = BeautifulSoup(resp.text, "lxml")
    table = soup.findAll('table')[-1]
    table = table.find('tbody')
    if sozyv == 'VI':
      rows = table.findAll('tr')
    elif sozyv == 'IV':
      rows = table.findAll('tr')[1:]
    for row in rows:
      idx, name, party = row.findAll('td')
      result.append([idx.text, name.text, party.text])
    pd.DataFrame(result,columns=['index', 'name', 'party']).to_csv('export/' +sozyv + '/' + dt +'.csv', index=False)

#%%
result = []
resp = req.get('https://web.archive.org/web/20160617175705/http://kenesh.kg:80/ru/deputy/list/35')
soup = BeautifulSoup(resp.text, "lxml")
table = soup.findAll('table')[-1]
table = table.find('tbody')
rows = table.findAll('tr')
for row in rows:
  idx, name, party = row.findAll('td')
  result.append([idx.text, name.text, party.text])

# %%
df1.index

# %%

# %%
