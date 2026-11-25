import re, json, sys
src, midjson, out = sys.argv[1], sys.argv[2], sys.argv[3]
lines = open(src, encoding='utf-8').read().split('\n')
sections = [(4104, 4417, '518'), (4417, 4683, '490'), (4683, 4701, '4209.5')]
mids = json.load(open(midjson))['mids']
countries = set()
for m in mids:
    countries.add(m['name']); countries.add(m['allocatedTo'])
    countries.add(re.sub(r'\s*\(.*?\)', '', m['allocatedTo']).strip())
countries |= {'Iran (Islamic Republic of)', 'Faroes', 'United Kingdom', 'United States', 'United States of America', 'Russian Federation',
              'Republic of Korea', 'Korea (Republic of)', 'Viet Nam', 'Türkiye', 'Turkey', 'Cabo Verde', 'China', 'Hong Kong, China',
              'Syrian Arab Republic', 'Libya', 'Venezuela (Bolivarian Republic of)', 'Côte d\'Ivoire', 'Democratic People\'s Republic of Korea',
              'United Republic of Tanzania', 'Bolivarian Republic of Venezuela', 'Greenland (Denmark)', 'Canada', 'Japan', 'Chile', 'Peru',
              'Ecuador', 'Argentina', 'Uruguay', 'Brazil', 'Mexico', 'Colombia', 'Panama', 'Australia', 'New Zealand'}
clist = sorted(countries, key=len, reverse=True)
skip = re.compile(r"^(=====PAGE|GMDSS\.1/Circ\.22|Annex 7, page|I:\\|NAV/|MET|Area|Country NAVTEX|International 518|National 490|National 4209)")
AREA = r'(?:XXI|XX|XIX|XVIII|XVII|XVI|XV|XIV|XIII|XII|XI|X|IX|VIII|VII|VI|V|IV|III|II|I)'
POS = r"(\d{1,2}\s?[°º˚⁰]\s?\d{1,2}\s?['′]\s?\.?\d*\s?[NS])\s*\.?(\d{1,3}\s?[°º˚⁰]\s?\d{1,2}\s?['′]\s?\.?\d*\s?[EW])"
rec = re.compile(r'(?:^|\s)(' + AREA + r')\s+(.*?)\s+(' + POS + r'|-)\s+(\d+|-)\s+([A-Z])\s+((?:\d{4}\s?,\s?)+\d{4})\s+(.*?)\s+(Operational|Planned|Temporarily suspended|Not operational|Under [Tt]rial|Under test|Suspended|Test)\b', re.I)
res = []
for a, b, freq in sections:
    text = ' '.join(l.strip() for l in lines[a:b] if l.strip() and not skip.match(l.strip()))
    text = re.sub(r'\s+', ' ', text)
    text = re.sub(r'(?:^|\s)' + AREA + r'(?: -){6,}(?= )', ' ', text)
    text = re.sub(r'X - - - - - - - - Australia is only providing.*?See annex 8\.', ' ', text)
    for m in rec.finditer(text):
        area, cs, pos, lat, lon, rng, b1, times, lang, status = m.groups()
        cs = cs.strip()
        country, station = None, cs
        for c in clist:
            if cs.startswith(c + ' ') or cs == c:
                country, station = c, cs[len(c):].strip()
                break
        if country is None:
            country, station = cs.split(' ', 1)[0], cs.split(' ', 1)[1] if ' ' in cs else ''
        pm = re.match(r'^\((.+?)\)\s+(.*)$', station)
        if pm:
            country, station = f'{country} ({pm.group(1)})', pm.group(2)
        res.append({'freq': freq, 'area': area, 'country': country, 'station': station,
                    'lat': re.sub(r'\s', '', lat).replace('⁰','°').replace('′',"'") if lat else None, 'lon': re.sub(r'\s', '', lon).replace('⁰','°').replace('′',"'") if lon else None,
                    'range': None if rng == '-' else int(rng), 'b1': b1,
                    'times': [t.strip() for t in times.split(',')], 'language': lang.strip(), 'status': status.capitalize() if status.lower().startswith('under') else status})
# validation: count schedules per section in raw text
for a, b, freq in sections:
    raw = re.sub(r'\s+', ' ', ' '.join(lines[a:b]))
    n = len(re.findall(r'\b[A-Z]\s+(?:\d{4}\s?,\s?)+\d{4}\b', raw))
    print('section', freq, 'schedules in text', n, 'parsed', sum(1 for r in res if r['freq'] == freq))
json.dump(res, open(out, 'w'), ensure_ascii=False, indent=1)
from collections import Counter
print(len(res), Counter(r['freq'] for r in res), Counter(r['status'] for r in res))
