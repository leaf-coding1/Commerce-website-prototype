// Quick order: a short step-by-step questionnaire that builds an order for the customer.
// Uses the menu data from data.ts and the basket functions from app.ts (both loaded first).

type MealType = "microwave" | "dish";

interface QuickOrderAnswers {
  mealType: MealType | null;
  cuisine: Cuisine | null;
  /** Item id of the chosen tea, "none" for no tea, or null if not answered yet. */
  tea: string | null;
  extras: Set<string>;
  diets: Set<Diet>;
  allergies: Set<Allergen>;
  other: string;
}

const QUICK_STEPS = ["meal", "cuisine", "tea", "extras", "dietary", "review"] as const;
type QuickStep = (typeof QUICK_STEPS)[number];

const MEAL_TYPES: { id: MealType; label: string; detail: string; icon: string }[] = [
  {
    id: "microwave", icon: "⏱️", label: "Microwave meal",
    detail: "Delivered chilled, ready to heat in 3–5 minutes whenever you like.",
  },
  {
    id: "dish", icon: "🍳", label: "Freshly cooked",
    detail: "Cooked to order by our kitchen from fresh ingredients and delivered hot.",
  },
];

const quick = {
  step: 0,
  answers: newAnswers(),
  /** Which of the suitable meals is suggested; "Show me another" moves it on. */
  mealOffset: 0,
};

function newAnswers(): QuickOrderAnswers {
  return {
    mealType: null,
    cuisine: null,
    tea: null,
    extras: new Set(),
    // Start from what the customer told us last time.
    diets: new Set(state.dietary.diets),
    allergies: new Set(state.dietary.allergies),
    other: state.dietary.other,
  };
}

// ───────────── Matching meals to dietary needs ─────────────

/** Reasons an item doesn't suit the customer, e.g. ["not vegan", "contains gluten"]. Empty means it suits. */
function conflicts(item: MenuItem, diets: Set<Diet>, allergies: Set<Allergen>): string[] {
  const contains = CONTAINS[item.id] ?? [];
  const reasons: string[] = [];

  if (diets.has("vegan") && !item.tags.includes("VG")) reasons.push("not vegan");
  else if (diets.has("vegetarian") && !item.tags.some((t) => t === "V" || t === "VG")) reasons.push("not vegetarian");
  if ((diets.has("halal") || diets.has("noPork")) && contains.includes("pork")) reasons.push("contains pork");
  if (diets.has("noBeef") && contains.includes("beef")) reasons.push("contains beef");

  for (const allergen of ALLERGY_OPTIONS) {
    if (!allergies.has(allergen.id)) continue;
    // The menu tags are a second check in case CONTAINS misses something.
    const tagged =
      ((allergen.id === "peanut" || allergen.id === "treeNut") && item.tags.includes("Nuts")) ||
      ((allergen.id === "fish" || allergen.id === "shellfish") && item.tags.includes("Fish"));
    if (tagged || contains.includes(allergen.id)) reasons.push(`contains ${allergen.label.toLowerCase()}`);
  }
  return reasons;
}

function suitableMeals(a: QuickOrderAnswers): MenuItem[] {
  return MENU.filter(
    (item) =>
      item.cuisine === a.cuisine &&
      item.category === a.mealType &&
      conflicts(item, a.diets, a.allergies).length === 0,
  );
}

function teasFor(cuisine: Cuisine): MenuItem[] {
  return MENU.filter((item) => item.cuisine === cuisine && item.isTea);
}

function cuisineInfo(id: Cuisine | null): CuisineInfo | undefined {
  return CUISINES.find((c) => c.id === id);
}

// ───────────── Building each step ─────────────

function optionCard(
  type: "radio" | "checkbox", name: string, value: string, checked: boolean,
  icon: string, title: string, detail = "", price?: number,
): string {
  return `
    <label class="qo-option">
      <input type="${type}" name="${name}" value="${value}" ${checked ? "checked" : ""}>
      <span class="qo-option-icon" aria-hidden="true">${icon}</span>
      <span class="qo-option-text">
        <strong>${title}</strong>
        ${detail ? `<small>${detail}</small>` : ""}
      </span>
      ${price !== undefined ? `<span class="qo-price">${formatPrice(price)}</span>` : ""}
    </label>`;
}

