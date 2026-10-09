# Assemble a flat, private page from pricing.html's chrome: head (title, description, canonical, noindex),
# header, the given body, footer, the shared scripts, and optional extra CSS, head and script.
#   python3 scripts/review/flat-page.py scripts/review/home-diff/page.json      (from the repository root)
# The page's own code lives in site/assets/review/ and is linked, so the body is the only thing this builds in.
import re, sys, json
def build(name, title, desc, body, css='', script='', headx=''):
    donor=open('site/pricing.html',encoding='utf8').read()
    esc=lambda t:t.replace('&','&amp;').replace('"','&quot;')
    head=donor[:donor.index('<body')]
    head=re.sub(r'<title>.*?</title>',f'<title>{esc(title)}</title>',head,count=1,flags=re.S)
    for prop in ('name="description"','property="og:description"'):
        head=re.sub(r'(<meta '+prop+r' content=")[^"]*(")',lambda m:m.group(1)+esc(desc)+m.group(2),head,count=1)
    head=re.sub(r'(<meta property="og:title" content=")[^"]*(")',lambda m:m.group(1)+esc(title)+m.group(2),head,count=1)
    head=head.replace('https://riskmandate.ai/pricing.html',f'https://riskmandate.ai/{name}.html')
    head=re.sub(r'<link rel="alternate" type="text/markdown" href="pricing.md"[^>]*>\n?','<meta name="robots" content="noindex,nofollow">\n',head,count=1)
    head=head.replace('</style>',css+'</style>',1)
    head=head.replace('</head>',headx+'</head>',1) if '</head>' in head else head+headx
    assert 'pricing.md' not in head and 'pricing.html' not in head, 'donor address left'
    b0=donor.index('<body'); sAt=donor.index('<script>',b0)
    db=donor[b0:sAt]
    hdr=re.search(r'<header class="top">.*?</header>',db,re.S).group(0)
    foot=re.search(r'<footer class="foot">.*?</footer>',db,re.S).group(0)
    tail=donor[sAt:].replace('RM.data.currentPage="pricing"',f'RM.data.currentPage="{name}"',1)
    assert f'RM.data.currentPage="{name}"' in tail
    if script: tail=tail.replace('</body>',script+'\n</body>',1)
    open(f'site/{name}.html','w',encoding='utf8').write(head+'<body id="top">\n\n'+hdr+'\n\n'+body+'\n\n'+foot+'\n\n'+tail)
if __name__=='__main__':
    cfg=json.load(open(sys.argv[1],encoding='utf8'))
    script=open(cfg['script'],encoding='utf8').read() if cfg.get('script') else ''
    script+=''.join(f'<script src="{s}"></script>\n' for s in cfg.get('scripts',[]))
    headx=''.join(f'<link rel="stylesheet" href="{s}">\n' for s in cfg.get('styles',[]))
    build(cfg['name'],cfg['title'],cfg['desc'],open(cfg['body'],encoding='utf8').read(),cfg.get('css',''),script,headx)
    print('built',cfg['name'])
