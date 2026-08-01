// Cuộn xuống phần “Vị trí đang tuyển nổi bật”
function scrollToJobs() {
  const jobList = document.getElementById("jobList");

  if (!jobList) {
    console.log("Không tìm thấy phần jobList");
    return;
  }

  const jobsSection = jobList.closest("section");

  jobsSection.scrollIntoView({
    behavior: "smooth",
    block: "start",
  });
}

// Tìm kiếm việc làm
function filterJobs() {
  const jobSearch = document.getElementById("jobSearch");
  const jobList = document.getElementById("jobList");

  if (!jobSearch || !jobList) {
    return;
  }

  const keyword = removeVietnameseText(
    jobSearch.value.trim().toLowerCase(),
  );

  const jobs = jobList.querySelectorAll(".job");

  jobs.forEach(function (job) {
    const jobContent = removeVietnameseText(
      `${job.dataset.key || ""} ${job.textContent}`.toLowerCase(),
    );

    job.hidden = keyword !== "" && !jobContent.includes(keyword);
  });

  scrollToJobs();
}

// Chuyển sang trang đăng nhập
function showPage(pageName) {
  if (pageName === "login") {
    window.location.href = "login.html";
  }
}

// Bỏ dấu tiếng Việt khi tìm kiếm
function removeVietnameseText(text) {
  return text
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/đ/g, "d")
    .replace(/Đ/g, "D");
}

document.addEventListener("DOMContentLoaded", function () {
  const jobSearch = document.getElementById("jobSearch");

  if (!jobSearch) {
    return;
  }

  // Nhấn Enter để tìm
  jobSearch.addEventListener("keydown", function (event) {
    if (event.key === "Enter") {
      filterJobs();
    }
  });

  // Xóa hết từ khóa thì hiện lại tất cả việc làm
  jobSearch.addEventListener("input", function () {
    if (jobSearch.value.trim() === "") {
      filterJobs();
    }
  });
});

