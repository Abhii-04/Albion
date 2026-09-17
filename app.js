const STORAGE_KEY = "caerleon-profit-desk-v1";
const cities = ["Fort Sterling", "Martlock", "Lymhurst", "Bridgewatch", "Thetford", "Brecilien"];
const API_BASE = "https://east.albion-online-data.com/api/v2/stats";
const QUALITY_NAMES = { 1: "Normal", 2: "Good", 3: "Outstanding", 4: "Excellent", 5: "Masterpiece" };
const LIVE_SORTS = {
  profit: {
    heroLabel: "Best profit per item",
    description: "highest profit per item",
    compare: (a, b) => b.profitPerItem - a.profitPerItem || b.netProfit - a.netProfit || b.roi - a.roi
  },
  roi: {
    heroLabel: "Best return on investment",
    description: "highest ROI",
    compare: (a, b) => b.roi - a.roi || b.profitPerItem - a.profitPerItem || b.netProfit - a.netProfit
  },
  bmPrice: {
    heroLabel: "Highest Black Market price",
    description: "highest Black Market price",
    compare: (a, b) => b.bmPrice - a.bmPrice || b.profitPerItem - a.profitPerItem || b.roi - a.roi
  },
  buyPrice: {
    heroLabel: "Lowest purchase price",
    description: "lowest origin buy price",
    compare: (a, b) => a.buyPrice - b.buyPrice || b.profitPerItem - a.profitPerItem || b.roi - a.roi
  }
};
const BASE_ITEMS = [
  { id: "HEAD_PLATE_SET1", name: "Soldier Helmet", category: "Armor" },
  { id: "HEAD_PLATE_SET2", name: "Knight Helmet", category: "Armor" },
  { id: "HEAD_PLATE_SET3", name: "Guardian Helmet", category: "Armor" },
  { id: "ARMOR_PLATE_SET1", name: "Soldier Armor", category: "Armor" },
  { id: "ARMOR_PLATE_SET2", name: "Knight Armor", category: "Armor" },
  { id: "ARMOR_PLATE_SET3", name: "Guardian Armor", category: "Armor" },
  { id: "SHOES_PLATE_SET1", name: "Soldier Boots", category: "Armor" },
  { id: "SHOES_PLATE_SET2", name: "Knight Boots", category: "Armor" },
  { id: "SHOES_PLATE_SET3", name: "Guardian Boots", category: "Armor" },
  { id: "HEAD_LEATHER_SET1", name: "Mercenary Hood", category: "Armor" },
  { id: "HEAD_LEATHER_SET2", name: "Hunter Hood", category: "Armor" },
  { id: "HEAD_LEATHER_SET3", name: "Assassin Hood", category: "Armor" },
  { id: "ARMOR_LEATHER_SET1", name: "Mercenary Jacket", category: "Armor" },
  { id: "ARMOR_LEATHER_SET2", name: "Hunter Jacket", category: "Armor" },
  { id: "ARMOR_LEATHER_SET3", name: "Assassin Jacket", category: "Armor" },
  { id: "SHOES_LEATHER_SET1", name: "Mercenary Shoes", category: "Armor" },
  { id: "SHOES_LEATHER_SET2", name: "Hunter Shoes", category: "Armor" },
  { id: "SHOES_LEATHER_SET3", name: "Assassin Shoes", category: "Armor" },
  { id: "HEAD_CLOTH_SET1", name: "Scholar Cowl", category: "Armor" },
  { id: "HEAD_CLOTH_SET2", name: "Cleric Cowl", category: "Armor" },
  { id: "HEAD_CLOTH_SET3", name: "Mage Cowl", category: "Armor" },
  { id: "ARMOR_CLOTH_SET1", name: "Scholar Robe", category: "Armor" },
  { id: "ARMOR_CLOTH_SET2", name: "Cleric Robe", category: "Armor" },
  { id: "ARMOR_CLOTH_SET3", name: "Mage Robe", category: "Armor" },
  { id: "SHOES_CLOTH_SET1", name: "Scholar Sandals", category: "Armor" },
  { id: "SHOES_CLOTH_SET2", name: "Cleric Sandals", category: "Armor" },
  { id: "SHOES_CLOTH_SET3", name: "Mage Sandals", category: "Armor" },
  { id: "MAIN_SWORD", name: "Broadsword", category: "Weapon" },
  { id: "2H_CLAYMORE", name: "Claymore", category: "Weapon" },
  { id: "2H_DUALSWORD", name: "Dual Swords", category: "Weapon" },
  { id: "MAIN_AXE", name: "Battleaxe", category: "Weapon" },
  { id: "2H_AXE", name: "Greataxe", category: "Weapon" },
  { id: "2H_HALBERD", name: "Halberd", category: "Weapon" },
  { id: "MAIN_MACE", name: "Mace", category: "Weapon" },
  { id: "2H_MACE", name: "Heavy Mace", category: "Weapon" },
  { id: "2H_FLAIL", name: "Morning Star", category: "Weapon" },
  { id: "MAIN_HAMMER", name: "Hammer", category: "Weapon" },
  { id: "2H_POLEHAMMER", name: "Polehammer", category: "Weapon" },
  { id: "2H_HAMMER", name: "Great Hammer", category: "Weapon" },
  { id: "2H_CROSSBOW", name: "Crossbow", category: "Weapon" },
  { id: "MAIN_1HCROSSBOW", name: "Light Crossbow", category: "Weapon" },
  { id: "2H_REPEATINGCROSSBOW", name: "Heavy Crossbow", category: "Weapon" },
  { id: "2H_BOW", name: "Bow", category: "Weapon" },
  { id: "2H_WARBOW", name: "Warbow", category: "Weapon" },
  { id: "2H_LONGBOW", name: "Longbow", category: "Weapon" },
  { id: "MAIN_SPEAR", name: "Spear", category: "Weapon" },
  { id: "2H_SPEAR", name: "Pike", category: "Weapon" },
  { id: "2H_GLAIVE", name: "Glaive", category: "Weapon" },
  { id: "MAIN_NATURESTAFF", name: "Nature Staff", category: "Weapon" },
  { id: "2H_NATURESTAFF", name: "Great Nature Staff", category: "Weapon" },
  { id: "2H_WILDSTAFF", name: "Wild Staff", category: "Weapon" },
  { id: "MAIN_DAGGER", name: "Dagger", category: "Weapon" },
  { id: "2H_DAGGERPAIR", name: "Dagger Pair", category: "Weapon" },
  { id: "2H_CLAWPAIR", name: "Claws", category: "Weapon" },
  { id: "2H_QUARTERSTAFF", name: "Quarterstaff", category: "Weapon" },
  { id: "2H_IRONCLADEDSTAFF", name: "Iron-clad Staff", category: "Weapon" },
  { id: "2H_DOUBLEBLADEDSTAFF", name: "Double Bladed Staff", category: "Weapon" },
  { id: "MAIN_FIRESTAFF", name: "Fire Staff", category: "Weapon" },
  { id: "2H_FIRESTAFF", name: "Great Fire Staff", category: "Weapon" },
  { id: "2H_INFERNOSTAFF", name: "Infernal Staff", category: "Weapon" },
  { id: "MAIN_HOLYSTAFF", name: "Holy Staff", category: "Weapon" },
  { id: "2H_HOLYSTAFF", name: "Great Holy Staff", category: "Weapon" },
  { id: "2H_DIVINESTAFF", name: "Divine Staff", category: "Weapon" },
  { id: "MAIN_ARCANESTAFF", name: "Arcane Staff", category: "Weapon" },
  { id: "2H_ARCANESTAFF", name: "Great Arcane Staff", category: "Weapon" },
  { id: "2H_ENIGMATICSTAFF", name: "Enigmatic Staff", category: "Weapon" },
  { id: "MAIN_FROSTSTAFF", name: "Frost Staff", category: "Weapon" },
  { id: "2H_FROSTSTAFF", name: "Great Frost Staff", category: "Weapon" },
  { id: "2H_GLACIALSTAFF", name: "Glacial Staff", category: "Weapon" },
  { id: "MAIN_CURSEDSTAFF", name: "Cursed Staff", category: "Weapon" },
  { id: "2H_CURSEDSTAFF", name: "Great Cursed Staff", category: "Weapon" },
  { id: "2H_DEMONICSTAFF", name: "Demonic Staff", category: "Weapon" },
  { id: "OFF_SHIELD", name: "Shield", category: "Off-hand" },
  { id: "OFF_TORCH", name: "Torch", category: "Off-hand" },
  { id: "OFF_BOOK", name: "Tome of Spells", category: "Off-hand" },
  { id: "BAG", name: "Bag", category: "Bag & Cape" },
  { id: "CAPE", name: "Cape", category: "Bag & Cape" }
];

