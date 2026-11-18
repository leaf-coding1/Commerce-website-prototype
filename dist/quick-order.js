"use strict";
// Quick order: a short step-by-step questionnaire that builds an order for the customer.
// Uses the menu data from data.ts and the basket functions from app.ts (both loaded first).
// The two buttons on the page ("Care for yourself" / "Care for other") decide who it's for.
const NO_DRINK = "none";
const QUICK_STEPS = ["cuisine", "dietary", "meal", "drink", "extras", "review"];
/** The steps this customer sees. Logged-in customers gave their dietary needs when they made
 *  their account (see account.ts), so they skip that step, unless they're ordering for someone else. */
function quickSteps() {
    const usesAccountDietary = currentAccount() !== null && !quick.answers.forSomeoneElse;
    return usesAccountDietary ? QUICK_STEPS.filter((s) => s !== "dietary") : QUICK_STEPS;
}
const quick = {
    step: 0,
    // Blank until the quick order is opened: account.js (currentAccount) hasn't loaded yet at this point.
    answers: newAnswers(false, emptyDietary()),
};
function newAnswers(forSomeoneElse, dietary) {
    return {
        cuisine: null,
        meal: null,
        drink: null,
        extras: new Set(),
        forSomeoneElse,
        giftExtras: new Set(),
        diets: new Set(dietary.diets),
        allergies: new Set(dietary.allergies),
        other: dietary.other,
    };
}
// ───────────── Matching meals to dietary needs ─────────────
/** Reasons an item doesn't suit the customer, e.g. ["not vegan", "contains gluten"]. Empty means it suits. */
function conflicts(item, diets, allergies) {
    const contains = CONTAINS[item.id] ?? [];
    const reasons = [];
    if (diets.has("vegan") && !item.tags.includes("VG"))
        reasons.push("not vegan");
    else if (diets.has("vegetarian") && !item.tags.some((t) => t === "V" || t === "VG"))
        reasons.push("not vegetarian");
    if ((diets.has("halal") || diets.has("noPork")) && contains.includes("pork"))
        reasons.push("contains pork");
    if (diets.has("noBeef") && contains.includes("beef"))
        reasons.push("contains beef");
    for (const allergen of ALLERGY_OPTIONS) {
        if (!allergies.has(allergen.id))
            continue;
        // The menu tags are a second check in case CONTAINS misses something.
        const tagged = ((allergen.id === "peanut" || allergen.id === "treeNut") && item.tags.includes("Nuts")) ||
            ((allergen.id === "fish" || allergen.id === "shellfish") && item.tags.includes("Fish"));
        if (tagged || contains.includes(allergen.id))
            reasons.push(`contains ${allergen.label.toLowerCase()}`);
    }
    return reasons;
}
/** Items of one category from the chosen cuisine that suit the customer's dietary needs. */
function suitableItems(a, category) {
    return MENU.filter((item) => item.cuisine === a.cuisine &&
        item.category === category &&
        conflicts(item, a.diets, a.allergies).length === 0);
}
/** The chosen meal / drink, or null if nothing is chosen or the choice no longer suits
 *  (e.g. they went back and changed cuisine or dietary needs). */
