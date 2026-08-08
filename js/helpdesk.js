const searchInput = document.querySelector("#helpSearch");
const faqItems = [...document.querySelectorAll(".faq-item")];
const emptySearch = document.querySelector(".empty-search");
const modal = document.querySelector("#ticketModal");
const form = document.querySelector("#ticketForm");
const submitButton = form.querySelector(".submit-btn");
const successModal = document.querySelector("#successModal");
const successToast = document.querySelector("#successToast");
const successCloseButton = document.querySelector(".success-close");
const finishButton = document.querySelector(".finish-btn");
let toastTimer;
const trackerForm = document.querySelector("#trackerForm");
const trackCode = document.querySelector("#trackCode");
const trackEmail = document.querySelector("#trackEmail");
const trackerError = document.querySelector("#trackerError");
const trackerEmpty = document.querySelector("#trackerEmpty");
const ticketDetail = document.querySelector("#ticketDetail");
const TICKET_STORAGE_KEY = "viettech_helpdesk_tickets_v1";
const TIMELINE_LABELS = [
  "Đã tiếp nhận",
  "Đang kiểm tra",
  "Đang xử lý",
  "Đã phản hồi",
  "Hoàn tất",
];

function normalizeText(value) {
  return value
    .toLocaleLowerCase("vi")
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/đ/g, "d");
}

function filterFaqs() {
  const keyword = normalizeText(searchInput.value.trim());
  let visibleCount = 0;
  faqItems.forEach((item) => {
    const isVisible =
      keyword === "" || normalizeText(item.textContent).includes(keyword);
    item.hidden = !isVisible;
    if (isVisible) visibleCount++;
  });
  emptySearch.hidden = visibleCount > 0;
}

searchInput.addEventListener("input", filterFaqs);
searchInput.addEventListener("keydown", (e) => {
  if (e.key === "Enter") {
    e.preventDefault();
    filterFaqs();
    document.querySelector("#faq").scrollIntoView({ behavior: "smooth" });
  }
});

faqItems.forEach((item) => {
  item.querySelector("button").addEventListener("click", () => {
    const willOpen = !item.classList.contains("open");
    faqItems.forEach((faq) => faq.classList.remove("open"));
    if (willOpen) item.classList.add("open");
  });
});

document.querySelectorAll("[data-query]").forEach((button) => {
  button.addEventListener("click", () => {
    searchInput.value = button.dataset.query;
    filterFaqs();
    document.querySelector("#faq").scrollIntoView({ behavior: "smooth" });
  });
});

function openModal() {
  modal.hidden = false;
  document.body.classList.add("modal-open");
}
function closeModal() {
  modal.hidden = true;
  if (successModal.hidden) document.body.classList.remove("modal-open");
}
function closeSuccessModal() {
  successModal.hidden = true;
  document.body.classList.remove("modal-open");
}

document
  .querySelectorAll(".open-ticket")
  .forEach((btn) => btn.addEventListener("click", openModal));
document.querySelector(".modal-close").addEventListener("click", closeModal);
modal.addEventListener("mousedown", (e) => {
  if (e.target === modal) closeModal();
});
successCloseButton.addEventListener("click", closeSuccessModal);
finishButton.addEventListener("click", closeSuccessModal);
successModal.addEventListener("mousedown", (e) => {
  if (e.target === successModal) closeSuccessModal();
});

document.addEventListener("keydown", (e) => {
  if (e.key !== "Escape") return;
  if (!successModal.hidden) closeSuccessModal();
  else if (!modal.hidden) closeModal();
});

function showSuccessToast() {
  clearTimeout(toastTimer);
  successToast.classList.remove("show");
  void successToast.offsetWidth;
  successToast.classList.add("show");
  toastTimer = setTimeout(() => successToast.classList.remove("show"), 4500);
}

function makeTicketCode() {
  const random = Math.floor(1000 + Math.random() * 9000);
  return `VT-QA-${random}`;
}

function getTickets() {
  try {
    return JSON.parse(localStorage.getItem(TICKET_STORAGE_KEY)) || [];
  } catch {
    return [];
  }
}

function saveTickets(tickets) {
  localStorage.setItem(TICKET_STORAGE_KEY, JSON.stringify(tickets));
}

