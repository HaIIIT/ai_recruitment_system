/* =========================
   CHỈNH SỬA HỒ SƠ
========================= */

const editProfileButton = document.getElementById("saveTop");
const profileForm = document.getElementById("profileForm");

let isEditingProfile = false;

/* Các nút chức năng chỉ được dùng khi đang chỉnh sửa */
const profileActionButtons = document.querySelectorAll(
  `
  .photo-wrap button,
  .text-button,
  .experience-top button,
  .skills button,
  .skill-button,
  .upload-button
  `,
);

/* Khóa hoặc mở các trường hồ sơ */
function setProfileEditMode(isEditing) {
  isEditingProfile = isEditing;

  /* Khóa/mở input và textarea trong hồ sơ */
  profileForm
    .querySelectorAll("input:not([type='file']), textarea, select")
    .forEach(function (field) {
      field.readOnly = !isEditing;

      if (field.tagName === "SELECT") {
        field.disabled = !isEditing;
      }

      field.classList.toggle("field-locked", !isEditing);
    });

  /* Khóa/mở các nút thêm, xóa, tải CV... */
  profileActionButtons.forEach(function (button) {
    button.disabled = !isEditing;
  });

  /* Thay nội dung nút chính */
  if (isEditing) {
    editProfileButton.innerHTML = `
      <span aria-hidden="true">💾</span>
      Lưu thay đổi
    `;

    editProfileButton.classList.add("saving-mode");
  } else {
    editProfileButton.innerHTML = `
      <span aria-hidden="true">✍︎</span>
      Chỉnh sửa hồ sơ
    `;

    editProfileButton.classList.remove("saving-mode");
  }
}

/* Ban đầu khóa hồ sơ */
setProfileEditMode(false);

/* Nhấn Chỉnh sửa/Lưu thay đổi */
editProfileButton.addEventListener("click", function () {
  /* Lần đầu: mở khóa hồ sơ */
  if (!isEditingProfile) {
    setProfileEditMode(true);

    const firstField = profileForm.querySelector("input, textarea");

    if (firstField) {
      firstField.focus();
    }

    return;
  }

  /* Lần thứ hai: kiểm tra và lưu */
  if (!profileForm.checkValidity()) {
    profileForm.reportValidity();
    return;
  }

  /* Cập nhật tên và vị trí sau khi lưu */
  updateProfileHeader();

  /* Ghi nhận ảnh đại diện mới */
  oldAvatarSource = profileAvatar.src;

  setProfileEditMode(false);
  showSuccessToast("Cập nhật hồ sơ thành công");
});

/* Ngăn form hồ sơ tải lại trang */
profileForm.addEventListener("submit", function (event) {
  event.preventDefault();
});

/* =========================
   ĐỔI ẢNH ĐẠI DIỆN
========================= */

const profileAvatar = document.getElementById("profileAvatar");
const avatarInput = document.getElementById("avatarInput");
const changeAvatarButton = document.getElementById("changeAvatarButton");

let oldAvatarSource = profileAvatar.src;
let selectedAvatarSource = null;

/* Nhấn nút Đổi ảnh */
changeAvatarButton.addEventListener("click", function () {
  if (!isEditingProfile) {
    showSuccessToast("Hãy nhấn Chỉnh sửa hồ sơ trước");
    return;
  }

  avatarInput.click();
});

/* Chọn ảnh từ máy */
avatarInput.addEventListener("change", function () {
  const selectedFile = this.files[0];

  if (!selectedFile) {
    return;
  }

  /* Chỉ cho phép chọn ảnh */
  const allowedTypes = ["image/jpeg", "image/png", "image/webp"];

  if (!allowedTypes.includes(selectedFile.type)) {
    this.value = "";
    showSuccessToast("Chỉ chấp nhận ảnh JPG, PNG hoặc WEBP");
    return;
  }

  /* Giới hạn dung lượng 5 MB */
  const maximumSize = 5 * 1024 * 1024;

  if (selectedFile.size > maximumSize) {
    this.value = "";
    showSuccessToast("Dung lượng ảnh không được vượt quá 5 MB");
    return;
  }

  /* Xóa URL ảnh xem trước trước đó */
  if (selectedAvatarSource) {
    URL.revokeObjectURL(selectedAvatarSource);
  }

  selectedAvatarSource = URL.createObjectURL(selectedFile);
  profileAvatar.src = selectedAvatarSource;

  showSuccessToast("Đã chọn ảnh đại diện mới");
});

/* =========================
   MODAL THÊM KINH NGHIỆM
========================= */

const experienceModal = document.getElementById("experienceModal");
const experienceForm = document.getElementById("experienceForm");
const currentJob = document.getElementById("currentJob");
const endDate = document.getElementById("endDate");

