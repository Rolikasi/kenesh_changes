# %%
import pandas as pd
import json
from bs4 import BeautifulSoup, NavigableString, Tag
import requests as req
import re

# %%
with open('kenesh_VI_links.json') as f:
    data = json.load(f)
with open('kenesh_IV_links.json') as f:
    data2 = json.load(f)

df1 = pd.DataFrame(data['archived_urls'])
df1.date = pd.to_datetime(df1.date, format='%Y-%m-%d')
df1 = df1.groupby(pd.DatetimeIndex(df1.date).to_period('M')).nth(0)
for row in df1.values:
    get_data(row[0], str(row[1].to_period('M')), 'VI')

# %%
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
    pd.DataFrame(result, columns=['index', 'name', 'party']).to_csv(
        'export/' + sozyv + '/' + dt + '.csv', index=False)


# %%
result = []
resp = req.get(
    'https://web.archive.org/web/20160617175705/http://kenesh.kg:80/ru/deputy/list/35')
soup = BeautifulSoup(resp.text, "lxml")
table = soup.findAll('table')[-1]
table = table.find('tbody')
rows = table.findAll('tr')
for row in rows:
    idx, name, party = row.findAll('td')
    result.append([idx.text, name.text, party.text])

# %%
df1 = pd.read_csv('kenesh_i_links.csv')
result = []
for link in df1.values[:-1]:
    resp = req.get(link[0])
    soup = BeautifulSoup(resp.text, "lxml")
    text = soup.find('div', {'class', 'act-content'}).text
    [result.append([x.strip(' ').replace('  ', ' '), link[1]])
          for x in re.findall('\\r\\n(\s[\w\s]*)\s+-\s', text)]

with open("I_kenesh_extra.html", encoding='utf8') as infile:
    soup = BeautifulSoup(infile, "html.parser")
texts = soup.findAll('a')[2:]
texts = [a.text for a in texts]
for text in texts:
  if 'народных' in text:
    [result.append([x.replace('"', '').replace('\n', '').replace('  ', ' '), 'СНП']) for x in re.findall('\d\s*([\D]*)$', text)]

  if 'Законодательного' in text:
    [result.append([x.replace('"', '').replace('\n', '').replace('  ', ' '), 'ЗС']) for x in re.findall('\d\s*([\D]*)$', text)]

# %%
pd.DataFrame(result, columns=['name', 'palata']).to_csv('export/I/I.csv', index=False)

# %%
#scrape commitets 2 sozyv
link = 'http://cbd.minjust.gov.kg/act/view/ru-ru/8647/20?mode=tekst'
resp = req.get(link)
soup = BeautifulSoup(resp.text, "lxml")
text = soup.find('div', {'class', 'act-content'}).text
result = [x.replace('\r', '') for x in re.findall('\d+\.\s(\w*\s*\w*\.?\s?\w*\.?)' , text)]
pd.DataFrame(result, columns=['name']).drop_duplicates().to_csv('export/II/II_from_minjust.csv', index=False)
# %%

# %%
resp = req.get('https://docs.google.com/spreadsheets/d/1GtD8oG3HJkRx3gDurrnym8qdJ4cD0jdwMh2gHRYFprQ/edit?usp=sharing')
soup = BeautifulSoup(resp.text, "lxml")
# %%
soup
# %%
