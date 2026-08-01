/* =========================================
   POPUP CHI TIẾT LỊCH PHỎNG VẤN
========================================= */

document.addEventListener("DOMContentLoaded", function () {
  const openInterviewButton = document.getElementById("openInterviewModal");

  const interviewDetailModal = document.getElementById("interviewDetailModal");

  const closeInterviewButton = document.getElementById("closeInterviewModal");

  const confirmInterviewButton = document.getElementById(
    "confirmInterviewModal",
  );

  let lastFocusedElement = null;

  /* Mở popup */
  function openInterviewModal() {
    if (!interviewDetailModal) {
      console.error('Không tìm thấy popup có id="interviewDetailModal".');
      return;
    }

    /*
     * Chỉ cho xem sau khi đã tra cứu hồ sơ.
     * Nếu không cần kiểm tra tra cứu, có thể xóa khối if này.
     */
    if (sessionStorage.getItem("candidateVerified") !== "true") {
      if (typeof showVerificationRequired === "function") {
        showVerificationRequired();
      }

      return;
    }

    lastFocusedElement = document.activeElement;

    interviewDetailModal.classList.add("show");
    interviewDetailModal.setAttribute("aria-hidden", "false");

    document.body.classList.add("modal-open");

    window.requestAnimationFrame(function () {
      if (closeInterviewButton) {
        closeInterviewButton.focus();
      }
    });
  }

  /* Đóng popup */
  function closeInterviewModal() {
    if (!interviewDetailModal) {
      return;
    }

    interviewDetailModal.classList.remove("show");
    interviewDetailModal.setAttribute("aria-hidden", "true");

    document.body.classList.remove("modal-open");

    if (lastFocusedElement) {
      lastFocusedElement.focus();
    }
  }

  /* Bấm nút Xem chi tiết */
  if (openInterviewButton) {
    openInterviewButton.addEventListener("click", function (event) {
      event.preventDefault();
      event.stopPropagation();
      openInterviewModal();
    });
  } else {
    console.error('Không tìm thấy nút có id="openInterviewModal".');
  }

  /* Bấm nút X */
  if (closeInterviewButton) {
    closeInterviewButton.addEventListener("click", function (event) {
      event.preventDefault();
      closeInterviewModal();
    });
  }

  /* Bấm nút Đã hiểu */
  if (confirmInterviewButton) {
    confirmInterviewButton.addEventListener("click", function (event) {
      event.preventDefault();
      closeInterviewModal();
    });
  }

  /* Bấm vào vùng nền bên ngoài để đóng */
  if (interviewDetailModal) {
    interviewDetailModal.addEventListener("click", function (event) {
      if (event.target === interviewDetailModal) {
        closeInterviewModal();
      }
    });
  }

  /* Nhấn Escape để đóng */
  document.addEventListener("keydown", function (event) {
    if (
      event.key === "Escape" &&
      interviewDetailModal &&
      interviewDetailModal.classList.contains("show")
    ) {
      closeInterviewModal();
    }
  });
});
