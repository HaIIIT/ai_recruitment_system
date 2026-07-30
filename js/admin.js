const colors = ["blue", "violet", "green", "orange"];
const year = new Date().getFullYear();

let users = [
  {
    id: 1,
    name: "Nguyễn Hoàng Minh",
    accountCode: `VT-${year}-0001`,
    phone: "0901234567",
    email: "minh@viettech.vn",
    role: "Admin",
    status: "Đang hoạt động",
    last: "5 phút trước",
    color: "blue",
  },
  {
    id: 2,
    name: "Trần Thu Hà",
    accountCode: `VT-${year}-0002`,
    phone: "0912345678",
    email: "ha.tran@viettech.vn",
    role: "HR",
    status: "Đang hoạt động",
    last: "25 phút trước",
    color: "violet",
  },
  {
    id: 3,
    name: "Lê Minh Anh",
    accountCode: `VT-${year}-0003`,
    phone: "0988123456",
    email: "anh.le@viettech.vn",
    role: "Manager",
    status: "Đang hoạt động",
    last: "1 giờ trước",
    color: "green",
  },
  {
    id: 4,
    name: "Phạm Quốc Bảo",
    accountCode: `VT-${year}-0004`,
    phone: "0908555666",
    email: "bao.pham@viettech.vn",
    role: "HR",
    status: "Tạm khóa",
    last: "12/07/2026",
    color: "orange",
  },
];


let notifications = [
  {
    id: 3,
    type: "create",
    text: `Bạn đã tạo tài khoản mới VT-${year}-0004 (HR)`,
    time: "2 phút trước",
    unread: true,
  },
  {
    id: 2,
    type: "update",
    text: `Bạn đã cập nhật vai trò tài khoản VT-${year}-0003`,
    time: "1 giờ trước",
    unread: true,
  },
  {
    id: 1,
    type: "delete",
    text: `Bạn đã xóa tài khoản VT-${year}-0001`,
    time: "Hôm qua",
    unread: false,
  },
];

const $ = (selector, root = document) => root.querySelector(selector);

const $$ = (selector, root = document) => [
  ...root.querySelectorAll(selector),
];

function escapeHtml(value) {
  const node = document.createElement("div");
  node.textContent = String(value);
  return node.innerHTML;
}

function initials(name) {
  return name
    .trim()
    .split(/\s+/)
    .slice(-2)
    .map((word) => word[0]?.toUpperCase())
    .join("");
}

function toast(message) {
  const element = $("#toast");

  if (!element) return;

  $("span", element).textContent = message;
  element.classList.add("show");

  clearTimeout(element.hideTimer);

  element.hideTimer = setTimeout(() => {
    element.classList.remove("show");
  }, 3200);
}

function logAdminAction(type, accountCode, description) {
  notifications.unshift({
    id: Date.now(),
    type,
    text: description,
    time: "Vừa xong",
    unread: true,
    targetCode: accountCode,
  });

  renderNotifications();
}

function renderUsers() {
  const keyword = ($("#userSearch")?.value || "")
    .trim()
    .toLowerCase();

  const role = $("#roleFilter")?.value || "";

  const filtered = users.filter((user) => {
    const searchContent = [
      user.name,
      user.email,
      user.accountCode,
    ]
      .join(" ")
      .toLowerCase();

    return (
      searchContent.includes(keyword) &&
      (!role || user.role === role)
    );
  });

  $("#userTableBody").innerHTML = filtered
    .map(
      (user) => `
        <tr>
          <td>
            <div class="user-cell">
              <span class="avatar ${escapeHtml(user.color)}">
                ${initials(user.name)}
              </span>

              <span>
                <b>${escapeHtml(user.name)}</b>

                <small>
                  ${escapeHtml(user.email)}
                  ·
                  ${escapeHtml(user.accountCode)}
                </small>
              </span>
            </div>
          </td>

          <td>
            <span class="role${
              user.role === "Admin" ? " admin" : ""
            }">
              ${escapeHtml(user.role)}
            </span>
          </td>

          <td>
            <span class="status ${
              user.status === "Đang hoạt động"
                ? "active"
                : "locked"
            }">
              ${escapeHtml(user.status)}
            </span>
          </td>

          <td>${escapeHtml(user.last)}</td>

          <td>
            <button
              class="edit-button"
              data-edit-user="${user.id}"
              type="button"
            >
              Chỉnh sửa
            </button>
          </td>
        </tr>
      `,
    )
    .join("");

  $("#emptyUsers").hidden = filtered.length > 0;

  $("#totalUsers").textContent = users.length;

  $("#activeUsers").textContent = users.filter(
    (user) => user.status === "Đang hoạt động",
  ).length;

  $("#adminUsers").textContent = users.filter(
    (user) => user.role === "Admin",
  ).length;

  $("#lockedUsers").textContent = users.filter(
    (user) => user.status === "Tạm khóa",
  ).length;

  $$("[data-edit-user]").forEach((button) => {
    button.addEventListener("click", () => {
      const selectedUser = users.find(
        (user) => user.id === Number(button.dataset.editUser),
      );

      openModal(selectedUser);
    });
  });
}

