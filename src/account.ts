// Accounts: log in, create an account (with dietary requirements) and log out.
// The site has no server, so accounts are kept in this browser's localStorage.
// Passwords are stored exactly as typed. That's fine for a demo but never for a real site.
// Uses helpers from app.ts and checkChip() from quick-order.ts (both loaded first).

const ACCOUNTS_KEY = "fiveKitchens.accounts";
const SESSION_KEY = "fiveKitchens.currentUser";

interface Account {
  email: string;
  password: string;
  dietary: DietaryInfo;
}

type AccountView = "login" | "signup" | "profile" | "editDietary";

// ───────────── Storage ─────────────

/** All accounts, keyed by lower-case email. */
function loadAccounts(): Record<string, Account> {
  try {
    const parsed = JSON.parse(storageGet(ACCOUNTS_KEY) ?? "{}");
    return parsed && typeof parsed === "object" ? parsed : {};
  } catch {
    return {};
  }
}

function saveAccounts(accounts: Record<string, Account>): void {
  storageSet(ACCOUNTS_KEY, JSON.stringify(accounts));
}

function accountKey(email: string): string {
  return email.trim().toLowerCase();
}

function currentAccount(): Account | null {
  const key = storageGet(SESSION_KEY);
  return key ? loadAccounts()[key] ?? null : null;
}

/** Called by saveDietary() in app.ts, so a logged-in account always has the latest requirements. */
function saveAccountDietary(dietary: DietaryInfo): void {
  const key = storageGet(SESSION_KEY);
  if (!key) return;
  const accounts = loadAccounts();
  if (!accounts[key]) return;
  accounts[key].dietary = dietary;
  saveAccounts(accounts);
}

// ───────────── Checking the form ─────────────

function checkEmailAndPassword(email: string, password: string): string | null {
  if (!email) return "Please enter your email address.";
  if (!email.includes("@")) return "Please enter an email address with an @ in it.";
  if (!password) return "Please enter a password.";
  return null;
}

// ───────────── Building each view ─────────────

function emailAndPasswordFields(view: "login" | "signup"): string {
  return `
    <div class="field">
      <label for="acc-email">Email</label>
      <input id="acc-email" name="email" type="email" autocomplete="email">
    </div>
    <div class="field">
      <label for="acc-password">Password</label>
      <input id="acc-password" name="password" type="password"
        autocomplete="${view === "login" ? "current-password" : "new-password"}">
    </div>`;
}

/** Tick boxes for diets and allergies plus a free-text box, pre-filled from `d`. */
function dietaryFields(d: DietaryInfo): string {
  return `
    <fieldset class="qo-group">
      <legend>Dietary requirements</legend>
      <div class="qo-checks">${DIET_OPTIONS.map((o) =>
        checkChip("diets", o.id, d.diets.includes(o.id), o.label, o.hint)).join("")}</div>
    </fieldset>
    <fieldset class="qo-group">
      <legend>Allergies</legend>
      <div class="qo-checks">${ALLERGY_OPTIONS.map((o) =>
        checkChip("allergies", o.id, d.allergies.includes(o.id), o.label)).join("")}</div>
    </fieldset>
    <div class="field">
      <label for="acc-other">Anything else the kitchen should know? <span class="optional">(optional)</span></label>
      <input id="acc-other" name="other" value="${escapeHtml(d.other)}" maxlength="200"
        placeholder="e.g. sulphites, celery, no coriander">
    </div>`;
}

function dietaryFromForm(data: FormData): DietaryInfo {
  return {
    diets: data.getAll("diets") as Diet[],
    allergies: data.getAll("allergies") as Allergen[],
    other: String(data.get("other") ?? "").trim(),
  };
}

function accountView(view: AccountView): { title: string; body: string } {
  switch (view) {
    case "login":
      return {
        title: "Log in",
        body: `
          ${emailAndPasswordFields("login")}
          <p class="error" id="account-error" role="alert"></p>
          <button type="submit" class="primary-button">Log in</button>
          <p class="account-switch">Don't have an account?
            <button type="button" class="link-button" data-account-view="signup">Create a new account</button></p>`,
      };

    case "signup":
      return {
        title: "Create an account",
        body: `
          ${emailAndPasswordFields("signup")}
          ${dietaryFields(state.dietary) /* start from whatever they've already told us, e.g. in the quick order */}
          <p class="error" id="account-error" role="alert"></p>
          <button type="submit" class="primary-button">Create account</button>
          <p class="account-switch">Already have an account?
            <button type="button" class="link-button" data-account-view="login">Log in</button></p>`,
      };

    case "editDietary":
      return {
        title: "Edit dietary requirements",
        body: `
          ${dietaryFields(currentAccount()!.dietary)}
          <p class="qo-small-print">We'll use these to choose your quick order meals and pass them on to the kitchen.</p>
          <div class="qo-nav">
            <button type="button" class="secondary-button" data-account-view="profile">Cancel</button>
            <button type="submit" class="primary-button">Save changes</button>
          </div>`,
      };

    case "profile": {
      const account = currentAccount()!;
      const notes = dietaryLines(account.dietary);
      return {
        title: "Your account",
        body: `
          <p class="account-email">Logged in as <strong>${escapeHtml(account.email)}</strong></p>
          <div class="notes-box">
            <h3>Dietary requirements</h3>
            ${notes.length
              ? `<ul>${notes.map((n) => `<li>${n}</li>`).join("")}</ul>`
              : `<p class="qo-none">None saved.</p>`}
            <button type="button" class="link-button" data-account-view="editDietary">Edit dietary requirements</button>
          </div>
          <button type="button" class="secondary-button" id="account-logout">Log out</button>`,
      };
    }
  }
}