const starterState = {
  availableSilver: 500000,
  saleTax: 6.5,
  riskReserve: 2,
  destinationCity: "Caerleon Black Market",
  liveSettings: {
    tier4: true, tier5: true, tier6: false, tier7: false, tier8: false, enchant: "all", category: "all",
    maxUnits: 10, transport: 750, freshness: "24", sort: "profit",
    cities: ["Fort Sterling", "Martlock", "Lymhurst", "Bridgewatch", "Thetford", "Caerleon"]
  },
  opportunities: [
    {
      id: crypto.randomUUID(), item: "Expert's Cape", tier: "T5.0", qty: 8,
      origin: "Fort Sterling", travelMinutes: 13, craftingFee: 850,
      finishedBuyPrice: 26500, bmSellPrice: 34000, transportPerItem: 550,
      materials: [{ name: "Cloth", price: 1200, amount: 16 }, { name: "Cape component", price: 4100, amount: 1 }]
    },
    {
      id: crypto.randomUUID(), item: "Expert's Bag", tier: "T5.1", qty: 6,
      origin: "Fort Sterling", travelMinutes: 13, craftingFee: 1100,
      finishedBuyPrice: 43000, bmSellPrice: 55500, transportPerItem: 650,
      materials: [{ name: "Cloth", price: 1550, amount: 8 }, { name: "Leather", price: 1700, amount: 8 }]
    },
    {
      id: crypto.randomUUID(), item: "Expert's Royal Sandals", tier: "T5.2", qty: 4,
      origin: "Lymhurst", travelMinutes: 16, craftingFee: 1650,
      finishedBuyPrice: 82000, bmSellPrice: 108000, transportPerItem: 900,
      materials: [{ name: "Leather", price: 2500, amount: 8 }, { name: "Royal Sigil", price: 18500, amount: 1 }]
    }
  ]
};

let state = loadState();
let allLiveResults = [];
let liveResults = [];
const selectedLiveItems = new Map();
let liveAbortController = null;

const $ = (selector, root = document) => root.querySelector(selector);
const opportunityList = $("#opportunityList");
const resultsBody = $("#resultsBody");
const emptyState = $("#emptyState");

function cloneStarterState() {
  return {
    ...structuredClone(starterState),
    opportunities: starterState.opportunities.map(o => ({ ...structuredClone(o), id: crypto.randomUUID() }))
  };
}

