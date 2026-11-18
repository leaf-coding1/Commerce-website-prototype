// Page behaviour: menu filtering, the basket, the address form and order confirmation.
// Menu data (MENU, CUISINES, CATEGORIES) comes from data.ts, loaded first.

const DELIVERY_FEE = 10.99;
const FREE_DELIVERY_FROM = 50;
const CART_KEY = "fiveKitchens.cart";
const ADDRESS_KEY = "fiveKitchens.address";
const DIETARY_KEY = "fiveKitchens.dietary";

type CuisineFilter = Cuisine | "all";
/** Anything that can go in the basket: a menu item or an extra. */
type Product = MenuItem | ExtraItem;

interface DietaryInfo {
  diets: Diet[];
  allergies: Allergen[];
  other: string;
}
type CategoryFilter = Category | "all";

interface DeliveryDetails {
  fullName: string;
  phone: string;
  line1: string;
  line2: string;
  city: string;
  postcode: string;
  deliveryTime: string;
  notes: string;
}

type FormErrors = Partial<Record<keyof DeliveryDetails, string>>;

const itemById = new Map<string, Product>([...MENU, ...EXTRAS, ...GIFT_EXTRAS].map((item) => [item.id, item]));

const state = {
  cuisine: "all" as CuisineFilter,
  category: "all" as CategoryFilter,
  search: "",
  cart: loadCart(),
  dietary: loadDietary(),
  language: "en",
};

// ───────────── Small helpers ─────────────

function byId<T extends HTMLElement>(id: string): T {
  const element = document.getElementById(id);
  if (!element) throw new Error(`Missing element #${id}`);
  return element as T;
}

function formatPrice(amount: number): string {
  return `$${amount.toFixed(2)}`;
}

function escapeHtml(text: string): string {
  return text
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;");
}

// localStorage can be unavailable (private browsing), so never let it break the page.
function storageGet(key: string): string | null {
  try {
    return localStorage.getItem(key);
  } catch {
    return null;
  }
}

function storageSet(key: string, value: string): void {
  try {
    localStorage.setItem(key, value);
  } catch {
    /* ignore */
  }
}

// ───────────── Cart ─────────────

function loadCart(): Map<string, number> {
  const cart = new Map<string, number>();
  const saved = storageGet(CART_KEY);
  if (!saved) return cart;
  try {
    const entries = JSON.parse(saved) as [string, number][];
    for (const [id, qty] of entries) {
      if (itemById.has(id) && qty > 0) cart.set(id, qty);
    }
  } catch {
    /* corrupt data: start with an empty basket */
  }
  return cart;
}

function saveCart(): void {
  storageSet(CART_KEY, JSON.stringify([...state.cart.entries()]));
}

function setQuantity(id: string, qty: number): void {
  if (qty <= 0) state.cart.delete(id);
  else state.cart.set(id, Math.min(qty, 20));
  saveCart();
  renderMenu();
  renderCart();
}

/** Adds one of each id to the basket and records the customer's dietary needs (used by the quick order).
 *  `saveToAccount` is false when the order is for someone else, so their needs don't replace the account's. */
function addItemsToOrder(ids: string[], dietary: DietaryInfo, saveToAccount = true): void {
  for (const id of ids) {
    if (itemById.has(id)) state.cart.set(id, Math.min((state.cart.get(id) ?? 0) + 1, 20));
  }
  state.dietary = dietary;
  saveCart();
  saveDietary(saveToAccount);
  renderMenu();
  renderCart();
}

function accentClass(item: Product): string {
  return "cuisine" in item ? `cuisine-${item.cuisine}` : "extra-item";
}

// ───────────── Dietary needs & allergies ─────────────

function emptyDietary(): DietaryInfo {
  return { diets: [], allergies: [], other: "" };
}

