const loginForm = document.getElementById("loginForm");
const emailInput = document.getElementById("email");
const passwordInput = document.getElementById("password");
const togglePassword = document.getElementById("togglePassword");

const emailError = document.getElementById("emailError");
const passwordError = document.getElementById("passwordError");
const formMessage = document.getElementById("formMessage");

/* Hiện hoặc ẩn mật khẩu */
togglePassword.addEventListener("click", function () {
  const isHidden = passwordInput.type === "password";

  passwordInput.type = isHidden ? "text" : "password";
  togglePassword.textContent = isHidden ? "Ẩn" : "Hiện";
  togglePassword.setAttribute(
    "aria-label",
    isHidden ? "Ẩn mật khẩu" : "Hiện mật khẩu",
  );
});

/* Xóa lỗi khi người dùng nhập lại */
emailInput.addEventListener("input", function () {
  emailError.textContent = "";
  emailInput.classList.remove("input-error");
  formMessage.textContent = "";
});

passwordInput.addEventListener("input", function () {
  passwordError.textContent = "";
  passwordInput.classList.remove("input-error");
  formMessage.textContent = "";
});

/* Kiểm tra địa chỉ email */
function isValidEmail(email) {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
}

/* Xử lý đăng nhập */
loginForm.addEventListener("submit", function (event) {
  event.preventDefault();

  const email = emailInput.value.trim();
  const password = passwordInput.value;

  let isValid = true;

  emailError.textContent = "";
  passwordError.textContent = "";
  formMessage.textContent = "";

  emailInput.classList.remove("input-error");
  passwordInput.classList.remove("input-error");

  if (email === "") {
    emailError.textContent = "Vui lòng nhập email.";
    emailInput.classList.add("input-error");
    isValid = false;
  } else if (!isValidEmail(email)) {
    emailError.textContent = "Email không đúng định dạng.";
    emailInput.classList.add("input-error");
    isValid = false;
  }

  if (password.trim() === "") {
    passwordError.textContent = "Vui lòng nhập mật khẩu.";
    passwordInput.classList.add("input-error");
    isValid = false;
  } else if (password.length < 8) {
    passwordError.textContent = "Mật khẩu phải có ít nhất 8 ký tự.";
    passwordInput.classList.add("input-error");
    isValid = false;
  }

  if (!isValid) {
    formMessage.textContent = "Vui lòng kiểm tra lại thông tin đăng nhập.";
    return;
  }

  formMessage.textContent = "Đăng nhập thành công, đang chuyển hướng...";

  sessionStorage.setItem("candidateLoggedIn", "true");
  sessionStorage.setItem("candidateEmail", email);

  setTimeout(function () {
    window.location.href = "../html/Main.html";
  }, 700);
});
