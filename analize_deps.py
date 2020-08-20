# %%
import pandas as pd
from os import listdir
from os.path import isfile, join
from difflib import SequenceMatcher
import numpy as np
import itertools
from functools import reduce

paths = ['III', 'IV', 'V', 'VI']
# %%
# Clean Data


# Clean tail in names of V kenesh
name_tail_replace = {
    'Игоря': 'Игорь',
    'ева': 'ев',
    'ова': 'ов',
    'ича': 'ич',
    r'^(\w*\s+\w*)([а])\b': r'\1',
    r'^(\w*\s+\w*)([у])\b': r'\1а',
    r'^(\w*\s+\w*)([я])\b': r'\1й',
    r'^(\w*\s+\w*)([ю])\b': r'\1я',
    'еву': 'ева',
    'ову': 'ова',
    'евну': 'евна',
    'овну': 'овна',
    'ину': 'ина',
}
df = pd.read_csv('2010-12_V_raw.csv')
df.name = df.name.replace(name_tail_replace, regex=True)
df.to_csv('export/V/2010-12.csv', index=False)

# clean party and names
party_rename = {
    'Политическая партия«Народная партия «Ак Жол»': 'Ак Жол',
    'Партия коммунистов Кыргызстана': 'Партия коммунистов Кыргызстана',
    'Социал-демократическая партия Кыргызстана (СДПК)': 'СДПК',
    'Политическая партия«Народная партия «Ак Жол» ': 'Ак Жол',
    'Политическая партия «Народная партия «Ак Жол»': 'Ак Жол',
    'Политическая партия «Народная партия «Ак Жол» ': 'Ак Жол',
    '«АТА-ЖУРТ»': 'Ата-Журт',
    '«АР-НАМЫС»': 'Ар-Намыс',
    '«РЕСПУБЛИКА»': 'Республика',
    '«АТА МЕКЕН»': 'Ата Мекен',
    'Парламентская фракция «Бир Бол»': 'Бир Бол',
    'Парламентская фракция «Республика - Ата Журт»': 'Республика - Ата Журт',
    'Парламентская фракция «Кыргызстан»': 'Кыргызстан',
    'Парламентская фракция СДПК': 'СДПК',
    'Фракция «Онугуу-Прогресс»': 'Онугуу-Прогресс',
    'Парламентская фракция «Ата Мекен»': 'Ата Мекен',
    'Парламентская фракция «Онугуу-Прогресс»': 'Онугуу-Прогресс',
}

name_rename = {
    'ЭГЕМБЕРДИЕВ': 'Эгембердиев',
    '\\xa0': ' ',
    '\\r\\n': '',
    '   ': ' ',
    '  ': ' ',
    'Шин Роман Александрович': 'Шин Роман', # первая перезапись
    'Шин Роман': 'Шин Роман Александрович', # вторая перезапись
    'Бабанов Өмүрбек Токтогулович': 'Бабанов Омурбек Токтогулович',
    'Нышанов Сайдулла Канболотович': 'Нышанов Сайдилла Канболотович',
    'Өмүркулов Иса Шейшенкулович': 'Омуркулов Иса Шейшенкулович',
    'Кудайбергенов Джаныш Камчибекович': 'Кудайбергенов Джаныш Камчыбекович',
    'Дербишева Гульнара Толубайевна': 'Дербишева Гульнара Толубаевна',
    'Жээнбеков Асилбек Шарипович': 'Жээнбеков Асылбек Шарипович',
    'Төрөбаев': 'Торобаев',
    'Юсуров Абдумеджит Лелезович': 'Юсуров Абдумажит Лелезович',
    'Кодуранова Асел Союзбековна': 'Кодуранова Асель Союзбековна',
    'Жумабеков Дастанбек Артисбекович': 'Джумабеков Дастанбек Артисбекович',
    'Рыспаев Кожобек Жайчыбекович': 'Рыспаев Кожобек Джайчыбекович',
    'Жетигенов Бакытбек Жеңишбекович': 'Джетигенов Бакытбек Дженишбекович',
    'Алтыбаева Айнуру Тойчиевна': 'Алтыбаева Айнура Тойчиевна',
    'Акматов Алмасбек Жумабекович': 'Акматов Алмазбек Жумабекович',
    'Асылбаева Гүлшат Кадыровна': 'Асылбаева Гюльшат Кадыровна',
    'Байбакпаев Экмат Журукпаевич': 'Байбакпаев Экмат Джурукпаевич',
    'Бакчиев Жаныбек Абдукапарович': 'Бакчиев Джаныбек Абдукапарович',
    'Жураев Сайдолимжон Маруфович': 'Джураев Сайдолимжон Маруфович',
    'Кадыкеев Нурланбек Кадыкеевич': 'Макеев Нурланбек Кадыкеевич',
    'Масабиров Талайбек Айтмаматович': 'Масабиров Таалайбек Айтмаматович',
    'Турускулов Жыргалбек Күрүчбекович': 'Турускулов Жыргалбек Куручбекович',
    'Алыбаев Орозбек Артильевич': 'Алыбаев Орозбек Артельевич',
    'ү': 'у',
    'ө': 'о',
    'Ө': 'О',
    'ң': 'н',
}


def clear_names(df):
    df.name = df.name.str.strip().replace(name_rename, regex=True)
    try:
        df.drop('index', 1, inplace=True)
    except:
        print('error')
    return df


