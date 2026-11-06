# Maison De La Fork · Shop page (holiday redesign)

A single static page with no build step and no dependencies. Everything it needs is in this folder; the only thing loaded from outside is the KoHo font from Google Fonts.

```
index.html          the shop page (markup, styles and scripts)
product.html        a sample product page (Abrisham Collection); every product card opens it for now
assets/img/         product photos, Cupid crest, garland, logos, favicon
assets/fonts/       Dahlia (display type)
.nojekyll           tells GitHub Pages to serve the files as they are
```

## Preview on your computer

Open a terminal in this folder and run:

```
python3 -m http.server 8000
```

Then visit http://localhost:8000. Double-clicking `index.html` also works, but some browsers block local fonts from `file://`, so the local server is closer to the real thing.

## Deploy with GitHub Pages

1. Create a repository and upload the **contents** of this folder to its root, so `index.html` sits at the top level. Include the hidden `.nojekyll` file (on a Mac, press Cmd + Shift + . in Finder to see it).
2. In the repository, go to **Settings → Pages**.
3. Under **Build and deployment**, choose **Deploy from a branch**, select `main` and `/ (root)`, and save.
4. After a minute the site is live at `https://<your-username>.github.io/<repository-name>/`.

All paths are relative, so the page works at a subpath as well as on a custom domain.

## Placeholders to confirm