function loadState() {
  try {
    const saved = JSON.parse(localStorage.getItem(STORAGE_KEY));
    if (saved && Array.isArray(saved.opportunities)) {
      return { ...cloneStarterState(), ...saved, liveSettings: { ...starterState.liveSettings, ...(saved.liveSettings || {}) } };
    }
  } catch (_) {}
  return cloneStarterState();
}

function saveState() {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
  const label = $("#savedLabel");
  label.textContent = "Saved just now";
  window.clearTimeout(saveState.timer);
  saveState.timer = window.setTimeout(() => { label.textContent = "Saved locally"; }, 1600);
}

function number(value, fallback = 0) {
  const parsed = Number(value);
  return Number.isFinite(parsed) ? Math.max(0, parsed) : fallback;
}

function silver(value) {
  return `${Math.round(value).toLocaleString("en-US")} s`;
}

function percent(value) {
  return `${value.toFixed(1)}%`;
}

function calculateMethod(opportunity, method) {
  const qty = Math.max(1, Math.floor(number(opportunity.qty, 1)));
  const materialCost = opportunity.materials.reduce((sum, material) => sum + number(material.price) * number(material.amount), 0);
  const acquisitionPerItem = method === "craft"
    ? materialCost + number(opportunity.craftingFee)
    : number(opportunity.finishedBuyPrice);
  const transportPerItem = number(opportunity.transportPerItem);
  const reservePerItem = acquisitionPerItem * (number(state.riskReserve) / 100);
  const requiredPerItem = acquisitionPerItem + transportPerItem + reservePerItem;
  const requiredCapital = requiredPerItem * qty;
  const netSalePerItem = number(opportunity.bmSellPrice) * (1 - number(state.saleTax) / 100);
  const profitPerItem = netSalePerItem - requiredPerItem;
  const netProfit = profitPerItem * qty;
  const roi = requiredCapital > 0 ? (netProfit / requiredCapital) * 100 : 0;
  const taxFactor = 1 - number(state.saleTax) / 100;
  const breakEven = taxFactor > 0 ? requiredPerItem / taxFactor : Infinity;
  return { method, qty, materialCost, acquisitionPerItem, requiredPerItem, requiredCapital, netSalePerItem, profitPerItem, netProfit, roi, breakEven };
}

function validateOpportunity(opportunity) {
  const errors = [];
  if (!opportunity.item.trim()) errors.push("Enter an item name");
  if (number(opportunity.qty) < 1) errors.push("Quantity must be at least 1");
  if (opportunity.materials.length === 0) errors.push("Add at least one material for the craft path");
  if (opportunity.materials.some(m => !m.name.trim())) errors.push("Name every material");
  if (number(opportunity.bmSellPrice) <= 0) errors.push("Enter a Black Market sell price");
  return errors;
}

function renderMaterial(material, opportunity, container) {
  const fragment = $("#materialTemplate").content.cloneNode(true);
  const line = $(".material-line", fragment);
  const nameInput = $('[data-material="name"]', line);
  const priceInput = $('[data-material="price"]', line);
  const amountInput = $('[data-material="amount"]', line);
  nameInput.value = material.name;
  priceInput.value = material.price;
  amountInput.value = material.amount;

  [nameInput, priceInput, amountInput].forEach(input => {
    input.addEventListener("input", () => {
      material.name = nameInput.value;
      material.price = number(priceInput.value);
      material.amount = number(amountInput.value);
      refreshCalculations();
    });
  });

  $(".remove-material", line).addEventListener("click", () => {
    if (opportunity.materials.length === 1) return;
    opportunity.materials = opportunity.materials.filter(m => m !== material);
    renderAll();
  });
  container.appendChild(line);
}

function renderOpportunity(opportunity, index) {
  const fragment = $("#opportunityTemplate").content.cloneNode(true);
  const card = $(".opportunity-card", fragment);
  card.dataset.id = opportunity.id;
  $(".card-index", card).textContent = String(index + 1).padStart(2, "0");

  card.querySelectorAll("[data-field]").forEach(input => {
    const field = input.dataset.field;
    input.value = opportunity[field];
    input.addEventListener("input", () => {
      opportunity[field] = input.type === "number" ? number(input.value) : input.value;
      refreshCalculations();
    });
    input.addEventListener("change", () => {
      opportunity[field] = input.type === "number" ? number(input.value) : input.value;
      refreshCalculations();
    });
  });

  const materialContainer = $(".material-lines", card);
  opportunity.materials.forEach(material => renderMaterial(material, opportunity, materialContainer));

  $(".add-material", card).addEventListener("click", () => {
    opportunity.materials.push({ name: "Material", price: 0, amount: 1 });
    renderAll();
  });

  $(".delete-card", card).addEventListener("click", () => {
    state.opportunities = state.opportunities.filter(o => o.id !== opportunity.id);
    renderAll();
  });

  opportunityList.appendChild(fragment);
}

function refreshCardOutputs(opportunity) {
  const card = $(`.opportunity-card[data-id="${opportunity.id}"]`);
  if (!card) return;
  const craft = calculateMethod(opportunity, "craft");
  const buy = calculateMethod(opportunity, "buy");
  const errors = validateOpportunity(opportunity);
  const message = $(".validation-message", card);
  message.hidden = errors.length === 0;
  message.textContent = errors.join(" · ");

  const craftProfit = $('[data-output="craftProfit"]', card);
  const buyProfit = $('[data-output="buyProfit"]', card);
  craftProfit.textContent = silver(craft.netProfit);
  buyProfit.textContent = silver(buy.netProfit);
  craftProfit.className = craft.netProfit >= 0 ? "positive" : "negative";
  buyProfit.className = buy.netProfit >= 0 ? "positive" : "negative";
  $('[data-output="craftMeta"]', card).textContent = `${percent(craft.roi)} ROI · ${silver(craft.requiredCapital)} capital`;
  $('[data-output="buyMeta"]', card).textContent = `${percent(buy.roi)} ROI · ${silver(buy.requiredCapital)} capital`;
  $(".craft-method", card).classList.toggle("winner", craft.netProfit >= buy.netProfit);
  $(".buy-method", card).classList.toggle("winner", buy.netProfit > craft.netProfit);
}

