//======================================================
// QUÊN MẬT KHẨU - FRONTEND DEMO
// HTML: forgot-password.html
// CSS : forgot-password.css
// Lưu ý: OTP hiện tại là OTP demo, chưa gửi email thật.
//======================================================

const step1 = document.getElementById("step1");
const step2 = document.getElementById("step2");
const step3 = document.getElementById("step3");
const stepItem1 = document.getElementById("stepItem1");
const stepItem2 = document.getElementById("stepItem2");
const stepItem3 = document.getElementById("stepItem3");
const line1 = document.getElementById("line1");
const line2 = document.getElementById("line2");

const accountCode = document.getElementById("accountCode");
const cccd = document.getElementById("cccd");
const email = document.getElementById("email");
const accountCodeError = document.getElementById("accountCodeError");
const cccdError = document.getElementById("cccdError");
const emailError = document.getElementById("emailError");
const verifyAccountBtn = document.getElementById("verifyAccountBtn");

const otpInputs = document.querySelectorAll(".otp-input");
const otpError = document.getElementById("otpError");
const verifyOtpBtn = document.getElementById("verifyOtpBtn");
const resendBtn = document.getElementById("resendBtn");
const emailDisplay = document.getElementById("emailDisplay");
const demoCode = document.getElementById("demoCode");
let generatedOtp = "";

const newPassword = document.getElementById("newPassword");
const confirmPassword = document.getElementById("confirmPassword");
const newPasswordError = document.getElementById("newPasswordError");
const confirmPasswordError = document.getElementById("confirmPasswordError");
const resetPasswordBtn = document.getElementById("resetPasswordBtn");
const lengthCheck = document.getElementById("lengthCheck");
const uppercaseCheck = document.getElementById("uppercaseCheck");
const numberCheck = document.getElementById("numberCheck");
const specialCheck = document.getElementById("specialCheck");

const successPopup = document.getElementById("successPopup");
const goLoginBtn = document.getElementById("goLoginBtn");

const verifyOverlay = document.getElementById("verifyOverlay");
const verifyTitle = document.getElementById("verifyTitle");
const verifySubtitle = document.getElementById("verifySubtitle");
const verifyProgress = document.getElementById("verifyProgress");
const verifyChecks = [
  document.getElementById("verifyCheck1"),
  document.getElementById("verifyCheck2"),
  document.getElementById("verifyCheck3"),
  document.getElementById("verifyCheck4"),
];

function resetVerifyAnimation() {
  verifyChecks.forEach(function (step, index) {
    step.className = "verify-step";
    step.querySelector(".verify-step-icon").textContent = String(index + 1);
  });
  verifyProgress.style.width = "0%";
}

function runSecureVerification(onComplete) {
  resetVerifyAnimation();

  verifyTitle.textContent = "Đang xác thực thông tin";
  verifySubtitle.textContent =
    "Hệ thống đang đối chiếu dữ liệu tài khoản với cơ sở dữ liệu bảo mật.";

  verifyOverlay.classList.add("show");

  const delays = [250, 750, 1250, 1750];

  verifyChecks.forEach(function (step, index) {
    setTimeout(function () {
      if (index > 0) {
        const prev = verifyChecks[index - 1];
        prev.className = "verify-step done";
        prev.querySelector(".verify-step-icon").textContent = "✓";
      }

      step.className = "verify-step active";
      verifyProgress.style.width = (index + 1) * 25 + "%";
    }, delays[index]);
  });

  setTimeout(function () {
    const last = verifyChecks[verifyChecks.length - 1];
    last.className = "verify-step done";
    last.querySelector(".verify-step-icon").textContent = "✓";
    verifyProgress.style.width = "100%";

    verifyTitle.textContent = "Xác thực hoàn tất";
    verifySubtitle.textContent =
      "Thông tin đã được đối chiếu thành công. Đang chuyển sang bước xác thực 2FA.";

    setTimeout(function () {
      verifyOverlay.classList.remove("show");
      if (typeof onComplete === "function") {
        onComplete();
      }
    }, 650);
  }, 2250);
}

const toastContainer = document.getElementById("toastContainer");

