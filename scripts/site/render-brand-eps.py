# render-brand-eps.py — the logo as EPS, for printers who ask for one.
#
#   pip3 install fonttools brotli --break-system-packages
#   python3 scripts/site/render-brand-eps.py
#
# Conference exhibition boards, printers and sponsor packs ask for .eps and reject
# everything else as "pixelated". This writes real vector EPS from the same geometry
# site/assets/brand/riskmandate-mark.svg carries, with one difference that matters in
# print: the lettering is converted to outlines. An EPS that names a font is an EPS that
# looks different on somebody else's RIP, and we do not get to see the proof.
#
# Outputs (committed, because nothing on this site is built at deploy time):
#   riskmandate-mark.eps            the tile, RGB
#   riskmandate-mark-cmyk.eps       the tile, CMYK for a four-colour press
#   riskmandate-lockup-light.eps    mark and wordmark, dark ink, RGB
#   riskmandate-lockup-dark.eps     mark and wordmark, light ink, for a dark ground
#
# The letterforms come from Geist, which this site self-hosts under the SIL Open Font
# License (site/assets/fonts/OFL.txt). Outlines of an OFL face may be embedded and
# redistributed; the licence travels with the font files, which are in the repository.

import json, math, pathlib, datetime
from fontTools.ttLib import TTFont
from fontTools.varLib import instancer
from fontTools.pens.basePen import BasePen

ROOT  = pathlib.Path(__file__).resolve().parents[2]
BRAND = ROOT / 'site/assets/brand'
FONTS = ROOT / 'site/assets/fonts'
TODAY = '2026-09-23'

INK    = (0x16, 0x16, 0x15)   # the tile
GREEN  = (0x1A, 0x7F, 0x5A)   # the ring and the ticks
PAPER  = (0xF7, 0xF6, 0xF2)   # the RM, and the wordmark on a dark ground
TEXT   = (0x1A, 0x19, 0x17)   # the wordmark on a light ground
# the inner ring is rgba(247,246,242,.22) over the tile; EPS has no alpha, so it is
# flattened against the ink it sits on rather than dropped
FAINT  = tuple(round(0.22 * p + 0.78 * i) for p, i in zip(PAPER, INK))


def rgb(c):
    return ' '.join(f'{v / 255:.4f}' for v in c) + ' setrgbcolor'


def cmyk(c):
    r, g, b = (v / 255 for v in c)
    k = 1 - max(r, g, b)
    if k >= 1 - 1e-9:
        return '0 0 0 1 setcmykcolor'
    f = lambda x: (1 - x - k) / (1 - k)
    return ' '.join(f'{v:.4f}' for v in (f(r), f(g), f(b), k)) + ' setcmykcolor'


# ----------------------------------------------------------------- glyph outlines
class PSPen(BasePen):
    """Font units in, PostScript path in — with the quadratics TrueType stores turned
    into the cubics PostScript understands, exactly rather than by sampling."""

    def __init__(self, glyphSet, out, scale, dx, dy):
        super().__init__(glyphSet)
        self.out, self.s, self.dx, self.dy = out, scale, dx, dy

    def pt(self, p):
        # the page is set up in SVG's coordinate space (y down); glyph space is y up
        return f'{self.dx + p[0] * self.s:.3f} {self.dy - p[1] * self.s:.3f}'

    def _moveTo(self, p):  self.out.append(f'{self.pt(p)} moveto')
    def _lineTo(self, p):  self.out.append(f'{self.pt(p)} lineto')
    def _curveToOne(self, p1, p2, p3):
        self.out.append(f'{self.pt(p1)} {self.pt(p2)} {self.pt(p3)} curveto')
    def _closePath(self): self.out.append('closepath')


def face(path, weight):
    f = TTFont(path)
    return instancer.instantiateVariableFont(f, {'wght': weight}, inplace=False, updateFontNames=False)


def text_path(font, s, size, x, y, tracking=0.0, centre_on=None):
    """Lay a short string out by its own advance widths and return the PostScript for it.
    Matches what the SVG asks for: a size, a letter-spacing, and either a left edge or a
    centre to sit on."""
    upem  = font['head'].unitsPerEm
    scale = size / upem
    hmtx, cmap, glyphs = font['hmtx'], font.getBestCmap(), font.getGlyphSet()
    names = [cmap[ord(ch)] for ch in s]
    width = sum(hmtx[n][0] * scale for n in names) + tracking * (len(names) - 1)
    pen_x = (centre_on - width / 2) if centre_on is not None else x
    out = ['newpath']
    for n in names:
        glyphs[n].draw(PSPen(glyphs, out, scale, pen_x, y))
        pen_x += hmtx[n][0] * scale + tracking
    out.append('fill')
    return out, width