function getRankedResults() {
  return state.opportunities.flatMap(opportunity => {
    if (validateOpportunity(opportunity).length) return [];
    return [calculateMethod(opportunity, "craft"), calculateMethod(opportunity, "buy")].map(result => ({ ...result, opportunity }));
  }).sort((a, b) => {
    const aFit = a.requiredCapital <= number(state.availableSilver) ? 1 : 0;
    const bFit = b.requiredCapital <= number(state.availableSilver) ? 1 : 0;
    if (aFit !== bFit) return bFit - aFit;
    return b.netProfit - a.netProfit;
  });
}

function renderResults() {
  const ranked = getRankedResults();
  resultsBody.innerHTML = "";
  emptyState.hidden = ranked.length > 0;
  const budget = number(state.availableSilver);

  ranked.forEach((result, index) => {
    const row = document.createElement("tr");
    const fit = result.requiredCapital <= budget;
    const methodName = result.method === "craft" ? "Craft" : "Buy finished";
    row.innerHTML = `
      <td>${String(index + 1).padStart(2, "0")}</td>
      <td class="result-item"><strong>${escapeHtml(result.opportunity.item)} · ${escapeHtml(result.opportunity.tier)}</strong><small>${escapeHtml(result.opportunity.origin)} → Caerleon · ${number(result.opportunity.travelMinutes)} min · ×${result.qty}</small></td>
      <td><span class="method-badge ${result.method}">${methodName}</span></td>
      <td class="${result.netProfit >= 0 ? "profit-positive" : "profit-negative"}">${silver(result.netProfit)}</td>
      <td>${silver(result.profitPerItem)}</td>
      <td>${percent(result.roi)}</td>
      <td>${silver(result.requiredCapital)}</td>
      <td>${Number.isFinite(result.breakEven) ? silver(result.breakEven) : "—"}</td>
      <td><span class="budget-status ${fit ? "fit" : "over"}">${fit ? "Fits" : "Over"}</span></td>
    `;
    resultsBody.appendChild(row);
  });

}

function escapeHtml(value) {
  const div = document.createElement("div");
  div.textContent = value;
  return div.innerHTML;
}

function buildScanItems() {
  const settings = state.liveSettings;
  const tiers = [4, 5, 6, 7, 8].filter(tier => settings[`tier${tier}`]);
  const tierNames = { 4: "Adept's", 5: "Expert's", 6: "Master's", 7: "Grandmaster's", 8: "Elder's" };
  const enchants = settings.enchant === "all" ? [0, 1, 2, 3] : [Number(settings.enchant)];
  const bases = settings.category === "all" ? BASE_ITEMS : BASE_ITEMS.filter(item => item.category === settings.category);
  return tiers.flatMap(tier => bases.flatMap(base => enchants.map(enchant => {
    const itemId = `T${tier}_${base.id}${enchant ? `@${enchant}` : ""}`;
    const tierName = tierNames[tier];
    return { ...base, tier, enchant, itemId, displayName: `${tierName} ${base.name} · ${tier}.${enchant}` };
  })));
}

function chunk(items, size) {
  const chunks = [];
  for (let index = 0; index < items.length; index += size) chunks.push(items.slice(index, index + size));
  return chunks;
}

async function fetchJson(url, signal) {
  const separator = url.includes("?") ? "&" : "?";
  const freshUrl = `${url}${separator}_=${Date.now()}-${Math.random().toString(36).slice(2)}`;
  const response = await fetch(freshUrl, {
    signal,
    cache: "no-store",
    headers: { Accept: "application/json" }
  });
  if (!response.ok) throw new Error(`Market API returned ${response.status}`);
  return response.json();
}

function isoDateDaysAgo(days) {
  const date = new Date();
  date.setUTCDate(date.getUTCDate() - days);
  return date.toISOString().slice(0, 10);
}

function parseMarketDate(value) {
  if (!value || String(value).startsWith("0001-")) return null;
  const normalized = /(?:Z|[+-]\d\d:\d\d)$/.test(value) ? value : `${value}Z`;
  const date = new Date(normalized);
  return Number.isNaN(date.getTime()) ? null : date;
}

function hoursOld(value) {
  const date = parseMarketDate(value);
  if (!date) return Infinity;
  return Math.max(0, (Date.now() - date.getTime()) / 3600000);
}

function ageLabel(hours) {
  if (!Number.isFinite(hours)) return "Unknown";
  if (hours < 1) return `${Math.max(1, Math.round(hours * 60))}m`;
  if (hours < 48) return `${Math.round(hours)}h`;
  return `${Math.round(hours / 24)}d`;
}

function setScanStatus(stateName, title, detail) {
  const status = $("#scanStatus");
  status.dataset.state = stateName;
  status.innerHTML = `<span class="status-light"></span><p><strong>${escapeHtml(title)}</strong> ${escapeHtml(detail)}</p>`;
}