// ───────────── Rendering ─────────────

function accountDialog(): HTMLDialogElement {
  return byId<HTMLDialogElement>("account");
}

function renderAccount(view: AccountView): void {
  const { title, body } = accountView(view);
  accountDialog().innerHTML = `
    <form class="qo-form" id="account-form" data-view="${view}" novalidate>
      <div class="qo-header">
        <p class="qo-step-label">Five Kitchens account</p>
        <button type="button" class="qo-close" id="account-close" aria-label="Close">×</button>
      </div>
      <h2 id="account-title" tabindex="-1">${title}</h2>
      <div class="qo-body">${body}</div>
    </form>`;
  const firstInput = accountDialog().querySelector<HTMLElement>("input");
  (firstInput ?? accountDialog().querySelector<HTMLElement>("#account-title"))?.focus();
}

/** Header button: "Log in" when logged out, otherwise the start of the email address. */
function renderAccountButton(): void {
  const account = currentAccount();
  byId("account-button-label").textContent = account ? account.email.split("@")[0] || account.email : "Log in";
  byId("account-button").setAttribute("aria-label", account ? `Your account (${account.email})` : "Log in");
}

function openAccount(): void {
  renderAccount(currentAccount() ? "profile" : "login");
  accountDialog().showModal();
}

// ───────────── Actions ─────────────

/** Makes this account the logged-in one and applies its dietary requirements to the order. */
function startSession(key: string, account: Account): void {
  storageSet(SESSION_KEY, key);
  state.dietary = { ...account.dietary };
  saveDietary();
  renderCart();
  renderAccountButton();
  accountDialog().close();
}

function logIn(email: string, password: string): string | null {
  const key = accountKey(email);
  const account = loadAccounts()[key];
  if (!account || account.password !== password) return "That email and password don't match an account.";
  startSession(key, account);
  return null;
}

function createAccount(email: string, password: string, data: FormData): string | null {
  const key = accountKey(email);
  const accounts = loadAccounts();
  if (accounts[key]) return "There's already an account with that email. Log in instead.";

  const account: Account = {
    email: email.trim(),
    password,
    dietary: dietaryFromForm(data),
  };
  accounts[key] = account;
  saveAccounts(accounts);
  startSession(key, account);
  return null;
}

/** Saves new dietary requirements to the account and the current order, then shows the account again. */
function updateDietary(data: FormData): void {
  state.dietary = dietaryFromForm(data);
  saveDietary(); // also saves them to the logged-in account
  renderCart();
  renderAccount("profile");
}

function logOut(): void {
  storageSet(SESSION_KEY, "");
  // Don't leave the last person's allergies on a shared device.
  state.dietary = emptyDietary();
  saveDietary();
  renderCart();
  renderAccountButton();
  accountDialog().close();
}

// ───────────── Events ─────────────

function bindAccount(): void {
  const dialog = accountDialog();
  byId("account-button").addEventListener("click", openAccount);

  dialog.addEventListener("submit", (event) => {
    event.preventDefault();
    const form = event.target as HTMLFormElement;
    const data = new FormData(form);
    if (form.dataset.view === "editDietary") {
      updateDietary(data);
      return;
    }

    const email = String(data.get("email") ?? "").trim();
    const password = String(data.get("password") ?? "");

    let error = checkEmailAndPassword(email, password);
    if (!error) error = form.dataset.view === "signup" ? createAccount(email, password, data) : logIn(email, password);
    if (error) byId("account-error").textContent = error;
  });

  dialog.addEventListener("click", (event) => {
    const target = event.target as HTMLElement;
    const switchTo = target.closest<HTMLElement>("[data-account-view]");

    if (target.closest("#account-close") || target === dialog) dialog.close(); // close button or backdrop
    else if (target.closest("#account-logout")) logOut();
    else if (switchTo) renderAccount(switchTo.dataset.accountView as AccountView);
  });

  // Clear the error as soon as they start fixing it.
  dialog.addEventListener("input", () => {
    const error = document.getElementById("account-error");
    if (error) error.textContent = "";
  });

  renderAccountButton();
}

bindAccount();