function notificationIcon(type) {
  const icons = {
    create: "＋",
    update: "↻",
    delete: "×",
    lock: "!",
    reset: "⌁",
    config: "⚙",
  };

  return icons[type] || "i";
}

function renderNotifications() {
  $("#notificationList").innerHTML = notifications.length
    ? notifications
        .map(
          (item) => `
            <button
              class="notification-item${
                item.unread ? " unread" : ""
              }"
              data-notification-id="${item.id}"
              type="button"
            >
              <i class="notification-type ${escapeHtml(item.type)}">
                ${notificationIcon(item.type)}
              </i>

              <span>
                <b>${escapeHtml(item.text)}</b>
                <small>${escapeHtml(item.time)}</small>
              </span>

              ${
                item.unread
                  ? '<em aria-label="Chưa đọc"></em>'
                  : ""
              }
            </button>
          `,
        )
        .join("")
    : '<p class="notification-empty">Chưa có hoạt động nào.</p>';

  const count = notifications.filter(
    (item) => item.unread,
  ).length;

  $("#notificationSummary").textContent =
    `${count} thông báo chưa đọc`;

  $("#notificationCount").textContent =
    count > 99 ? "99+" : count;

  $("#notificationCount").hidden = count === 0;

  $$("[data-notification-id]").forEach((button) => {
    button.addEventListener("click", () => {
      const item = notifications.find(
        (entry) =>
          entry.id === Number(button.dataset.notificationId),
      );

      if (item) {
        item.unread = false;
      }

      renderNotifications();
    });
  });
}

function openModal(user = null) {
  $("#userForm").reset();

  $("#editingId").value = user?.id || "";

  $("#modalEyebrow").textContent = user
    ? "CHỈNH SỬA TÀI KHOẢN"
    : "TÀI KHOẢN MỚI";

  $("#modalTitle").textContent = user
    ? "Chỉnh sửa tài khoản"
    : "Thêm tài khoản mới";

  $("#modalDescription").textContent = user
    ? "Cập nhật thông tin tài khoản nội bộ."
    : "Tạo tài khoản dành cho nhân sự nội bộ.";

  $("#accountCode").value = user?.accountCode || "";
  $("#fullName").value = user?.name || "";
  $("#email").value = user?.email || "";
  $("#phone").value = user?.phone || "";
  $("#role").value = user?.role || "HR";

  $("#status").value =
    user?.status || "Đang hoạt động";

  $("#submitAccount span").textContent = user
    ? "✓ Lưu thay đổi"
    : "＋ Tạo tài khoản";

  $("#submitAccount").disabled = false;

  $("#userModal").classList.add("show");
  $("#userModal").setAttribute("aria-hidden", "false");

  document.body.style.overflow = "hidden";

  setTimeout(() => {
    $("#fullName").focus();
  }, 80);
}

function closeModal() {
  $("#userModal").classList.remove("show");
  $("#userModal").setAttribute("aria-hidden", "true");

  document.body.style.overflow = "";
}

function generatePreviewCode() {
  const sequences = users
    .map((user) =>
      user.accountCode?.match(
        new RegExp(`^VT-${year}-(\\d{4})$`),
      ),
    )
    .filter(Boolean)
    .map((match) => Number(match[1]));

  const nextSequence =
    Math.max(0, ...sequences) + 1;

  return `VT-${year}-${String(nextSequence).padStart(
    4,
    "0",
  )}`;
}