function showToast(type, title, message) {
  // Không tạo trùng cùng một thông báo khi người dùng bấm liên tục
  const toastKey = type + "|" + title + "|" + message;

  const existingToast = Array.from(
    toastContainer.querySelectorAll(".toast"),
  ).find(function (item) {
    return item.dataset.toastKey === toastKey;
  });

  if (existingToast) {
    return;
  }

  const toast = document.createElement("div");
  toast.className = "toast " + type;
  toast.dataset.toastKey = toastKey;

  // ICON
  const toastIcon = document.createElement("div");
  toastIcon.className = "toast-icon";

  if (type === "success") {
    toastIcon.textContent = "✓";
  } else if (type === "error") {
    toastIcon.textContent = "!";
  } else {
    toastIcon.textContent = "i";
  }

  // CONTENT
  const toastContent = document.createElement("div");
  toastContent.className = "toast-content";

  const toastTitle = document.createElement("div");
  toastTitle.className = "toast-title";
  toastTitle.textContent = title;

  const toastMessage = document.createElement("div");
  toastMessage.className = "toast-message";
  toastMessage.textContent = message;

  toastContent.appendChild(toastTitle);
  toastContent.appendChild(toastMessage);

  // NÚT ĐÓNG
  const toastClose = document.createElement("button");
  toastClose.className = "toast-close";
  toastClose.type = "button";
  toastClose.textContent = "×";

  // GHÉP TOAST
  toast.appendChild(toastIcon);
  toast.appendChild(toastContent);
  toast.appendChild(toastClose);

  toastContainer.appendChild(toast);

  // Cho trình duyệt render trạng thái ban đầu rồi mới trượt vào
  requestAnimationFrame(function () {
    requestAnimationFrame(function () {
      toast.classList.add("show");
    });
  });

  let removeTimer = null;

  function closeToast() {
    if (toast.classList.contains("hide")) {
      return;
    }

    toast.classList.remove("show");
    toast.classList.add("hide");

    clearTimeout(removeTimer);

    setTimeout(function () {
      toast.remove();
    }, 400);
  }

  toastClose.addEventListener("click", closeToast);

  // Tự thu vào sau 3 giây
  removeTimer = setTimeout(function () {
    closeToast();
  }, 3000);
}

function showStep(stepNumber) {
  step1.classList.remove("active");
  step2.classList.remove("active");
  step3.classList.remove("active");

  if (stepNumber === 1) {
    step1.classList.add("active");
    stepItem1.className = "step active";
    stepItem2.className = "step";
    stepItem3.className = "step";
    line1.classList.remove("active");
    line2.classList.remove("active");
  }
  if (stepNumber === 2) {
    step2.classList.add("active");
    stepItem1.className = "step completed";
    stepItem2.className = "step active";
    stepItem3.className = "step";
    line1.classList.add("active");
    line2.classList.remove("active");
  }
  if (stepNumber === 3) {
    step3.classList.add("active");
    stepItem1.className = "step completed";
    stepItem2.className = "step completed";
    stepItem3.className = "step active";
    line1.classList.add("active");
    line2.classList.add("active");
  }
}

function isValidEmail(value) {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value);
}

verifyAccountBtn.addEventListener("click", function () {
  accountCodeError.textContent = "";
  cccdError.textContent = "";
  emailError.textContent = "";
  let valid = true;

  if (accountCode.value.trim() === "") {
    accountCodeError.textContent = "Vui lòng nhập mã tài khoản.";
    valid = false;
  }

  const cccdValue = cccd.value.trim();
  if (cccdValue === "") {
    cccdError.textContent = "Vui lòng nhập số CCCD.";
    valid = false;
  } else if (!/^\d{12}$/.test(cccdValue)) {
    cccdError.textContent = "CCCD phải gồm đúng 12 chữ số.";
    valid = false;
  }

  const emailValue = email.value.trim();
  if (emailValue === "") {
    emailError.textContent = "Vui lòng nhập email.";
    valid = false;
  } else if (!isValidEmail(emailValue)) {
    emailError.textContent = "Địa chỉ email không hợp lệ.";
    valid = false;
  }

  if (!valid) {
    showToast(
      "error",
      "Xác thực chưa thành công",
      "Vui lòng kiểm tra lại Mã tài khoản, CCCD và Email.",
    );
    return;
  }

  emailDisplay.textContent = emailValue;

  verifyAccountBtn.disabled = true;
  verifyAccountBtn.textContent = "Đang xác thực...";

  runSecureVerification(function () {
    generateOtp();

    showToast(
      "success",
      "Xác thực tài khoản thành công",
      "Thông tin tài khoản đã được đối chiếu với hệ thống.",
    );

    showStep(2);
    otpInputs[0].focus();

    verifyAccountBtn.disabled = false;
    verifyAccountBtn.textContent = "Tiến hành xác thực";
  });
});

