// ==================== 05.05 · ACCOUNTS, LOGIN & BACKUPS ====================
// 05.05.1 · Komplett-Backup
function isLifeOsBackupKey(k) {
  return (
    !!k &&
    (k.startsWith("lifeos:") ||
      k.startsWith("lifeos_accounts_") ||
      k.startsWith("lifeos_active_account_") ||
      k.startsWith("lifeos_account_profile_"))
  );
}
function getFullAccountDataObj() {
  try {
    saveCurrentLocalAccountSnapshot();
  } catch (e) {}
  const data = {
    _version: "4.0",
    _type: "LifeOS-Komplettkonto",
    _exported: new Date().toISOString(),
  };
  for (let i = 0; i < localStorage.length; i++) {
    const k = localStorage.key(i);
    if (isLifeOsBackupKey(k)) data[k] = localStorage.getItem(k);
  }
  return data;
}

// 05.05.2 · Dauerhafter lokaler Account-Vault
const LOCAL_ACCOUNTS_KEY = "lifeos_accounts_v1";
const LOCAL_ACTIVE_ACCOUNT_KEY = "lifeos_active_account_v1";
const LOCAL_ACCOUNTS_BACKUP_KEY = "lifeos_accounts_permanent_backup_v2";
const LOCAL_ACTIVE_BACKUP_KEY = "lifeos_active_account_permanent_v2";
const LOCAL_LOGGED_OUT_KEY = "lifeos_account_logged_out_v2";
const LOCAL_ACCOUNT_ITEM_PREFIX = "lifeos_account_profile_v2_";
let _localAccountSyncBusy = false;