async function submitAccount(event) {
  event.preventDefault();

  const form = event.currentTarget;
  const editingId = Number($("#editingId").value);

  const email = $("#email")
    .value.trim()
    .toLowerCase();

  const phone = $("#phone").value.trim();

  if (!form.reportValidity()) return;

  if (!email.endsWith("@viettech.vn")) {
    $("#email").setCustomValidity(
      "Email phải thuộc tên miền @viettech.vn.",
    );

    $("#email").reportValidity();
    return;
  }

  $("#email").setCustomValidity("");

  if (phone && !/^\d{10}$/.test(phone)) {
    $("#phone").setCustomValidity(
      "Số điện thoại phải gồm đúng 10 chữ số.",
    );

    $("#phone").reportValidity();
    return;
  }

  $("#phone").setCustomValidity("");

  const emailExisted = users.some(
    (user) =>
      user.id !== editingId &&
      user.email.toLowerCase() === email,
  );

  if (emailExisted) {
    toast("Email công ty đã tồn tại.");
    return;
  }

  const submitButton = $("#submitAccount");

  submitButton.disabled = true;
  submitButton.classList.add("loading");

  $("#submitAccount span").textContent = editingId
    ? "Đang lưu thay đổi..."
    : "Đang tạo mã tài khoản...";

  await new Promise((resolve) => {
    setTimeout(resolve, 700);
  });

  // Payload không chứa accountCode.
  const data = {
    name: $("#fullName").value.trim(),
    email,
    phone,
    role: $("#role").value,
    status: $("#status").value,
  };

  if (editingId) {
    const user = users.find(
      (entry) => entry.id === editingId,
    );

    const previousRole = user.role;

    Object.assign(user, data);

    const action =
      previousRole !== data.role
        ? "update"
        : data.status === "Tạm khóa"
          ? "lock"
          : "update";

    logAdminAction(
      action,
      user.accountCode,
      `Bạn đã cập nhật tài khoản ${user.accountCode}`,
    );

    toast(
      `Đã cập nhật tài khoản ${user.accountCode} thành công.`,
    );
  } else {
    /*
     * accountCode không được lấy từ input hoặc đưa vào
     * payload phía client.
     *
     * Hàm generatePreviewCode() chỉ mô phỏng kết quả API
     * dành cho giao diện HTML tĩnh.
     *
     * Khi kết nối backend thật, mã tài khoản phải được sinh
     * trong transaction của cơ sở dữ liệu.
     */
    const accountCode = generatePreviewCode();

    users.unshift({
      id: Date.now(),
      accountCode,
      ...data,
      last: "Vừa tạo",
      color: colors[users.length % colors.length],
    });

    $("#accountCode").value = accountCode;

    logAdminAction(
      "create",
      accountCode,
      `Bạn đã tạo tài khoản mới ${accountCode} (${data.role})`,
    );

    toast(
      `Đã tạo tài khoản ${accountCode} thành công.`,
    );
  }

  renderUsers();

  submitButton.classList.remove("loading");

  setTimeout(closeModal, 350);
}

/* ================================
   CHUYỂN TRANG SIDEBAR
================================ */

$$(".nav-item[data-page]").forEach((button) => {
  button.addEventListener("click", () => {
    const settings =
      button.dataset.page === "settings";

    $$(".nav-item").forEach((item) => {
      item.classList.remove("active");
    });

    $$(".page").forEach((page) => {
      page.classList.remove("active");
    });

    button.classList.add("active");

    $(settings ? "#settingsPage" : "#usersPage")
      .classList.add("active");

    $("#breadcrumbTitle").textContent = settings
      ? "Cấu hình hệ thống"
      : "Quản lý tài khoản";

    history.replaceState(
      null,
      "",
      settings ? "#settings" : "#users",
    );
  });
});

/* ================================
   QUẢN LÝ TÀI KHOẢN
================================ */

$("#userSearch")?.addEventListener(
  "input",
  renderUsers,
);

$("#roleFilter")?.addEventListener(
  "change",
  renderUsers,
);

$("#addUserButton")?.addEventListener(
  "click",
  () => openModal(),
);

$("#closeModal")?.addEventListener(
  "click",
  closeModal,
);

$("#cancelModal")?.addEventListener(
  "click",
  closeModal,
);

$("#userForm")?.addEventListener(
  "submit",
  submitAccount,
);

$("#email")?.addEventListener("input", (event) => {
  event.target.setCustomValidity("");
});

$("#phone")?.addEventListener("input", (event) => {
  event.target.setCustomValidity("");
});