function generateOtp() {
  generatedOtp = Math.floor(100000 + Math.random() * 900000).toString();
  demoCode.textContent = generatedOtp;
}

otpInputs.forEach(function (input, index) {
  input.addEventListener("input", function () {
    input.value = input.value.replace(/\D/g, "");
    if (input.value && index < otpInputs.length - 1) {
      otpInputs[index + 1].focus();
    }
  });

  input.addEventListener("keydown", function (event) {
    if (event.key === "Backspace" && input.value === "" && index > 0) {
      otpInputs[index - 1].focus();
    }
  });

  input.addEventListener("paste", function (event) {
    event.preventDefault();
    const pasted = (event.clipboardData || window.clipboardData)
      .getData("text")
      .replace(/\D/g, "")
      .slice(0, 6);
    pasted.split("").forEach((char, i) => {
      if (otpInputs[i]) otpInputs[i].value = char;
    });
    const lastIndex = Math.min(pasted.length, 6) - 1;
    if (lastIndex >= 0) otpInputs[lastIndex].focus();
  });
});

function getOtpValue() {
  let value = "";
  otpInputs.forEach(function (input) {
    value += input.value;
  });
  return value;
}

verifyOtpBtn.addEventListener("click", function () {
  otpError.textContent = "";
  const enteredOtp = getOtpValue();

  if (enteredOtp.length !== 6) {
    otpError.textContent = "Vui lòng nhập đủ 6 chữ số.";
    showToast(
      "error",
      "Mã xác thực chưa hợp lệ",
      "Bạn cần nhập đủ 6 chữ số OTP.",
    );
    return;
  }

  if (enteredOtp !== generatedOtp) {
    otpError.textContent = "Mã xác thực không chính xác.";
    showToast(
      "error",
      "Xác thực 2FA thất bại",
      "Mã OTP bạn nhập không chính xác.",
    );
    return;
  }

  verifyOtpBtn.disabled = true;
  verifyOtpBtn.textContent = "Đang kiểm tra...";

  resetVerifyAnimation();
  verifyTitle.textContent = "Đang xác thực mã 2FA";
  verifySubtitle.textContent =
    "Hệ thống đang kiểm tra tính hợp lệ của mã xác thực và phiên bảo mật.";
  verifyOverlay.classList.add("show");

  verifyChecks.forEach(function (step) {
    step.style.display = "none";
  });

  verifyProgress.style.width = "35%";

  setTimeout(function () {
    verifyProgress.style.width = "72%";
  }, 500);

  setTimeout(function () {
    verifyProgress.style.width = "100%";
    verifyTitle.textContent = "Xác thực 2FA thành công";
    verifySubtitle.textContent =
      "Phiên xác thực hợp lệ. Bạn được phép thiết lập mật khẩu mới.";
  }, 1050);

  setTimeout(function () {
    verifyOverlay.classList.remove("show");

    verifyChecks.forEach(function (step) {
      step.style.display = "flex";
    });

    showToast(
      "success",
      "Xác thực 2FA thành công",
      "Mã OTP chính xác. Quyền cấp lại mật khẩu đã được mở.",
    );

    showStep(3);
    newPassword.focus();

    verifyOtpBtn.disabled = false;
    verifyOtpBtn.textContent = "Xác thực mã";
  }, 1650);
});

resendBtn.addEventListener("click", function () {
  otpError.textContent = "";
  otpInputs.forEach(function (input) {
    input.value = "";
  });
  generateOtp();
  otpInputs[0].focus();
  resendBtn.textContent = "Đã gửi lại mã";

  showToast(
    "info",
    "Đã gửi lại mã xác thực",
    "Một mã OTP mới đã được tạo cho phiên xác thực này.",
  );

  setTimeout(function () {
    resendBtn.textContent = "Gửi lại mã";
  }, 2000);
});

document.getElementById("backStep1").addEventListener("click", function () {
  showStep(1);
});
document.getElementById("backStep2").addEventListener("click", function () {
  showStep(2);
});

document.querySelectorAll(".toggle-password").forEach(function (button) {
  button.addEventListener("click", function () {
    const targetId = button.getAttribute("data-target");
    const input = document.getElementById(targetId);
    if (input.type === "password") {
      input.type = "text";
      button.textContent = "⊘";
    } else {
      input.type = "password";
      button.textContent = "👁";
    }
  });
});