function openExperienceModal() {
  /* Không cho mở nếu chưa bật chỉnh sửa */
  if (!isEditingProfile) {
    showSuccessToast("Hãy nhấn Chỉnh sửa hồ sơ trước");
    return;
  }

  experienceModal.classList.add("show");
  document.body.style.overflow = "hidden";
}

function closeExperienceModal() {
  experienceModal.classList.remove("show");
  document.body.style.overflow = "";
}

/* Chọn đang làm việc thì khóa ngày kết thúc */
currentJob.addEventListener("change", function () {
  endDate.disabled = this.checked;

  if (this.checked) {
    endDate.value = "";
  }
});

/* Nhấn vào vùng tối để đóng */
experienceModal.addEventListener("click", function (event) {
  if (event.target === experienceModal) {
    closeExperienceModal();
  }
});

/* Nhấn Escape để đóng */
document.addEventListener("keydown", function (event) {
  if (event.key === "Escape" && experienceModal.classList.contains("show")) {
    closeExperienceModal();
  }
});

/* Lưu kinh nghiệm */
experienceForm.addEventListener("submit", function (event) {
  event.preventDefault();

  showSuccessToast("Thêm kinh nghiệm thành công");

  experienceForm.reset();
  endDate.disabled = false;
  closeExperienceModal();
});

/* =========================
   THÔNG BÁO THÀNH CÔNG
========================= */

let toastTimer;

function showSuccessToast(message = "Thao tác thành công", type = "success") {
  const toast = document.getElementById("successToast");
  const toastTitle = document.getElementById("toastTitle");
  const toastIcon = document.getElementById("toastIcon");
  const toastMessage = document.getElementById("toastMessage");

  if (!toast || !toastTitle || !toastIcon || !toastMessage) {
    return;
  }

  clearTimeout(toastTimer);
  const isError = type === "error";

  toast.classList.toggle("is-error", isError);
  toastTitle.textContent = isError
    ? "Tệp CV không hợp lệ!"
    : "Thao tác thành công!";
  toastIcon.textContent = isError ? "✕" : "✓";
  toastMessage.textContent = message;

  /* Khởi động lại hiệu ứng trượt vào giống thông báo Helpdesk */
  toast.classList.remove("show");
  void toast.offsetWidth;
  toast.classList.add("show");

  toastTimer = setTimeout(function () {
    hideSuccessToast();
  }, 4500);
}

function hideSuccessToast() {
  const toast = document.getElementById("successToast");

  if (!toast) {
    return;
  }

  toast.classList.remove("show");
  clearTimeout(toastTimer);
}
/* =========================
   CẬP NHẬT TÊN VÀ VỊ TRÍ Ở ĐẦU HỒ SƠ
========================= */

const fullNameInput = profileForm.querySelector('input[name="fullName"]');

const positionInput = profileForm.querySelector('input[name="position"]');

const profileDisplayName = document.getElementById("profileDisplayName");

const profileDisplayJob = document.getElementById("profileDisplayJob");

function updateProfileHeader() {
  profileDisplayName.textContent =
    fullNameInput.value.trim() || "Chưa cập nhật họ tên";

  profileDisplayJob.textContent =
    positionInput.value.trim() || "Chưa cập nhật vị trí";
}

/* Hiển thị dữ liệu có sẵn khi mở trang */
updateProfileHeader();
profileAvatar.addEventListener("error", function () {
  this.removeAttribute("src");
});

/* =========================
   TẢI CV MỚI
========================= */

const cvInput = document.getElementById("cvInput");
const uploadCvButton = document.getElementById("uploadCv");
const cvFileBox = document.querySelector(".cv-file");
const cvFileName = cvFileBox.querySelector("strong");
const cvFileInformation = cvFileBox.querySelector("small");
const cvFileIcon = cvFileBox.querySelector(".pdf-icon");

/* Nhấn nút Tải CV mới */
uploadCvButton.addEventListener("click", function () {
  if (!isEditingProfile) {
    showSuccessToast("Hãy nhấn Chỉnh sửa hồ sơ trước");
    return;
  }

  /* Xóa lựa chọn cũ để có thể chọn lại cùng một file */
  cvInput.value = "";
  cvInput.click();
});