function checkChip(name: string, value: string, checked: boolean, label: string, hint = ""): string {
  return `
    <label class="qo-check">
      <input type="checkbox" name="${name}" value="${value}" ${checked ? "checked" : ""}>
      <span>${label}${hint ? `<small>${hint}</small>` : ""}</span>
    </label>`;
}

function stepContent(step: QuickStep): { title: string; intro?: string; body: string } {
  const a = quick.answers;

  switch (step) {
    case "meal":
      return {
        title: "What kind of meal would you like?",
        body: `<div class="qo-options" role="radiogroup">${MEAL_TYPES.map((m) =>
          optionCard("radio", "mealType", m.id, a.mealType === m.id, m.icon, m.label, m.detail)).join("")}</div>`,
      };

    case "cuisine":
      return {
        title: "Which cuisine are you in the mood for?",
        body: `<div class="qo-options" role="radiogroup">${CUISINES.map((c) =>
          optionCard("radio", "cuisine", c.id, a.cuisine === c.id, c.flag, c.name, c.blurb)).join("")}</div>`,
      };

    case "tea": {
      const cuisine = cuisineInfo(a.cuisine);
      const teas = a.cuisine ? teasFor(a.cuisine) : [];
      return {
        title: `Would you like a ${cuisine?.name ?? ""} tea with that?`,
        body: `<div class="qo-options" role="radiogroup">
          ${teas.map((t) => optionCard("radio", "tea", t.id, a.tea === t.id, t.emoji, t.name, t.description, t.price)).join("")}
          ${optionCard("radio", "tea", "none", a.tea === "none", "🚫", "No tea, thanks")}
        </div>`,
      };
    }

    case "extras":
      return {
        title: "Any extras?",
        intro: "Optional: tick as many as you like.",
        body: `<div class="qo-options">${EXTRAS.map((x) =>
          optionCard("checkbox", "extras", x.id, a.extras.has(x.id), x.emoji, x.name, x.description, x.price)).join("")}</div>`,
      };

    case "dietary":
      return {
        title: "Any dietary needs or allergies?",
        intro: "We'll only suggest meals that suit you, and pass this on to the kitchen.",
        body: `
          <fieldset class="qo-group">
            <legend>Dietary needs</legend>
            <div class="qo-checks">${DIET_OPTIONS.map((d) =>
              checkChip("diets", d.id, a.diets.has(d.id), d.label, d.hint)).join("")}</div>
          </fieldset>
          <fieldset class="qo-group">
            <legend>Allergies</legend>
            <div class="qo-checks">${ALLERGY_OPTIONS.map((x) =>
              checkChip("allergies", x.id, a.allergies.has(x.id), x.label)).join("")}</div>
          </fieldset>
          <div class="field">
            <label for="qo-other">Anything else the kitchen should know? <span class="optional">(optional)</span></label>
            <input id="qo-other" name="other" value="${escapeHtml(a.other)}" maxlength="200"
              placeholder="e.g. sulphites, celery, no coriander">
          </div>
          <p class="qo-small-print">Allergen info is a guide. All our kitchens handle nuts, gluten, dairy and seafood,
            so if your allergy is severe please call us before ordering.</p>`,
      };

    case "review":
      return reviewContent();
  }
}

