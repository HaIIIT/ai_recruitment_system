document.addEventListener("DOMContentLoaded", function () {
    const searchInput = document.getElementById("searchInput");

    const filterButton = document.getElementById("filterButton");
    const filterPanel = document.getElementById("filterPanel");

    const positionFilter = document.getElementById("positionFilter");
    const statusFilter = document.getElementById("statusFilter");
    const scoreFilter = document.getElementById("scoreFilter");

    const clearFilterButton = document.getElementById(
        "clearFilterButton"
    );

    const exportButton = document.getElementById("exportButton");

    const openAddModalButton = document.getElementById(
        "openAddModalButton"
    );

    const candidateModal = document.getElementById("candidateModal");
    const modalTitle = document.getElementById("modalTitle");

    const closeModalButton = document.getElementById(
        "closeModalButton"
    );

    const cancelModalButton = document.getElementById(
        "cancelModalButton"
    );

    const candidateForm = document.getElementById("candidateForm");

    const candidateNameInput = document.getElementById(
        "candidateName"
    );

    const candidateEmailInput = document.getElementById(
        "candidateEmail"
    );

    const candidatePhoneInput = document.getElementById(
        "candidatePhone"
    );

    const candidatePositionInput = document.getElementById(
        "candidatePosition"
    );

    const candidateScoreInput = document.getElementById(
        "candidateScore"
    );

    const candidateStatusInput = document.getElementById(
        "candidateStatus"
    );

    const candidateCVInput = document.getElementById(
        "candidateCV"
    );

    const saveButtonText = document.getElementById(
        "saveButtonText"
    );

    const tableBody = document.getElementById(
        "candidateTableBody"
    );

    const emptyState = document.getElementById("emptyState");

    const contextMenu = document.getElementById("contextMenu");

    const viewCandidateButton = document.getElementById(
        "viewCandidateButton"
    );

    const editCandidateButton = document.getElementById(
        "editCandidateButton"
    );

    const changeStatusButton = document.getElementById(
        "changeStatusButton"
    );

    const deleteCandidateButton = document.getElementById(
        "deleteCandidateButton"
    );

    const detailModal = document.getElementById("detailModal");

    const closeDetailModalButton = document.getElementById(
        "closeDetailModalButton"
    );

    const detailAvatar = document.getElementById("detailAvatar");
    const detailName = document.getElementById("detailName");
    const detailPosition = document.getElementById("detailPosition");
    const detailEmail = document.getElementById("detailEmail");
    const detailPhone = document.getElementById("detailPhone");
    const detailScore = document.getElementById("detailScore");
    const detailStatus = document.getElementById("detailStatus");

    const toast = document.getElementById("toast");
    const toastMessage = document.getElementById("toastMessage");

    let selectedRow = null;
    let editingRow = null;
    let toastTimer = null;

    /*
        Hiện hoặc ẩn bộ lọc
    */
    filterButton.addEventListener("click", function () {
        filterPanel.classList.toggle("show");
    });

    /*
        Mở modal thêm ứng viên
    */
    openAddModalButton.addEventListener("click", function () {
        editingRow = null;

        candidateForm.reset();

        modalTitle.textContent = "Thêm ứng viên";
        saveButtonText.textContent = "Thêm ứng viên";

        candidateStatusInput.value = "Chờ xử lý";

        candidateModal.classList.add("show");

        candidateNameInput.focus();
    });

    /*
        Đóng modal
    */
    closeModalButton.addEventListener("click", closeCandidateModal);
    cancelModalButton.addEventListener("click", closeCandidateModal);

    candidateModal.addEventListener("click", function (event) {
        if (event.target === candidateModal) {
            closeCandidateModal();
        }
    });

    function closeCandidateModal() {
        candidateModal.classList.remove("show");
        candidateForm.reset();
        editingRow = null;
    }

    /*
        Kiểm tra file CV
    */
    candidateCVInput.addEventListener("change", function () {
        const file = candidateCVInput.files[0];

        if (!file) {
            return;
        }

        const allowedExtensions = [
            "pdf",
            "doc",
            "docx"
        ];

        const fileExtension = file.name
            .split(".")
            .pop()
            .toLowerCase();

        const maxFileSize = 10 * 1024 * 1024;

        if (!allowedExtensions.includes(fileExtension)) {
            showToast("Chỉ hỗ trợ file PDF, DOC hoặc DOCX.");
            candidateCVInput.value = "";
            return;
        }

        if (file.size > maxFileSize) {
            showToast("Dung lượng CV không được vượt quá 10MB.");
            candidateCVInput.value = "";
        }
    });

    /*
        Thêm hoặc cập nhật ứng viên
    */
    candidateForm.addEventListener("submit", function (event) {
        event.preventDefault();

        const name = candidateNameInput.value.trim();
        const email = candidateEmailInput.value.trim();
        const phone = candidatePhoneInput.value.trim();

        const position = candidatePositionInput.value;
        const score = Number(candidateScoreInput.value);
        const status = candidateStatusInput.value;

        if (
            !name ||
            !email ||
            !phone ||
            !position ||
            Number.isNaN(score) ||
            !status
        ) {
            showToast("Vui lòng nhập đầy đủ thông tin.");
            return;
        }

        if (score < 0 || score > 100) {
            showToast("Điểm AI phải từ 0 đến 100.");
            return;
        }

        const phonePattern = /^[0-9]{9,11}$/;

        if (!phonePattern.test(phone)) {
            showToast("Số điện thoại không hợp lệ.");
            return;
        }

        const duplicateEmail = Array.from(
            document.querySelectorAll(".candidate-row")
        ).some(function (row) {
            return (
                normalizeText(row.dataset.email) ===
                    normalizeText(email) &&
                row !== editingRow
            );
        });

        if (duplicateEmail) {
            showToast("Email này đã tồn tại.");
            return;
        }

        if (editingRow) {
            updateCandidateRow(editingRow, {
                name: name,
                email: email,
                phone: phone,
                position: position,
                score: score,
                status: status,
                updated: "Vừa cập nhật"
            });

            showToast("Đã cập nhật hồ sơ ứng viên.");
        } else {
            const newRow = createCandidateRow({
                id: Date.now(),
                name: name,
                email: email,
                phone: phone,
                position: position,
                score: score,
                status: status,
                updated: "Vừa tạo"
            });

            tableBody.appendChild(newRow);

            bindRowMenu(newRow);

            showToast("Đã thêm ứng viên mới.");
        }

        closeCandidateModal();
        applyFilters();
    });

    /*
        Tạo dòng ứng viên mới
    */
    function createCandidateRow(data) {
        const row = document.createElement("tr");

        row.className = "candidate-row";

        row.dataset.id = data.id;
        row.dataset.name = data.name;
        row.dataset.email = data.email;
        row.dataset.phone = data.phone;
        row.dataset.position = data.position;
        row.dataset.score = data.score;
        row.dataset.status = data.status;
        row.dataset.updated = data.updated;

        const initials = createInitials(data.name);
        const avatarClass = getAvatarClass(data.position);
        const statusClass = getStatusClass(data.status);

        row.innerHTML = `
            <td>
                <div class="candidate-cell">

                    <div class="avatar ${avatarClass}">
                        ${escapeHTML(initials)}
                    </div>

                    <div class="candidate-information">

                        <strong>
                            ${escapeHTML(data.name)}
                        </strong>

                        <span>
                            ${escapeHTML(data.email)}
                        </span>

                    </div>

                </div>
            </td>

            <td>
                ${escapeHTML(data.position)}
            </td>

            <td class="score-cell">
                ${data.score}/100
            </td>

            <td>
                <span class="status-badge ${statusClass}">
                    ${escapeHTML(data.status)}
                </span>
            </td>

            <td>
                ${escapeHTML(data.updated)}
            </td>

            <td>
                <button
                    type="button"
                    class="more-button"
                    aria-label="Mở menu"
                >
                    <i class="fa-solid fa-ellipsis"></i>
                </button>
            </td>
        `;

        return row;
    }

    /*
        Cập nhật dòng ứng viên
    */
    function updateCandidateRow(row, data) {
        row.dataset.name = data.name;
        row.dataset.email = data.email;
        row.dataset.phone = data.phone;
        row.dataset.position = data.position;
        row.dataset.score = data.score;
        row.dataset.status = data.status;
        row.dataset.updated = data.updated;

        const avatar = row.querySelector(".avatar");

        avatar.textContent = createInitials(data.name);
        avatar.className =
            `avatar ${getAvatarClass(data.position)}`;

        row.querySelector(
            ".candidate-information strong"
        ).textContent = data.name;

        row.querySelector(
            ".candidate-information span"
        ).textContent = data.email;

        row.children[1].textContent = data.position;
        row.children[2].textContent = `${data.score}/100`;

        const statusBadge = row.querySelector(".status-badge");

        statusBadge.textContent = data.status;
        statusBadge.className =
            `status-badge ${getStatusClass(data.status)}`;

        row.children[4].textContent = data.updated;
    }

    /*
        Tạo chữ viết tắt
    */
    function createInitials(name) {
        const words = name
            .trim()
            .split(/\s+/)
            .filter(Boolean);

        if (words.length === 0) {
            return "UV";
        }

        if (words.length === 1) {
            return words[0].slice(0, 2).toUpperCase();
        }

        return (
            words[0].charAt(0) +
            words[words.length - 1].charAt(0)
        ).toUpperCase();
    }

    /*
        Màu avatar
    */
    function getAvatarClass(position) {
        if (position === "Frontend Developer") {
            return "avatar-purple";
        }

        if (position === "Backend Developer") {
            return "avatar-blue";
        }

        if (position === "UI/UX Designer") {
            return "avatar-orange";
        }

        return "avatar-green";
    }

    /*
        Class trạng thái
    */
    function getStatusClass(status) {
        if (status === "Phỏng vấn") {
            return "status-interview";
        }

        if (status === "HR xem xét") {
            return "status-review";
        }

        if (status === "AI đã phân tích") {
            return "status-analyzed";
        }

        return "status-pending";
    }

    /*
        Tìm kiếm và lọc
    */
    searchInput.addEventListener("input", applyFilters);
    positionFilter.addEventListener("change", applyFilters);
    statusFilter.addEventListener("change", applyFilters);
    scoreFilter.addEventListener("change", applyFilters);

    clearFilterButton.addEventListener("click", function () {
        searchInput.value = "";
        positionFilter.value = "all";
        statusFilter.value = "all";
        scoreFilter.value = "all";

        applyFilters();
    });

    function applyFilters() {
        const keyword = normalizeText(searchInput.value);

        const selectedPosition = positionFilter.value;
        const selectedStatus = statusFilter.value;
        const selectedScore = scoreFilter.value;

        const rows = document.querySelectorAll(".candidate-row");

        let visibleCount = 0;

        rows.forEach(function (row) {
            const name = normalizeText(row.dataset.name);
            const email = normalizeText(row.dataset.email);
            const position = row.dataset.position;
            const status = row.dataset.status;
            const score = Number(row.dataset.score);

            const matchesKeyword =
                name.includes(keyword) ||
                email.includes(keyword) ||
                normalizeText(position).includes(keyword) ||
                normalizeText(status).includes(keyword);

            const matchesPosition =
                selectedPosition === "all" ||
                selectedPosition === position;

            const matchesStatus =
                selectedStatus === "all" ||
                selectedStatus === status;

            const matchesScore =
                selectedScore === "all" ||
                score >= Number(selectedScore);

            const shouldShow =
                matchesKeyword &&
                matchesPosition &&
                matchesStatus &&
                matchesScore;

            row.classList.toggle("hidden", !shouldShow);

            if (shouldShow) {
                visibleCount++;
            }
        });

        emptyState.classList.toggle(
            "show",
            visibleCount === 0
        );
    }

    function normalizeText(value) {
        return String(value)
            .toLowerCase()
            .normalize("NFD")
            .replace(/[\u0300-\u036f]/g, "");
    }

    /*
        Menu ba chấm
    */
    function bindRowMenu(row) {
        const moreButton = row.querySelector(".more-button");

        moreButton.addEventListener("click", function (event) {
            event.stopPropagation();

            selectedRow = row;

            const rect = moreButton.getBoundingClientRect();

            let left = rect.right - 170;
            let top = rect.bottom + 6;

            if (left < 10) {
                left = 10;
            }

            if (top + 165 > window.innerHeight) {
                top = rect.top - 160;
            }

            contextMenu.style.left = `${left}px`;
            contextMenu.style.top = `${top}px`;

            contextMenu.classList.add("show");
        });
    }

    document
        .querySelectorAll(".candidate-row")
        .forEach(bindRowMenu);

    /*
        Xem hồ sơ
    */
    viewCandidateButton.addEventListener("click", function () {
        if (!selectedRow) {
            return;
        }

        detailName.textContent = selectedRow.dataset.name;
        detailPosition.textContent = selectedRow.dataset.position;
        detailEmail.textContent = selectedRow.dataset.email;
        detailPhone.textContent = selectedRow.dataset.phone;
        detailScore.textContent =
            `${selectedRow.dataset.score}/100`;
        detailStatus.textContent = selectedRow.dataset.status;

        detailAvatar.textContent =
            createInitials(selectedRow.dataset.name);

        detailAvatar.className =
            `detail-avatar ${getAvatarClass(
                selectedRow.dataset.position
            )}`;

        closeContextMenu();

        detailModal.classList.add("show");
    });

    closeDetailModalButton.addEventListener(
        "click",
        closeDetailModal
    );

    detailModal.addEventListener("click", function (event) {
        if (event.target === detailModal) {
            closeDetailModal();
        }
    });

    function closeDetailModal() {
        detailModal.classList.remove("show");
    }

    /*
        Chỉnh sửa ứng viên
    */
    editCandidateButton.addEventListener("click", function () {
        if (!selectedRow) {
            return;
        }

        editingRow = selectedRow;

        modalTitle.textContent = "Chỉnh sửa ứng viên";
        saveButtonText.textContent = "Lưu thay đổi";

        candidateNameInput.value = selectedRow.dataset.name;
        candidateEmailInput.value = selectedRow.dataset.email;
        candidatePhoneInput.value = selectedRow.dataset.phone;

        candidatePositionInput.value =
            selectedRow.dataset.position;

        candidateScoreInput.value =
            selectedRow.dataset.score;

        candidateStatusInput.value =
            selectedRow.dataset.status;

        closeContextMenu();

        candidateModal.classList.add("show");

        candidateNameInput.focus();
    });

    /*
        Đổi trạng thái
    */
    changeStatusButton.addEventListener("click", function () {
        if (!selectedRow) {
            return;
        }

        const statuses = [
            "Chờ xử lý",
            "AI đã phân tích",
            "HR xem xét",
            "Phỏng vấn"
        ];

        const currentStatus = selectedRow.dataset.status;
        const currentIndex = statuses.indexOf(currentStatus);

        const nextStatus =
            statuses[
                currentIndex === statuses.length - 1
                    ? 0
                    : currentIndex + 1
            ];

        selectedRow.dataset.status = nextStatus;
        selectedRow.dataset.updated = "Vừa cập nhật";

        const statusBadge = selectedRow.querySelector(
            ".status-badge"
        );

        statusBadge.textContent = nextStatus;
        statusBadge.className =
            `status-badge ${getStatusClass(nextStatus)}`;

        selectedRow.children[4].textContent =
            "Vừa cập nhật";

        closeContextMenu();
        applyFilters();

        showToast(`Đã chuyển trạng thái sang ${nextStatus}.`);
    });

    /*
        Xóa ứng viên
    */
    deleteCandidateButton.addEventListener("click", function () {
        if (!selectedRow) {
            return;
        }

        const candidateName = selectedRow.dataset.name;

        const confirmed = window.confirm(
            `Bạn có chắc muốn xóa ứng viên "${candidateName}" không?`
        );

        if (!confirmed) {
            closeContextMenu();
            return;
        }

        selectedRow.remove();
        selectedRow = null;

        closeContextMenu();
        applyFilters();

        showToast("Đã xóa ứng viên.");
    });

    document.addEventListener("click", function (event) {
        if (
            !contextMenu.contains(event.target) &&
            !event.target.closest(".more-button")
        ) {
            closeContextMenu();
        }
    });

    window.addEventListener("scroll", closeContextMenu);
    window.addEventListener("resize", closeContextMenu);

    function closeContextMenu() {
        contextMenu.classList.remove("show");
    }

    /*
        Xuất CSV
    */
    exportButton.addEventListener("click", function () {
        const rows = [
            [
                "Họ và tên",
                "Email",
                "Số điện thoại",
                "Vị trí",
                "Điểm AI",
                "Trạng thái",
                "Cập nhật"
            ]
        ];

        document
            .querySelectorAll(".candidate-row")
            .forEach(function (row) {
                rows.push([
                    row.dataset.name,
                    row.dataset.email,
                    row.dataset.phone,
                    row.dataset.position,
                    `${row.dataset.score}/100`,
                    row.dataset.status,
                    row.dataset.updated
                ]);
            });

        const csvContent = rows
            .map(function (row) {
                return row
                    .map(function (cell) {
                        const escapedCell = String(cell).replace(
                            /"/g,
                            '""'
                        );

                        return `"${escapedCell}"`;
                    })
                    .join(",");
            })
            .join("\n");

        const blob = new Blob(
            ["\uFEFF" + csvContent],
            {
                type: "text/csv;charset=utf-8;"
            }
        );

        const downloadURL = URL.createObjectURL(blob);
        const link = document.createElement("a");

        link.href = downloadURL;
        link.download = "kho-ung-vien.csv";

        document.body.appendChild(link);

        link.click();
        link.remove();

        URL.revokeObjectURL(downloadURL);

        showToast("Đã xuất danh sách ứng viên.");
    });

    /*
        Thông báo
    */
    function showToast(message) {
        toastMessage.textContent = message;

        toast.classList.add("show");

        clearTimeout(toastTimer);

        toastTimer = setTimeout(function () {
            toast.classList.remove("show");
        }, 2500);
    }

    /*
        Chống chèn mã HTML
    */
    function escapeHTML(value) {
        return String(value)
            .replace(/&/g, "&amp;")
            .replace(/</g, "&lt;")
            .replace(/>/g, "&gt;")
            .replace(/"/g, "&quot;")
            .replace(/'/g, "&#039;");
    }

    applyFilters();
});