def rename_party(df):
    try:
        df.party = df.party.replace(party_rename, regex=True)
        return df
    except:
        print("error in:", df)
        df['party'] = 'Самовыдвиженец'
        return df


csvs = {}


for path in paths:
    full_path = "export/" + path
    csvs.update(
        {path: [full_path + '/'+f for f in listdir(full_path) if isfile(join(full_path, f))]})

for csv in csvs:
    csvs.update({csv: [clear_names(rename_party(pd.read_csv(f)))
                       for f in csvs[csv]]})
    pd.concat(csvs[csv]).replace('', np.nan, regex=True).dropna().sort_values(
        'party').drop_duplicates(ignore_index=True).to_csv('export/cleaned/' + csv + '.csv', index=False)

# %%



# %%
# join dfs in one df
def party_finder(df, party):
    col_name = {'Самовыдвиженец': 'isIndependent',
                'Ак Жол': 'isAkjol',
                'СДПК': 'isSDPK',
                'Партия коммунистов Кыргызстана': 'isCommunist',
                'Ата Мекен': 'isAtameken',
                'Ата-Журт': "isAtajurt",
                'Республика': 'isRepublic',
                'Ар-Намыс': 'isArnamys',
                'Бир Бол': 'isBirbol',
                'Кыргызстан': 'isKyrgyzstan',
                'Онугуу-Прогресс': 'isOnuguu',
                'Республика - Ата Журт': 'isRepAtajurt'}
    df1 = df.copy()
    df1[col_name[party]] = df1.apply(
        lambda r: r.str.contains(party, case=False).any(), axis=1)
    df1[col_name[party]] = df1[col_name[party]].astype(int)
    return df1[['name', col_name[party]]]

rename_cols = {'party_III': '3', 'party_IV': '4',
               'party_V': '5', 'party_VI': '6'}
dfs = [pd.read_csv('export/cleaned/' + f + '.csv').reset_index().rename(
    columns={'party': 'party_'+f, 'index': 'num'}) for f in paths]
df_reduced = reduce(lambda left, right: pd.merge(
    left, right, on=['name', 'num'], how='outer'), dfs)


# %%
dfs = [pd.read_csv('export/cleaned/' + f + '.csv').rename(
    columns={'party': 'party_'+f, 'index': 'num'}) for f in paths]
df_finder = reduce(lambda left, right: pd.merge(
    left, right, on=['name'], how='outer'), dfs)
df_finder['partyChanger'] = 0
for idx in df_finder.index:
    if len(set(list(df_finder.drop('party_III', 1).loc[idx].values))) > 4:
        df_finder.loc[idx, 'partyChanger'] = 1
df_partychange = df_finder[['name', 'partyChanger']]
df_finder['isFemale'] = df_finder.name.str.contains(
    'ева|ова|евна|овна|Гульнара', regex=True)
df_finder.isFemale = df_finder.isFemale.astype(int)
df_female = df_finder[['name', 'isFemale']]
df_finder['allParties'] = df_finder[['party_III', 'party_IV','party_V', 'party_VI']].apply(lambda row: ','.join([x.replace('nan', '') for x in row.values.astype(str)]), axis=1)
df_allParty = df_finder[['name', 'allParties']]
dfs_export = [df_partychange, df_reduced, df_female, df_allParty]
parties = list(pd.unique(
    df_finder[['party_III', 'party_IV', 'party_V', 'party_VI']].values.ravel('K')))
parties.remove(np.nan)
for party in parties:
    dfs_export.append(party_finder(df_finder, party))
df_final = reduce(lambda left, right: pd.merge(
    left, right, on=['name'], how='outer'), dfs_export)
df_export = df_final.sort_values('name').rename(columns=rename_cols).melt(id_vars=['name', 'partyChanger', 'num','isFemale', 'isIndependent', 'isAkjol', 'isSDPK',
       'isCommunist', 'isAtameken', 'isAtajurt', 'isRepublic', 'isArnamys',
       'isBirbol', 'isKyrgyzstan', 'isOnuguu', 'isRepAtajurt', 'allParties'],
                                                                          var_name="sozyv",
                                                                          value_name="party").sort_values('name').dropna()


# %%
df_export = df_export.sort_values(['name', 'sozyv'])
df_export.sozyv = df_export.sozyv.astype(int)
#df_export['sozyvMisser'] = 0
df_export['sozyvMisser'] = df_export[['name', 'sozyv']].groupby('name').diff()
dfc = df_export.groupby('name')['sozyvMisser']
df_export['sozyvMisser'] = dfc.transform('max')

df_export.to_csv('visual/data/deputs_js.csv', index=False)
# for idx in df_export.index:
#     print
#df_export.loc[idx,'sozyvMisser'] = 1
# %%
df_finder.sort_values(['party_VI', 'party_V', 'party_IV', 'party_III']).to_csv(
    'export/kenesh_deps.csv', index=False)
# %%
#%%


# def similar(a, b):
#     return SequenceMatcher(None, a, b).ratio()


# def find_similar(df, col):
#     cleanedList = [x for x in df[col].unique() if str(x) != 'nan']
#     found_similar = {}
#     for name, nextname in itertools.combinations(cleanedList, 2):
#         if similar(name, nextname) > 0.8:
#             print("similar", name, 'and', nextname, similar(name, nextname))
#             found_similar.update({nextname: name})
#     return found_similar


# for col in ['name']:
#     print(find_similar(concatenated_df, col))

# %%