newPassword.addEventListener("input", function () {
  const value = newPassword.value;
  setRequirement(lengthCheck, value.length >= 8);
  setRequirement(uppercaseCheck, /[A-Z]/.test(value));
  setRequirement(numberCheck, /[0-9]/.test(value));
  setRequirement(specialCheck, /[!@#$%^&*(),.?":{}| < >]/.test(value));
});

function setRequirement(element, valid) {
  const icon = element.querySelector("span");
  if (valid) {
    element.classList.add("valid");
    icon.textContent = "✓";
  } else {
    element.classList.remove("valid");
    icon.textContent = "○";
  }
}

resetPasswordBtn.addEventListener("click", function () {
  newPasswordError.textContent = "";
  confirmPasswordError.textContent = "";
  const password = newPassword.value;
  const confirm = confirmPassword.value;
  let valid = true;

  if (password === "") {
    newPasswordError.textContent = "Vui lòng nhập mật khẩu mới.";
    valid = false;
  } else if (password.length < 8) {
    newPasswordError.textContent = "Mật khẩu phải có ít nhất 8 ký tự.";
    valid = false;
  } else if (!/[A-Z]/.test(password)) {
    newPasswordError.textContent = "Mật khẩu cần ít nhất 1 chữ hoa.";
    valid = false;
  } else if (!/[0-9]/.test(password)) {
    newPasswordError.textContent = "Mật khẩu cần ít nhất 1 chữ số.";
    valid = false;
  } else if (!/[!@#$%^&*(),.?":{}| < >]/.test(password)) {
    newPasswordError.textContent = "Mật khẩu cần ít nhất 1 ký tự đặc biệt.";
    valid = false;
  }

  if (confirm === "") {
    confirmPasswordError.textContent = "Vui lòng nhập lại mật khẩu.";
    valid = false;
  } else if (password !== confirm) {
    confirmPasswordError.textContent = "Mật khẩu nhập lại không khớp.";
    valid = false;
  }

  if (!valid) {
    showToast(
      "error",
      "Mật khẩu chưa hợp lệ",
      "Vui lòng kiểm tra các yêu cầu và phần nhập lại mật khẩu.",
    );
    return;
  }

  showToast(
    "success",
    "Cập nhật mật khẩu thành công",
    "Mật khẩu mới đã được xác nhận.",
  );

  setTimeout(function () {
    successPopup.classList.add("show");
  }, 450);
});

goLoginBtn.addEventListener("click", function () {
  navigateWithVault("../html/login.html");
});

cccd.addEventListener("input", function () {
  this.value = this.value.replace(/\D/g, "").slice(0, 12);
});

/* ======================================================
   PAGE TRANSITION - CỬA THÉP TRƯỢT NGANG
====================================================== */

const pageTransition = document.getElementById("pageTransition");

/*
   Khi vào trang:
   2 tấm cửa đang khép ở giữa,
   sau đó trượt thẳng ra trái/phải.
*/
function openVaultPage() {
  if (!pageTransition) {
    return;
  }

  pageTransition.classList.remove("is-hidden", "is-closing", "is-open");

  setTimeout(function () {
    pageTransition.classList.add("is-open");
  }, 80);

  setTimeout(function () {
    pageTransition.classList.add("is-hidden");
  }, 920);
}

/*
   Khi bấm chuyển trang:
   2 tấm cửa trượt từ hai bên vào giữa,
   khóa xoay nhẹ rồi mới đổi trang.
*/
function navigateWithVault(url) {
  if (!pageTransition) {
    window.location.href = url;
    return;
  }

  pageTransition.classList.remove("is-hidden");

  /*
       Giữ trạng thái cửa đang nằm ngoài 2 bên
       trước khi cho nó trượt vào giữa.
    */
  pageTransition.classList.add("is-open");

  requestAnimationFrame(function () {
    requestAnimationFrame(function () {
      pageTransition.classList.add("is-closing");
      pageTransition.classList.remove("is-open");
    });
  });

  setTimeout(function () {
    window.location.href = url;
  }, 820);
}

/* Chỉ các link có data-page-transition mới chạy hiệu ứng */
document.querySelectorAll("a[data-page-transition]").forEach(function (link) {
  link.addEventListener("click", function (event) {
    if (
      event.ctrlKey ||
      event.metaKey ||
      event.shiftKey ||
      link.target === "_blank"
    ) {
      return;
    }

    event.preventDefault();

    navigateWithVault(link.getAttribute("href"));
  });
});

openVaultPage();
