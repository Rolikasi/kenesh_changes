# %%
import pandas as pd
from os import listdir
from os.path import isfile, join
from difflib import SequenceMatcher
import numpy as np
import itertools
from functools import reduce

paths = ['III', 'IV', 'V', 'VI']
#%%
# Clean Data


##Clean tail in names of V kenesh
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

##clean party and names
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
    'Алыбаев Орозбек Артильевич' : 'Алыбаев Орозбек Артельевич',
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
    csvs.update({path:[full_path + '/'+f for f in listdir(full_path) if isfile(join(full_path, f))]})

for csv in csvs:
    csvs.update({csv : [clear_names(rename_party(pd.read_csv(f))) for f in csvs[csv]]})
    pd.concat(csvs[csv]).replace('', np.nan, regex=True).dropna().sort_values('party').drop_duplicates(ignore_index=True).to_csv('export/cleaned/' + csv + '.csv', index=False)

# %%


def similar(a, b):
    return SequenceMatcher(None, a, b).ratio()


def find_similar(df, col):
    cleanedList = [x for x in df[col].unique() if str(x) != 'nan']
    found_similar = {}
    for name, nextname in itertools.combinations(cleanedList, 2):
        if similar(name, nextname) > 0.8:
            print("similar", name, 'and', nextname, similar(name, nextname))
            found_similar.update({nextname: name})
    return found_similar


for col in ['name']:
    print(find_similar(concatenated_df, col))


# %%
### join dfs in one df
dfs = [pd.read_csv('export/cleaned/' + f +'.csv').reset_index().rename(columns={'party': 'party_'+f, 'index': 'num'}) for f in paths]
df_final = reduce(lambda left,right: pd.merge(left,right,on=['name', 'num'], how='outer'), dfs)
df_final = df_final.sort_values('name')
#df_final['num'] += 1
df_final.melt(id_vars=["name", "num"],
        var_name="sozyv",
        value_name="party").sort_values('name').dropna().to_csv('visual/data/deputs_js.csv', index=False)
# %%