function ensureDemoTicket() {
  const tickets = getTickets();
  if (tickets.some((t) => t.code === "VT-QA-0001")) return;
  tickets.push({
    code: "VT-QA-0001",
    email: "demo@viettech.vn",
    fullName: "Nguyễn Minh Anh",
    requestSubject: "Tài khoản & đăng nhập",
    requestDescription:
      "Tôi không nhận được mã xác thực khi thực hiện quên mật khẩu.",
    createdAt: "2026-08-08T09:18:00+07:00",
    updatedAt: "2026-08-08T14:32:00+07:00",
    currentStep: 3,
    response:
      "Chào bạn Minh Anh, đội hỗ trợ đã kiểm tra và mở lại luồng gửi mã xác thực cho tài khoản. Bạn vui lòng thử lại thao tác “Quên mật khẩu”. Nếu chưa nhận được mã sau 5 phút, hãy phản hồi lại phiếu này để tụi mình kiểm tra tiếp.",
    responseAt: "2026-08-08T14:32:00+07:00",
  });
  saveTickets(tickets);
}

function formatTicketDate(value) {
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return value || "—";
  return date.toLocaleString("vi-VN", {
    hour: "2-digit",
    minute: "2-digit",
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
  });
}

function escapeHtml(value = "") {
  return String(value).replace(
    /[&<>'"]/g,
    (char) =>
      ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", "'": "&#39;", '"': "&quot;" })[
        char
      ],
  );
}

function fillTicketSummary(data, code) {
  document.querySelector("#summaryName").textContent = data.fullName;
  document.querySelector("#summaryEmail").textContent = data.email;
  document.querySelector("#summarySubject").textContent = data.requestSubject;
  document.querySelector("#summaryDescription").textContent =
    data.requestDescription;
  document.querySelector("#ticketCode").textContent = code;
}

function storeNewTicket(data, code) {
  const tickets = getTickets();
  const now = new Date().toISOString();
  tickets.unshift({
    code,
    email: data.email.trim().toLowerCase(),
    fullName: data.fullName,
    requestSubject: data.requestSubject,
    requestDescription: data.requestDescription,
    createdAt: now,
    updatedAt: now,
    currentStep: 0,
    response: "",
    responseAt: "",
  });
  saveTickets(tickets.slice(0, 30));
}

function statusText(step) {
  return TIMELINE_LABELS[
    Math.max(0, Math.min(step, TIMELINE_LABELS.length - 1))
  ];
}

function renderTicket(ticket) {
  trackerError.hidden = true;
  trackerEmpty.hidden = true;
  ticketDetail.hidden = false;
  const step = Math.max(0, Math.min(Number(ticket.currentStep) || 0, 4));
  const isDone = step === 4;
  const timeline = TIMELINE_LABELS.map((label, index) => {
    const cls = index < step ? "complete" : index === step ? "current" : "";
    return `<div class="timeline-step ${cls}"><i class="timeline-dot"></i>${label}</div>`;
  }).join("");

  const reply = ticket.response
    ? `<div class="support-reply"><div class="reply-avatar">VT</div><div class="reply-body"><strong>Phản hồi từ VietTech Support</strong><p>${escapeHtml(ticket.response)}</p><span class="reply-time">${formatTicketDate(ticket.responseAt || ticket.updatedAt)}</span></div></div>`
    : `<div class="waiting-reply">Phiếu đang được đội hỗ trợ tiếp nhận. Khi có cập nhật hoặc phản hồi, nội dung sẽ xuất hiện trực tiếp tại đây và đồng thời được gửi tới email của bạn.</div>`;

  ticketDetail.innerHTML = `
    <div class="ticket-detail-head">
      <div>
        <div class="ticket-detail-code">${escapeHtml(ticket.code)}</div>
        <h3>${escapeHtml(ticket.requestSubject)}</h3>
        <div class="ticket-detail-date">Tạo lúc ${formatTicketDate(ticket.createdAt)} · Cập nhật ${formatTicketDate(ticket.updatedAt)}</div>
      </div>
      <span class="status-pill ${isDone ? "done" : "active"}">${statusText(step)}</span>
    </div>
    <div class="ticket-info-grid">
      <div class="ticket-info-box"><span>NGƯỜI GỬI</span><strong>${escapeHtml(ticket.fullName)}</strong></div>
      <div class="ticket-info-box"><span>EMAIL</span><strong>${escapeHtml(ticket.email)}</strong></div>
      <div class="ticket-info-box" style="grid-column:1/-1"><span>NỘI DUNG YÊU CẦU</span><strong>${escapeHtml(ticket.requestDescription)}</strong></div>
    </div>
    <div class="progress-title"><strong>Quy trình phản hồi</strong><span>Bước ${step + 1}/${TIMELINE_LABELS.length}</span></div>
    <div class="ticket-timeline">${timeline}</div>
    ${reply}
  `;
}

