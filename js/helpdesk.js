/* ================================
   1. KHAI BÁO PHẦN TỬ
================================ */

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

/* ================================
   2. CHUẨN HÓA NỘI DUNG TÌM KIẾM
================================ */

function normalizeText(value) {
  return value
    .toLocaleLowerCase("vi")
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "");
}

/* ================================
   3. TÌM KIẾM CÂU HỎI THƯỜNG GẶP
================================ */

function filterFaqs() {
  const keyword = normalizeText(searchInput.value.trim());

  let visibleCount = 0;

  faqItems.forEach((item) => {
    const faqContent = normalizeText(item.textContent);

    const isVisible = keyword === "" || faqContent.includes(keyword);

    item.hidden = !isVisible;

    if (isVisible) {
      visibleCount++;
    }
  });

  emptySearch.hidden = visibleCount > 0;
}

searchInput.addEventListener("input", filterFaqs);

/* ================================
   4. ĐÓNG/MỞ CÂU HỎI FAQ
================================ */

faqItems.forEach((item) => {
  const faqButton = item.querySelector("button");

  faqButton.addEventListener("click", () => {
    const willOpen = !item.classList.contains("open");

    faqItems.forEach((faq) => {
      faq.classList.remove("open");

      const icon = faq.querySelector("b");

      if (icon) {
        icon.textContent = "+";
      }
    });

    if (willOpen) {
      item.classList.add("open");

      const currentIcon = item.querySelector("b");

      if (currentIcon) {
        currentIcon.textContent = "−";
      }
    }
  });
});

/* ================================
   5. CHỌN NHANH DANH MỤC HỖ TRỢ
================================ */

document.querySelectorAll("[data-query]").forEach((button) => {
  button.addEventListener("click", () => {
    searchInput.value = button.dataset.query;

    filterFaqs();

    document.querySelector("#faq").scrollIntoView({
      behavior: "smooth",
    });
  });
});

/* ================================
   6. MỞ FORM GỬI YÊU CẦU
================================ */

function openModal() {
  modal.hidden = false;

  document.body.classList.add("modal-open");
}

document.querySelectorAll(".open-ticket").forEach((button) => {
  button.addEventListener("click", openModal);
});

/* ================================
   7. ĐÓNG FORM GỬI YÊU CẦU
================================ */

function closeModal() {
  modal.hidden = true;

  if (successModal.hidden) {
    document.body.classList.remove("modal-open");
  }
}

const modalCloseButton = document.querySelector(".modal-close");

modalCloseButton.addEventListener("click", closeModal);

modal.addEventListener("mousedown", (event) => {
  if (event.target === modal) {
    closeModal();
  }
});

/* ================================
   8. HỘP KẾT QUẢ GỬI THÀNH CÔNG
================================ */

function closeSuccessModal() {
  successModal.hidden = true;

  document.body.classList.remove("modal-open");
}

successCloseButton.addEventListener("click", closeSuccessModal);

finishButton.addEventListener("click", closeSuccessModal);

successModal.addEventListener("mousedown", (event) => {
  if (event.target === successModal) {
    closeSuccessModal();
  }
});

/* ================================
   9. ĐÓNG HỘP BẰNG PHÍM ESC
================================ */

document.addEventListener("keydown", (event) => {
  if (event.key !== "Escape") {
    return;
  }

  if (!successModal.hidden) {
    closeSuccessModal();
  } else if (!modal.hidden) {
    closeModal();
  }
});

/* ================================
   10. THÔNG BÁO GÓC PHẢI
================================ */

function showSuccessToast() {
  clearTimeout(toastTimer);

  successToast.classList.remove("show");

  /*
   * Khởi động lại animation nếu người dùng
   * gửi nhiều yêu cầu liên tiếp.
   */
  void successToast.offsetWidth;

  successToast.classList.add("show");

  toastTimer = setTimeout(() => {
    successToast.classList.remove("show");
  }, 4500);
}

/* ================================
   11. HIỂN THỊ TÓM TẮT PHIẾU
================================ */

function fillTicketSummary(ticketData) {
  document.querySelector("#summaryName").textContent = ticketData.fullName;

  document.querySelector("#summaryEmail").textContent = ticketData.email;

  document.querySelector("#summarySubject").textContent =
    ticketData.requestSubject;

  document.querySelector("#summaryDescription").textContent =
    ticketData.requestDescription;
}

/* ================================
   12. XỬ LÝ GỬI PHIẾU YÊU CẦU
================================ */

form.addEventListener("submit", (event) => {
  event.preventDefault();

  /*
   * Lấy dữ liệu người dùng đã nhập
   * trước khi xóa nội dung form.
   */
  const formData = new FormData(form);
  const ticketData = Object.fromEntries(formData.entries());

  /*
   * Khóa nút trong thời gian gửi,
   * tránh người dùng bấm nhiều lần.
   */
  submitButton.disabled = true;
  submitButton.textContent = "Đang gửi yêu cầu...";

  /*
   * Mô phỏng quá trình gửi yêu cầu.
   */
  setTimeout(() => {
    fillTicketSummary(ticketData);

    form.reset();

    submitButton.disabled = false;
    submitButton.textContent = "Gửi yêu cầu hỗ trợ →";

    closeModal();

    /*
     * Hiện bảng tóm tắt giữa màn hình.
     */
    successModal.hidden = false;
    document.body.classList.add("modal-open");

    /*
     * Hiện animation thông báo
     * ở góc trên bên phải.
     */
    showSuccessToast();
  }, 900);
});