function loadDietary(): DietaryInfo {
  const saved = storageGet(DIETARY_KEY);
  if (!saved) return emptyDietary();
  try {
    const parsed = JSON.parse(saved) as Partial<DietaryInfo>;
    return {
      diets: (parsed.diets ?? []).filter((id) => DIET_OPTIONS.some((o) => o.id === id)),
      allergies: (parsed.allergies ?? []).filter((id) => ALLERGY_OPTIONS.some((o) => o.id === id)),
      other: typeof parsed.other === "string" ? parsed.other : "",
    };
  } catch {
    return emptyDietary();
  }
}

function saveDietary(saveToAccount = true): void {
  storageSet(DIETARY_KEY, JSON.stringify(state.dietary));
  if (saveToAccount) saveAccountDietary(state.dietary); // keep a logged-in account up to date (account.ts)
}

/** One HTML line per kind of note, e.g. "Allergies: Peanuts, Gluten". Empty when there is nothing to say. */
function dietaryLines(info: DietaryInfo): string[] {
  const labels = <T extends string>(options: { id: T; label: string }[], ids: T[]) =>
    options.filter((o) => ids.includes(o.id)).map((o) => o.label).join(", ");
  const lines: string[] = [];
  if (info.diets.length) lines.push(`<strong>Diet:</strong> ${labels(DIET_OPTIONS, info.diets)}`);
  if (info.allergies.length) lines.push(`<strong>Allergies:</strong> ${labels(ALLERGY_OPTIONS, info.allergies)}`);
  if (info.other) lines.push(`<strong>Other:</strong> ${escapeHtml(info.other)}`);
  return lines;
}

function cartTotals() {
  let subtotal = 0;
  let count = 0;
  for (const [id, qty] of state.cart) {
    subtotal += (itemById.get(id)?.price ?? 0) * qty;
    count += qty;
  }
  const delivery = count === 0 || subtotal >= FREE_DELIVERY_FROM ? 0 : DELIVERY_FEE;
  return { subtotal, delivery, total: subtotal + delivery, count };
}

// ───────────── Menu ─────────────

function renderCuisineTabs(): void {
  const container = document.getElementById("cuisine-tabs");
  if (!container) return; // the full menu isn't on the page at the moment
  const tabs: { id: CuisineFilter; label: string }[] = [
    { id: "all", label: "🌏 All" },
    ...CUISINES.map((c) => ({ id: c.id, label: `${c.flag} ${c.name}` })),
  ];
  container.innerHTML = tabs
    .map(
      (tab) => `<button type="button" class="cuisine-tab" data-cuisine="${tab.id}"
        aria-pressed="${state.cuisine === tab.id}">${tab.label}</button>`,
    )
    .join("");
}

function matchesFilters(item: MenuItem): boolean {
  if (state.cuisine !== "all" && item.cuisine !== state.cuisine) return false;
  if (state.category !== "all" && item.category !== state.category) return false;
  if (!state.search) return true;
  const haystack = [item.name, item.nativeName ?? "", item.description, ...item.tags]
    .join(" ")
    .toLowerCase();
  return haystack.includes(state.search);
}

function itemCard(item: MenuItem): string {
  const qty = state.cart.get(item.id) ?? 0;
  const tags = item.tags.map((t) => `<span class="tag tag-${t}">${t}</span>`).join("");
  const microwaveTime = item.microwaveMinutes
    ? `<span class="tag tag-microwave">⏱️ ${item.microwaveMinutes} min</span>`
    : "";
  const control =
    qty === 0
      ? `<button type="button" class="add-button" data-action="add" data-id="${item.id}">Add</button>`
      : `<div class="stepper" aria-label="Quantity of ${item.name}">
           <button type="button" data-action="dec" data-id="${item.id}" aria-label="Remove one">−</button>
           <span>${qty}</span>
           <button type="button" data-action="inc" data-id="${item.id}" aria-label="Add one">+</button>
         </div>`;

  return `
    <article class="item-card cuisine-${item.cuisine}">
      <div class="item-emoji" aria-hidden="true">${item.emoji}</div>
      <div class="item-body">
        <h4>${item.name}</h4>
        ${item.nativeName ? `<p class="native-name">${item.nativeName}</p>` : ""}
        <p class="item-description">${item.description}</p>
        <div class="tags">${microwaveTime}${tags}</div>
      </div>
      <div class="item-footer">
        <span class="price">${formatPrice(item.price)}</span>
        ${control}
      </div>
    </article>`;
}