async function fetchInPools(groups, worker, concurrency = 3) {
  const results = new Array(groups.length);
  let cursor = 0;
  async function run() {
    while (cursor < groups.length) {
      const index = cursor++;
      results[index] = await worker(groups[index], index);
    }
  }
  await Promise.all(Array.from({ length: Math.min(concurrency, groups.length) }, run));
  return results;
}

function weightedHistory(historyRows) {
  const averages = new Map();
  historyRows.forEach(entry => {
    const points = Array.isArray(entry.data) ? entry.data : [];
    let weightedTotal = 0;
    let volume = 0;
    let simpleTotal = 0;
    let simpleCount = 0;
    points.forEach(point => {
      const price = number(point.avg_price);
      const count = number(point.item_count);
      if (price <= 0) return;
      simpleTotal += price;
      simpleCount += 1;
      if (count > 0) {
        weightedTotal += price * count;
        volume += count;
      }
    });
    const average = volume > 0 ? weightedTotal / volume : (simpleCount ? simpleTotal / simpleCount : 0);
    averages.set(`${entry.item_id}|${entry.quality || 0}`, { average, volume });
  });
  return averages;
}

function calculateLiveResults(items, currentRows, historyRows) {
  const settings = state.liveSettings;
  const freshness = number(settings.freshness);
  const budget = number(state.availableSilver);
  const taxFactor = 1 - number(state.saleTax) / 100;
  const selectedCities = new Set(settings.cities);
  const itemMeta = new Map(items.map(item => [item.itemId, item]));
  const byItemQuality = new Map();
  currentRows.forEach(row => {
    const quality = Number(row.quality);
    if (!QUALITY_NAMES[quality] || !itemMeta.has(row.item_id)) return;
    const key = `${row.item_id}|${quality}`;
    if (!byItemQuality.has(key)) byItemQuality.set(key, []);
    byItemQuality.get(key).push(row);
  });
  const averages = weightedHistory(historyRows);

  return items.flatMap(item => Object.keys(QUALITY_NAMES).flatMap(qualityKey => {
    const quality = Number(qualityKey);
    const rows = byItemQuality.get(`${item.itemId}|${quality}`) || [];
    const blackMarket = rows
      .filter(row => row.city === "Black Market" && number(row.buy_price_max) > 0 && hoursOld(row.buy_price_max_date) <= freshness)
      .sort((a, b) => number(b.buy_price_max) - number(a.buy_price_max))[0];
    const origin = rows
      .filter(row => selectedCities.has(row.city) && number(row.sell_price_min) > 0 && hoursOld(row.sell_price_min_date) <= freshness)
      .sort((a, b) => number(a.sell_price_min) - number(b.sell_price_min))[0];
    if (!blackMarket || !origin) return [];

    const buyPrice = number(origin.sell_price_min);
    const bmPrice = number(blackMarket.buy_price_max);
    const reservePerItem = buyPrice * (number(state.riskReserve) / 100);
    const requiredPerItem = buyPrice + number(settings.transport) + reservePerItem;
    const affordableUnits = requiredPerItem > 0 ? Math.floor(budget / requiredPerItem) : 0;
    const units = Math.min(Math.max(1, Math.floor(number(settings.maxUnits, 1))), affordableUnits);
    if (units < 1) return [];
    const profitPerItem = bmPrice * taxFactor - requiredPerItem;
    if (profitPerItem <= 0) return [];
    const requiredCapital = requiredPerItem * units;
    const netProfit = profitPerItem * units;
    const roi = requiredCapital > 0 ? (netProfit / requiredCapital) * 100 : 0;
    const history = averages.get(`${item.itemId}|${quality}`) || { average: 0, volume: 0 };
    const originAge = hoursOld(origin.sell_price_min_date);
    const bmAge = hoursOld(blackMarket.buy_price_max_date);
    return [{
      ...item, quality, qualityName: QUALITY_NAMES[quality], origin: origin.city,
      buyPrice, bmPrice, bmAverage: history.average, bmVolume: history.volume,
      units, affordableUnits, requiredPerItem, requiredCapital, profitPerItem, netProfit, roi,
      originAge, bmAge, originTimestamp: origin.sell_price_min_date, bmTimestamp: blackMarket.buy_price_max_date,
      dataAge: Math.max(originAge, bmAge)
    }];
  }));
}

function selectedLiveSort() {
  return LIVE_SORTS[state.liveSettings.sort] || LIVE_SORTS.profit;
}

function sortLiveResults(results, sortKey = state.liveSettings.sort) {
  const sort = LIVE_SORTS[sortKey] || LIVE_SORTS.profit;
  return [...results].sort(sort.compare);
}

function applyLiveSort() {
  liveResults = sortLiveResults(allLiveResults).slice(0, 50);
}

function updateLiveSortUI() {
  const sortKey = LIVE_SORTS[state.liveSettings.sort] ? state.liveSettings.sort : "profit";
  document.querySelectorAll("[data-sort-header]").forEach(header => {
    header.classList.toggle("active-sort", header.dataset.sortHeader === sortKey);
  });
  $("#bestRankLabel").textContent = LIVE_SORTS[sortKey].heroLabel;
}