function chosenMeal(a) {
    return suitableItems(a, "quick meal").find((m) => m.id === a.meal) ?? null;
}
function chosenDrink(a) {
    return suitableItems(a, "drink").find((d) => d.id === a.drink) ?? null;
}
function cuisineInfo(id) {
    return CUISINES.find((c) => c.id === id);
}
// ───────────── Building each step ─────────────
function optionCard(type, name, value, checked, icon, title, detail = "", price) {
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
/** A meal or drink as a radio card, with its native name, description and heating time. */
function menuOption(name, item, checked) {
    const detail = [
        item.nativeName ? `<span class="qo-native">${item.nativeName}</span>` : "",
        item.description,
        item.microwaveMinutes ? `⏱️ Microwave ${item.microwaveMinutes} min` : "",
    ].filter(Boolean).join("<br>");
    return optionCard("radio", name, item.id, checked, item.emoji, item.name, detail, item.price);
}
function checkChip(name, value, checked, label, hint = "") {
    return `
    <label class="qo-check">
      <input type="checkbox" name="${name}" value="${value}" ${checked ? "checked" : ""}>
      <span>${label}${hint ? `<small>${hint}</small>` : ""}</span>
    </label>`;
}
function stepContent(step) {
    const a = quick.answers;
    const who = a.forSomeoneElse ? "them" : "you";
    switch (step) {
        case "cuisine":
            return {
                title: a.forSomeoneElse ? "Which cuisine would they like?" : "Which cuisine are you in the mood for?",
                body: `<div class="qo-options" role="radiogroup">${CUISINES.map((c) => optionCard("radio", "cuisine", c.id, a.cuisine === c.id, c.flag, c.name, c.blurb)).join("")}</div>`,
            };
        case "dietary":
            return {
                title: a.forSomeoneElse
                    ? "Does the person you're ordering for have any dietary needs or allergies?"
                    : "Any dietary needs or allergies?",
                intro: `We'll only show meals and drinks that suit ${who}, and pass this on to the kitchen.`,
                body: `
          <fieldset class="qo-group">
            <legend>Dietary needs</legend>
            <div class="qo-checks">${DIET_OPTIONS.map((d) => checkChip("diets", d.id, a.diets.has(d.id), d.label, d.hint)).join("")}</div>
          </fieldset>
          <fieldset class="qo-group">
            <legend>Allergies</legend>
            <div class="qo-checks">${ALLERGY_OPTIONS.map((x) => checkChip("allergies", x.id, a.allergies.has(x.id), x.label)).join("")}</div>
          </fieldset>
          <div class="field">
            <label for="qo-other">Anything else the kitchen should know? <span class="optional">(optional)</span></label>
            <input id="qo-other" name="other" value="${escapeHtml(a.other)}" maxlength="200"
              placeholder="e.g. sulphites, celery, no coriander">
          </div>
          <p class="qo-small-print">Allergen info is a guide. All our kitchens handle nuts, gluten, dairy and seafood,
            so if your allergy is severe please call us before ordering.</p>`,
            };
        case "meal": {
            const cuisine = cuisineInfo(a.cuisine);
            const meals = suitableItems(a, "quick meal");
            return {
                title: `Choose a ${cuisine.name} meal`,
                intro: `${cuisine.flag} Only meals that suit ${a.forSomeoneElse ? "their" : "your"} dietary needs are shown.`,
                body: meals.length
                    ? `<div class="qo-options" role="radiogroup">${meals.map((m) => menuOption("meal", m, a.meal === m.id)).join("")}</div>`
                    : `<p class="qo-warning">No meals on the ${cuisine.name} menu suit these dietary needs.
              <button type="button" class="link-button" data-qo-goto="cuisine">Try another cuisine</button>,
              or carry on to choose just a drink and extras.</p>`,
            };
        }
        case "drink": {
            const cuisine = cuisineInfo(a.cuisine);
            const drinks = suitableItems(a, "drink");
            return {
                title: `Choose a ${cuisine.name} drink`,
                intro: drinks.length ? "Traditional teas and drinks to go with the meal." : undefined,
                body: drinks.length
                    ? `<div class="qo-options" role="radiogroup">
              ${drinks.map((d) => menuOption("drink", d, a.drink === d.id)).join("")}
              ${optionCard("radio", "drink", NO_DRINK, a.drink === NO_DRINK, "🚫", "No drink, thanks")}
            </div>`
                    : `<p class="qo-none">None of the ${cuisine.name} drinks suit these dietary needs, so we'll leave the drink out.</p>`,
            };
        }
        case "extras":
            return {
                title: "Any extras?",
                intro: "Optional: tick as many as you like.",
                body: `
          <div class="qo-options">${EXTRAS.map((x) => optionCard("checkbox", "extras", x.id, a.extras.has(x.id), x.emoji, x.name, x.description, x.price)).join("")}</div>
          ${a.forSomeoneElse
                    ? `<fieldset class="qo-group">
                 <legend>Anything else for their package? <span class="optional">(optional)</span></legend>
                 <div class="qo-options">${GIFT_EXTRAS.map((x) => optionCard("checkbox", "giftExtras", x.id, a.giftExtras.has(x.id), x.emoji, x.name, x.description, x.price)).join("")}</div>
               </fieldset>`
                    : ""}`,
            };
        case "review":
            return reviewContent();
    }
}
/** Everything the quick order will add to the basket: meal, drink and extras. */
function reviewItems(a) {
    const extras = [...EXTRAS.filter((x) => a.extras.has(x.id)), ...chosenGiftExtras(a)];
    return [chosenMeal(a), chosenDrink(a), ...extras].filter((x) => Boolean(x));
}
function reviewContent() {
    const a = quick.answers;
    const cuisine = cuisineInfo(a.cuisine);
    const meal = chosenMeal(a);
    const drink = chosenDrink(a);
    const extras = [...EXTRAS.filter((x) => a.extras.has(x.id)), ...chosenGiftExtras(a)];
    const line = (item, accent) => `
    <li class="${accent}">
      <span>${item.emoji} ${item.name}<small>${item.description}</small></span>
      <span class="qo-price">${formatPrice(item.price)}</span>
    </li>`;
    const change = (step) => `<button type="button" class="link-button" data-qo-goto="${step}">Change</button>`;
    const total = reviewItems(a).reduce((sum, item) => sum + item.price, 0);
    const notes = dietaryLines(currentDietary());
    return {
        title: a.forSomeoneElse ? "Here's their care package" : "Here's your quick order",
        intro: `${cuisine.flag} ${cuisine.name}${a.forSomeoneElse ? " · 🎁 For someone else" : ""}`,
        body: `
      <h3 class="qo-subhead">Meal ${change("meal")}</h3>
      ${meal ? `<ul class="qo-review">${line(meal, `cuisine-${meal.cuisine}`)}</ul>` : `<p class="qo-none">No meal</p>`}
      <h3 class="qo-subhead">Drink ${change("drink")}</h3>
      ${drink ? `<ul class="qo-review">${line(drink, `cuisine-${drink.cuisine}`)}</ul>` : `<p class="qo-none">No drink</p>`}
      <h3 class="qo-subhead">Extras ${change("extras")}</h3>
      ${extras.length
            ? `<ul class="qo-review">${extras.map((x) => line(x, "extra-item")).join("")}</ul>`
            : `<p class="qo-none">None</p>`}
      ${notes.length
            ? `<div class="notes-box"><h3>Dietary &amp; allergy notes${currentAccount() && !a.forSomeoneElse ? " (from your account)" : ""}</h3><ul>${notes.map((n) => `<li>${n}</li>`).join("")}</ul></div>`
            : ""}
      <div class="qo-total"><span>Adds to your basket</span><span>${formatPrice(total)}</span></div>`,
    };
}
/** The card / ribbons they ticked, or none if the order is for themselves. */
function chosenGiftExtras(a) {
    return a.forSomeoneElse ? GIFT_EXTRAS.filter((x) => a.giftExtras.has(x.id)) : [];
}
function currentDietary() {
    const a = quick.answers;
    return { diets: [...a.diets], allergies: [...a.allergies], other: a.other };
}
// ───────────── Rendering & navigation ─────────────
function quickDialog() {
    return byId("quick-order");
}
function renderQuickOrder() {
    const steps = quickSteps();
    const step = steps[quick.step];
    const { title, intro, body } = stepContent(step);
    let submitLabel = "Next";
    let submitDisabled = false;
    let submitClass = "primary-button";
    if (step === "review") {
        // The last button works like the old basket button: 🛒, the total and how many items it adds.
        const items = reviewItems(quick.answers);
        const total = items.reduce((sum, item) => sum + item.price, 0);
        submitClass = "primary-button qo-cart-button";
        submitLabel = `
      <span aria-hidden="true">🛒</span>
      <span>Add to my order</span>
      <span class="qo-cart-total">${formatPrice(total)}</span>
      <span class="badge" aria-label="${items.length} item${items.length === 1 ? "" : "s"}">${items.length}</span>`;
        submitDisabled = items.length === 0;
    }
    quickDialog().innerHTML = `
    <form class="qo-form" id="qo-form" novalidate>
      <div class="qo-header">
        <p class="qo-step-label">${quick.answers.forSomeoneElse ? "Care for other" : "Care for yourself"}
          · Step ${quick.step + 1} of ${steps.length}</p>
        <button type="button" class="qo-close" id="qo-close" aria-label="Close quick order">×</button>
      </div>
      <div class="qo-progress" aria-hidden="true">
        <span style="width: ${((quick.step + 1) / steps.length) * 100}%"></span>
      </div>
      <h2 id="quick-order-title" tabindex="-1">${title}</h2>
      ${intro ? `<p class="qo-intro">${intro}</p>` : ""}
      <div class="qo-body">${body}</div>
      <p class="error" id="qo-error" role="alert"></p>
      <div class="qo-nav">
        ${quick.step > 0 ? `<button type="button" class="secondary-button" id="qo-back">Back</button>` : ""}
        <button type="submit" class="${submitClass}" ${submitDisabled ? "disabled" : ""}>${submitLabel}</button>
      </div>
    </form>`;
    quickDialog().querySelector("#quick-order-title")?.focus();
}
/** Saves the answers on the current step. Returns an error message if a required answer is missing. */
function saveStep(form) {
    const a = quick.answers;
    const data = new FormData(form);
    const value = (name) => data.get(name);
    switch (quickSteps()[quick.step]) {
        case "cuisine": {
            const cuisine = value("cuisine");
            if (!cuisine)
                return "Please choose a cuisine.";
            a.cuisine = cuisine;
            break;
        }
        case "dietary":
            a.diets = new Set(data.getAll("diets"));
            a.allergies = new Set(data.getAll("allergies"));
            a.other = (value("other") ?? "").trim();
            break;
        case "meal": {
            const meal = value("meal");
            if (!meal && suitableItems(a, "quick meal").length)
                return "Please choose a meal.";
            a.meal = meal;
            break;
        }
        case "drink": {
            const drink = value("drink");
            if (!drink && suitableItems(a, "drink").length)
                return "Please choose a drink, or “No drink, thanks”.";
            a.drink = drink;
            break;
        }
        case "extras":
            a.extras = new Set(data.getAll("extras"));
            a.giftExtras = new Set(data.getAll("giftExtras"));
            break;
        case "review":
            break;
    }
    return null;
}
function goToStep(step) {
    quick.step = Math.max(0, step);
    renderQuickOrder();
}
function openQuickOrder(forSomeoneElse) {
    // For themselves: start from the account's saved needs, or (logged out) what they told us last time.
    // For someone else: start blank, since the customer's own needs don't apply.
    const dietary = forSomeoneElse ? emptyDietary() : currentAccount()?.dietary ?? state.dietary;
    quick.answers = newAnswers(forSomeoneElse, dietary);
    quick.step = 0;
    renderQuickOrder();
    quickDialog().showModal();
}
function finishQuickOrder() {
    const a = quick.answers;
    const ids = [chosenMeal(a)?.id, chosenDrink(a)?.id, ...a.extras,
        ...chosenGiftExtras(a).map((x) => x.id)]
        .filter((id) => Boolean(id));
    // Someone else's needs go to the kitchen with this order but aren't saved to the customer's account.
    addItemsToOrder(ids, currentDietary(), !a.forSomeoneElse);
    quickDialog().close();
    openOrderScreen();
}
function bindQuickOrder() {
    const dialog = quickDialog();
    byId("quick-order-button").addEventListener("click", () => openQuickOrder(false));
    byId("quick-order-other-button").addEventListener("click", () => openQuickOrder(true));
    dialog.addEventListener("submit", (event) => {
        event.preventDefault();
        const form = event.target;
        const error = saveStep(form);
        if (error) {
            byId("qo-error").textContent = error;
            return;
        }
        if (quickSteps()[quick.step] === "review")
            finishQuickOrder();
        else
            goToStep(quick.step + 1);
    });
    dialog.addEventListener("click", (event) => {
        const target = event.target;
        const form = byId("qo-form");
        if (target.closest("#qo-close")) {
            dialog.close();
        }
        else if (target.closest("#qo-back")) {
            saveStep(form); // keep whatever they picked on this step
            goToStep(quick.step - 1);
        }
        else if (target.closest("[data-qo-goto]")) {
            const step = target.closest("[data-qo-goto]").dataset.qoGoto;
            goToStep(quickSteps().indexOf(step));
        }
        else if (target === dialog) {
            dialog.close(); // clicked the backdrop
        }
    });
    // Clear the "please choose" message as soon as they pick something.
    dialog.addEventListener("change", () => {
        const error = document.getElementById("qo-error");
        if (error)
            error.textContent = "";
    });
}
bindQuickOrder();
//# sourceMappingURL=quick-order.js.map