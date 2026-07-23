const pages = ["portal", "login", "candidate", "admin"];

function showPage(pageId) {
  pages.forEach((id) => {
    document.getElementById(id)?.classList.toggle("hidden", id !== pageId);
  });
  window.scrollTo({ top: 0, behavior: "smooth" });
}

function switchTab(tab) {
  const isRegister = tab === "register";
  document.getElementById("loginTab").classList.toggle("active", !isRegister);
  document.getElementById("registerTab").classList.toggle("active", isRegister);
  document.getElementById("nameField").classList.toggle("hidden", !isRegister);
  document.getElementById("authTitle").textContent = isRegister
    ? "Táº¡o tÃ i khoáº£n á»©ng viÃªn"
    : "ChÃ o má»«ng báº¡n quay láº¡i";
  document.getElementById("authDesc").textContent = isRegister
    ? "Táº¡o há»“ sÆ¡ Ä‘á»ƒ á»©ng tuyá»ƒn vÃ  theo dÃµi tiáº¿n trÃ¬nh tuyá»ƒn dá»¥ng."
    : "ÄÄƒng nháº­p Ä‘á»ƒ quáº£n lÃ½ há»“ sÆ¡ vÃ  theo dÃµi káº¿t quáº£.";
  document.getElementById("submitText").textContent = isRegister
    ? "ÄÄƒng kÃ½"
    : "ÄÄƒng nháº­p";
}

function showRegister() {
  showPage("login");
  switchTab("register");
}

function showToast(message, type = "info") {
  let toast = document.getElementById("toast");
  if (!toast) {
    toast = document.createElement("div");
    toast.id = "toast";
    document.body.appendChild(toast);
  }
  toast.className = `toast ${type} show`;
  toast.textContent = message;
  clearTimeout(showToast.timer);
  showToast.timer = setTimeout(() => toast.classList.remove("show"), 2800);
}

function filterJobs() {
  const query = document
    .getElementById("jobSearch")
    .value.trim()
    .toLocaleLowerCase("vi");
  const jobs = [...document.querySelectorAll("#jobList .job")];
  let visible = 0;

  jobs.forEach((job) => {
    const matched =
      !query ||
      `${job.dataset.key || ""} ${job.textContent}`
        .toLocaleLowerCase("vi")
        .includes(query);
    job.classList.toggle("hidden", !matched);
    if (matched) visible += 1;
  });

  let empty = document.getElementById("jobEmpty");
  if (!empty) {
    empty = document.createElement("p");
    empty.id = "jobEmpty";
    empty.className = "empty-state hidden";
    document.getElementById("jobList").after(empty);
  }
  empty.textContent = `KhÃ´ng tÃ¬m tháº¥y viá»‡c lÃ m phÃ¹ há»£p vá»›i â€œ${query}â€.`;
  empty.classList.toggle("hidden", visible > 0 || !query);
  document.getElementById("jobList").scrollIntoView({ behavior: "smooth" });
}

function submitAuth() {
  const card = document.querySelector(".auth-card");
  const inputs = [...card.querySelectorAll(".field:not(.hidden) input")];
  const email = card.querySelector('input[type="email"]');
  const password = card.querySelector('input[type="password"]');
  const isRegister = document
    .getElementById("registerTab")
    .classList.contains("active");

  if (inputs.some((input) => !input.value.trim())) {
    showToast("Vui lÃ²ng nháº­p Ä‘áº§y Ä‘á»§ thÃ´ng tin.", "error");
    return;
  }
  if (!email.checkValidity()) {
    showToast("Email chÆ°a Ä‘Ãºng Ä‘á»‹nh dáº¡ng.", "error");
    email.focus();
    return;
  }
  if (password.value.length < 8) {
    showToast("Máº­t kháº©u cáº§n cÃ³ Ã­t nháº¥t 8 kÃ½ tá»±.", "error");
    password.focus();
    return;
  }

  showToast(isRegister ? "ÄÄƒng kÃ½ thÃ nh cÃ´ng!" : "ÄÄƒng nháº­p thÃ nh cÃ´ng!", "success");
  setTimeout(() => showPage("candidate"), 450);
}

function lookupApplication() {
  const input = document.getElementById("lookupCode");
  const code = input.value.trim().toUpperCase();
  const application = document.querySelector(".application");

  if (!code) {
    application.classList.remove("hidden");
    showToast("Vui lÃ²ng nháº­p mÃ£ há»“ sÆ¡.", "error");
    input.focus();
    return;
  }
  if (code === "UV-2026-0186") {
    application.classList.remove("hidden");
    application.scrollIntoView({ behavior: "smooth", block: "start" });
    showToast("ÄÃ£ tÃ¬m tháº¥y há»“ sÆ¡.", "success");
  } else {
    application.classList.add("hidden");
    showToast("KhÃ´ng tÃ¬m tháº¥y mÃ£ há»“ sÆ¡ nÃ y.", "error");
  }
}

function selectAdminMenu(button) {
  document
    .querySelectorAll(".sidebar > button:not(.brand)")
    .forEach((item) => item.classList.remove("active"));
  button.classList.add("active");
  const title = button.textContent.replace(/^[^\p{L}]+/u, "").trim();
  document.querySelector(".topbar > b").textContent = title;

  if (title === "Tá»•ng quan") {
    document.querySelector(".content").classList.remove("admin-content-muted");
    showToast("Äang xem trang Tá»•ng quan.");
  } else {
    document.querySelector(".content").classList.add("admin-content-muted");
    showToast(`ÄÃ£ chá»n má»¥c â€œ${title}â€.`);
  }
}

document.addEventListener("DOMContentLoaded", () => {
  document
    .getElementById("jobSearch")
    ?.addEventListener("keydown", (event) => {
      if (event.key === "Enter") filterJobs();
    });

  const lookup = document.getElementById("lookupCode");
  if (lookup) {
    const button = document.createElement("button");
    button.className = "lookup-button";
    button.textContent = "Tra cá»©u";
    button.addEventListener("click", lookupApplication);
    lookup.after(button);
    lookup.addEventListener("keydown", (event) => {
      if (event.key === "Enter") lookupApplication();
    });
  }

  document
    .querySelector(".auth-card .primary.submit")
    ?.addEventListener("click", (event) => {
      event.preventDefault();
      submitAuth();
    });

  const navButtons = document.querySelectorAll(".public-header nav button");
  navButtons[0]?.addEventListener("click", () =>
    document.getElementById("jobList").scrollIntoView({ behavior: "smooth" }),
  );
  navButtons[1]?.addEventListener("click", () =>
    showToast("VietTech â€“ nÆ¡i cÃ´ng nghá»‡ vÃ  con ngÆ°á»i cÃ¹ng phÃ¡t triá»ƒn."),
  );
  navButtons[2]?.addEventListener("click", () =>
    showToast("ChuyÃªn má»¥c Cáº©m nang nghá» nghiá»‡p Ä‘ang Ä‘Æ°á»£c cáº­p nháº­t."),
  );

  document.querySelector(".sidebar .brand")?.addEventListener("click", () => {
    showPage("portal");
  });
  document
    .querySelectorAll(".sidebar > button:not(.brand)")
    .forEach((button) =>
      button.addEventListener("click", () => selectAdminMenu(button)),
    );

  document.querySelector(".welcome .primary")?.addEventListener("click", () => {
    showToast("ÄÃ£ má»Ÿ chá»©c nÄƒng táº¡o tin tuyá»ƒn dá»¥ng má»›i.", "success");
  });
});