$("#userModal")?.addEventListener(
  "mousedown",
  (event) => {
    if (event.target === event.currentTarget) {
      closeModal();
    }
  },
);

/* ================================
   CHUÔNG THÔNG BÁO
================================ */

$("#notificationButton")?.addEventListener(
  "click",
  (event) => {
    event.stopPropagation();

    $("#notificationPanel").classList.toggle("show");
    $("#helpPanel").classList.remove("show");

    event.currentTarget.setAttribute(
      "aria-expanded",
      String(
        $("#notificationPanel").classList.contains(
          "show",
        ),
      ),
    );
  },
);

$("#helpButton")?.addEventListener(
  "click",
  (event) => {
    event.stopPropagation();

    $("#helpPanel").classList.toggle("show");
    $("#notificationPanel").classList.remove("show");
  },
);

$("#closeHelp")?.addEventListener("click", () => {
  $("#helpPanel").classList.remove("show");
});

$("#markAllRead")?.addEventListener("click", () => {
  notifications.forEach((item) => {
    item.unread = false;
  });

  renderNotifications();

  toast(
    "Đã đánh dấu tất cả thông báo là đã đọc.",
  );
});

$("#viewAllActivity")?.addEventListener(
  "click",
  () => {
    toast(
      "Đã hiển thị toàn bộ lịch sử hoạt động.",
    );
  },
);

document.addEventListener("click", (event) => {
  const notificationPanel = $("#notificationPanel");
  const notificationButton = $("#notificationButton");
  const helpPanel = $("#helpPanel");
  const helpButton = $("#helpButton");

  if (
    !notificationPanel?.contains(event.target) &&
    !notificationButton?.contains(event.target)
  ) {
    notificationPanel?.classList.remove("show");
  }

  if (
    !helpPanel?.contains(event.target) &&
    !helpButton?.contains(event.target)
  ) {
    helpPanel?.classList.remove("show");
  }
});

document.addEventListener("keydown", (event) => {
  if (
    event.key === "Escape" &&
    $("#userModal").classList.contains("show")
  ) {
    closeModal();
  }

  if (
    (event.ctrlKey || event.metaKey) &&
    event.key.toLowerCase() === "k"
  ) {
    event.preventDefault();
    $("#globalSearch")?.focus();
  }
});

/* ================================
   CẤU HÌNH HỆ THỐNG
================================ */

const SETTINGS_KEY = "viettech-admin-settings";

function openSettingsTab(name) {
  $$("[data-settings-tab]").forEach((button) => {
    button.classList.toggle(
      "active",
      button.dataset.settingsTab === name,
    );
  });

  $$("[data-settings-section]").forEach((section) => {
    section.classList.toggle(
      "active",
      section.dataset.settingsSection === name,
    );
  });
}

$$("[data-settings-tab]").forEach((button) => {
  button.addEventListener("click", () => {
    openSettingsTab(button.dataset.settingsTab);
  });
});

$$(".switch").forEach((button) => {
  button.addEventListener("click", () => {
    button.classList.toggle("on");

    button.setAttribute(
      "aria-checked",
      String(button.classList.contains("on")),
    );
  });
});

function collectSettings() {
  const data = {};

  $$(
    "#settingsForm input, " +
      "#settingsForm select, " +
      "#settingsForm textarea",
  ).forEach((field) => {
    if (field.id) {
      data[field.id] = field.value;
    }
  });

  $$(
    "#settingsForm .switch[data-setting]",
  ).forEach((button) => {
    data[button.dataset.setting] =
      button.classList.contains("on");
  });

  return data;
}

$("#saveSettings")?.addEventListener(
  "click",
  () => {
    if (!$("#settingsForm").reportValidity()) {
      return;
    }

    localStorage.setItem(
      SETTINGS_KEY,
      JSON.stringify(collectSettings()),
    );

    logAdminAction(
      "config",
      "SYSTEM",
      "Bạn đã thay đổi cấu hình hệ thống",
    );

    toast("Đã lưu cấu hình hệ thống.");
  },
);

$("#resetSettings")?.addEventListener(
  "click",
  () => {
    const accepted = confirm(
      "Bạn có muốn khôi phục toàn bộ cấu hình mặc định?",
    );

    if (!accepted) return;

    localStorage.removeItem(SETTINGS_KEY);
    $("#settingsForm").reset();

    logAdminAction(
      "config",
      "SYSTEM",
      "Bạn đã khôi phục cấu hình mặc định",
    );

    toast("Đã khôi phục cấu hình mặc định.");
  },
);