/* ==================================================
   POPUP CHI TIẾT VIỆC LÀM
   Chỉ điều khiển các nút "Xem chi tiết"
================================================== */
document.addEventListener("DOMContentLoaded", function () {
  const modal = document.getElementById("jobDetailModal");
  const triggers = document.querySelectorAll(".job-detail-trigger");
  const applyButton = document.getElementById("jobDetailApply");

  if (!modal || !triggers.length || !applyButton) {
    return;
  }

  const jobs = {
    frontend: {
      title: "Senior Frontend Developer",
      department: "Khối Công nghệ",
      location: "TP. Hồ Chí Minh",
      type: "Toàn thời gian",
      salary: "30–45 triệu",
      experience: "3+ năm",
      level: "Senior",
      quantity: "02 nhân sự",
      deadline: "30/08/2026",
      description: [
        "Phát triển và tối ưu giao diện web có hiệu năng cao bằng ReactJS, TypeScript.",
        "Phối hợp với UI/UX Designer và Backend Developer để xây dựng sản phẩm hoàn chỉnh.",
        "Đề xuất giải pháp kỹ thuật, review code và hỗ trợ các thành viên trong nhóm.",
        "Tối ưu trải nghiệm người dùng, khả năng truy cập và hiệu suất trên nhiều thiết bị.",
      ],
      requirements: [
        "Tối thiểu 3 năm kinh nghiệm phát triển Frontend.",
        "Thành thạo HTML5, CSS3, JavaScript, ReactJS và quản lý state.",
        "Có kinh nghiệm REST API, Git, responsive design và kiểm thử giao diện.",
        "Tư duy sản phẩm tốt, chủ động và có khả năng làm việc nhóm.",
      ],
      benefits: [
        "Thu nhập cạnh tranh, xét tăng lương 2 lần/năm và thưởng theo hiệu quả.",
        "Đầy đủ BHXH, BHYT; 14 ngày phép và khám sức khỏe định kỳ.",
        "Ngân sách học tập, chứng chỉ chuyên môn và lộ trình thăng tiến rõ ràng.",
        "Thiết bị làm việc hiện đại, du lịch và hoạt động gắn kết hằng năm.",
      ],
    },
    backend: {
      title: "Backend Developer (Node.js)",
      department: "Khối Công nghệ",
      location: "Hà Nội",
      type: "Linh hoạt",
      salary: "25–40 triệu",
      experience: "2+ năm",
      level: "Middle/Senior",
      quantity: "03 nhân sự",
      deadline: "05/09/2026",
      description: [
        "Thiết kế, phát triển và vận hành API, microservices trên nền tảng Node.js.",
        "Xây dựng mô hình dữ liệu, tối ưu truy vấn và bảo đảm tính ổn định của hệ thống.",
        "Phối hợp cùng Frontend, QA và DevOps trong toàn bộ vòng đời sản phẩm.",
        "Theo dõi hiệu năng, xử lý sự cố và cải tiến chất lượng mã nguồn.",
      ],
      requirements: [
        "Tối thiểu 2 năm kinh nghiệm với Node.js, Express hoặc NestJS.",
        "Hiểu rõ RESTful API, SQL/NoSQL, caching và bảo mật ứng dụng.",
        "Có kinh nghiệm Docker, Git và quy trình CI/CD là lợi thế.",
        "Có tư duy hệ thống, kỹ năng phân tích và giao tiếp tốt.",
      ],
      benefits: [
        "Lương cạnh tranh, thưởng dự án và thưởng hiệu suất.",
        "Mô hình làm việc linh hoạt, hỗ trợ thiết bị và chi phí làm việc.",
        "Được tham gia các hệ thống quy mô lớn và chương trình đào tạo chuyên sâu.",
        "Đầy đủ chế độ bảo hiểm, nghỉ phép, du lịch và chăm sóc sức khỏe.",
      ],
    },
    designer: {
      title: "UI/UX Designer",
      department: "Phòng Sản phẩm",
      location: "TP. Hồ Chí Minh",
      type: "Toàn thời gian",
      salary: "20–32 triệu",
      experience: "2+ năm",
      level: "Middle",
      quantity: "02 nhân sự",
      deadline: "10/09/2026",
      description: [
        "Nghiên cứu người dùng và thiết kế trải nghiệm cho sản phẩm web, mobile.",
        "Xây dựng user flow, wireframe, prototype và giao diện hoàn chỉnh trên Figma.",
        "Phối hợp với Product Manager và Developer để bảo đảm chất lượng triển khai.",
        "Phát triển, chuẩn hóa và duy trì hệ thống thiết kế của sản phẩm.",
      ],
      requirements: [
        "Tối thiểu 2 năm kinh nghiệm UI/UX và có portfolio sản phẩm thực tế.",
        "Thành thạo Figma, prototype, auto layout và component system.",
        "Hiểu nguyên tắc thiết kế responsive, accessibility và usability.",
        "Có khả năng trình bày, tiếp nhận phản hồi và làm việc đa phòng ban.",
      ],
      benefits: [
        "Thu nhập cạnh tranh và thưởng theo kết quả sản phẩm.",
        "Chủ động đề xuất ý tưởng, tham gia trực tiếp vào quyết định sản phẩm.",
        "Ngân sách học tập, workshop và công cụ thiết kế chuyên nghiệp.",
        "Bảo hiểm đầy đủ, nghỉ phép, du lịch và môi trường sáng tạo.",
      ],
    },
  };

  const title = document.getElementById("jobDetailTitle");
  const department = document.getElementById("jobDetailDepartment");
  const meta = document.getElementById("jobDetailMeta");
  const description = document.getElementById("jobDetailDescription");
  const requirements = document.getElementById("jobDetailRequirements");
  const benefits = document.getElementById("jobDetailBenefits");
  const summary = document.getElementById("jobDetailSummary");
  const deadline = document.getElementById("jobDetailDeadline");
  let activeJob = null;
  let lastFocusedElement = null;

  function renderList(element, items) {
    element.innerHTML = items.map(function (item) {
      return "<li>" + item + "</li>";
    }).join("");
  }

  function openJobDetail(jobId) {
    const job = jobs[jobId];

    if (!job) {
      return;
    }

    activeJob = job;
    lastFocusedElement = document.activeElement;
    title.textContent = job.title;
    department.textContent = job.department;
    meta.innerHTML =
      '<span><i class="fa-solid fa-location-dot"></i>' + job.location + "</span>" +
      '<span><i class="fa-regular fa-clock"></i>' + job.type + "</span>" +
      '<span><i class="fa-solid fa-coins"></i>' + job.salary + "</span>";
    renderList(description, job.description);
    renderList(requirements, job.requirements);
    renderList(benefits, job.benefits);
    summary.innerHTML =
      "<div><dt>Kinh nghiệm</dt><dd>" + job.experience + "</dd></div>" +
      "<div><dt>Cấp bậc</dt><dd>" + job.level + "</dd></div>" +
      "<div><dt>Số lượng</dt><dd>" + job.quantity + "</dd></div>" +
      "<div><dt>Phòng ban</dt><dd>" + job.department + "</dd></div>";
    deadline.textContent = job.deadline;
    modal.classList.add("is-open");
    modal.setAttribute("aria-hidden", "false");
    document.body.classList.add("job-detail-modal-open");
    modal.querySelector(".job-detail-modal__close").focus();
  }

  function closeJobDetail(restoreFocus) {
    modal.classList.remove("is-open");
    modal.setAttribute("aria-hidden", "true");
    document.body.classList.remove("job-detail-modal-open");

    if (restoreFocus !== false && lastFocusedElement) {
      lastFocusedElement.focus();
    }
  }

  triggers.forEach(function (trigger) {
    trigger.addEventListener("click", function () {
      openJobDetail(trigger.dataset.jobId);
    });
  });

  modal.querySelectorAll("[data-close-job-detail]").forEach(function (button) {
    button.addEventListener("click", function () {
      closeJobDetail(true);
    });
  });

  applyButton.addEventListener("click", function () {
    const position = document.getElementById("applicationPosition");
    const applicationTrigger = document.getElementById("openApplicationModal");

    if (position && activeJob) {
      position.value = activeJob.title;
    }

    closeJobDetail(false);

    if (applicationTrigger) {
      applicationTrigger.click();
    }
  });

  document.addEventListener("keydown", function (event) {
    if (event.key === "Escape" && modal.classList.contains("is-open")) {
      closeJobDetail(true);
    }
  });
});

