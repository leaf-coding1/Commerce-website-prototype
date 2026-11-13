# Five Kitchens: Food Delivery Website

A local (not public) food delivery site built with HTML, CSS and TypeScript. It has
Chinese, Indian, Nepalese, Vietnamese and Bangladeshi food, and each cuisine has three sections:

- **Dishes**: freshly cooked meals
- **Microwave meals**: chilled ready meals, each showing its heating time
- **Drinks & teas**: traditional teas and drinks from that culture

You can filter by cuisine and section, search the menu, build up a basket, and enter a
delivery address. Placing an order shows a confirmation; no real order or payment is made.

## Running it

```bash
npm install      # first time only: installs the TypeScript compiler
npm run build    # compiles src/*.ts into dist/*.js
```

Then open `index.html` in a browser (double-clicking it works).

While you're editing, `npm run watch` recompiles every time you save a `.ts` file.

## Files

| File | What it holds |
| --- | --- |
| `index.html` | Page structure: header, menu area, basket and address form |
| `styles.css` | All styling, including the colour for each cuisine and dark mode |
| `src/data.ts` | The menu: cuisines, sections and every item with its price and tags |
| `src/app.ts` | Behaviour: filtering, basket, form checks, order confirmation |
| `dist/` | Compiled JavaScript (generated, don't edit by hand) |

To add or change a dish, edit `src/data.ts` and run `npm run build` again.
