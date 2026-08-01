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

    const reportModal = document.getElementById("reportModal");
    const closeModalButton = document.getElementById("closeModalButton");
    const cancelModalButton = document.getElementById(
        "cancelModalButton"
    );

    const reportForm = document.getElementById("reportForm");

    const candidateNameInput = document.getElementById("candidateName");
    const candidatePositionInput = document.getElementById(
        "candidatePosition"
    );
    const candidateScoreInput = document.getElementById(
        "candidateScore"
    );
    const candidateStatusInput = document.getElementById(
        "candidateStatus"
    );

    const tableBody = document.getElementById("reportTableBody");
    const emptyState = document.getElementById("emptyState");

    const totalCandidates = document.getElementById("totalCandidates");
    const interviewCandidates = document.getElementById(
        "interviewCandidates"
    );
    const averageScore = document.getElementById("averageScore");
    const conversionRate = document.getElementById("conversionRate");

    const chartPeriod = document.getElementById("chartPeriod");

    const contextMenu = document.getElementById("contextMenu");
    const changeStatusButton = document.getElementById(
        "changeStatusButton"
    );
    const deleteRowButton = document.getElementById("deleteRowButton");

    const toast = document.getElementById("toast");
    const toastMessage = document.getElementById("toastMessage");

    let selectedRow = null;
    let toastTimer = null;

    /*
        Hiện hoặc ẩn bộ lọc
    */
    filterButton.addEventListener("click", function () {
        filterPanel.classList.toggle("show");
    });

    /*
        Mở modal
    */
    openAddModalButton.addEventListener("click", function () {
        reportModal.classList.add("show");
        candidateNameInput.focus();
    });

    closeModalButton.addEventListener("click", closeModal);
    cancelModalButton.addEventListener("click", closeModal);

    reportModal.addEventListener("click", function (event) {
        if (event.target === reportModal) {
            closeModal();
        }
    });

    function closeModal() {
        reportModal.classList.remove("show");
        reportForm.reset();
    }

    /*
        Thêm dữ liệu mới
    */
    reportForm.addEventListener("submit", function (event) {
        event.preventDefault();

        const name = candidateNameInput.value.trim();
        const position = candidatePositionInput.value;
        const score = Number(candidateScoreInput.value);
        const status = candidateStatusInput.value;

        if (!name || !position || Number.isNaN(score) || !status) {
            showToast("Vui lòng nhập đầy đủ thông tin.");
            return;
        }

        if (score < 0 || score > 100) {
            showToast("Điểm AI phải từ 0 đến 100.");
            return;
        }

        const newRow = createReportRow({
            name: name,
            position: position,
            score: score,
            status: status,
            updated: "Vừa cập nhật"
        });

        tableBody.appendChild(newRow);

        bindRowMenu(newRow);

        closeModal();
        applyFilters();
        updateStatistics();
        updateChart();

        showToast("Đã thêm dữ liệu mới.");
    });

    /*
        Tạo dòng bảng
    */
    function createReportRow(data) {
        const row = document.createElement("tr");

        row.className = "report-row";

        row.dataset.name = data.name;
        row.dataset.position = data.position;
        row.dataset.score = data.score;
        row.dataset.status = data.status;
        row.dataset.updated = data.updated;

        const initials = createInitials(data.name);
        const avatarClass = getAvatarClass(data.position);

        row.innerHTML = `
            <td>
                <div class="candidate-cell">

                    <div class="avatar ${avatarClass}">
                        ${escapeHTML(initials)}
                    </div>

                    <strong>
                        ${escapeHTML(data.name)}
                    </strong>

                </div>
            </td>

            <td>
                ${escapeHTML(data.position)}
            </td>

            <td class="score-cell">
                ${data.score}/100
            </td>

            <td>
                <span class="status-badge">
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
        Chữ viết tắt
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
        Chọn màu avatar
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

        const rows = document.querySelectorAll(".report-row");

        let visibleRows = 0;

        rows.forEach(function (row) {
            const name = normalizeText(row.dataset.name);
            const position = row.dataset.position;
            const status = row.dataset.status;
            const score = Number(row.dataset.score);

            const matchesKeyword =
                name.includes(keyword) ||
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
                visibleRows++;
            }
        });

        emptyState.classList.toggle(
            "show",
            visibleRows === 0
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

            let left = rect.right - 165;
            let top = rect.bottom + 6;

            if (left < 10) {
                left = 10;
            }

            if (top + 100 > window.innerHeight) {
                top = rect.top - 90;
            }

            contextMenu.style.left = `${left}px`;
            contextMenu.style.top = `${top}px`;

            contextMenu.classList.add("show");
        });
    }

    document
        .querySelectorAll(".report-row")
        .forEach(bindRowMenu);

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

        const newStatus =
            statuses[
                currentIndex === statuses.length - 1
                    ? 0
                    : currentIndex + 1
            ];

        selectedRow.dataset.status = newStatus;
        selectedRow.dataset.updated = "Vừa cập nhật";

        selectedRow.querySelector(
            ".status-badge"
        ).textContent = newStatus;

        selectedRow.children[4].textContent =
            "Vừa cập nhật";

        closeContextMenu();
        applyFilters();
        updateStatistics();
        updateChart();

        showToast("Đã cập nhật trạng thái.");
    });

    /*
        Xóa dữ liệu
    */
    deleteRowButton.addEventListener("click", function () {
        if (!selectedRow) {
            return;
        }

        const name = selectedRow.dataset.name;

        const confirmed = window.confirm(
            `Bạn có chắc muốn xóa dữ liệu của "${name}" không?`
        );

        if (!confirmed) {
            closeContextMenu();
            return;
        }

        selectedRow.remove();
        selectedRow = null;

        closeContextMenu();
        applyFilters();
        updateStatistics();
        updateChart();

        showToast("Đã xóa dữ liệu.");
    });

    /*
        Cập nhật thống kê
    */
    function updateStatistics() {
        const rows = Array.from(
            document.querySelectorAll(".report-row")
        );

        const total = rows.length;

        const interviewCount = rows.filter(function (row) {
            return row.dataset.status === "Phỏng vấn";
        }).length;

        const totalScore = rows.reduce(function (sum, row) {
            return sum + Number(row.dataset.score);
        }, 0);

        const average =
            total > 0
                ? (totalScore / total).toFixed(1)
                : "0";

        const conversion =
            total > 0
                ? Math.round((interviewCount / total) * 100)
                : 0;

        totalCandidates.textContent = total;
        interviewCandidates.textContent = interviewCount;
        averageScore.textContent = average;
        conversionRate.textContent = `${conversion}%`;
    }

    /*
        Cập nhật biểu đồ
    */
    function updateChart() {
        const rows = Array.from(
            document.querySelectorAll(".report-row")
        );

        const values = [
            rows.length,

            rows.filter(function (row) {
                return row.dataset.status !== "Chờ xử lý";
            }).length,

            rows.filter(function (row) {
                return (
                    row.dataset.status === "HR xem xét" ||
                    row.dataset.status === "Phỏng vấn"
                );
            }).length,

            rows.filter(function (row) {
                return row.dataset.status === "Phỏng vấn";
            }).length
        ];

        const maxValue = Math.max(...values, 1);

        document
            .querySelectorAll(".chart-column")
            .forEach(function (column, index) {
                const value = values[index];

                const valueElement = column.querySelector(
                    ".bar-value"
                );

                const barElement = column.querySelector(
                    ".chart-bar"
                );

                valueElement.textContent = value;

                const height =
                    25 + (value / maxValue) * 110;

                barElement.style.height = `${height}px`;
            });
    }

    chartPeriod.addEventListener("change", function () {
        showToast(
            `Đã chọn thống kê: ${
                chartPeriod.options[
                    chartPeriod.selectedIndex
                ].text
            }`
        );
    });

    /*
        Xuất CSV
    */
    exportButton.addEventListener("click", function () {
        const rows = [
            [
                "Ứng viên",
                "Vị trí",
                "Điểm AI",
                "Trạng thái",
                "Cập nhật"
            ]
        ];

        document
            .querySelectorAll(".report-row")
            .forEach(function (row) {
                rows.push([
                    row.dataset.name,
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

        const url = URL.createObjectURL(blob);
        const link = document.createElement("a");

        link.href = url;
        link.download = "bao-cao-thong-ke.csv";

        document.body.appendChild(link);

        link.click();
        link.remove();

        URL.revokeObjectURL(url);

        showToast("Đã xuất báo cáo CSV.");
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
        Chống chèn HTML
    */
    function escapeHTML(value) {
        return String(value)
            .replace(/&/g, "&amp;")
            .replace(/</g, "&lt;")
            .replace(/>/g, "&gt;")
            .replace(/"/g, "&quot;")
            .replace(/'/g, "&#039;");
    }

    updateStatistics();
    updateChart();
    applyFilters();
});