- Holiday items: Lattice Pie $85, Pigeon Pie $95, Holiday Cookies from $120, Madeleine Tower $198 are placeholder prices. Pastel Toot Tower keeps the live $228.
- Order-by dates beside the Holiday collection: Thanksgiving Nov 20, Christmas Dec 18. Placeholders.
- The five Holiday images are AI-assisted studio renders on #ECDFD8, made from real product photos. `hol-pastel.jpg` is a portrait version for the tall feature card.
- Product tiles sit on a 3 px light grid (2 px on mobile). Hovering a photo dissolves it into a close-up of the same piece. The close-ups are crops of the main photos, saved as `*-d.jpg` next to them; when a photo is replaced, replace its `-d` close-up too (or re-crop it). On phones every tile shows the whole piece (no close-ups); in the intro's collection grid the small tiles fit the whole object into the tile.
- The add button is a blind emboss pressed into the card with a plus at its centre (`emboss-plus.png`). Pointing at a card deepens it and "Add" slides out in gold. Adding drops an ochre wax seal exactly onto it (the emboss stays under the seal while it lands) (`seal-blank.png`) with the count pressed into the wax; the seal stays flush right where the emboss was, with a small plus and minus stacked beside it; each change presses the seal again, and back at zero the emboss returns. The photo shows an "In bag" tag and the header bag carries an ochre badge with the total. Both pieces are cut from AI-assisted photographs of a real blind emboss and a real ochre wax seal, so the paper grain, the bevel of the ring and the soft shadow under the wax are photographic. None of this is connected to a store yet.
- Persian Sweets use the real product photographs from maisondelafork.com (`*-r.jpg`, the site's 300 px photos enlarged to 600 px with a light sharpen; hover close-ups `*-r-d.jpg`). For sharper results, replace them with the original full-size photographs. Assortments (Special Gift Box, Abrisham, Diba), Rumi Blend and the Gift Card are AI-assisted overhead studio renders (`*-s.jpg`), made from real product photos, with the backdrop matched to #ECDFD8.
- The story section near the foot of the page opens with the Maison monogram as a blind emboss (`monogram-emboss.png`): only the light and shadow of the relief, cut from an AI-assisted photograph of a real emboss, so it sits directly on the page colour (#F5E9E5).
- Compose Your Own sits on a brand-blue band (#B8C9E1). Its photo (`compose-box.jpg`, an AI-assisted render of the gift box beside a red Christmas bauble) has its backdrop flattened to exactly the same blue, keeping only the shadows, which ease out before the frame, so the image has no visible edge. If you replace it, keep the background exactly #B8C9E1.
- On phones the announcement bar is hidden and the header itself is brand blue, with the one-line logo (`logo-line-navy.svg`, the footer logo in navy) set flush left. The shipping note still appears in the service row near the foot of the page.
- The shop opens with the Holiday intro, in three resting places. 1) The paper: the visitor's own scrolling lifts the blue paper; near the end the page takes over and eases it away. 2) The introduction: the Toot Tower stays in place, a green Christmas bauble rolls in from the right and comes to rest against its bowl (`hol-ornament.png`, with its shadow `hol-ornament-shadow.jpg` multiplied onto the backdrop; cut from an AI-assisted photo registered to the tower photo, so it sits exactly where it was shot), a short text and the order dates surface beside it, a warm light and a little gold dust appear, and the gold garlands drop into the corners. 3) One more scroll glides on to the collection with names and prices. Scrolling up returns step by step. A small animated scroll cue sits under the title. The tower never moves or changes size. With reduced motion the collection is shown still.
- The intro's paper comes from a photograph with a green-screen window: `paper-tile.jpg` (seamless texture, set to the brand blue), `paper-window.png` (the real cut edge, fibres and all, keyed out of the green) and `paper-shadow.png` (the real shadow the paper casts inside the window, multiplied over the tower). `hol-pomegranate-mul.jpg` is the tower photo with its backdrop flattened to white, so no light shows in the window until the reveal.
- On the intro paper the crest becomes the window's frame: `frame-print2.png` (the printed ribbon and gold oval, stretched to the window's proportions), then, under the oval, `maison-line.png` (Maison De La Fork), the letterpressed title (`title-main.png` on one line; `title-main-2.png` on two lines for phones) and `cupid-print.png` (the cupid, out of its medallion) beneath the title. All are cut from AI-assisted photographs of real printing. The site has a single header row (the utility bar is gone; FAQ, contact and shipping live in the footer and service row). On the shop page it sits transparent on the paper; the gold corner sprigs are no longer used on the shop page.
- Desktop and laptop screens: the whole intro crest (ribbon to scroll cue) always fits the screen, with an even margin (10% of the screen height, 48 to 100 px) below the header and above the bottom edge. On short screens the crest and tower shrink to fit; the tower keeps its place across the three stages.

- The Holiday collection continues straight under the intro's collection grid, on the same columns and gaps, with no heading of its own: three main courses and two side dishes around the Special Gift Box, which takes the large tile (two columns by two rows; full width on phones). The Special Gift Box is the same product as under Assortments, so it shares one quantity in the bag. The mains and sides are PLACEHOLDERS (`Main Course I–III`, `Side Dish I–II`, "Price to come", no add button) on a plain tile with the blind-embossed monogram (`hol-soon.jpg`) until the names, prices and photos arrive; edit `HOLIDAY_MORE` in `build.py`.
- On phones the Holiday photos are shown closer in; each photo can name the part to keep in view (`fp` in `build.py`, e.g. the top of the Madeleine Tower).

- Choices before adding: Lattice Pie (Pumpkin, Berries, Apple, from the Holiday site's description), Pigeon Pie (Chicken, Turkey) and Noon Berenji (Botanical, Yamatsu Red Roses, Portuguese Vintage Tile) carry a small picker in place of the card's note: the chosen option, underlined in ochre, opens a menu headed Flavour or Pattern. The first option is chosen to begin with, so Add always works in one tap. Each option is its own line in the bag (e.g. "Lattice Pie · Apple"), and the seal shows the count for the option on show. The picker opens upward near the bottom of the screen, keeps inside the screen edges, and works with the keyboard (arrows, Enter, Escape). Options live in `opts` in `build.py`. The Noon Berenji card is now one product with three patterns (it was "Noon Berenji, Botanical").

- Cards, everywhere: the name (caps, semi-bold), then the price (larger, medium weight, figures aligned), then the note or the choice (light). In every row of cards the prices sit on one line at the bottom, whatever the length of the names. On touch screens the picker and the add button have a 44 px touch area, and the picker's menu has taller rows.
- Phones: the intro's collection stage keeps the title and the Toot Tower (the tower grows into its large tile); the Lattice Pie, Pigeon Pie, Holiday Cookies and Madeleine Tower lead the grid that follows, at a comfortable size, then the Special Gift Box, then the mains and sides.

## Product page (sample)

- `product.html` is one designed product page, built from the Abrisham Collection. Every product card in the shop links to it for now; when the real store is connected, each card should open its own product.
- It shares the shop's styles, header, footer and service row, cut straight from `index.html` at build time, so the two pages always match.
- All product text is taken as-is from maisondelafork.com/shop/large-mix-box/: name, price, description, the five cookies (shown as small round photos beside the description), size, allergens, pickup and shipping, and the related products. Nothing has been added. The seasonal corner pieces appear on the shop page only.
- Related products follow the live page, except Toot Tower, which is swapped for the Diba Collection so every card has a studio photo.
- The cart is shared between the two pages and remembered in this browser only (localStorage). It is a design stand-in for the real cart.

## Notes before launch

- This is a design build. The Add to Bag, Search, Sort and newsletter controls are not connected to the store yet; the menu, footer and "Begin" links point to the live maisondelafork.com pages.
- Every product photo is a studio render at 1200 × 900 px, with a hover close-up saved as `*-d.jpg` beside it. The older 300 px photos (`*-g.jpg`) are no longer used on the page.
- Make sure the Dahlia licence covers web use.
- Phones: the intro's crest fills the width (the ribbon's ends sit about 10 px from the screen edges). The ribbon is drawn smaller on phones (`frame-print-m.png`: the bow and swags scaled to 80% about the knot, the gold oval and its garland untouched), so the oval and tower can be larger and the title is set on two lines (`title-2line.png`, recomposed from the same letterpress photograph). To make room, the collection grid is pushed down until the tower's tile sits where the oval belongs, so the tower still never moves between the three stages.