function updateHeroFromLive() {
  updateLiveSortUI();
  const best = liveResults[0];
  if (!best) {
    $("#bestName").textContent = "No fresh profitable flip";
    $("#bestMethod").textContent = "Try a longer data-age window";
    $("#bestProfit").textContent = "0 s";
    $("#bestRoi").textContent = "0%";
    $("#bestCapital").textContent = "0 s";
    $("#budgetUsed").textContent = "0%";
    $("#budgetBar").style.width = "0%";
    return;
  }
  const usage = number(state.availableSilver) > 0 ? best.requiredCapital / number(state.availableSilver) * 100 : 100;
  $("#bestName").textContent = `${best.displayName} · ${best.qualityName}`;
  $("#bestMethod").textContent = `Buy ${best.qualityName} in ${best.origin} → Black Market · ${best.units} units`;
  $("#bestProfit").textContent = silver(best.profitPerItem);
  $("#bestRoi").textContent = percent(best.roi);
  $("#bestCapital").textContent = silver(best.requiredPerItem);
  $("#budgetUsed").textContent = percent(usage);
  $("#budgetBar").style.width = `${Math.min(100, usage)}%`;
}

function liveSelectionKey(result) {
  return `${result.itemId}|${result.quality}|${result.origin}`;
}

function updateBuyListTotals() {
  const selections = [...selectedLiveItems.values()];
  const purchaseSpend = selections.reduce((sum, entry) => sum + entry.result.buyPrice * entry.quantity, 0);
  const requiredCapital = selections.reduce((sum, entry) => sum + entry.result.requiredPerItem * entry.quantity, 0);
  const expectedProfit = selections.reduce((sum, entry) => sum + entry.result.profitPerItem * entry.quantity, 0);
  const budgetLeft = number(state.availableSilver) - requiredCapital;

  $("#selectedPurchaseSpend").textContent = silver(purchaseSpend);
  $("#selectedCapital").textContent = silver(requiredCapital);
  $("#selectedProfit").textContent = silver(expectedProfit);
  $("#selectedBudgetLeft").textContent = `${budgetLeft < 0 ? "−" : ""}${silver(Math.abs(budgetLeft))}`;
  $("#selectedBudgetLeft").className = budgetLeft >= 0 ? "" : "over-budget-text";
  const status = $("#selectedBudgetStatus");
  status.className = `checklist-budget ${budgetLeft >= 0 ? "fits" : "over"}`;
  status.textContent = budgetLeft >= 0
    ? `This list fits your ${silver(number(state.availableSilver))} budget.`
    : `Over budget by ${silver(Math.abs(budgetLeft))}. Lower quantities before buying.`;

  selections.forEach(entry => {
    const key = liveSelectionKey(entry.result);
    const row = [...document.querySelectorAll("[data-checklist-key]")]
      .find(element => element.dataset.checklistKey === key);
    if (!row) return;
    $("[data-line-capital]", row).textContent = silver(entry.result.requiredPerItem * entry.quantity);
    $("[data-line-profit]", row).textContent = silver(entry.result.profitPerItem * entry.quantity);
  });
}

function renderBuyList() {
  const panel = $("#buyChecklist");
  const body = $("#buyChecklistBody");
  const selections = [...selectedLiveItems.values()];
  panel.hidden = selections.length === 0;
  $("#selectedCount").textContent = `${selections.length} ${selections.length === 1 ? "item" : "items"}`;
  body.innerHTML = "";

  selections.forEach(entry => {
    const result = entry.result;
    const key = liveSelectionKey(result);
    const row = document.createElement("tr");
    row.dataset.checklistKey = key;
    row.innerHTML = `
      <td class="result-item"><strong>${escapeHtml(result.displayName)} · ${escapeHtml(result.qualityName)}</strong><small>${escapeHtml(result.itemId)} · ${escapeHtml(result.category)}</small></td>
      <td><strong>${escapeHtml(result.origin)}</strong><small>${ageLabel(result.originAge)} old</small></td>
      <td><strong>${silver(result.buyPrice)}</strong><small>each</small></td>
      <td><strong>${silver(result.bmPrice)}</strong><small>${ageLabel(result.bmAge)} old</small></td>
      <td><input class="checklist-quantity" type="number" min="1" max="${Math.max(1, result.affordableUnits)}" step="1" value="${entry.quantity}" aria-label="Quantity of ${escapeHtml(result.displayName)} in ${escapeHtml(result.qualityName)} quality" /></td>
      <td data-line-capital>${silver(result.requiredPerItem * entry.quantity)}</td>
      <td class="profit-positive" data-line-profit>${silver(result.profitPerItem * entry.quantity)}</td>
    `;
    $(".checklist-quantity", row).addEventListener("input", event => {
      const max = Math.max(1, result.affordableUnits);
      entry.quantity = Math.min(max, Math.max(1, Math.floor(number(event.target.value, 1))));
      updateBuyListTotals();
    });
    $(".checklist-quantity", row).addEventListener("change", event => {
      event.target.value = entry.quantity;
    });
    body.appendChild(row);
  });
  if (selections.length) updateBuyListTotals();
}

function clearBuyList() {
  selectedLiveItems.clear();
  renderLiveResults();
}

async function copyBuyList() {
  const selections = [...selectedLiveItems.values()];
  if (!selections.length) return;
  const lines = selections.map((entry, index) => {
    const result = entry.result;
    return `${index + 1}. ${result.displayName} | ${result.qualityName} | ${result.itemId} | Buy ${entry.quantity} in ${result.origin} at or below ${silver(result.buyPrice)} each | BM ${silver(result.bmPrice)} | Expected profit ${silver(result.profitPerItem)} each`;
  });
  const requiredCapital = selections.reduce((sum, entry) => sum + entry.result.requiredPerItem * entry.quantity, 0);
  const expectedProfit = selections.reduce((sum, entry) => sum + entry.result.profitPerItem * entry.quantity, 0);
  const text = [`Albion Asia verified buy list`, ...lines, `Required capital: ${silver(requiredCapital)}`, `Expected net profit: ${silver(expectedProfit)}`].join("\n");
  try {
    await navigator.clipboard.writeText(text);
  } catch (_) {
    const textarea = document.createElement("textarea");
    textarea.value = text;
    textarea.style.position = "fixed";
    textarea.style.opacity = "0";
    document.body.appendChild(textarea);
    textarea.select();
    document.execCommand("copy");
    textarea.remove();
  }
  const button = $("#copyBuyList");
  button.textContent = "Copied";
  window.setTimeout(() => { button.textContent = "Copy list"; }, 1400);
}