/* ==================================================
   POPUP ỨNG TUYỂN
   Chỉ điều khiển form mới, không thay đổi chức năng cũ
================================================== */
document.addEventListener("DOMContentLoaded", function () {
  const openButton = document.getElementById("openApplicationModal");
  const modal = document.getElementById("applicationModal");
  const form = document.getElementById("applicationForm");
  const cvInput = document.getElementById("applicationCv");
  const dropzone = document.getElementById("applicationDropzone");
  const fileStatus = document.getElementById("applicationFileStatus");
  const toast = document.getElementById("applicationToast");

  if (!openButton || !modal || !form || !cvInput || !dropzone) {
    return;
  }

  const validExtensions = ["pdf", "doc", "docx"];
  const maximumFileSize = 5 * 1024 * 1024;
  let selectedCv = null;
  let toastTimer;
  let lastFocusedElement;

  function openApplicationModal() {
    lastFocusedElement = document.activeElement;
    modal.classList.add("is-open");
    modal.setAttribute("aria-hidden", "false");
    document.body.classList.add("application-modal-open");

    window.setTimeout(function () {
      document.getElementById("applicantName").focus();
    }, 100);
  }

  function closeApplicationModal() {
    modal.classList.remove("is-open");
    modal.setAttribute("aria-hidden", "true");
    document.body.classList.remove("application-modal-open");

    if (lastFocusedElement) {
      lastFocusedElement.focus();
    }
  }

  function setFieldError(input, message) {
    const field = input.closest(".application-field");

    if (!field) {
      return;
    }

    field.classList.toggle("has-error", Boolean(message));
    field.querySelector(".application-field__error").textContent = message;
  }

  function validateTextFields() {
    const nameInput = document.getElementById("applicantName");
    const emailInput = document.getElementById("applicantEmail");
    const phoneInput = document.getElementById("applicantPhone");
    const positionInput = document.getElementById("applicationPosition");
    const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    const phonePattern = /^(?:\+?84|0)(?:[\s.-]*\d){9}$/;
    let isValid = true;

    if (nameInput.value.trim().length < 2) {
      setFieldError(nameInput, "Vui lòng nhập họ và tên.");
      isValid = false;
    } else {
      setFieldError(nameInput, "");
    }

    if (!emailPattern.test(emailInput.value.trim())) {
      setFieldError(emailInput, "Email chưa đúng định dạng.");
      isValid = false;
    } else {
      setFieldError(emailInput, "");
    }

    if (!phonePattern.test(phoneInput.value.trim())) {
      setFieldError(phoneInput, "Số điện thoại chưa hợp lệ.");
      isValid = false;
    } else {
      setFieldError(phoneInput, "");
    }

    if (!positionInput.value) {
      setFieldError(positionInput, "Vui lòng chọn vị trí ứng tuyển.");
      isValid = false;
    } else {
      setFieldError(positionInput, "");
    }

    return isValid;
  }

  function showFileStatus(type, message) {
    const icon =
      type === "valid"
        ? '<i class="fa-solid fa-circle-check"></i>'
        : '<i class="fa-solid fa-circle-xmark"></i>';

    fileStatus.className =
      "application-file is-visible " +
      (type === "valid" ? "is-valid" : "is-invalid");
    fileStatus.innerHTML = icon + "<span>" + message + "</span>";
    dropzone.classList.toggle("has-file", type === "valid");
    dropzone.classList.toggle("has-error", type !== "valid");
  }

  function validateCv(file) {
    if (!file) {
      selectedCv = null;
      showFileStatus("invalid", "Vui lòng chọn hồ sơ CV.");
      return false;
    }

    const extension = file.name.split(".").pop().toLowerCase();

    if (!validExtensions.includes(extension)) {
      selectedCv = null;
      cvInput.value = "";
      showFileStatus(
        "invalid",
        "Sai định dạng. Chỉ chấp nhận PDF, DOC hoặc DOCX.",
      );
      return false;
    }

    if (file.size > maximumFileSize) {
      selectedCv = null;
      cvInput.value = "";
      showFileStatus("invalid", "Tệp vượt quá dung lượng tối đa 5 MB.");
      return false;
    }

    selectedCv = file;
    showFileStatus("valid", file.name + " — Tệp hợp lệ");
    return true;
  }

  function resetApplicationForm() {
    form.reset();
    selectedCv = null;
    fileStatus.className = "application-file";
    fileStatus.innerHTML = "";
    dropzone.classList.remove("has-file", "has-error", "is-dragging");

    form.querySelectorAll(".application-field").forEach(function (field) {
      field.classList.remove("has-error");
      field.querySelector(".application-field__error").textContent = "";
    });
  }

  function showApplicationToast() {
    window.clearTimeout(toastTimer);
    toast.classList.add("is-visible");
    toastTimer = window.setTimeout(function () {
      toast.classList.remove("is-visible");
    }, 3500);
  }

  openButton.addEventListener("click", openApplicationModal);

  modal.querySelectorAll("[data-close-application]").forEach(function (button) {
    button.addEventListener("click", closeApplicationModal);
  });

  document.addEventListener("keydown", function (event) {
    if (event.key === "Escape" && modal.classList.contains("is-open")) {
      closeApplicationModal();
    }
  });

  cvInput.addEventListener("change", function () {
    validateCv(cvInput.files[0]);
  });

  ["dragenter", "dragover"].forEach(function (eventName) {
    dropzone.addEventListener(eventName, function (event) {
      event.preventDefault();
      dropzone.classList.add("is-dragging");
    });
  });

  ["dragleave", "drop"].forEach(function (eventName) {
    dropzone.addEventListener(eventName, function (event) {
      event.preventDefault();
      dropzone.classList.remove("is-dragging");
    });
  });

  dropzone.addEventListener("drop", function (event) {
    const file = event.dataTransfer.files[0];

    if (validateCv(file)) {
      const transfer = new DataTransfer();
      transfer.items.add(file);
      cvInput.files = transfer.files;
    }
  });

  form.querySelectorAll("input:not([type='file']), select").forEach(
    function (input) {
      input.addEventListener("input", function () {
        setFieldError(input, "");
      });
    },
  );

  form.addEventListener("submit", function (event) {
    event.preventDefault();

    const informationIsValid = validateTextFields();
    const cvIsValid = validateCv(selectedCv || cvInput.files[0]);

    if (!informationIsValid || !cvIsValid) {
      const firstError = form.querySelector(
        ".has-error input, .has-error select, .application-dropzone.has-error",
      );

      if (firstError) {
        firstError.focus();
      }
      return;
    }

    closeApplicationModal();
    showApplicationToast();
    resetApplicationForm();
  });
});
document.addEventListener("DOMContentLoaded", function () {
  /*
   * Danh sách thành phần cần chạy animation.
   * JavaScript tự tìm class nên không cần sửa HTML.
   */
  const animationGroups = [
    {
      selector:
        ".section-title, .section-header, .jobs-header, .featured-jobs-header",
      animation: "reveal-up",
    },
    {
      selector: ".job-card, .job-item, .recruitment-card",
      animation: "reveal-up",
      stagger: true,
    },
    {
      selector: ".company-about-content, .company-about__content",
      animation: "reveal-left",
    },
    {
      selector: ".company-values",
      animation: "reveal-right",
    },
    {
      selector: ".value-card",
      animation: "reveal-right",
      stagger: true,
    },
    {
      selector: ".about-image, .company-image",
      animation: "reveal-zoom",
    },
    {
      selector:
        ".footer-column, .footer-info, .footer-logo, .footer-links",
      animation: "reveal-up",
      stagger: true,
    },
  ];

  const animatedElements = new Set();

  animationGroups.forEach(function (group) {
    const elements = document.querySelectorAll(group.selector);

    elements.forEach(function (element, index) {
      /*
       * Không thêm hai loại animation khác nhau
       * vào cùng một phần tử.
       */
      if (animatedElements.has(element)) {
        return;
      }

      animatedElements.add(element);
      element.classList.add("reveal", group.animation);

      if (group.stagger) {
        const delayNumber = (index % 5) + 1;
        element.classList.add(`reveal-delay-${delayNumber}`);
      }
    });
  });

  const revealElements = document.querySelectorAll(".reveal");

  /* Hỗ trợ trình duyệt cũ */
  if (!("IntersectionObserver" in window)) {
    revealElements.forEach(function (element) {
      element.classList.add("is-visible");
    });
  } else {
    const revealObserver = new IntersectionObserver(
      function (entries, observer) {
        entries.forEach(function (entry) {
          if (entry.isIntersecting) {
            entry.target.classList.add("is-visible");

            /* Animation chỉ chạy một lần */
            observer.unobserve(entry.target);
          }
        });
      },
      {
        threshold: 0.12,
        rootMargin: "0px 0px -40px 0px",
      }
    );

    revealElements.forEach(function (element) {
      revealObserver.observe(element);
    });
  }

  /* =========================================
     TẠO NÚT CUỘN LÊN ĐẦU TRANG
  ========================================= */

  const scrollButton = document.createElement("button");

  scrollButton.className = "scroll-to-top";
  scrollButton.type = "button";
  scrollButton.setAttribute("aria-label", "Cuộn lên đầu trang");
  scrollButton.innerHTML = '<i class="fa-solid fa-arrow-up"></i>';

  document.body.appendChild(scrollButton);

  window.addEventListener("scroll", function () {
    if (window.scrollY > 450) {
      scrollButton.classList.add("show");
    } else {
      scrollButton.classList.remove("show");
    }
  });

  scrollButton.addEventListener("click", function () {
    window.scrollTo({
      top: 0,
      behavior: "smooth",
    });
  });

  /* =========================================
     CUỘN MƯỢT CHO LIÊN KẾT CÓ DẤU #
  ========================================= */

  document.querySelectorAll('a[href^="#"]').forEach(function (link) {
    link.addEventListener("click", function (event) {
      const targetId = this.getAttribute("href");

      if (!targetId || targetId === "#") {
        return;
      }

      const targetElement = document.querySelector(targetId);

      if (targetElement) {
        event.preventDefault();

        targetElement.scrollIntoView({
          behavior: "smooth",
          block: "start",
        });
      }
    });
  });
});