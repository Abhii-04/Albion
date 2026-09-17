# Albion Online Profit Scanner

Private-browser profit scanner for Albion Online Asia. It compares royal-city sell orders with Caerleon Black Market buy orders, supports selectable T4–T8 tiers and all qualities, and ranks the top 50 affordable opportunities by profit per item, ROI, Black Market price, or purchase price. You can also mark in-game-verified results and generate an exact buy list with quantities and budget totals.

## Setup

No dependency installation is required. You only need Python 3 or another static-file server.

```bash
python3 --version
```

## Start

Run this command inside the extracted folder:

```bash
python3 -m http.server 4173
```

Then open:

```text
http://localhost:4173
```

For a static deployment that uses `.openai/hosting.json`, prepare the `dist` folder first:

```bash
mkdir -p dist
cp index.html styles.css app.js dist/
```

## Data source

The browser fetches Asia-server prices directly from the Albion Online Data Project. A working internet connection is required. Price timestamps depend on community client uploads.

## Main files

- `index.html` — interface and page structure
- `styles.css` — responsive styling
- `app.js` — item catalog, live API fetching, filtering, selectable ranking, profit calculations, and verified buy-list logic
- `.openai/hosting.json` — ChatGPT Sites hosting configuration