function renderMenu(): void {
  const menuList = document.getElementById("menu-list");
  if (!menuList) return; // the full menu isn't on the page at the moment
  const cuisines = CUISINES.filter((c) => state.cuisine === "all" || c.id === state.cuisine);
  let html = "";

  for (const cuisine of cuisines) {
    let sections = "";
    for (const category of CATEGORIES) {
      const items = MENU.filter((i) => i.cuisine === cuisine.id && i.category === category.id && matchesFilters(i));
      if (items.length === 0) continue;
      const note =
        category.id === "quick meal"
          ? `<p class="section-note">Delivered chilled. Keep in the fridge and eat within 3 days.</p>`
          : "";
      sections += `
        <div class="category-section">
          <h3>${category.icon} ${category.label}</h3>
          ${note}
          <div class="item-grid">${items.map(itemCard).join("")}</div>
        </div>`;
    }
    if (!sections) continue;
    html += `
      <section class="cuisine-section cuisine-${cuisine.id}">
        <header class="cuisine-header">
          <h2><span aria-hidden="true">${cuisine.flag}</span> ${cuisine.name}</h2>
          <p>${cuisine.blurb}</p>
        </header>
        ${sections}
      </section>`;
  }

  menuList.innerHTML =
    html || `<p class="empty-state">Nothing matches “${escapeHtml(state.search)}”. Try another search or filter.</p>`;
}

// -------------- Basket panel --------------

function renderCart(): void {
  const { subtotal, delivery, total, count } = cartTotals();

  byId("cart-list").innerHTML =
    count === 0
      ? `<p class="empty-cart">Your basket is empty. Add something from the menu to get started.</p>`
      : `<ul class="cart-items">${[...state.cart]
          .map(([id, qty]) => {
            const item = itemById.get(id)!;
            return `
              <li class="cart-item ${accentClass(item)}">
                <span class="cart-item-name">${item.emoji} ${item.name}</span>
                <div class="stepper small">
                  <button type="button" data-action="dec" data-id="${id}" aria-label="Remove one ${item.name}">−</button>
                  <span>${qty}</span>
                  <button type="button" data-action="inc" data-id="${id}" aria-label="Add one ${item.name}">+</button>
                </div>
                <span class="cart-item-price">${formatPrice(item.price * qty)}</span>
              </li>`;
          })
          .join("")}</ul>`;

  const notes = dietaryLines(state.dietary);
  byId("dietary-notes").innerHTML = notes.length
    ? `<div class="notes-box">
         <div class="notes-box-head">
           <h3>Dietary &amp; allergy notes</h3>
           <button type="button" class="link-button" id="clear-dietary">Remove</button>
         </div>
         <ul>${notes.map((line) => `<li>${line}</li>`).join("")}</ul>
       </div>`
    : "";

  const freeDeliveryHint =
    count > 0 && delivery > 0
      ? `<p class="hint">Add ${formatPrice(FREE_DELIVERY_FROM - subtotal)} more for free delivery.</p>`
      : "";

  byId("totals").innerHTML = `
    <div><dt>Subtotal</dt><dd>${formatPrice(subtotal)}</dd></div>
    <div><dt>Delivery</dt><dd>${count === 0 ? "—" : delivery === 0 ? "Free" : formatPrice(delivery)}</dd></div>
    <div class="grand-total"><dt>Total</dt><dd>${formatPrice(total)}</dd></div>
    ${freeDeliveryHint}`;

  const mobileBar = byId<HTMLButtonElement>("mobile-cart-bar");
  mobileBar.hidden = count === 0;
  byId("mobile-cart-summary").textContent = `View order · ${count} item${count === 1 ? "" : "s"} · ${formatPrice(total)}`;

  byId<HTMLButtonElement>("place-order").disabled = count === 0;
}