function renderLiveResults() {
  const body = $("#liveResultsBody");
  body.innerHTML = "";
  liveResults.forEach((result, index) => {
    const row = document.createElement("tr");
    const key = liveSelectionKey(result);
    const selected = selectedLiveItems.has(key);
    row.classList.toggle("is-selected", selected);
    const originAgeClass = result.originAge <= 6 ? "fresh" : result.originAge > 24 ? "stale" : "";
    const bmAgeClass = result.bmAge <= 6 ? "fresh" : result.bmAge > 24 ? "stale" : "";
    row.innerHTML = `
      <td class="${index < 3 ? "rank-top" : ""}">${String(index + 1).padStart(2, "0")}</td>
      <td><label class="verify-toggle"><input type="checkbox" data-live-index="${index}" ${selected ? "checked" : ""} aria-label="Mark ${escapeHtml(result.displayName)} in ${escapeHtml(result.qualityName)} quality as verified in game" /><span>${selected ? "Added" : "Add"}</span></label></td>
      <td class="result-item"><strong>${escapeHtml(result.displayName)} · ${escapeHtml(result.qualityName)}</strong><small>${escapeHtml(result.category)} · purchase this exact quality · ${escapeHtml(result.itemId)}</small></td>
      <td class="result-item"><strong>${escapeHtml(result.origin)}</strong><small>${silver(result.buyPrice)} each</small></td>
      <td>${silver(result.bmPrice)}</td>
      <td class="avg-price">${result.bmAverage > 0 ? silver(result.bmAverage) : "—"}<small>${result.bmVolume > 0 ? `${Math.round(result.bmVolume).toLocaleString("en-US")} recorded` : "No history"}</small></td>
      <td>${result.units}</td>
      <td class="profit-positive">${silver(result.netProfit)}</td>
      <td class="profit-positive">${silver(result.profitPerItem)}</td>
      <td>${percent(result.roi)}</td>
      <td class="price-age ${originAgeClass}" title="Origin updated ${escapeHtml(result.originTimestamp)} UTC">${ageLabel(result.originAge)}</td>
      <td class="price-age ${bmAgeClass}" title="Black Market updated ${escapeHtml(result.bmTimestamp)} UTC">${ageLabel(result.bmAge)}</td>
    `;
    body.appendChild(row);
  });
  $("#liveTableWrap").hidden = liveResults.length === 0;
  renderBuyList();
  updateHeroFromLive();
}

async function scanLivePrices() {
  const settings = state.liveSettings;
  if (![4, 5, 6, 7, 8].some(tier => settings[`tier${tier}`])) {
    setScanStatus("error", "Choose a tier.", "Select T4, T5, or both.");
    return;
  }
  if (!settings.cities.length) {
    setScanStatus("error", "Choose an origin.", "Select at least one city to scan.");
    return;
  }

  if (liveAbortController) liveAbortController.abort();
  liveAbortController = new AbortController();
  const signal = liveAbortController.signal;
  const button = $("#scanLive");
  button.disabled = true;
  button.textContent = "Scanning…";
  const items = buildScanItems();
  const groups = chunk(items, 50);
  const locations = [...settings.cities, "Black Market"].map(encodeURIComponent).join(",");
  const qualities = "1,2,3,4,5";
  let completed = 0;
  setScanStatus("loading", `Scanning ${(items.length * 5).toLocaleString("en-US")} item-quality combinations.`, "Loading current city and Black Market orders…");

  try {
    const currentBatches = await fetchInPools(groups, async group => {
      const ids = group.map(item => encodeURIComponent(item.itemId)).join(",");
      const currentUrl = `${API_BASE}/prices/${ids}.json?locations=${locations}&qualities=${qualities}`;
      const current = await fetchJson(currentUrl, signal);
      completed += 1;
      setScanStatus("loading", `Current prices ${completed}/${groups.length}.`, "Checking order freshness, budget, and margins…");
      return current;
    }, 4);

    const currentRows = currentBatches.flatMap(result => Array.isArray(result) ? result : []);
    const provisional = calculateLiveResults(items, currentRows, []);
    const candidateMap = new Map();
    Object.keys(LIVE_SORTS).forEach(sortKey => {
      sortLiveResults(provisional, sortKey).slice(0, 50).forEach(item => {
        candidateMap.set(`${item.itemId}|${item.quality}`, item);
      });
    });
    const topCandidates = [...candidateMap.values()];
    const historyGroups = Object.keys(QUALITY_NAMES).flatMap(qualityKey => {
      const sameQuality = topCandidates.filter(item => item.quality === Number(qualityKey));
      return chunk(sameQuality, 50).map(group => ({ quality: Number(qualityKey), items: group }));
    });
    completed = 0;
    const historyBatches = await fetchInPools(historyGroups, async group => {
      const ids = group.items.map(item => encodeURIComponent(item.itemId)).join(",");
      const historyUrl = `${API_BASE}/history/${ids}.json?date=${isoDateDaysAgo(7)}&end_date=${isoDateDaysAgo(0)}&locations=Black%20Market&qualities=${group.quality}&time-scale=24`;
      const history = await fetchJson(historyUrl, signal);
      completed += 1;
      setScanStatus("loading", `Black Market averages ${completed}/${historyGroups.length}.`, "Calculating seven-day volume-weighted prices…");
      return history;
    }, 3);
    const historyRows = historyBatches.flatMap(result => Array.isArray(result) ? result : []);
    allLiveResults = calculateLiveResults(items, currentRows, historyRows);
    applyLiveSort();
    selectedLiveItems.clear();
    renderLiveResults();
    const now = new Date();
    if (liveResults.length) {
      setScanStatus("success", `Top ${liveResults.length} profitable flips.`, `Fresh no-cache API scan at ${now.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}; sorted by ${selectedLiveSort().description}. Verify quality and order quantity in game before buying.`);
    } else {
      setScanStatus("error", "No affordable profitable flips found.", "Try a longer freshness window or a lower transport cost.");
    }
  } catch (error) {
    if (error.name !== "AbortError") {
      setScanStatus("error", "Live scan failed.", `${error.message}. The community API may be temporarily unavailable; try again shortly.`);
    }
  } finally {
    button.disabled = false;
    button.textContent = "Scan live Asia prices";
    liveAbortController = null;
  }
}

