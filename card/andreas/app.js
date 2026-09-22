(() => {
  const cfg = window.ADS_WALLET_CARD || {};
  const profile = cfg.profile || {};
  const wallet = cfg.wallet || {};
  const $ = (id) => document.getElementById(id);

  const setText = (id, value) => {
    if (value && $(id)) $(id).textContent = value;
  };

  setText("profile-name", profile.name);
  setText("profile-role", profile.role);
  setText("profile-company", profile.company);

  const email = $("email-link");
  if (email && profile.email) {
    email.href = `mailto:${profile.email}`;
    email.querySelector("strong").textContent = profile.email;
  }

  const website = $("website-link");
  if (website && profile.website) {
    website.href = profile.website;
    website.querySelector("strong").textContent = profile.website.replace(/^https?:\/\//, "").replace(/\/$/, "");
  }

  const instagram = $("instagram-link");
  if (instagram && profile.instagram) {
    instagram.href = profile.instagram;
    const handle = profile.instagram.split("/").filter(Boolean).pop();
    instagram.querySelector("strong").textContent = handle ? `@${handle}` : "Instagram";
  }

  const whatsapp = $("whatsapp-link");
  if (whatsapp && profile.whatsapp) {
    whatsapp.href = profile.whatsapp;
    whatsapp.classList.remove("hidden");
  }

  const linkedin = $("linkedin-link");
  if (linkedin && profile.linkedin) {
    linkedin.href = profile.linkedin;
    linkedin.classList.remove("hidden");
  }

  const save = $("save-contact");
  if (save && cfg.contactFile) save.href = cfg.contactFile;

  const activateWalletLink = (id, url) => {
    const el = $(id);
    if (!el || !url) return false;
    el.href = url;
    el.classList.remove("disabled");
    el.removeAttribute("aria-disabled");
    return true;
  };

  const appleActive = activateWalletLink("apple-wallet", wallet.appleWalletUrl);
  const googleActive = activateWalletLink("google-wallet", wallet.googleWalletUrl);
  const status = $("wallet-status");

  if (status) {
    if (appleActive && googleActive) status.textContent = "Choose your Wallet and keep my details with you.";
    else if (appleActive || googleActive) status.textContent = "Wallet support is partially active.";
  }

  ["apple-wallet", "google-wallet"].forEach((id) => {
    const el = $(id);
    if (!el) return;
    el.addEventListener("click", (event) => {
      if (el.classList.contains("disabled")) {
        event.preventDefault();
        showToast("Wallet activation is being prepared.");
      }
    });
  });

  $("share-card")?.addEventListener("click", async () => {
    const shareData = {
      title: `${profile.name || "Andreas Demetriou"} — ${profile.company || "ADSolutions"}`,
      text: `Here are my ADSolutions contact details.`,
      url: window.location.href
    };
    try {
      if (navigator.share) await navigator.share(shareData);
      else {
        await navigator.clipboard.writeText(window.location.href);
        showToast("Card link copied.");
      }
    } catch (error) {
      if (error?.name !== "AbortError") showToast("Unable to share this link.");
    }
  });

  function showToast(message) {
    const toast = $("toast");
    if (!toast) return;
    toast.textContent = message;
    toast.classList.add("show");
    window.clearTimeout(showToast.timer);
    showToast.timer = window.setTimeout(() => toast.classList.remove("show"), 2200);
  }
})();