# ----------------------------------------------------------------- the drawing
def rounded_rect(x, y, w, h, r):
    x1, y1 = x + w, y + h
    return ['newpath', f'{x + r} {y} moveto',
            f'{x1} {y} {x1} {y1} {r} arcto pop pop pop pop',
            f'{x1} {y1} {x} {y1} {r} arcto pop pop pop pop',
            f'{x} {y1} {x} {y} {r} arcto pop pop pop pop',
            f'{x} {y} {x1} {y} {r} arcto pop pop pop pop',
            'closepath', 'fill']


def mark(colour, mono):
    """The 64×64 tile, in SVG coordinates."""
    o  = [f'% the tile', colour(INK)] + rounded_rect(0, 0, 64, 64, 17)
    o += ['% the ring', colour(GREEN), '2.6 setlinewidth',
          'newpath 32 32 19 0 360 arc stroke']
    o += ['% the faint inner ring, flattened against the tile', colour(FAINT),
          '1 setlinewidth', 'newpath 32 32 13.5 0 360 arc stroke']
    o += ['% the four ticks', colour(GREEN), '2 setlinewidth', '0 setlinecap']
    for x1, y1, x2, y2 in [(32, 9, 32, 14), (32, 50, 32, 55), (9, 32, 14, 32), (50, 32, 55, 32)]:
        o.append(f'newpath {x1} {y1} moveto {x2} {y2} lineto stroke')
    o += ['% RM, as outlines', colour(PAPER)]
    o += text_path(mono, 'RM', 13, 0, 37, tracking=-0.5, centre_on=32)[0]
    return o


def eps(title, w, h, body, scale):
    """One EPS file: the header a RIP reads, then the drawing in SVG coordinates."""
    return '\n'.join([
        '%!PS-Adobe-3.0 EPSF-3.0',
        f'%%BoundingBox: 0 0 {math.ceil(w * scale)} {math.ceil(h * scale)}',
        f'%%HiResBoundingBox: 0 0 {w * scale:.4f} {h * scale:.4f}',
        f'%%Title: {title}',
        '%%Creator: riskmandate.ai — scripts/site/render-brand-eps.py',
        f'%%CreationDate: {TODAY}',
        '%%LanguageLevel: 2',
        '%%DocumentData: Clean7Bit',
        '%%Pages: 1',
        '%%EndComments',
        '% Vector throughout, and the lettering is outlines rather than a font reference,',
        '% so nothing here depends on what is installed where it is printed.',
        '%%BeginProlog',
        '%%EndProlog',
        '%%Page: 1 1',
        'gsave',
        f'{scale:.6f} {scale:.6f} scale',
        f'0 {h} translate 1 -1 scale   % draw in the same coordinates as the SVG',
        '1 setlinejoin 1 setlinecap',
        *body,
        'grestore',
        'showpage',
        '%%EOF',
        '',
    ])


def main():
    mono = face(FONTS / 'geist-mono-latin.woff2', 700)
    sans = face(FONTS / 'geist-latin.woff2', 700)
    written = {}

    # the tile, at 300pt square — a size a press can scale from without arithmetic
    for name, colour in [('riskmandate-mark.eps', rgb), ('riskmandate-mark-cmyk.eps', cmyk)]:
        written[name] = eps('RiskMandate — the mark', 64, 64, mark(colour, mono), 300 / 64)

    # the lockup: the tile, then the wordmark set in Geist at 700
    word, width = text_path(sans, 'RiskMandate', 27, 80, 41, tracking=-1.1)
    box_w = 80 + width + 6
    for name, ink in [('riskmandate-lockup-light.eps', TEXT), ('riskmandate-lockup-dark.eps', PAPER)]:
        body = mark(rgb, mono) + ['% the wordmark, as outlines', rgb(ink)] + word
        written[name] = eps('RiskMandate — the lockup', box_w, 64, body, 300 / 64)

    for name, text in written.items():
        (BRAND / name).write_text(text)
        print(f'  {name:32} {len(text) / 1024:5.1f}KB')
    print(f'wordmark width {width:.2f} units at 27pt · lockup box {box_w:.2f}×64')


if __name__ == '__main__':
    main()