$("#backupNow")?.addEventListener("click", () => {
  toast("Đã tạo bản sao lưu dữ liệu.");
});

$("#exportSettings")?.addEventListener(
  "click",
  () => {
    toast("Đã chuẩn bị tệp cấu hình.");
  },
);

$("#maintenanceMode")?.addEventListener(
  "click",
  () => {
    toast("Đã cập nhật chế độ bảo trì.");
  },
);

/* ================================
   GIAO DIỆN SÁNG / TỐI
================================ */

const APPEARANCE_KEY =
  "viettech-admin-appearance";

const appearanceState = {
  mode: "light",
  accent: "blue",
  density: "comfortable",
};

const accentValues = {
  blue: {
    primary: "#2563eb",
    hover: "#1d4ed8",
    light: "#eff6ff",
  },

  indigo: {
    primary: "#4f46e5",
    hover: "#4338ca",
    light: "#eef2ff",
  },

  teal: {
    primary: "#0f9b81",
    hover: "#0b7f6b",
    light: "#ecfdf8",
  },
};

function applyAppearance() {
  const prefersDark = window.matchMedia(
    "(prefers-color-scheme: dark)",
  ).matches;

  const useDark =
    appearanceState.mode === "dark" ||
    (
      appearanceState.mode === "system" &&
      prefersDark
    );

  document.body.classList.toggle(
    "theme-dark",
    useDark,
  );

  document.body.classList.toggle(
    "density-compact",
    appearanceState.density === "compact",
  );

  const selectedColors =
    accentValues[appearanceState.accent] ||
    accentValues.blue;

  document.documentElement.style.setProperty(
    "--color-primary",
    selectedColors.primary,
  );

  document.documentElement.style.setProperty(
    "--color-primary-hover",
    selectedColors.hover,
  );

  document.documentElement.style.setProperty(
    "--color-primary-light",
    selectedColors.light,
  );

  $$("[data-theme-mode]").forEach((button) => {
    const selected =
      button.dataset.themeMode ===
      appearanceState.mode;

    button.classList.toggle(
      "selected",
      selected,
    );

    button.setAttribute(
      "aria-checked",
      String(selected),
    );
  });

  $$("[data-accent]").forEach((button) => {
    button.classList.toggle(
      "selected",
      button.dataset.accent ===
        appearanceState.accent,
    );
  });

  $$("[data-density]").forEach((button) => {
    button.classList.toggle(
      "active",
      button.dataset.density ===
        appearanceState.density,
    );
  });

  const sampleColor = $("#sampleColor");

  if (sampleColor) {
    sampleColor.textContent =
      selectedColors.primary.toUpperCase();
  }

  const uiSample = $("#uiSample");

  if (uiSample) {
    uiSample.style.setProperty(
      "--color-primary",
      selectedColors.primary,
    );
  }
}

function saveAppearance(
  message = "Đã lưu tùy chọn giao diện.",
) {
  localStorage.setItem(
    APPEARANCE_KEY,
    JSON.stringify(appearanceState),
  );

  toast(message);
}

$$("[data-theme-mode]").forEach((button) => {
  button.addEventListener("click", () => {
    appearanceState.mode =
      button.dataset.themeMode;

    applyAppearance();

    localStorage.setItem(
      APPEARANCE_KEY,
      JSON.stringify(appearanceState),
    );
  });
});

$$("[data-accent]").forEach((button) => {
  button.addEventListener("click", () => {
    appearanceState.accent =
      button.dataset.accent;

    applyAppearance();
  });
});

$$("[data-density]").forEach((button) => {
  button.addEventListener("click", () => {
    appearanceState.density =
      button.dataset.density;

    applyAppearance();
  });
});

$("#saveAppearance")?.addEventListener(
  "click",
  () => {
    saveAppearance();
  },
);

$("#resetAppearance")?.addEventListener(
  "click",
  () => {
    Object.assign(appearanceState, {
      mode: "light",
      accent: "blue",
      density: "comfortable",
    });

    applyAppearance();

    saveAppearance(
      "Đã khôi phục giao diện mặc định.",
    );
  },
);

/* Đọc giao diện đã lưu */

