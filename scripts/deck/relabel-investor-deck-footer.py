# relabel-investor-deck-footer.py — the investor deck's footer, Confidential to CC BY 4.0.
#
#   python3 scripts/deck/relabel-investor-deck-footer.py <deck-as-presented.pdf> <out.pdf>
#
# The deck is a Chromium print in which every glyph is an outlined path, so there is no font to
# set text in. Slide 15 carries "under CC BY 4.0." at the footer's size, so the new footer is
# built from the deck's own glyphs: the eleven paths of "Confidential" are dropped, the seven of
# "CC BY 4.0" are copied in at the same baseline, and the dot and page number that follow are
# shifted left to close the gap. The five slides whose footer names its sources carry no
# "Confidential" and are left alone. Nothing else on any slide is touched. Written 2 October 2026
# for v1.35.13, at the lead's ask; the counts it asserts are the v3 deck's and will need
# revisiting for a v4.
import sys
from pypdf import PdfReader, PdfWriter
from pypdf.generic import DecodedStreamObject, NameObject
SRC, OUT = sys.argv[1], sys.argv[2]
r=PdfReader(SRC)
def fills(toks):
    pts=[]; out=[]; start=None
    for i,t in enumerate(toks):
        if t=='m' and start is None: start=i-2
        if t in ('m','l'): pts.append((float(toks[i-2]),float(toks[i-1])))
        elif t=='c':
            for k in (6,4,2): pts.append((float(toks[i-k]),float(toks[i-k+1])))
        elif t in ('f','f*'):
            if pts:
                xs=[p[0] for p in pts]; ys=[p[1] for p in pts]
                out.append(dict(x0=min(xs),y0=min(ys),x1=max(xs),y1=max(ys),s=start,e=i))
            pts=[]; start=None
        elif t in ('n','S','W','W*','re'): pts=[]; start=None
    return out
# source glyphs: the last line of slide 15's first card, "under CC BY 4.0."
t15=r.pages[14].get_contents().get_data().decode('latin1').split()
line=[g for g in fills(t15) if 354<g['y0']<356 and 120<g['x0']<270]
line.sort(key=lambda g:g['x0'])
assert len(line)==13, len(line)
src=line[5:12]   # C C B Y 4 . 0
assert abs((src[0]['x1']-src[0]['x0'])-11.1)<0.3 and abs((src[6]['x0'])-248.4)<0.3
src_C_x0=src[0]['x0']; src_C_y0=src[0]['y0']; src_end=src[6]['x1']
w=PdfWriter(clone_from=r)
changed=[]
for pi in range(len(r.pages)):
    toks=r.pages[pi].get_contents().get_data().decode('latin1').split()
    foot=[g for g in fills(toks) if 50<g['y0']<70 and g['y1']<72 and 90<g['x0']<800]
    foot.sort(key=lambda g:g['x0'])
    if len(foot)!=26: continue   # the five slides whose footer names its sources
    C=foot[12]; l=foot[22]
    assert abs((C['x1']-C['x0'])-11.1)<0.3 and abs((C['y1']-C['y0'])-13.3)<0.3, (pi, C)
    assert abs((l['x1']-l['x0'])-2.9)<0.3, (pi, l)
    tx=C['x0']-src_C_x0; ty=C['y0']-src_C_y0
    new_end=src_end+tx; dx=l['x1']-new_end
    # rebuild: tokens up to the start of glyph 12, the new glyphs, the trailing glyphs shifted, the rest
    head=toks[:foot[12]['s']]
    new=[]
    for g in src:
        new+=['q','1','0','0','1',f'{tx:.4f}',f'{ty:.4f}','cm']+t15[g['s']:g['e']+1]+['Q']
    tail_s=foot[23]['s']; tail_e=foot[-1]['e']
    trailing=['q','1','0','0','1',f'{-dx:.4f}','0','cm']+toks[tail_s:tail_e+1]+['Q']
    rest=toks[tail_e+1:]
    data=' '.join(head+new+trailing+rest).encode('latin1')
    so=DecodedStreamObject(); so.set_data(data)
    w.pages[pi][NameObject('/Contents')]=w._add_object(so.flate_encode())
    changed.append(pi+1)
w.compress_identical_objects(remove_identicals=True, remove_orphans=True)
for p in w.pages: p.compress_content_streams(level=9)
w.write(OUT)
print('changed slides', changed)
