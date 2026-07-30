const lookupSuccessToast = document.getElementById("lookupSuccessToast");

const closeLookupToast = document.getElementById("closeLookupToast");

let lookupToastTimer;
sessionStorage.removeItem("candidateVerified");
const lookupForm = document.getElementById("lookupForm");

const applicationCode = document.getElementById("applicationCode");
const lookupEmail = document.getElementById("lookupEmail");
const lookupCccd = document.getElementById("lookupCccd");
const lookupPhone = document.getElementById("lookupPhone");

const lookupMessage = document.getElementById("lookupMessage");
const lookupMessageText = document.getElementById("lookupMessageText");
const lookupSpinner = document.getElementById("lookupSpinner");
const lookupButton = document.getElementById("lookupButton");
const applicationCard = document.getElementById("applicationCard");

const buttonText = lookupButton.querySelector(".button-text");

let lookupTimer;

/* Chỉ cho nhập số CCCD */
lookupCccd.addEventListener("input", function () {
  this.value = this.value.replace(/\D/g, "").slice(0, 12);
});

/* Chỉ cho nhập số điện thoại */
lookupPhone.addEventListener("input", function () {
  this.value = this.value.replace(/\D/g, "").slice(0, 10);
});

/* Tra cứu hồ sơ */
lookupForm.addEventListener("submit", function (event) {
  event.preventDefault();

  clearTimeout(lookupTimer);
  resetLookupState();

  const codePattern = /^UV-\d{4}-\d{4,}$/i;
  const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  const cccdPattern = /^\d{12}$/;
  const phonePattern = /^0\d{9}$/;

  if (!codePattern.test(applicationCode.value.trim())) {
    showLookupError(
      applicationCode,
      "Mã hồ sơ không đúng định dạng. Ví dụ: UV-2026-0186.",
    );
    return;
  }

  if (!emailPattern.test(lookupEmail.value.trim())) {
    showLookupError(lookupEmail, "Vui lòng nhập đúng địa chỉ email.");
    return;
  }

  if (!cccdPattern.test(lookupCccd.value.trim())) {
    showLookupError(lookupCccd, "Số CCCD phải gồm đúng 12 chữ số.");
    return;
  }

  if (!phonePattern.test(lookupPhone.value.trim())) {
    showLookupError(
      lookupPhone,
      "Số điện thoại phải gồm 10 chữ số và bắt đầu bằng số 0.",
    );
    return;
  }

  startLookupLoading();

  /* Mô phỏng thời gian tra cứu dữ liệu */
  lookupTimer = setTimeout(function () {
    finishLookupSuccessfully();
  }, 2000);
});

/* Bắt đầu hiệu ứng đang tải */
function startLookupLoading() {
  lookupMessage.className = "lookup-message show";
  lookupMessageText.textContent = "Thông tin hợp lệ. Đang tra cứu hồ sơ...";

  lookupSpinner.classList.add("show");

  lookupButton.disabled = true;
  lookupButton.classList.add("loading");
  buttonText.textContent = "Đang tra cứu...";

  applicationCard.classList.add("is-hidden");
  applicationCard.classList.remove("show-result");

  setFieldsDisabled(true);
}

/* Hoàn thành tra cứu */
function finishLookupSuccessfully() {
  lookupSpinner.classList.remove("show");
  lookupMessage.className = "lookup-message";
  lookupMessageText.textContent = "";

  lookupButton.disabled = false;
  lookupButton.classList.remove("loading");
  buttonText.textContent = "Tra cứu hồ sơ";

  setFieldsDisabled(false);

  applicationCard.classList.remove("is-hidden");
  applicationCard.classList.add("show-result");

  sessionStorage.setItem("candidateVerified", "true");

  /* Hiện thông báo góc phải */
  showLookupSuccessToast();

  applicationCard.scrollIntoView({
    behavior: "smooth",
    block: "start",
  });
}

/* Hiển thị lỗi */
function showLookupError(input, message) {
  input.classList.add("input-error");
  input.focus();

  lookupMessage.className = "lookup-message show error";
  lookupMessageText.textContent = message;
  lookupSpinner.classList.remove("show");
}

/* Đặt lại trạng thái trước mỗi lần tra cứu */
function resetLookupState() {
  const fields = [applicationCode, lookupEmail, lookupCccd, lookupPhone];

  fields.forEach(function (field) {
    field.classList.remove("input-error");
  });

  lookupMessage.className = "lookup-message";
  lookupMessageText.textContent = "";
  lookupSpinner.classList.remove("show");
}

/* Khóa hoặc mở các ô trong lúc tra cứu */
function setFieldsDisabled(disabled) {
  const fields = [applicationCode, lookupEmail, lookupCccd, lookupPhone];

  fields.forEach(function (field) {
    field.disabled = disabled;
  });
}
/* Khóa các trang khi chưa tra cứu hồ sơ */
const protectedLinks = document.querySelectorAll(".protected-link");
const protectedButton = document.querySelector(".protected-button");

function canAccessCandidateInformation() {
  return sessionStorage.getItem("candidateVerified") === "true";
}

function showVerificationRequired() {
  lookupMessage.className = "lookup-message show error";
  lookupMessageText.textContent =
    "Vui lòng tra cứu hồ sơ ứng tuyển trước khi sử dụng chức năng này.";

  lookupSpinner.classList.remove("show");

  lookupForm.scrollIntoView({
    behavior: "smooth",
    block: "center",
  });

  applicationCode.focus();
}

protectedLinks.forEach(function (link) {
  link.addEventListener("click", function (event) {
    if (!canAccessCandidateInformation()) {
      event.preventDefault();
      showVerificationRequired();
    }
  });
});

if (protectedButton) {
  protectedButton.addEventListener("click", function () {
    if (!canAccessCandidateInformation()) {
      showVerificationRequired();
      return;
    }

    window.location.href = protectedButton.dataset.href;
  });
}
function showLookupSuccessToast() {
  if (!lookupSuccessToast) {
    return;
  }

  clearTimeout(lookupToastTimer);

  /* Khởi động lại animation thanh thời gian */
  lookupSuccessToast.classList.remove("show");
  void lookupSuccessToast.offsetWidth;
  lookupSuccessToast.classList.add("show");

  lookupToastTimer = setTimeout(function () {
    hideLookupSuccessToast();
  }, 4000);
}

function hideLookupSuccessToast() {
  if (!lookupSuccessToast) {
    return;
  }

  lookupSuccessToast.classList.remove("show");
  clearTimeout(lookupToastTimer);
}

if (closeLookupToast) {
  closeLookupToast.addEventListener("click", hideLookupSuccessToast);
}