function bindLiveControls() {
  const settings = state.liveSettings;
  const controls = {
    scanTier4: ["tier4", "checked"], scanTier5: ["tier5", "checked"],
    scanTier6: ["tier6", "checked"], scanTier7: ["tier7", "checked"], scanTier8: ["tier8", "checked"],
    scanEnchant: ["enchant", "value"],
    scanCategory: ["category", "value"], scanMaxUnits: ["maxUnits", "number"],
    scanTransport: ["transport", "number"], scanFreshness: ["freshness", "value"],
    scanSort: ["sort", "value"]
  };
  Object.entries(controls).forEach(([id, [key, kind]]) => {
    const control = $(`#${id}`);
    control[kind === "checked" ? "checked" : "value"] = settings[key];
    control.addEventListener("change", () => {
      settings[key] = kind === "checked" ? control.checked : kind === "number" ? number(control.value) : control.value;
      saveState();
      if (key === "sort" && allLiveResults.length) {
        applyLiveSort();
        renderLiveResults();
        setScanStatus("success", `Top ${liveResults.length} profitable flips.`, `Re-ranked by ${selectedLiveSort().description} using the latest scan. Verify quality and order quantity in game before buying.`);
      }
    });
  });
  document.querySelectorAll(".city-filter input[type='checkbox']").forEach(input => {
    input.checked = settings.cities.includes(input.value);
    input.addEventListener("change", () => {
      settings.cities = [...document.querySelectorAll(".city-filter input:checked")].map(box => box.value);
      saveState();
    });
  });
  $("#scanLive").addEventListener("click", scanLivePrices);
  $("#scanLiveTop").addEventListener("click", () => {
    $("#workspaceTitle").scrollIntoView({ behavior: "smooth", block: "start" });
    scanLivePrices();
  });
  $("#openManual").addEventListener("click", () => {
    $("#manualPlanner").open = true;
  });
  $("#liveResultsBody").addEventListener("change", event => {
    const toggle = event.target.closest("[data-live-index]");
    if (!toggle) return;
    const result = liveResults[Number(toggle.dataset.liveIndex)];
    if (!result) return;
    const key = liveSelectionKey(result);
    if (toggle.checked) selectedLiveItems.set(key, { result, quantity: 1 });
    else selectedLiveItems.delete(key);
    renderLiveResults();
  });
  $("#clearBuyList").addEventListener("click", clearBuyList);
  $("#copyBuyList").addEventListener("click", copyBuyList);
}

function refreshCalculations() {
  state.opportunities.forEach(refreshCardOutputs);
  renderResults();
  saveState();
}

function renderAll() {
  opportunityList.innerHTML = "";
  state.opportunities.forEach(renderOpportunity);
  refreshCalculations();
}

function addOpportunity() {
  state.opportunities.push({
    id: crypto.randomUUID(), item: "New T5 opportunity", tier: "T5.0", qty: 1,
    origin: "Fort Sterling", travelMinutes: 13, craftingFee: 0,
    finishedBuyPrice: 0, bmSellPrice: 0, transportPerItem: 0,
    materials: [{ name: "Primary material", price: 0, amount: 1 }]
  });
  renderAll();
  const cards = document.querySelectorAll(".opportunity-card");
  cards[cards.length - 1]?.scrollIntoView({ behavior: "smooth", block: "center" });
}

function bindGlobalControls() {
  ["availableSilver", "saleTax", "riskReserve", "destinationCity"].forEach(id => {
    const input = $(`#${id}`);
    input.value = state[id];
    const update = () => {
      state[id] = input.type === "number" ? number(input.value) : input.value;
      if (id === "saleTax" && state[id] >= 100) {
        state[id] = 99;
        input.value = 99;
      }
      refreshCalculations();
      if (id === "availableSilver" && selectedLiveItems.size) updateBuyListTotals();
    };
    input.addEventListener("input", update);
    input.addEventListener("change", update);
  });
  $("#addOpportunityBottom").addEventListener("click", addOpportunity);
  $("#resetWorkspace").addEventListener("click", () => {
    state = cloneStarterState();
    bindStateToGlobals();
    renderAll();
  });
}

function bindStateToGlobals() {
  $("#availableSilver").value = state.availableSilver;
  $("#saleTax").value = state.saleTax;
  $("#riskReserve").value = state.riskReserve;
  $("#destinationCity").value = state.destinationCity;
}

bindGlobalControls();
bindLiveControls();
renderAll();