try {
  const savedAppearance = JSON.parse(
    localStorage.getItem(APPEARANCE_KEY),
  );

  Object.assign(
    appearanceState,
    savedAppearance || {},
  );
} catch (error) {
  localStorage.removeItem(APPEARANCE_KEY);
}

/* Tự đổi khi giao diện hệ thống thay đổi */

window
  .matchMedia("(prefers-color-scheme: dark)")
  .addEventListener("change", () => {
    if (appearanceState.mode === "system") {
      applyAppearance();
    }
  });

/* ================================
   KHỞI TẠO
================================ */

applyAppearance();
renderUsers();
renderNotifications();

if (location.hash === "#settings") {
  $('.nav-item[data-page="settings"]')?.click();
}
/* ================================
   TÌM KIẾM NHANH TRÊN TOPBAR
================================ */

function normalizeSearchText(value) {
  return String(value)
    .toLocaleLowerCase("vi")
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/đ/g, "d")
    .trim();
}

/* Từ khóa tương ứng với từng mục cấu hình */
const quickSearchSections = [
  {
    tab: "general",
    keywords:
      "cai dat chung doanh nghiep cong ty ten he thong ngon ngu khu vuc mui gio dia chi",
  },
  {
    tab: "recruitment",
    keywords:
      "cau hinh tuyen dung quy trinh ho so ung vien cv ai tin tuyen dung",
  },
  {
    tab: "notifications",
    keywords:
      "email thong bao bao cao nhac lich phong van dang nhap thiet bi",
  },
  {
    tab: "security",
    keywords:
      "bao mat mat khau xac thuc hai lop 2fa khoa tai khoan phien dang nhap",
  },
  {
    tab: "appearance",
    keywords:
      "giao dien hien thi sang toi theo he thong mau chu dao mat do",
  },
  {
    tab: "data",
    keywords:
      "du lieu he thong sao luu khoi phuc xuat cau hinh bao tri backup",
  },
];

/* Mở trang tương ứng trên sidebar */
function openQuickSearchPage(pageName) {
  const navigationButton = document.querySelector(
    `.nav-item[data-page="${pageName}"]`,
  );

  navigationButton?.click();
}

/* Thực hiện tìm kiếm */
function runQuickSearch() {
  const globalSearch = document.querySelector("#globalSearch");

  const keyword = normalizeSearchText(
    globalSearch?.value || "",
  );

  /* Khi xóa hết nội dung tìm kiếm */
  if (!keyword) {
    const userSearch = document.querySelector("#userSearch");

    if (userSearch) {
      userSearch.value = "";
      renderUsers();
    }

    return;
  }

  /* Kiểm tra có phải đang tìm mục cấu hình không */
  const matchedSection = quickSearchSections.find(
    (section) => {
      if (keyword.length <= 2) {
        return section.keywords
          .split(/\s+/)
          .includes(keyword);
      }

      return section.keywords.includes(keyword);
    },
  );

  /* Nếu tìm thấy mục cấu hình */
  if (matchedSection) {
    openQuickSearchPage("settings");
    openSettingsTab(matchedSection.tab);
    return;
  }

  /* Nếu không phải cấu hình thì tìm tài khoản */
  openQuickSearchPage("users");

  const userSearch = document.querySelector("#userSearch");

  if (userSearch) {
    userSearch.value = globalSearch.value.trim();
    renderUsers();
  }
}

/* Tự tìm sau 0,22 giây */
let quickSearchTimer;

document
  .querySelector("#globalSearch")
  ?.addEventListener("input", () => {
    clearTimeout(quickSearchTimer);

    quickSearchTimer = setTimeout(
      runQuickSearch,
      220,
    );
  });

/* Enter để tìm, Escape để xóa */
document
  .querySelector("#globalSearch")
  ?.addEventListener("keydown", (event) => {
    if (event.key === "Enter") {
      event.preventDefault();

      clearTimeout(quickSearchTimer);
      runQuickSearch();
    }

    if (event.key === "Escape") {
      event.currentTarget.value = "";

      runQuickSearch();
      event.currentTarget.blur();
    }
  });

/* Ctrl + K để chọn nhanh ô tìm kiếm */
document.addEventListener("keydown", (event) => {
  if (
    (event.ctrlKey || event.metaKey) &&
    event.key.toLowerCase() === "k"
  ) {
    event.preventDefault();

    document
      .querySelector("#globalSearch")
      ?.focus();
  }
});