// ───────────── Address form ─────────────

const FIELD_NAMES: (keyof DeliveryDetails)[] = [
  "fullName", "phone", "line1", "line2", "city", "postcode", "deliveryTime", "notes",
];

function populateDeliveryTimes(): void {
  const select = byId<HTMLSelectElement>("deliveryTime");
  const options = [`<option value="ASAP">As soon as possible (about 40 min)</option>`];

  // Offer 30-minute slots starting about an hour from now, up to 10pm.
  const slot = new Date();
  slot.setMinutes(slot.getMinutes() + 60);
  slot.setMinutes(Math.ceil(slot.getMinutes() / 30) * 30, 0, 0);
  const lastSlot = new Date();
  lastSlot.setHours(22, 0, 0, 0);

  while (slot <= lastSlot) {
    const label = slot.toLocaleTimeString("en-GB", { hour: "2-digit", minute: "2-digit" });
    options.push(`<option value="${label}">Today at ${label}</option>`);
    slot.setMinutes(slot.getMinutes() + 30);
  }
  select.innerHTML = options.join("");
}

function formControl(name: keyof DeliveryDetails) {
  return byId<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>(name);
}

function readForm(): DeliveryDetails {
  const details = {} as DeliveryDetails;
  for (const name of FIELD_NAMES) details[name] = formControl(name).value.trim();
  details.postcode = details.postcode.toUpperCase();
  return details;
}

function restoreSavedAddress(): void {
  const saved = storageGet(ADDRESS_KEY);
  if (!saved) return;
  try {
    const details = JSON.parse(saved) as Partial<DeliveryDetails>;
    for (const name of FIELD_NAMES) {
      if (name === "deliveryTime" || name === "notes") continue;
      const value = details[name];
      if (typeof value === "string") formControl(name).value = value;
    }
  } catch {
    /* ignore */
  }
}

function validate(details: DeliveryDetails): FormErrors {
  const errors: FormErrors = {};
  if (details.fullName.length < 2) errors.fullName = "Please enter your name.";
  if (details.phone.replace(/\D/g, "").length < 10) errors.phone = "Please enter a phone number the driver can call.";
  if (!details.line1) errors.line1 = "Please enter your house number and street.";
  if (!details.city) errors.city = "Please enter your town or city.";
  // AUS postcode
  if (!/^[0-9]{4}$/.test(details.postcode)) {
    errors.postcode = "Please enter a valid Australian postcode, e.g. 2000 or 2432.";
  }
  return errors;
}

function showErrors(errors: FormErrors): void {
  for (const name of FIELD_NAMES) {
    const message = errors[name] ?? "";
    const errorEl = document.querySelector<HTMLElement>(`[data-error-for="${name}"]`);
    if (errorEl) errorEl.textContent = message;
    formControl(name).setAttribute("aria-invalid", String(Boolean(message)));
  }
}

// ───────────── Placing an order ─────────────

function estimatedArrival(deliveryTime: string): string {
  if (deliveryTime !== "ASAP") return `Today at ${deliveryTime}`;
  const eta = new Date(Date.now() + 40 * 60 * 1000);
  return `Around ${eta.toLocaleTimeString("en-GB", { hour: "2-digit", minute: "2-digit" })}`;
}

function placeOrder(event: SubmitEvent): void {
  event.preventDefault();
  const formError = byId("form-error");
  formError.textContent = "";

  if (state.cart.size === 0) {
    formError.textContent = "Your basket is empty.";
    return;
  }

  const details = readForm();
  const errors = validate(details);
  showErrors(errors);
  const firstInvalid = FIELD_NAMES.find((name) => errors[name]);
  if (firstInvalid) {
    formControl(firstInvalid).focus();
    return;
  }

  storageSet(ADDRESS_KEY, JSON.stringify(details));
  showConfirmation(details);

  state.cart.clear();
  state.dietary = emptyDietary();
  saveCart();
  saveDietary();
  renderMenu();
  renderCart();
  byId<HTMLTextAreaElement>("notes").value = "";
}