function findTicket(code, email) {
  const normalizedCode = code.trim().toUpperCase();
  const normalizedEmail = email.trim().toLowerCase();

  return getTickets().find(
    (ticket) =>
      ticket.code.toUpperCase() === normalizedCode &&
      ticket.email.toLowerCase() === normalizedEmail,
  );
}

trackerForm.addEventListener("submit", (e) => {
  e.preventDefault();
  const ticket = findTicket(trackCode.value, trackEmail.value);
  if (!ticket) {
    ticketDetail.hidden = true;
    trackerEmpty.hidden = false;
    trackerError.textContent =
      "Không tìm thấy yêu cầu khớp với mã phiếu và email này. Kiểm tra lại thông tin rồi thử lại nhé.";
    trackerError.hidden = false;
    return;
  }
  renderTicket(ticket);
});

ensureDemoTicket();

form.addEventListener("submit", (e) => {
  e.preventDefault();
  const data = Object.fromEntries(new FormData(form).entries());
  submitButton.disabled = true;
  submitButton.textContent = "Đang gửi...";
  setTimeout(() => {
    const code = makeTicketCode();
    storeNewTicket(data, code);
    fillTicketSummary(data, code);
    form.reset();
    submitButton.disabled = false;
    submitButton.textContent = "Gửi yêu cầu hỗ trợ →";
    closeModal();
    successModal.hidden = false;
    document.body.classList.add("modal-open");
    showSuccessToast();
  }, 800);
});

function goBack() {
  if (window.history.length > 1) window.history.back();
  else window.location.href = "index.html";
}

/* MICRO ANIMATIONS */
const reducedMotion = window.matchMedia(
  "(prefers-reduced-motion: reduce)",
).matches;

if (!reducedMotion) {
  const revealGroups = [
    [".section-heading", 0],
    [".category-card", 70],
    [".tracker-search-card, .tracker-result-card", 90],
    [".faq-left, .faq-item", 70],
    [".cta", 0],
    [".contact-card", 80],
  ];

  const revealElements = [];
  revealGroups.forEach(([selector, stagger]) => {
    document.querySelectorAll(selector).forEach((el, index) => {
      el.classList.add("reveal-ready");
      el.style.setProperty(
        "--reveal-delay",
        `${Math.min(index * stagger, 320)}ms`,
      );
      revealElements.push(el);
    });
  });

  const revealObserver = new IntersectionObserver(
    (entries, observer) => {
      entries.forEach((entry) => {
        if (!entry.isIntersecting) return;
        entry.target.classList.add("is-visible");
        observer.unobserve(entry.target);
      });
    },
    { threshold: 0.12, rootMargin: "0px 0px -45px 0px" },
  );

  revealElements.forEach((el) => revealObserver.observe(el));

  const hero = document.querySelector(".hero");
  if (hero) {
    hero.addEventListener("pointermove", (event) => {
      const rect = hero.getBoundingClientRect();
      const x = ((event.clientX - rect.left) / rect.width) * 100;
      const y = ((event.clientY - rect.top) / rect.height) * 100;
      hero.style.setProperty("--mx", `${x.toFixed(1)}%`);
      hero.style.setProperty("--my", `${y.toFixed(1)}%`);
    });
    hero.addEventListener("pointerleave", () => {
      hero.style.setProperty("--mx", "74%");
      hero.style.setProperty("--my", "22%");
    });
  }
}