function reviewContent(): { title: string; intro?: string; body: string } {
  const a = quick.answers;
  const cuisine = cuisineInfo(a.cuisine)!;
  const mealType = MEAL_TYPES.find((m) => m.id === a.mealType)!;
  const meals = suitableMeals(a);
  const meal = meals.length ? meals[quick.mealOffset % meals.length] : null;
  const tea = MENU.find((item) => item.id === a.tea);
  const extras = EXTRAS.filter((x) => a.extras.has(x.id));

  const line = (item: Product, accent: string) => `
    <li class="${accent}">
      <span>${item.emoji} ${item.name}<small>${item.description}</small></span>
      <span class="qo-price">${formatPrice(item.price)}</span>
    </li>`;

  let mealHtml: string;
  if (meal) {
    mealHtml = `
      <ul class="qo-review">${line(meal, `cuisine-${meal.cuisine}`)}</ul>
      ${meals.length > 1
        ? `<button type="button" class="link-button" id="qo-another">🔀 Show me another (${meals.length} options suit you)</button>`
        : ""}`;
  } else {
    mealHtml = `
      <p class="qo-warning">No ${mealType.label.toLowerCase()}s on the ${cuisine.name} menu suit your dietary needs.
        <button type="button" class="link-button" data-qo-goto="0">Change meal type</button> or
        <button type="button" class="link-button" data-qo-goto="1">try another cuisine</button>.</p>`;
  }

  const teaProblems = tea ? conflicts(tea, a.diets, a.allergies).filter((r) => r !== "spicy") : [];
  const teaWarning = teaProblems.length
    ? `<p class="qo-warning">⚠️ ${tea!.name} is ${teaProblems.join(", ")}.
         <button type="button" class="link-button" data-qo-goto="2">Change tea</button></p>`
    : "";

  const items: Product[] = [meal, tea, ...extras].filter((x): x is Product => Boolean(x));
  const total = items.reduce((sum, item) => sum + item.price, 0);
  const notes = dietaryLines(currentDietary());

  return {
    title: "Here's your quick order",
    intro: `${cuisine.flag} ${cuisine.name} · ${mealType.label}`,
    body: `
      <h3 class="qo-subhead">Your meal</h3>
      ${mealHtml}
      <h3 class="qo-subhead">Tea &amp; extras</h3>
      ${tea || extras.length
        ? `<ul class="qo-review">${tea ? line(tea, `cuisine-${tea.cuisine}`) : ""}${extras.map((x) => line(x, "extra-item")).join("")}</ul>`
        : `<p class="qo-none">None</p>`}
      ${teaWarning}
      ${notes.length
        ? `<div class="notes-box"><h3>Dietary &amp; allergy notes</h3><ul>${notes.map((n) => `<li>${n}</li>`).join("")}</ul></div>`
        : ""}
      <div class="qo-total"><span>Adds to your basket</span><span>${formatPrice(total)}</span></div>`,
  };
}

function currentDietary(): DietaryInfo {
  const a = quick.answers;
  return { diets: [...a.diets], allergies: [...a.allergies], other: a.other };
}

// ───────────── Rendering & navigation ─────────────

function quickDialog(): HTMLDialogElement {
  return byId<HTMLDialogElement>("quick-order");
}

function renderQuickOrder(): void {
  const step = QUICK_STEPS[quick.step];
  const { title, intro, body } = stepContent(step);
  const isReview = step === "review";

  let submitLabel = "Next";
  let submitDisabled = false;
  if (isReview) {
    const hasMeal = suitableMeals(quick.answers).length > 0;
    const hasOthers = (quick.answers.tea && quick.answers.tea !== "none") || quick.answers.extras.size > 0;
    submitLabel = hasMeal ? "Add to my order" : "Add tea & extras only";
    submitDisabled = !hasMeal && !hasOthers;
  }

  quickDialog().innerHTML = `
    <form class="qo-form" id="qo-form" novalidate>
      <div class="qo-header">
        <p class="qo-step-label">Quick order · Step ${quick.step + 1} of ${QUICK_STEPS.length}</p>
        <button type="button" class="qo-close" id="qo-close" aria-label="Close quick order">×</button>
      </div>
      <div class="qo-progress" aria-hidden="true">
        <span style="width: ${((quick.step + 1) / QUICK_STEPS.length) * 100}%"></span>
      </div>
      <h2 id="quick-order-title" tabindex="-1">${title}</h2>
      ${intro ? `<p class="qo-intro">${intro}</p>` : ""}
      <div class="qo-body">${body}</div>
      <p class="error" id="qo-error" role="alert"></p>
      <div class="qo-nav">
        ${quick.step > 0 ? `<button type="button" class="secondary-button" id="qo-back">Back</button>` : ""}
        <button type="submit" class="primary-button" ${submitDisabled ? "disabled" : ""}>${submitLabel}</button>
      </div>
    </form>`;

  quickDialog().querySelector<HTMLElement>("#quick-order-title")?.focus();
}