function showConfirmation(details: DeliveryDetails): void {
  const { subtotal, delivery, total } = cartTotals();
  const orderNumber = `FK-${Math.floor(10000 + Math.random() * 90000)}`;
  const hasMicrowaveMeals = [...state.cart.keys()].some((id) => {
    const item = itemById.get(id);
    return item !== undefined && "category" in item && item.category === "quick meal";
  });
  const notes = dietaryLines(state.dietary);

  const lines = [...state.cart]
    .map(([id, qty]) => {
      const item = itemById.get(id)!;
      return `<li><span>${qty} × ${item.name}</span><span>${formatPrice(item.price * qty)}</span></li>`;
    })
    .join("");

  const address = [details.line1, details.line2, details.city, details.postcode]
    .filter(Boolean)
    .map(escapeHtml)
    .join("<br>");

  const dialog = byId<HTMLDialogElement>("confirmation");
  dialog.innerHTML = `
    <div class="confirmation-icon" aria-hidden="true">✅</div>
    <h2 id="confirmation-title">Order placed!</h2>
    <p class="order-number">Order number <strong>${orderNumber}</strong></p>
    <p class="eta">${estimatedArrival(details.deliveryTime)}</p>

    <div class="confirmation-grid">
      <div>
        <h3>Delivering to</h3>
        <p><strong>${escapeHtml(details.fullName)}</strong><br>${address}<br>${escapeHtml(details.phone)}</p>
        ${details.notes ? `<p class="driver-notes">“${escapeHtml(details.notes)}”</p>` : ""}
      </div>
      <div>
        <h3>Your items</h3>
        <ul class="confirmation-items">${lines}</ul>
        <dl class="totals compact">
          <div><dt>Subtotal</dt><dd>${formatPrice(subtotal)}</dd></div>
          <div><dt>Delivery</dt><dd>${delivery === 0 ? "Free" : formatPrice(delivery)}</dd></div>
          <div class="grand-total"><dt>Total</dt><dd>${formatPrice(total)}</dd></div>
        </dl>
      </div>
    </div>

    ${notes.length
      ? `<div class="notes-box"><h3>Dietary &amp; allergy notes sent to the kitchen</h3>
           <ul>${notes.map((line) => `<li>${line}</li>`).join("")}</ul></div>`
      : ""}

    ${hasMicrowaveMeals
      ? `<p class="section-note">Your microwave meals will arrive chilled: pop them in the fridge and heat as shown on each label.</p>`
      : ""}

    <form method="dialog"><button class="primary-button" type="submit">Done</button></form>`;
  dialog.showModal();
}

// ───────────── Language switcher (stub) ─────────────
// Only remembers which language was picked; nothing is translated yet.

function renderLanguageMenu(): void {
  const current = LANGUAGES.find((l) => l.code === state.language) ?? LANGUAGES[0];
  byId("language-button-label").textContent = current.nativeName;
  byId("language-button").setAttribute("aria-label", `Change language (current: ${current.name})`);
  byId("language-menu").innerHTML = LANGUAGES.map(
    (lang) => `<li><button type="button" class="language-option" data-language="${lang.code}" lang="${lang.code}"
        aria-pressed="${lang.code === state.language}">
        <span>${lang.nativeName}</span>
        ${lang.code === "en" ? "" : `<small lang="en">${lang.name}</small>`}
      </button></li>`,
  ).join("");
}

function setLanguageMenuOpen(open: boolean): void {
  byId("language-menu").hidden = !open;
  byId("language-button").setAttribute("aria-expanded", String(open));
}