function parseAccountArray(raw) {
  try {
    const data = JSON.parse(raw || "[]");
    return Array.isArray(data) ? data : [];
  } catch (e) {
    return [];
  }
}
function readLocalAccounts() {
  const sources = [
    ...parseAccountArray(localStorage.getItem(LOCAL_ACCOUNTS_KEY)),
    ...parseAccountArray(localStorage.getItem(LOCAL_ACCOUNTS_BACKUP_KEY)),
  ];
  for (let i = 0; i < localStorage.length; i++) {
    const k = localStorage.key(i);
    if (k && k.startsWith(LOCAL_ACCOUNT_ITEM_PREFIX)) {
      try {
        const a = JSON.parse(localStorage.getItem(k));
        if (a && a.id) sources.push(a);
      } catch (e) {}
    }
  }
  const map = {};
  sources.forEach((a) => {
    if (!a || !a.id) return;
    const old = map[a.id],
      oldTime = old?.lastActive || old?.createdAt || "",
      newTime = a.lastActive || a.createdAt || "";
    if (!old || newTime >= oldTime) map[a.id] = a;
  });
  return Object.values(map);
}
function backupAccountsToIndexedDB(accounts) {
  try {
    if (!window.indexedDB) return;
    const req = indexedDB.open("LifeOSPermanentAccountVault", 1);
    req.onupgradeneeded = () => {
      const db = req.result;
      if (!db.objectStoreNames.contains("vault")) db.createObjectStore("vault");
    };
    req.onsuccess = () => {
      try {
        const tx = req.result.transaction("vault", "readwrite");
        tx.objectStore("vault").put(
          {
            accounts,
            active: getActiveLocalAccountId(),
            savedAt: new Date().toISOString(),
          },
          "main",
        );
      } catch (e) {}
    };
  } catch (e) {}
}
function writeLocalAccounts(accounts) {
  const raw = JSON.stringify(accounts);
  let saved = false;
  try {
    localStorage.setItem(LOCAL_ACCOUNTS_KEY, raw);
    saved = true;
  } catch (e) {}
  try {
    localStorage.setItem(LOCAL_ACCOUNTS_BACKUP_KEY, raw);
    saved = true;
  } catch (e) {}
  const validIds = new Set(accounts.map((a) => a.id));
  try {
    const stale = [];
    for (let i = 0; i < localStorage.length; i++) {
      const k = localStorage.key(i);
      if (
        k &&
        k.startsWith(LOCAL_ACCOUNT_ITEM_PREFIX) &&
        !validIds.has(k.slice(LOCAL_ACCOUNT_ITEM_PREFIX.length))
      )
        stale.push(k);
    }
    stale.forEach((k) => localStorage.removeItem(k));
  } catch (e) {}
  accounts.forEach((a) => {
    try {
      localStorage.setItem(LOCAL_ACCOUNT_ITEM_PREFIX + a.id, JSON.stringify(a));
    } catch (e) {}
  });
  backupAccountsToIndexedDB(accounts);
  if (!saved)
    alert(
      "Das Konto konnte nicht gespeichert werden. Bitte prüfe den freien Browser-Speicher.",
    );
  return saved;
}
function setActiveLocalAccountId(id) {
  if (!id) return clearActiveLocalAccountId();
  try {
    localStorage.setItem(LOCAL_ACTIVE_ACCOUNT_KEY, id);
    localStorage.setItem(LOCAL_ACTIVE_BACKUP_KEY, id);
    localStorage.removeItem(LOCAL_LOGGED_OUT_KEY);
  } catch (e) {}
  try {
    document.cookie = `lifeos_active_account=${encodeURIComponent(id)};max-age=315360000;path=/;SameSite=Lax`;
  } catch (e) {}
  backupAccountsToIndexedDB(readLocalAccounts());
}
function clearActiveLocalAccountId() {
  try {
    localStorage.removeItem(LOCAL_ACTIVE_ACCOUNT_KEY);
    localStorage.removeItem(LOCAL_ACTIVE_BACKUP_KEY);
    localStorage.setItem(LOCAL_LOGGED_OUT_KEY, "1");
  } catch (e) {}
  try {
    document.cookie = "lifeos_active_account=;max-age=0;path=/;SameSite=Lax";
  } catch (e) {}
  backupAccountsToIndexedDB(readLocalAccounts());
}
function getActiveLocalAccountId() {
  let id = "";
  try {
    id =
      localStorage.getItem(LOCAL_ACTIVE_ACCOUNT_KEY) ||
      localStorage.getItem(LOCAL_ACTIVE_BACKUP_KEY) ||
      "";
  } catch (e) {}
  if (!id) {
    try {
      const m = document.cookie.match(/(?:^|; )lifeos_active_account=([^;]+)/);
      if (m) id = decodeURIComponent(m[1]);
    } catch (e) {}
  }
  return id;
}
function getActiveLocalAccount() {
  const id = getActiveLocalAccountId();
  return id ? readLocalAccounts().find((a) => a.id === id) || null : null;
}
function restoreAccountsFromIndexedDB() {
  return new Promise((resolve) => {
    try {
      if (!window.indexedDB) return resolve(false);
      const req = indexedDB.open("LifeOSPermanentAccountVault", 1);
      req.onupgradeneeded = () => {
        const db = req.result;
        if (!db.objectStoreNames.contains("vault"))
          db.createObjectStore("vault");
      };
      req.onerror = () => resolve(false);
      req.onsuccess = () => {
        try {
          const get = req.result
            .transaction("vault", "readonly")
            .objectStore("vault")
            .get("main");
          get.onerror = () => resolve(false);
          get.onsuccess = () => {
            const vault = get.result;
            if (vault?.accounts?.length) {
              const merged = [...readLocalAccounts(), ...vault.accounts],
                map = {};
              merged.forEach((a) => {
                if (!a?.id) return;
                const old = map[a.id],
                  oldTime = old?.lastActive || old?.createdAt || "",
                  newTime = a.lastActive || a.createdAt || "";
                if (!old || newTime > oldTime) map[a.id] = a;
              });
              writeLocalAccounts(Object.values(map));
              if (
                !getActiveLocalAccountId() &&
                vault.active &&
                localStorage.getItem(LOCAL_LOGGED_OUT_KEY) !== "1"
              )
                setActiveLocalAccountId(vault.active);
              resolve(true);
            } else resolve(false);
          };
        } catch (e) {
          resolve(false);
        }
      };
    } catch (e) {
      resolve(false);
    }
  });
}
async function ensureDurableAccountsLoaded() {
  try {
    if (navigator.storage?.persist) navigator.storage.persist().catch(() => {});
    await Promise.race([
      restoreAccountsFromIndexedDB(),
      new Promise((r) => setTimeout(() => r(false), 500)),
    ]);
    const accounts = readLocalAccounts();
    if (accounts.length) writeLocalAccounts(accounts);
  } catch (e) {}
}
function escapeAccountHtml(value) {
  return String(value == null ? "" : value).replace(
    /[&<>"']/g,
    (c) =>
      ({
        "&": "&amp;",
        "<": "&lt;",
        ">": "&gt;",
        '"': "&quot;",
        "'": "&#39;",
      })[c],
  );
}
function collectLifeOsProfileData() {
  const data = {};
  for (let i = 0; i < localStorage.length; i++) {
    const k = localStorage.key(i);
    if (k && k.startsWith("lifeos:")) data[k] = localStorage.getItem(k);
  }
  return data;
}
function clearLifeOsProfileData() {
  const keys = [];
  for (let i = 0; i < localStorage.length; i++) {
    const k = localStorage.key(i);
    if (k && k.startsWith("lifeos:")) keys.push(k);
  }
  keys.forEach((k) => localStorage.removeItem(k));
}
function restoreLifeOsProfileData(data) {
  if (!data || typeof data !== "object") return;
  Object.keys(data).forEach((k) => {
    if (k.startsWith("lifeos:") && typeof data[k] === "string")
      localStorage.setItem(k, data[k]);
  });
}
function syncActiveLocalAccountKey(storageKey, rawValue) {
  if (_localAccountSyncBusy || !storageKey || !storageKey.startsWith("lifeos:"))
    return;
  const activeId = getActiveLocalAccountId();
  if (!activeId) return;
  const accounts = readLocalAccounts();
  const idx = accounts.findIndex((a) => a.id === activeId);
  if (idx < 0) return;
  accounts[idx].data = accounts[idx].data || {};
  accounts[idx].data[storageKey] = rawValue;
  accounts[idx].lastActive = new Date().toISOString();
  if (storageKey === "lifeos:player-name") {
    try {
      accounts[idx].displayName =
        JSON.parse(rawValue) || accounts[idx].displayName;
    } catch (e) {}
  }
  writeLocalAccounts(accounts);
}
function saveCurrentLocalAccountSnapshot() {
  const activeId = getActiveLocalAccountId();
  if (!activeId) return false;
  const accounts = readLocalAccounts();
  const idx = accounts.findIndex((a) => a.id === activeId);
  if (idx < 0) return false;
  accounts[idx].data = collectLifeOsProfileData();
  accounts[idx].displayName = getPlayerName() || accounts[idx].displayName;
  accounts[idx].lastActive = new Date().toISOString();
  return writeLocalAccounts(accounts);
}
function randomAccountSalt() {
  try {
    const bytes = new Uint8Array(16);
    crypto.getRandomValues(bytes);
    return Array.from(bytes)
      .map((b) => b.toString(16).padStart(2, "0"))
      .join("");
  } catch (e) {
    return Math.random().toString(36).slice(2) + Date.now().toString(36);
  }
}
function hashPortablePassword(password, salt) {
  const value = String(salt) + "|" + String(password);
  let h1 = 0xdeadbeef,
    h2 = 0x41c6ce57;
  for (let i = 0; i < value.length; i++) {
    const ch = value.charCodeAt(i);
    h1 = Math.imul(h1 ^ ch, 2654435761);
    h2 = Math.imul(h2 ^ ch, 1597334677);
  }
  return (
    (h1 >>> 0).toString(16).padStart(8, "0") +
    (h2 >>> 0).toString(16).padStart(8, "0")
  ).repeat(4);
}
async function hashLocalPassword(password, salt) {
  const value = String(salt) + "|" + String(password);
  try {
    if (crypto && crypto.subtle && window.TextEncoder) {
      const digest = await crypto.subtle.digest(
        "SHA-256",
        new TextEncoder().encode(value),
      );
      return Array.from(new Uint8Array(digest))
        .map((b) => b.toString(16).padStart(2, "0"))
        .join("");
    }
  } catch (e) {}
  return hashPortablePassword(password, salt);
}
function normalizeAccountUsername(value) {
  return String(value || "")
    .trim()
    .toLowerCase()
    .replace(/[^a-z0-9._-]/g, "");
}
function setAccountError(id, message) {
  const el = document.getElementById(id);
  if (el) el.textContent = message || "";
}
function toggleLocalPassword(inputId, button) {
  const input = document.getElementById(inputId);
  if (!input) return;
  input.type = input.type === "password" ? "text" : "password";
  if (button) button.textContent = input.type === "password" ? "👁" : "🙈";
}
function setAccountGateMode(mode) {
  const create = mode !== "login";
  document
    .getElementById("gate-create-panel")
    ?.classList.toggle("hidden", !create);
  document
    .getElementById("gate-login-panel")
    ?.classList.toggle("hidden", create);
  document
    .getElementById("gate-tab-create")
    ?.classList.toggle("active", create);
  document
    .getElementById("gate-tab-login")
    ?.classList.toggle("active", !create);
  const copy = document.getElementById("account-gate-copy");
  if (copy)
    copy.textContent = create
      ? "Erstelle dein Konto und bleib automatisch angemeldet."
      : "Melde dich mit deinem Benutzernamen und Passwort an.";
  if (!create) renderKnownLocalAccounts();
  setTimeout(
    () =>
      document
        .getElementById(create ? "gate-create-name" : "gate-login-user")
        ?.focus(),
    120,
  );
}
function renderKnownLocalAccounts() {
  const host = document.getElementById("gate-known-accounts");
  if (!host) return;
  const accounts = readLocalAccounts();
  if (!accounts.length) {
    host.classList.remove("hidden");
    host.innerHTML =
      '<p class="text-[10px] text-left p-2.5 rounded-[11px]" style="color:#FBBF24;background:rgba(251,191,36,.06);border:1px solid rgba(251,191,36,.18)">Auf dieser Website-Adresse wurde noch kein Konto gefunden. Falls du die Netlify-URL geändert hast, lade deine Konto-Datei.</p>';
    return;
  }
  host.classList.remove("hidden");
  host.innerHTML = `<p class="font-mono text-[8px] text-left mb-1.5" style="color:#666">KONTO AUF DIESEM GERÄT AUSWÄHLEN</p><div class="flex flex-wrap gap-1.5">${accounts.map((a) => `<button type="button" onclick="selectKnownLocalAccount('${a.id}')" class="px-2.5 py-1.5 rounded-[10px] text-[10px] font-bold" style="background:#171717;border:1px solid #303030;color:#E5E5E5">${escapeAccountHtml(a.displayName || a.username)} <span style="color:#777">@${escapeAccountHtml(a.username)}</span></button>`).join("")}</div>`;
}
function selectKnownLocalAccount(id) {
  const a = readLocalAccounts().find((x) => x.id === id);
  if (!a) return;
  const input = document.getElementById("gate-login-user");
  if (input) input.value = a.username;
  document.getElementById("gate-login-pass")?.focus();
}
async function verifyLocalAccountPassword(account, password) {
  if (!account || !password) return false;
  const secure = await hashLocalPassword(password, account.salt),
    portable = hashPortablePassword(password, account.salt);
  return (
    secure === account.passwordHash ||
    portable === account.passwordHash ||
    portable === account.passwordHashPortable ||
    secure === account.passwordHashSecure
  );
}
async function repairLocalLogin() {
  let accounts = readLocalAccounts(),
    username = normalizeAccountUsername(
      document.getElementById("gate-login-user")?.value || "",
    );
  let account = accounts.find((a) => a.username === username);
  if (!account && accounts.length === 1) account = accounts[0];
  if (!account) {
    setAccountGateMode("create");
    const user = document.getElementById("gate-create-user");
    if (user) user.value = username;
    setAccountError(
      "gate-create-error",
      "Auf dieser URL existiert das alte Konto nicht. Erstelle es neu oder lade deine Konto-Datei.",
    );
    return;
  }
  if (
    !confirm(
      `Passwort für @${account.username} auf diesem Gerät neu setzen? Dein gespeicherter Fortschritt bleibt erhalten.`,
    )
  )
    return;
  const next = prompt("Neues Passwort (mindestens 4 Zeichen):", "");
  if (next === null) return;
  if (next.length < 4)
    return alert("Das neue Passwort braucht mindestens 4 Zeichen.");
  const salt = randomAccountSalt(),
    secure = await hashLocalPassword(next, salt),
    portable = hashPortablePassword(next, salt);
  account.salt = salt;
  account.passwordHash = secure;
  account.passwordHashSecure = secure;
  account.passwordHashPortable = portable;
  account.lastActive = new Date().toISOString();
  const idx = accounts.findIndex((a) => a.id === account.id);
  accounts[idx] = account;
  writeLocalAccounts(accounts);
  setActiveLocalAccountId(account.id);
  _localAccountSyncBusy = true;
  clearLifeOsProfileData();
  restoreLifeOsProfileData(account.data || {});
  localStorage.setItem(
    "lifeos:player-name",
    JSON.stringify(account.displayName || account.username),
  );
  _localAccountSyncBusy = false;
  alert("✓ Login repariert. Du wirst jetzt angemeldet.");
  completeLocalAccountAccess("gate");
}

function completeLocalAccountAccess(source) {
  if (source === "gate") {
    const gate = document.getElementById("account-gate");
    if (gate) {
      gate.style.opacity = "0";
      gate.style.transition = "opacity .3s ease";
    }
    setTimeout(() => {
      if (gate) {
        gate.classList.add("hidden");
        gate.style.display = "none";
      }
      enterApp();
    }, 280);
  } else {
    location.reload();
  }
}
// 05.05.3 · Konto erstellen, anmelden und reparieren
async function createLocalAccount(source = "modal") {
  const prefix = source === "gate" ? "gate-create" : "modal-create";
  const displayName = (document.getElementById(prefix + "-name")?.value || "")
    .trim()
    .slice(0, 18);
  const username = normalizeAccountUsername(
    document.getElementById(prefix + "-user")?.value || "",
  );
  const password = document.getElementById(prefix + "-pass")?.value || "";
  const errorId = prefix + "-error";
  setAccountError(errorId, "");
  if (displayName.length < 1)
    return setAccountError(errorId, "Bitte gib deinen Anzeigenamen ein.");
  if (username.length < 3)
    return setAccountError(
      errorId,
      "Der Benutzername braucht mindestens 3 Zeichen.",
    );
  if (password.length < 4)
    return setAccountError(
      errorId,
      "Das Passwort braucht mindestens 4 Zeichen.",
    );
  let accounts = readLocalAccounts();
  if (accounts.some((a) => a.username === username))
    return setAccountError(
      errorId,
      "Dieser Benutzername existiert auf diesem Gerät bereits.",
    );

  const previousId = getActiveLocalAccountId();
  if (previousId) saveCurrentLocalAccountSnapshot();
  const claimExistingData = !previousId && accounts.length === 0;
  const profileData = claimExistingData ? collectLifeOsProfileData() : {};
  if (!claimExistingData) {
    _localAccountSyncBusy = true;
    clearLifeOsProfileData();
    _localAccountSyncBusy = false;
  }
  profileData["lifeos:player-name"] = JSON.stringify(displayName);
  localStorage.setItem("lifeos:player-name", JSON.stringify(displayName));

  const salt = randomAccountSalt();
  const passwordHash = await hashLocalPassword(password, salt),
    passwordHashPortable = hashPortablePassword(password, salt);
  const account = {
    id:
      "account-" +
      Date.now().toString(36) +
      "-" +
      Math.random().toString(36).slice(2, 8),
    username,
    displayName,
    salt,
    passwordHash,
    passwordHashSecure: passwordHash,
    passwordHashPortable,
    createdAt: new Date().toISOString(),
    lastActive: new Date().toISOString(),
    data: profileData,
  };
  accounts.push(account);
  if (!writeLocalAccounts(accounts)) return;
  setActiveLocalAccountId(account.id);
  try {
    launchConfetti();
  } catch (e) {}
  completeLocalAccountAccess(source);
}
async function loginLocalAccount(source = "modal") {
  const prefix = source === "gate" ? "gate-login" : "modal-login",
    username = normalizeAccountUsername(
      document.getElementById(prefix + "-user")?.value || "",
    ),
    password = document.getElementById(prefix + "-pass")?.value || "",
    errorId = prefix + "-error",
    button = document.getElementById(
      source === "gate" ? "gate-login-submit" : "modal-login-submit",
    );
  setAccountError(errorId, "");
  if (!username)
    return setAccountError(errorId, "Bitte gib deinen Benutzernamen ein.");
  if (!password)
    return setAccountError(errorId, "Bitte gib dein Passwort ein.");
  try {
    if (button) {
      button.disabled = true;
      button.textContent = "Wird geprüft …";
    }
    await ensureDurableAccountsLoaded();
    let accounts = readLocalAccounts(),
      account = accounts.find((a) => a.username === username);
    if (!account) {
      setAccountError(
        errorId,
        "Konto auf dieser Website-Adresse nicht gefunden. Nutze „Login reparieren“ oder lade die Konto-Datei.",
      );
      if (source === "gate") renderKnownLocalAccounts();
      return;
    }
    if (!(await verifyLocalAccountPassword(account, password))) {
      setAccountError(
        errorId,
        "Passwort stimmt nicht. Tippe auf „Login reparieren“, um es lokal zurückzusetzen.",
      );
      return;
    }
    // Upgrade old account hashes so future logins work in every browser context.
    const secure = await hashLocalPassword(password, account.salt),
      portable = hashPortablePassword(password, account.salt);
    account.passwordHash = secure;
    account.passwordHashSecure = secure;
    account.passwordHashPortable = portable;
    if (getActiveLocalAccountId()) saveCurrentLocalAccountSnapshot();
    _localAccountSyncBusy = true;
    clearLifeOsProfileData();
    restoreLifeOsProfileData(account.data || {});
    localStorage.setItem(
      "lifeos:player-name",
      JSON.stringify(account.displayName || account.username),
    );
    setActiveLocalAccountId(account.id);
    _localAccountSyncBusy = false;
    account.lastActive = new Date().toISOString();
    const idx = accounts.findIndex((a) => a.id === account.id);
    accounts[idx] = account;
    writeLocalAccounts(accounts);
    completeLocalAccountAccess(source);
  } catch (err) {
    console.error("Life OS login failed", err);
    setAccountError(
      errorId,
      "Anmeldung fehlgeschlagen. Bitte „Login reparieren“ verwenden.",
    );
  } finally {
    if (button) {
      button.disabled = false;
      button.textContent = "Einloggen";
    }
  }
}
function openCreateLocalAccountModal() {
  openModalHTML(`
    <div class="flex justify-between items-center"><div><p class="font-mono text-[9px] tracking-widest opacity-50">NEUES PROFIL</p><h3 class="font-display text-[22px] font-bold">Konto erstellen</h3></div><button onclick="openAccountModal()" class="w-8 h-8 rounded-full bg-[var(--surface-2)]">✕</button></div>
    <div class="mt-5 space-y-3">
      <input id="modal-create-name" maxlength="18" placeholder="Dein Anzeigename" autocomplete="name" class="input-min w-full">
      <input id="modal-create-user" maxlength="20" placeholder="Benutzername" autocomplete="username" autocapitalize="none" class="input-min w-full">
      <div class="relative"><input id="modal-create-pass" type="password" maxlength="64" placeholder="Passwort (mind. 4 Zeichen)" autocomplete="new-password" class="input-min w-full !pr-12"><button onclick="toggleLocalPassword('modal-create-pass',this)" class="absolute right-2 top-1/2 -translate-y-1/2 w-8 h-8">👁</button></div>
      <p id="modal-create-error" class="text-[11px] text-[#F87171] min-h-[16px]"></p>
      <button onclick="createLocalAccount('modal')" class="w-full btn-primary !py-3 font-bold">Konto erstellen</button>
    </div>`);
}
function openLocalLoginModal() {
  openModalHTML(`
    <div class="flex justify-between items-center"><div><p class="font-mono text-[9px] tracking-widest opacity-50">WILLKOMMEN ZURÜCK</p><h3 class="font-display text-[22px] font-bold">Einloggen</h3></div><button onclick="openAccountModal()" class="w-8 h-8 rounded-full bg-[var(--surface-2)]">✕</button></div>
    <div class="mt-5 space-y-3">
      <input id="modal-login-user" maxlength="20" placeholder="Benutzername" autocomplete="username" autocapitalize="none" class="input-min w-full">
      <div class="relative"><input id="modal-login-pass" type="password" maxlength="64" placeholder="Passwort" autocomplete="current-password" class="input-min w-full !pr-12"><button onclick="toggleLocalPassword('modal-login-pass',this)" class="absolute right-2 top-1/2 -translate-y-1/2 w-8 h-8">👁</button></div>
      <p id="modal-login-error" class="text-[11px] text-[#F87171] min-h-[16px]"></p>
      <button id="modal-login-submit" onclick="loginLocalAccount('modal')" class="w-full btn-primary !py-3 font-bold">Einloggen</button>
    </div>`);
}
function saveLocalDisplayName() {
  const name = (document.getElementById("account-display-name")?.value || "")
    .trim()
    .slice(0, 18);
  if (!name) return alert("Bitte einen Namen eingeben.");
  setPlayerName(name);
  saveCurrentLocalAccountSnapshot();
  updatePlayerNameUI();
  openAccountModal();
}
function saveLocalAccountNow() {
  if (saveCurrentLocalAccountSnapshot())
    alert("✓ Dein Fortschritt wurde im Konto gespeichert.");
}
function logoutLocalAccount() {
  if (!confirm("Möchtest du dich wirklich abmelden?")) return;
  saveCurrentLocalAccountSnapshot();
  clearActiveLocalAccountId();
  _localAccountSyncBusy = true;
  clearLifeOsProfileData();
  _localAccountSyncBusy = false;
  location.reload();
}
function deleteLocalAccount() {
  const active = getActiveLocalAccount();
  if (!active) return;
  if (
    !confirm(
      `Konto @${active.username} wirklich von diesem Gerät löschen? Der gespeicherte Fortschritt wird gelöscht.`,
    )
  )
    return;
  const accounts = readLocalAccounts().filter((a) => a.id !== active.id);
  clearActiveLocalAccountId();
  writeLocalAccounts(accounts);
  _localAccountSyncBusy = true;
  clearLifeOsProfileData();
  _localAccountSyncBusy = false;
  location.reload();
}

function openAccountModal() {
  const account = getActiveLocalAccount();
  if (!account) {
    openModalHTML(`
      <div class="flex justify-between items-center"><h3 class="font-display text-[22px] font-bold">👤 Account</h3><button onclick="closeModal()" class="w-8 h-8 rounded-full bg-[var(--surface-2)]">✕</button></div>
      <div class="mt-5 p-4 rounded-[18px] text-center" style="background:var(--surface-2);border:1px solid var(--border)">
        <div class="w-14 h-14 rounded-[17px] bg-white text-black flex items-center justify-center font-bold text-[30px] mx-auto">L</div>
        <h4 class="font-display text-[20px] font-bold mt-3">Dein Life OS Konto</h4>
        <p class="text-[12px] mt-1 text-[var(--text-2)]">Kein komischer Code mehr – einfach Benutzername und Passwort.</p>
      </div>
      <div class="grid grid-cols-1 sm:grid-cols-2 gap-2 mt-4"><button onclick="openCreateLocalAccountModal()" class="btn-primary !py-3 font-bold">Konto erstellen</button><button onclick="openLocalLoginModal()" class="btn-ghost !py-3 font-bold">Einloggen</button></div>`);
    return;
  }
  const accountXp = typeof getBonusXp === "function" ? getBonusXp() : 0;
  const accountRank =
    typeof getAccountRank === "function" ? getAccountRank() : null;
  const initial = (account.displayName || account.username || "L")
    .charAt(0)
    .toUpperCase();
  openModalHTML(`
    <div class="flex justify-between items-center"><div><p class="font-mono text-[9px] tracking-widest text-[#4ADE80]">● EINGELOGGT</p><h3 class="font-display text-[22px] font-bold">Mein Konto</h3></div><button onclick="closeModal()" class="w-8 h-8 rounded-full bg-[var(--surface-2)]">✕</button></div>
    <div class="mt-5 p-4 rounded-[18px] flex items-center gap-3" style="background:linear-gradient(145deg,var(--surface-2),var(--surface-3));border:1px solid var(--border)">
      <div class="w-14 h-14 rounded-[17px] bg-white text-black flex items-center justify-center font-bold text-[27px] shrink-0">${escapeAccountHtml(initial)}</div>
      <div class="min-w-0"><p class="font-display text-[19px] font-bold truncate">${escapeAccountHtml(account.displayName)}</p><p class="font-mono text-[11px] text-[var(--text-2)]">@${escapeAccountHtml(account.username)}</p><p class="text-[10px] text-[#4ADE80] mt-1">✓ Automatisch angemeldet</p></div>
    </div>
    <div class="grid grid-cols-2 gap-2 mt-3"><div class="p-3 rounded-[14px] bg-[var(--surface-2)] border border-[var(--border)]"><p class="font-mono text-[9px] opacity-60">TOTAL XP</p><p class="font-bold mt-1" style="color:#22D3EE">${Number(accountXp).toLocaleString("de-DE")} XP</p></div><div class="p-3 rounded-[14px] bg-[var(--surface-2)] border border-[var(--border)]"><p class="font-mono text-[9px] opacity-60">RANK</p><p class="font-bold mt-1" style="color:${accountRank?.tier?.color || "var(--text)"}">${accountRank?.tier?.title || "Unranked"}</p></div></div>
    <div class="mt-4"><label class="font-mono text-[9px] opacity-55">ANZEIGENAME</label><div class="flex gap-2 mt-1.5"><input id="account-display-name" maxlength="18" value="${escapeAccountHtml(account.displayName)}" class="input-min flex-1"><button onclick="saveLocalDisplayName()" class="btn-ghost !px-4 !py-2 font-bold">Speichern</button></div></div>
    <div class="mt-4 p-3 rounded-[14px] text-[11px] leading-relaxed text-[var(--text-2)]" style="background:var(--surface-2);border:1px solid var(--border)">🛡️ Versionssicher gespeichert: Das Konto liegt dreifach in LocalStorage, als Einzelprofil und zusätzlich in IndexedDB. Bei Updates auf derselben Netlify-URL wirst du automatisch wieder angemeldet.</div>
    <div class="grid grid-cols-1 sm:grid-cols-2 gap-2 mt-4"><button onclick="saveLocalAccountNow()" class="btn-primary !py-2.5 font-bold">✓ Fortschritt sichern</button><button onclick="logoutLocalAccount()" class="btn-ghost !py-2.5 font-bold">Abmelden</button></div>
    <details class="mt-4"><summary class="text-[11px] text-[var(--text-2)] cursor-pointer">Konto-Datei für neue URL oder anderes Gerät</summary><div class="grid grid-cols-2 gap-2 mt-2"><button onclick="downloadBackupFile()" class="btn-ghost !py-2 text-[11px]">Konto-Datei sichern ↓</button><button onclick="document.getElementById('backup-file-input').click()" class="btn-ghost !py-2 text-[11px]">Konto-Datei laden ↑</button><input id="backup-file-input" type="file" accept=".json,.lifeos" class="hidden" onchange="importBackupFile(event)"></div><button onclick="deleteLocalAccount()" class="w-full mt-3 py-2 text-[11px] text-[#F87171]">Konto von diesem Gerät löschen</button></details>`);
}

// File-based account backup (replaces the deprecated URL/code login).
function downloadBackupFile() {
  try {
    const dataObj = getFullAccountDataObj();
    const blob = new Blob([JSON.stringify(dataObj, null, 2)], {
      type: "application/json",
    });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `LifeOS_Konto_${getPlayerName() || "Account"}_${new Date().toISOString().slice(0, 10)}.lifeos.json`;
    document.body.appendChild(a);
    a.click();
    a.remove();
    URL.revokeObjectURL(url);
  } catch (e) {
    alert("Fehler beim Exportieren: " + e.message);
  }
}

function importBackupFile(event) {
  const file = event.target.files?.[0];
  if (!file) return;
  const reader = new FileReader();
  reader.onload = function (e) {
    try {
      const dataObj = JSON.parse(e.target.result);
      let count = 0;
      Object.keys(dataObj).forEach((k) => {
        if (isLifeOsBackupKey(k)) {
          const val = dataObj[k];
          localStorage.setItem(
            k,
            typeof val === "string" ? val : JSON.stringify(val),
          );
          count++;
        }
      });
      if (count === 0)
        return alert(
          "Keine gültigen Life OS Daten in der Backup-Datei gefunden.",
        );
      alert(
        `✓ Komplettes Konto erfolgreich geladen (${count} Datensätze). Die Seite wird jetzt neu geladen.`,
      );
      location.reload();
    } catch (err) {
      alert("Fehler beim Lesen der JSON-Datei.");
    }
  };
  reader.readAsText(file);
}
