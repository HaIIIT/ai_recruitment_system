const searchInput = document.getElementById("searchInput");
const filterButton = document.getElementById("filterButton");
const filterPanel = document.getElementById("filterPanel");
const statusFilter = document.getElementById("statusFilter");
const clearFilterButton = document.getElementById("clearFilterButton");

const exportButton = document.getElementById("exportButton");
const addJobButton = document.getElementById("addJobButton");

const jobModal = document.getElementById("jobModal");
const closeModalButton = document.getElementById("closeModalButton");
const cancelButton = document.getElementById("cancelButton");
const jobForm = document.getElementById("jobForm");

const jobTableBody = document.getElementById("jobTableBody");
const emptyState = document.getElementById("emptyState");

function getJobRows() {
    return document.querySelectorAll(".job-row");
}

function filterJobs() {
    const keyword = searchInput.value.trim().toLowerCase();
    const selectedStatus = statusFilter.value;

    let visibleCount = 0;

    getJobRows().forEach(function (row) {
        const searchText = row.dataset.search.toLowerCase();
        const rowStatus = row.dataset.status;

        const matchesKeyword = searchText.includes(keyword);

        const matchesStatus =
            selectedStatus === "all" ||
            rowStatus === selectedStatus;

        if (matchesKeyword && matchesStatus) {
            row.style.display = "";
            visibleCount++;
        } else {
            row.style.display = "none";
        }
    });

    emptyState.style.display =
        visibleCount === 0 ? "block" : "none";
}

searchInput.addEventListener("input", filterJobs);
statusFilter.addEventListener("change", filterJobs);

filterButton.addEventListener("click", function () {
    filterPanel.classList.toggle("show");
});

clearFilterButton.addEventListener("click", function () {
    searchInput.value = "";
    statusFilter.value = "all";
    filterJobs();
});

function openModal() {
    jobModal.classList.add("show");
    document.body.style.overflow = "hidden";
}

function closeModal() {
    jobModal.classList.remove("show");
    document.body.style.overflow = "";
    jobForm.reset();
}

addJobButton.addEventListener("click", openModal);
closeModalButton.addEventListener("click", closeModal);
cancelButton.addEventListener("click", closeModal);

jobModal.addEventListener("click", function (event) {
    if (event.target === jobModal) {
        closeModal();
    }
});

document.addEventListener("keydown", function (event) {
    if (event.key === "Escape") {
        closeModal();
    }
});

jobForm.addEventListener("submit", function (event) {
    event.preventDefault();

    const jobTitle = document.getElementById("jobTitle").value.trim();
    const department = document.getElementById("department").value.trim();

    const candidateCount =
        document.getElementById("candidateCount").value;

    const matchingCount =
        document.getElementById("matchingCount").value;

    const deadlineValue =
        document.getElementById("deadline").value;

    const status =
        document.getElementById("jobStatus").value;

    const deadline = formatDate(deadlineValue);

    const statusInformation = getStatusInformation(status);

    const newRow = document.createElement("tr");

    newRow.className = "job-row";
    newRow.dataset.status = status;
    newRow.dataset.search =
        `${jobTitle} ${department}`.toLowerCase();

    newRow.innerHTML = `
        <td>
            <div class="job-info">
                <strong>${escapeHtml(jobTitle)}</strong>
                <span>${escapeHtml(department)}</span>
            </div>
        </td>

        <td class="number-cell">${candidateCount}</td>
        <td class="number-cell">${matchingCount}</td>
        <td>${deadline}</td>

        <td>
            <span class="status-badge ${statusInformation.className}">
                ${statusInformation.label}
            </span>
        </td>

        <td>
            <button class="more-button" type="button">
                <i class="fa-solid fa-ellipsis"></i>
            </button>
        </td>
    `;

    jobTableBody.appendChild(newRow);

    closeModal();
    filterJobs();

    alert("Đã thêm tin tuyển dụng thành công.");
});

function getStatusInformation(status) {
    if (status === "expiring") {
        return {
            label: "Sắp hết hạn",
            className: "status-expiring"
        };
    }

    if (status === "closed") {
        return {
            label: "Đã đóng",
            className: "status-closed"
        };
    }

    return {
        label: "Đang tuyển",
        className: "status-active"
    };
}

function formatDate(dateValue) {
    if (!dateValue) {
        return "";
    }

    const parts = dateValue.split("-");

    return `${parts[2]}/${parts[1]}/${parts[0]}`;
}

function escapeHtml(value) {
    return value
        .replaceAll("&", "&amp;")
        .replaceAll("<", "&lt;")
        .replaceAll(">", "&gt;")
        .replaceAll('"', "&quot;")
        .replaceAll("'", "&#039;");
}

exportButton.addEventListener("click", function () {
    const rows = [
        [
            "Vị trí tuyển dụng",
            "Phòng ban",
            "Ứng viên",
            "Phù hợp",
            "Hạn nộp",
            "Trạng thái"
        ]
    ];

    getJobRows().forEach(function (row) {
        if (row.style.display === "none") {
            return;
        }

        const title =
            row.querySelector(".job-info strong").textContent.trim();

        const department =
            row.querySelector(".job-info span").textContent.trim();

        const cells = row.querySelectorAll("td");

        const candidateCount = cells[1].textContent.trim();
        const matchingCount = cells[2].textContent.trim();
        const deadline = cells[3].textContent.trim();

        const status =
            row.querySelector(".status-badge").textContent.trim();

        rows.push([
            title,
            department,
            candidateCount,
            matchingCount,
            deadline,
            status
        ]);
    });

    const csvContent = rows
        .map(function (row) {
            return row
                .map(function (cell) {
                    return `"${cell.replaceAll('"', '""')}"`;
                })
                .join(",");
        })
        .join("\n");

    const blob = new Blob(
        ["\uFEFF" + csvContent],
        { type: "text/csv;charset=utf-8;" }
    );

    const downloadUrl = URL.createObjectURL(blob);
    const downloadLink = document.createElement("a");

    downloadLink.href = downloadUrl;
    downloadLink.download = "danh-sach-tin-tuyen-dung.csv";

    document.body.appendChild(downloadLink);
    downloadLink.click();
    downloadLink.remove();

    URL.revokeObjectURL(downloadUrl);
});