function bindLanguageMenu(): void {
  const button = byId("language-button");
  const menu = byId("language-menu");

  button.addEventListener("click", () =>
    setLanguageMenuOpen(button.getAttribute("aria-expanded") !== "true"));

  menu.addEventListener("click", (event) => {
    const option = (event.target as HTMLElement).closest<HTMLElement>("[data-language]");
    if (!option) return;
    state.language = option.dataset.language!;
    renderLanguageMenu();
    setLanguageMenuOpen(false);
    button.focus();
  });

  // Close when clicking anywhere else or pressing Escape.
  document.addEventListener("click", (event) => {
    if (!(event.target as HTMLElement).closest(".language-picker")) setLanguageMenuOpen(false);
  });
  document.addEventListener("keydown", (event) => {
    if (event.key === "Escape" && !menu.hidden) {
      setLanguageMenuOpen(false);
      button.focus();
    }
  });
}

// ───────────── Events ─────────────

/** Shows the order (basket + delivery address) covering the whole screen. Used at the end of the quick order. */
function openOrderScreen(): void {
  const order = byId("order");
  order.classList.add("is-fullscreen");
  order.scrollTop = 0;
  document.body.classList.add("order-screen-open");
  byId("order-screen-title").focus();
}

function closeOrderScreen(): void {
  const order = byId("order");
  if (!order.classList.contains("is-fullscreen")) return;
  order.classList.remove("is-fullscreen");
  document.body.classList.remove("order-screen-open");
}

function bindEvents(): void {
  // One click handler for every add / + / − button, wherever it is on the page.
  document.addEventListener("click", (event) => {
    const target = (event.target as HTMLElement).closest<HTMLElement>("[data-action]");
    if (!target?.dataset.id) return;
    const id = target.dataset.id;
    const qty = state.cart.get(id) ?? 0;
    if (target.dataset.action === "add" || target.dataset.action === "inc") setQuantity(id, qty + 1);
    if (target.dataset.action === "dec") setQuantity(id, qty - 1);
  });

  document.getElementById("cuisine-tabs")?.addEventListener("click", (event) => {
    const tab = (event.target as HTMLElement).closest<HTMLElement>("[data-cuisine]");
    if (!tab) return;
    state.cuisine = tab.dataset.cuisine as CuisineFilter;
    renderCuisineTabs();
    renderMenu();
  });

  // The search box is optional (it's currently commented out in index.html).
  document.getElementById("search")?.addEventListener("input", (event) => {
    state.search = (event.target as HTMLInputElement).value.trim().toLowerCase();
    renderMenu();
  });

  // Clear a field's error as soon as the user starts fixing it.
  byId("address-form").addEventListener("input", (event) => {
    const name = (event.target as HTMLElement).id;
    const errorEl = document.querySelector<HTMLElement>(`[data-error-for="${name}"]`);
    if (errorEl) errorEl.textContent = "";
    (event.target as HTMLElement).removeAttribute("aria-invalid");
  });

  byId("dietary-notes").addEventListener("click", (event) => {
    if (!(event.target as HTMLElement).closest("#clear-dietary")) return;
    state.dietary = emptyDietary();
    saveDietary(false); // only clears this order's notes; the account keeps its saved requirements
    renderCart();
  });

  byId<HTMLFormElement>("address-form").addEventListener("submit", placeOrder);
  byId("mobile-cart-bar").addEventListener("click", openOrderScreen);

  // Full-screen order view: close with its button or Escape, and go back to the page once an order is placed.
  byId("close-order-screen").addEventListener("click", closeOrderScreen);
  document.addEventListener("keydown", (event) => {
    if (event.key === "Escape" && !document.querySelector("dialog[open]")) closeOrderScreen();
  });
  byId<HTMLDialogElement>("confirmation").addEventListener("close", closeOrderScreen);
}

// ───────────── Start ─────────────

renderCuisineTabs();
renderMenu();
renderCart();
populateDeliveryTimes();
restoreSavedAddress();
renderLanguageMenu();
bindEvents();
bindLanguageMenu();
