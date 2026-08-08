const loginForm = document.getElementById("loginForm");

const accountCodeInput = document.getElementById("accountCode");
const passwordInput = document.getElementById("password");

const accountCodeError = document.getElementById("accountCodeError");
const passwordError = document.getElementById("passwordError");

const formMessage = document.getElementById("formMessage");

const togglePassword = document.getElementById("togglePassword");
const eyeIcon = document.getElementById("eyeIcon");

const loginButton = document.getElementById("loginButton");

const toastContainer = document.getElementById("toastContainer");

/* =========================================
   EYE ICON
========================================= */

const eyeOpenSvg = `<svg viewBox="0 0 24 24">
  <path d="M2.5 12s3.5-6 9.5-6 9.5 6 9.5 6-3.5 6-9.5 6S2.5 12 2.5 12z"></path>
  <circle cx="12" cy="12" r="2.7"></circle>
</svg>`;

const eyeOffSvg = `<svg viewBox="0 0 24 24">
  <path d="M3 3l18 18"></path>
  <path d="M10.6 10.6a2 2 0 0 0 2.8 2.8"></path>
  <path d="M9.9 4.3A10.8 10.8 0 0 1 12 4c5 0 8.3 4.2 9 8a11.7 11.7 0 0 1-2 4.2"></path>
  <path d="M6.6 6.6A10.8 10.8 0 0 0 3 12c.8 4 4.2 8 9 8a10.4 10.4 0 0 0 4-.8"></path>
</svg>`;

eyeIcon.innerHTML = eyeOffSvg;

/* =========================================
   SHOW / HIDE PASSWORD
========================================= */

togglePassword.addEventListener("click", function () {
  const isHidden = passwordInput.type === "password";

  passwordInput.type = isHidden ? "text" : "password";

  eyeIcon.innerHTML = isHidden ? eyeOpenSvg : eyeOffSvg;

  togglePassword.setAttribute(
    "aria-label",
    isHidden ? "Ẩn mật khẩu" : "Hiện mật khẩu",
  );
});

/* =========================================
   CLEAR ERROR
========================================= */

accountCodeInput.addEventListener("input", function () {
  accountCodeInput.value = accountCodeInput.value.toUpperCase();

  accountCodeError.textContent = "";
  accountCodeInput.classList.remove("invalid");
  formMessage.textContent = "";
});

passwordInput.addEventListener("input", function () {
  passwordError.textContent = "";
  passwordInput.classList.remove("invalid");
  formMessage.textContent = "";
});

/* =========================================
   TOAST
========================================= */

function showToast(type, title, message) {
  const toast = document.createElement("div");

  toast.className = "toast " + type;

  const titleElement = document.createElement("strong");
  titleElement.textContent = title;

  const messageElement = document.createElement("span");
  messageElement.textContent = message;

  toast.appendChild(titleElement);
  toast.appendChild(messageElement);

  toastContainer.appendChild(toast);

  requestAnimationFrame(function () {
    requestAnimationFrame(function () {
      toast.classList.add("show");
    });
  });

  setTimeout(function () {
    toast.classList.remove("show");
    toast.classList.add("hide");

    setTimeout(function () {
      toast.remove();
    }, 400);
  }, 3000);
}

/* =========================================
   LOGIN + PHÂN LUỒNG TÀI KHOẢN
========================================= */

loginForm.addEventListener("submit", function (event) {
  event.preventDefault();

  const accountCode = accountCodeInput.value.trim().toUpperCase();
  const password = passwordInput.value;

  let isValid = true;
  let redirectPage = "";
  let accountRole = "";

  accountCodeError.textContent = "";
  passwordError.textContent = "";
  formMessage.textContent = "";

  accountCodeInput.classList.remove("invalid");
  passwordInput.classList.remove("invalid");

  /* =====================================
     KIỂM TRA MÃ TÀI KHOẢN
  ===================================== */

  if (accountCode === "") {
    accountCodeError.textContent = "Vui lòng nhập mã tài khoản.";
    accountCodeInput.classList.add("invalid");
    isValid = false;
  } else if (accountCode.startsWith("VT-HR-")) {
    redirectPage = "Main.html";
    accountRole = "HR";
  } else if (accountCode.startsWith("VT-AD-")) {
    redirectPage = "admin.html";
    accountRole = "ADMIN";
  } else {
    accountCodeError.textContent =
      "Mã tài khoản phải bắt đầu bằng VT-HR- hoặc VT-AD-.";
    accountCodeInput.classList.add("invalid");
    isValid = false;
  }

  /* =====================================
     KIỂM TRA MẬT KHẨU
  ===================================== */

  if (password.trim() === "") {
    passwordError.textContent = "Vui lòng nhập mật khẩu.";
    passwordInput.classList.add("invalid");
    isValid = false;
  } else if (password.length < 8) {
    passwordError.textContent = "Mật khẩu phải có ít nhất 8 ký tự.";
    passwordInput.classList.add("invalid");
    isValid = false;
  }

  /* =====================================
     CÓ LỖI
  ===================================== */

  if (!isValid) {
    showToast(
      "error",
      "Xác thực chưa thành công",
      "Vui lòng kiểm tra lại mã tài khoản và mật khẩu.",
    );

    return;
  }

  /* =====================================
     LOADING
  ===================================== */

  loginButton.classList.add("loading");
  loginButton.disabled = true;

  formMessage.textContent = "Đang xác thực tài khoản nội bộ...";

  setTimeout(function () {
    sessionStorage.setItem("employeeLoggedIn", "true");
    sessionStorage.setItem("employeeAccountCode", accountCode);
    sessionStorage.setItem("employeeRole", accountRole);

    loginButton.classList.remove("loading");
    loginButton.disabled = false;

    formMessage.textContent = "Xác thực thành công, đang chuyển hướng...";

    if (accountRole === "HR") {
      showToast(
        "success",
        "Đăng nhập thành công",
        "Tài khoản nhân viên đã được xác thực.",
      );
    } else {
      showToast(
        "success",
        "Đăng nhập thành công",
        "Tài khoản quản trị đã được xác thực.",
      );
    }

    setTimeout(function () {
      window.location.href = redirectPage;
    }, 900);
  }, 1100);
});