/** Saves the answers on the current step. Returns an error message if a required answer is missing. */
function saveStep(form: HTMLFormElement): string | null {
  const a = quick.answers;
  const data = new FormData(form);
  const value = (name: string) => data.get(name) as string | null;

  switch (QUICK_STEPS[quick.step]) {
    case "meal":
      if (!value("mealType")) return "Please choose microwave or freshly cooked.";
      a.mealType = value("mealType") as MealType;
      break;
    case "cuisine": {
      const cuisine = value("cuisine") as Cuisine | null;
      if (!cuisine) return "Please choose a cuisine.";
      if (cuisine !== a.cuisine) a.tea = null; // teas differ per cuisine
      a.cuisine = cuisine;
      break;
    }
    case "tea":
      if (!value("tea")) return "Please choose a tea, or “No tea, thanks”.";
      a.tea = value("tea");
      break;
    case "extras":
      a.extras = new Set(data.getAll("extras") as string[]);
      break;
    case "dietary":
      a.diets = new Set(data.getAll("diets") as Diet[]);
      a.allergies = new Set(data.getAll("allergies") as Allergen[]);
      a.other = (value("other") ?? "").trim();
      break;
    case "review":
      break;
  }
  return null;
}

function goToStep(step: number): void {
  if (QUICK_STEPS[step] === "review") {
    const count = Math.max(suitableMeals(quick.answers).length, 1);
    quick.mealOffset = Math.floor(Math.random() * count);
  }
  quick.step = step;
  renderQuickOrder();
}

function openQuickOrder(): void {
  quick.answers = newAnswers();
  quick.step = 0;
  renderQuickOrder();
  quickDialog().showModal();
}

function finishQuickOrder(): void {
  const a = quick.answers;
  const meals = suitableMeals(a);
  const meal = meals.length ? meals[quick.mealOffset % meals.length] : null;
  const ids = [meal?.id, a.tea !== "none" ? a.tea : null, ...a.extras].filter((id): id is string => Boolean(id));

  addItemsToOrder(ids, currentDietary());
  quickDialog().close();
  scrollToOrder();
}

function bindQuickOrder(): void {
  const dialog = quickDialog();
  byId("quick-order-button").addEventListener("click", openQuickOrder);

  dialog.addEventListener("submit", (event) => {
    event.preventDefault();
    const form = event.target as HTMLFormElement;
    const error = saveStep(form);
    if (error) {
      byId("qo-error").textContent = error;
      return;
    }
    if (QUICK_STEPS[quick.step] === "review") finishQuickOrder();
    else goToStep(quick.step + 1);
  });

  dialog.addEventListener("click", (event) => {
    const target = event.target as HTMLElement;
    const form = byId<HTMLFormElement>("qo-form");

    if (target.closest("#qo-close")) {
      dialog.close();
    } else if (target.closest("#qo-back")) {
      saveStep(form); // keep whatever they picked on this step
      goToStep(quick.step - 1);
    } else if (target.closest("#qo-another")) {
      quick.mealOffset += 1;
      renderQuickOrder();
    } else if (target.closest("[data-qo-goto]")) {
      goToStep(Number(target.closest<HTMLElement>("[data-qo-goto]")!.dataset.qoGoto));
    } else if (target === dialog) {
      dialog.close(); // clicked the backdrop
    }
  });

  // Clear the "please choose" message as soon as they pick something.
  dialog.addEventListener("change", () => {
    const error = document.getElementById("qo-error");
    if (error) error.textContent = "";
  });
}

bindQuickOrder();
