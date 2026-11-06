# Maison de La Fork — product detail pages (2026-11-06)

## What changed

- Reused the **existing Abrisham Collection** product-detail visual design.
- Created **25 individual HTML product pages**, each with a distinct filename, title, gallery, copy, facts, and related-product links.
- Updated **28 shop product cards** across desktop and mobile/holiday duplicate grids. All product image and product name links resolve to the corresponding page.
- Updated Small/Large Box links in the Compose section to their own pages.
- Kept `product.html` as an Abrisham Collection compatibility URL.
- Preserved colors, typography, shared bag count, image assets, mobile layout, and base CSS/JS structure.
- Added option selection on the detailed Lattice Pie, Pigeon Pie, Noon Berenji pages.

## Copy provenance

The `product_content_manifest.json` file records whether copy came from the client's supplied text, the public official site (paraphrased), or an editorial preview.

**Official listing details:** https://maisondelafork.com/shop/ and its item pages. Prices on most static pages follow the *provided redesign*, which is not necessarily the same as the live store today.

**Requires approval:** Five Holiday products in the redesign are not present as confirmed current listings; they use brief, clearly marked draft/preview copy. Main Course I–III and Side Dish I–II remain explicitly **Coming soon**. Special Gift Box's exact contents and Calisson packaging can be confirmed before go-live. Holiday prices, variants, stock, ingredients, nutrition, allergens and delivery require product-owner approval before publishing. The original site includes placeholder prices.

**Live back-end not connected:** This is a static front-end, **not a functioning online checkout**. The cart uses browser localStorage, as it did in the original. Gift Card and Custom Boxes link to the original website for personalization and payment. Seasonal previews point to Maison contact rather than collecting unverifiable orders. Do not launch as a commercial e-commerce site without WooCommerce/cart/payments integration.

## Preview

In the extracted folder run `python -m http.server 8000`, then open http://localhost:8000/index.html.

Key example pages:
- `product-pansy-cookie.html`
- `product-noon-berenji.html`
- `product-walnut.html`
- `product-gift-card.html`
- `product-lattice-pie.html`

## Notes

- Product photo galleries reuse the photos **already present in the supplied project**; no third-party product images are hotlinked. Different angles only appear when actual local alternatives exist, and crops are used otherwise.
- Primary palette, type, gallery behavior, mobile sticky add-to-cart, and responsive shell follow the Abrisham sample.
- Client copy was lightly punctuated for readability; user-provided product descriptions are primary where available.
