document.addEventListener("DOMContentLoaded", function () {
    const searchInput = document.getElementById("candidateSearchInput");

    const filterButton = document.getElementById("filterButton");
    const filterPanel = document.getElementById("filterPanel");

    const positionFilter = document.getElementById("positionFilter");
    const stageFilter = document.getElementById("stageFilter");
    const clearFilterButton = document.getElementById("clearFilterButton");

    const exportButton = document.getElementById("exportButton");

    const openAddModalButton = document.getElementById(
        "openAddModalButton"
    );

    const candidateModal = document.getElementById("candidateModal");
    const closeModalButton = document.getElementById("closeModalButton");
    const cancelModalButton = document.getElementById("cancelModalButton");

    const candidateForm = document.getElementById("candidateForm");

    const candidateNameInput = document.getElementById("candidateName");
    const candidatePositionInput = document.getElementById(
        "candidatePosition"
    );
    const candidateScoreInput = document.getElementById("candidateScore");
    const candidateStageInput = document.getElementById("candidateStage");

    const contextMenu = document.getElementById("cardContextMenu");
    const deleteCandidateButton = document.getElementById(
        "deleteCandidateButton"
    );

    const toast = document.getElementById("toast");
    const toastMessage = document.getElementById("toastMessage");

    let selectedCard = null;
    let draggedCard = null;
    let toastTimer = null;

    // Mở và đóng bộ lọc
    filterButton.addEventListener("click", function () {
        filterPanel.classList.toggle("show");
    });

    // Mở modal
    openAddModalButton.addEventListener("click", function () {
        candidateModal.classList.add("show");
        candidateNameInput.focus();
    });

    // Đóng modal
    closeModalButton.addEventListener("click", closeModal);
    cancelModalButton.addEventListener("click", closeModal);

    candidateModal.addEventListener("click", function (event) {
        if (event.target === candidateModal) {
            closeModal();
        }
    });

    function closeModal() {
        candidateModal.classList.remove("show");
        candidateForm.reset();
    }

    // Thêm ứng viên
    candidateForm.addEventListener("submit", function (event) {
        event.preventDefault();

        const name = candidateNameInput.value.trim();
        const position = candidatePositionInput.value;
        const score = Number(candidateScoreInput.value);
        const stage = candidateStageInput.value;

        if (!name || !position || Number.isNaN(score)) {
            showToast("Vui lòng nhập đầy đủ thông tin.");
            return;
        }

        if (score < 0 || score > 100) {
            showToast("Điểm phù hợp phải từ 0 đến 100.");
            return;
        }

        const candidateList = document.querySelector(
            `.candidate-list[data-stage="${stage}"]`
        );

        const newCard = createCandidateCard({
            id: Date.now(),
            name: name,
            position: position,
            score: score
        });

        candidateList.appendChild(newCard);

        bindCardEvents(newCard);

        updateColumnCounts();
        applyFilters();
        closeModal();

        showToast("Đã thêm ứng viên mới.");
    });

    // Tạo card ứng viên
    function createCandidateCard(candidate) {
        const card = document.createElement("div");

        card.className = "candidate-card";
        card.draggable = true;

        card.dataset.id = candidate.id;
        card.dataset.name = candidate.name;
        card.dataset.position = candidate.position;
        card.dataset.score = candidate.score;

        const initials = createInitials(candidate.name);
        const avatarClass = getAvatarClass(candidate.position);

        card.innerHTML = `
            <div class="candidate-top">

                <div class="candidate-person">

                    <div class="avatar ${avatarClass}">
                        ${escapeHTML(initials)}
                    </div>

                    <div class="candidate-main-info">
                        <strong>${escapeHTML(candidate.name)}</strong>
                        <span>${escapeHTML(candidate.position)}</span>
                    </div>

                </div>

                <button
                    type="button"
                    class="card-menu-button"
                    aria-label="Mở menu"
                >
                    <i class="fa-solid fa-ellipsis"></i>
                </button>

            </div>

            <div class="candidate-score">
                <span>Điểm phù hợp</span>
                <strong>${candidate.score}/100</strong>
            </div>
        `;

        return card;
    }

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

    // Tìm kiếm và lọc
    searchInput.addEventListener("input", applyFilters);
    positionFilter.addEventListener("change", applyFilters);
    stageFilter.addEventListener("change", applyFilters);

    clearFilterButton.addEventListener("click", function () {
        searchInput.value = "";
        positionFilter.value = "all";
        stageFilter.value = "all";

        applyFilters();
    });

    function applyFilters() {
        const keyword = normalizeText(searchInput.value);
        const selectedPosition = positionFilter.value;
        const selectedStage = stageFilter.value;

        const cards = document.querySelectorAll(".candidate-card");

        cards.forEach(function (card) {
            const name = normalizeText(card.dataset.name);
            const position = card.dataset.position;

            const list = card.closest(".candidate-list");
            const stage = list.dataset.stage;

            const matchesKeyword =
                name.includes(keyword) ||
                normalizeText(position).includes(keyword);

            const matchesPosition =
                selectedPosition === "all" ||
                selectedPosition === position;

            const matchesStage =
                selectedStage === "all" ||
                selectedStage === stage;

            const shouldDisplay =
                matchesKeyword &&
                matchesPosition &&
                matchesStage;

            card.classList.toggle("hidden", !shouldDisplay);
        });

        updateColumnCounts(true);
    }

    function normalizeText(value) {
        return String(value)
            .toLowerCase()
            .normalize("NFD")
            .replace(/[\u0300-\u036f]/g, "");
    }

    // Cập nhật số lượng
    function updateColumnCounts(onlyVisible = false) {
        const columns = document.querySelectorAll(".pipeline-column");

        columns.forEach(function (column) {
            const selector = onlyVisible
                ? ".candidate-card:not(.hidden)"
                : ".candidate-card";

            const total = column.querySelectorAll(selector).length;
            const countElement = column.querySelector(".column-count");

            countElement.textContent = total;
        });
    }

    // Kéo thả
    function bindCardEvents(card) {
        card.addEventListener("dragstart", function () {
            draggedCard = card;
            card.classList.add("dragging");
        });

        card.addEventListener("dragend", function () {
            card.classList.remove("dragging");

            document
                .querySelectorAll(".candidate-list")
                .forEach(function (list) {
                    list.classList.remove("drag-over");
                });

            draggedCard = null;
        });

        const menuButton = card.querySelector(".card-menu-button");

        menuButton.addEventListener("click", function (event) {
            event.stopPropagation();

            selectedCard = card;

            const rect = menuButton.getBoundingClientRect();

            contextMenu.style.top = `${rect.bottom + 6}px`;
            contextMenu.style.left = `${rect.right - 155}px`;

            contextMenu.classList.add("show");
        });
    }

    document
        .querySelectorAll(".candidate-card")
        .forEach(bindCardEvents);

    document
        .querySelectorAll(".candidate-list")
        .forEach(function (list) {
            list.addEventListener("dragover", function (event) {
                event.preventDefault();
                list.classList.add("drag-over");
            });

            list.addEventListener("dragleave", function (event) {
                if (!list.contains(event.relatedTarget)) {
                    list.classList.remove("drag-over");
                }
            });

            list.addEventListener("drop", function (event) {
                event.preventDefault();

                list.classList.remove("drag-over");

                if (!draggedCard) {
                    return;
                }

                list.appendChild(draggedCard);

                updateColumnCounts();
                applyFilters();

                showToast("Đã cập nhật giai đoạn ứng viên.");
            });
        });

    // Menu xóa ứng viên
    deleteCandidateButton.addEventListener("click", function () {
        if (!selectedCard) {
            return;
        }

        const candidateName = selectedCard.dataset.name;

        const shouldDelete = window.confirm(
            `Bạn có chắc muốn xóa ứng viên "${candidateName}" không?`
        );

        if (!shouldDelete) {
            closeContextMenu();
            return;
        }

        selectedCard.remove();
        selectedCard = null;

        closeContextMenu();
        updateColumnCounts();
        applyFilters();

        showToast("Đã xóa ứng viên.");
    });

    document.addEventListener("click", function (event) {
        if (
            !contextMenu.contains(event.target) &&
            !event.target.closest(".card-menu-button")
        ) {
            closeContextMenu();
        }
    });

    window.addEventListener("scroll", closeContextMenu);
    window.addEventListener("resize", closeContextMenu);

    function closeContextMenu() {
        contextMenu.classList.remove("show");
    }

    // Xuất CSV
    exportButton.addEventListener("click", function () {
        const stageNames = {
            pending: "Chờ xử lý",
            review: "HR xem xét",
            interview: "Phỏng vấn",
            offer: "Đề nghị nhận việc"
        };

        const rows = [
            [
                "Họ và tên",
                "Vị trí ứng tuyển",
                "Điểm phù hợp",
                "Giai đoạn"
            ]
        ];

        document
            .querySelectorAll(".candidate-card")
            .forEach(function (card) {
                const stage = card.closest(".candidate-list").dataset.stage;

                rows.push([
                    card.dataset.name,
                    card.dataset.position,
                    `${card.dataset.score}/100`,
                    stageNames[stage] || stage
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
        link.download = "quy-trinh-tuyen-dung.csv";

        document.body.appendChild(link);
        link.click();
        link.remove();

        URL.revokeObjectURL(downloadURL);

        showToast("Đã xuất dữ liệu CSV.");
    });

    // Thông báo
    function showToast(message) {
        toastMessage.textContent = message;
        toast.classList.add("show");

        clearTimeout(toastTimer);

        toastTimer = setTimeout(function () {
            toast.classList.remove("show");
        }, 2500);
    }

    // Chống chèn HTML
    function escapeHTML(value) {
        return String(value)
            .replace(/&/g, "&amp;")
            .replace(/</g, "&lt;")
            .replace(/>/g, "&gt;")
            .replace(/"/g, "&quot;")
            .replace(/'/g, "&#039;");
    }

    updateColumnCounts();
});