/* Khi chọn CV từ máy */
cvInput.addEventListener("change", function () {
  const selectedFile = this.files[0];

  if (!selectedFile) {
    return;
  }

  /* Lấy phần mở rộng của file */
  const fileExtension = selectedFile.name.split(".").pop().toLowerCase();

  /* Chỉ cho phép PDF, DOC và DOCX */
  const allowedExtensions = ["pdf", "doc", "docx"];

  if (!allowedExtensions.includes(fileExtension)) {
    this.value = "";

    showSuccessToast(
      "Sai định dạng. Chỉ chấp nhận tệp PDF, DOC hoặc DOCX.",
      "error",
    );
    return;
  }

  /* Giới hạn dung lượng tối đa 5 MB */
  const maximumSize = 5 * 1024 * 1024;

  if (selectedFile.size > maximumSize) {
    this.value = "";

    showSuccessToast("Dung lượng CV không được vượt quá 5 MB.", "error");
    return;
  }

  /* Không chấp nhận file rỗng */
  if (selectedFile.size === 0) {
    this.value = "";

    showSuccessToast("Tệp CV đang bị rỗng hoặc không hợp lệ.", "error");
    return;
  }

  /* Hiển thị tên CV */
  cvFileName.textContent = selectedFile.name;

  /* Hiển thị biểu tượng định dạng */
  cvFileIcon.textContent = fileExtension.toUpperCase();

  /* Hiển thị ngày và dung lượng */
  const currentDate = new Date().toLocaleDateString("vi-VN");

  cvFileInformation.textContent = `Cập nhật ${currentDate} · ${formatFileSize(selectedFile.size)}`;

  /* Thay đổi giao diện để báo đã chọn file */
  cvFileBox.classList.add("cv-selected");

  showSuccessToast("Đã chọn CV mới, hãy nhấn Lưu thay đổi");
});

/* Định dạng dung lượng file */
function formatFileSize(fileSize) {
  const oneMegabyte = 1024 * 1024;

  if (fileSize >= oneMegabyte) {
    return `${(fileSize / oneMegabyte).toFixed(1)} MB`;
  }

  return `${Math.ceil(fileSize / 1024)} KB`;
}
/* =========================
   THÊM VÀ XÓA KỸ NĂNG
========================= */

const skillsContainer = document.getElementById("skills");
const skillInput = document.getElementById("skillInput");
const addSkillButton = document.getElementById("addSkillButton");

/* Thêm kỹ năng mới */
function addSkill() {
  if (!isEditingProfile) {
    showSuccessToast("Hãy nhấn Chỉnh sửa hồ sơ trước");
    return;
  }

  const skillName = skillInput.value.trim();

  /* Không cho nhập trống */
  if (!skillName) {
    showSuccessToast("Vui lòng nhập tên kỹ năng");
    skillInput.focus();
    return;
  }

  /* Giới hạn độ dài */
  if (skillName.length > 30) {
    showSuccessToast("Tên kỹ năng không được vượt quá 30 ký tự");
    skillInput.focus();
    return;
  }

  /* Lấy danh sách kỹ năng hiện tại */
  const existingSkills = Array.from(
    skillsContainer.querySelectorAll("span"),
  ).map(function (skillItem) {
    const skillCopy = skillItem.cloneNode(true);
    const deleteButton = skillCopy.querySelector("button");

    if (deleteButton) {
      deleteButton.remove();
    }

    return skillCopy.textContent.trim().toLowerCase();
  });

  /* Không cho thêm kỹ năng trùng */
  if (existingSkills.includes(skillName.toLowerCase())) {
    showSuccessToast("Kỹ năng này đã có trong danh sách");
    skillInput.select();
    return;
  }

  /* Tạo thẻ kỹ năng */
  const skillItem = document.createElement("span");
  const skillText = document.createTextNode(`${skillName} `);

  const deleteButton = document.createElement("button");
  deleteButton.type = "button";
  deleteButton.textContent = "×";
  deleteButton.setAttribute("aria-label", `Xóa kỹ năng ${skillName}`);

  skillItem.appendChild(skillText);
  skillItem.appendChild(deleteButton);
  skillsContainer.appendChild(skillItem);

  skillInput.value = "";
  skillInput.focus();

  showSuccessToast(`Đã thêm kỹ năng ${skillName}`);
}

/* Nhấn nút Thêm kỹ năng */
addSkillButton.addEventListener("click", function () {
  addSkill();
});

/* Nhấn Enter trong ô nhập */
skillInput.addEventListener("keydown", function (event) {
  if (event.key === "Enter") {
    event.preventDefault();
    addSkill();
  }
});

/* Xóa kỹ năng bằng dấu × */
skillsContainer.addEventListener("click", function (event) {
  const deleteButton = event.target.closest("button");

  if (!deleteButton) {
    return;
  }

  if (!isEditingProfile) {
    showSuccessToast("Hãy nhấn Chỉnh sửa hồ sơ trước");
    return;
  }

  const skillItem = deleteButton.closest("span");

  if (!skillItem) {
    return;
  }

  const skillName = skillItem.firstChild.textContent.trim();

  skillItem.remove();
  showSuccessToast(`Đã xóa kỹ năng ${skillName}`);
});
