document.addEventListener("DOMContentLoaded", function () {
    // ==============================
    // PHẦN TỬ UPLOAD
    // ==============================

    const uploadArea = document.getElementById("uploadArea");
    const uploadButton = document.getElementById("uploadButton");
    const cvInput = document.getElementById("cvInput");
    const fileName = document.getElementById("fileName");

    // ==============================
    // THANH CÔNG CỤ
    // ==============================

    const addButton = document.getElementById("addButton");
    const filterButton = document.getElementById("filterButton");
    const exportButton = document.getElementById("exportButton");

    const searchInput = document.getElementById("searchInput");

    const filterPanel = document.getElementById("filterPanel");
    const positionFilter = document.getElementById("positionFilter");
    const scoreFilter = document.getElementById("scoreFilter");
    const clearFilterButton =
        document.getElementById("clearFilterButton");

    // ==============================
    // DANH SÁCH ỨNG VIÊN
    // ==============================

    const candidateList =
        document.getElementById("candidateList");

    const emptyResult =
        document.getElementById("emptyResult");

    // ==============================
    // MODAL
    // ==============================

    const candidateModal =
        document.getElementById("candidateModal");

    const closeModalButton =
        document.getElementById("closeModalButton");

    const cancelButton =
        document.getElementById("cancelButton");

    const candidateForm =
        document.getElementById("candidateForm");

    const candidateName =
        document.getElementById("candidateName");

    const candidatePosition =
        document.getElementById("candidatePosition");

    const candidateScore =
        document.getElementById("candidateScore");


    // ==============================
    // CHỌN FILE CV
    // ==============================

    uploadButton.addEventListener("click", function () {
        cvInput.click();
    });

    cvInput.addEventListener("change", function () {
        const selectedFile = cvInput.files[0];

        if (selectedFile) {
            handleFile(selectedFile);
        }
    });


    // ==============================
    // KÉO THẢ FILE
    // ==============================

    uploadArea.addEventListener("dragover", function (event) {
        event.preventDefault();

        uploadArea.classList.add("dragging");
    });

    uploadArea.addEventListener("dragleave", function () {
        uploadArea.classList.remove("dragging");
    });

    uploadArea.addEventListener("drop", function (event) {
        event.preventDefault();

        uploadArea.classList.remove("dragging");

        const selectedFile =
            event.dataTransfer.files[0];

        if (selectedFile) {
            handleFile(selectedFile);
        }
    });


    // ==============================
    // KIỂM TRA FILE
    // ==============================

    function handleFile(file) {
        const allowedExtensions = [
            "pdf",
            "doc",
            "docx"
        ];

        const fileExtension = file.name
            .split(".")
            .pop()
            .toLowerCase();

        const maxSize = 10 * 1024 * 1024;

        if (!allowedExtensions.includes(fileExtension)) {
            alert("Chỉ hỗ trợ tệp PDF, DOC hoặc DOCX.");

            cvInput.value = "";
            fileName.textContent = "";

            return;
        }

        if (file.size > maxSize) {
            alert("Tệp vượt quá dung lượng tối đa 10 MB.");

            cvInput.value = "";
            fileName.textContent = "";

            return;
        }

        fileName.innerHTML = `
            <i class="fa-solid fa-file-lines"></i>
            Đã chọn: ${escapeHtml(file.name)}
        `;
    }


    // ==============================
    // MỞ MODAL
    // ==============================

    function openModal() {
        candidateModal.classList.add("show");

        document.body.style.overflow = "hidden";

        setTimeout(function () {
            candidateName.focus();
        }, 100);
    }


    // ==============================
    // ĐÓNG MODAL
    // ==============================

    function closeModal() {
        candidateModal.classList.remove("show");

        document.body.style.overflow = "";

        candidateForm.reset();
    }

    addButton.addEventListener("click", openModal);

    closeModalButton.addEventListener(
        "click",
        closeModal
    );

    cancelButton.addEventListener(
        "click",
        closeModal
    );

    candidateModal.addEventListener(
        "click",
        function (event) {
            if (event.target === candidateModal) {
                closeModal();
            }
        }
    );

    document.addEventListener(
        "keydown",
        function (event) {
            if (
                event.key === "Escape" &&
                candidateModal.classList.contains("show")
            ) {
                closeModal();
            }
        }
    );


    // ==============================
    // THÊM ỨNG VIÊN
    // ==============================

    candidateForm.addEventListener(
        "submit",
        function (event) {
            event.preventDefault();

            const name =
                candidateName.value.trim();

            const position =
                candidatePosition.value.trim();

            const score =
                Number(candidateScore.value);

            if (!name || !position) {
                alert("Vui lòng nhập đầy đủ thông tin.");

                return;
            }

            if (
                Number.isNaN(score) ||
                score < 0 ||
                score > 100
            ) {
                alert(
                    "Điểm phân tích phải nằm trong khoảng từ 0 đến 100."
                );

                return;
            }

            const initials =
                createInitials(name);

            const newCandidate =
                document.createElement("article");

            newCandidate.className =
                "candidate-item";

            newCandidate.dataset.name =
                name.toLowerCase();

            newCandidate.dataset.position =
                position.toLowerCase();

            newCandidate.dataset.score =
                String(score);

            newCandidate.innerHTML = `
                <div class="candidate-avatar avatar-purple">
                    ${escapeHtml(initials)}
                </div>

                <div class="candidate-info">
                    <strong>${escapeHtml(name)}</strong>
                    <span>${escapeHtml(position)}</span>
                </div>

                <div
                    class="score-circle"
                    style="--score: ${score}"
                >
                    <span>${score}</span>
                </div>
            `;

            candidateList.appendChild(newCandidate);

            closeModal();

            filterCandidates();

            alert(
                "Đã thêm kết quả phân tích thành công."
            );
        }
    );


    // ==============================
    // TẠO CHỮ VIẾT TẮT
    // ==============================

    function createInitials(fullName) {
        const words = fullName
            .trim()
            .split(/\s+/)
            .filter(Boolean);

        if (words.length === 0) {
            return "UV";
        }

        if (words.length === 1) {
            return words[0]
                .substring(0, 2)
                .toUpperCase();
        }

        const firstLetter =
            words[words.length - 2][0];

        const secondLetter =
            words[words.length - 1][0];

        return (
            firstLetter + secondLetter
        ).toUpperCase();
    }


    // ==============================
    // MỞ / ĐÓNG BỘ LỌC
    // ==============================

    filterButton.addEventListener(
        "click",
        function () {
            filterPanel.classList.toggle("show");
        }
    );


    // ==============================
    // TÌM KIẾM VÀ LỌC
    // ==============================

    searchInput.addEventListener(
        "input",
        filterCandidates
    );

    positionFilter.addEventListener(
        "change",
        filterCandidates
    );

    scoreFilter.addEventListener(
        "change",
        filterCandidates
    );

    clearFilterButton.addEventListener(
        "click",
        function () {
            searchInput.value = "";
            positionFilter.value = "all";
            scoreFilter.value = "0";

            filterCandidates();
        }
    );

    function filterCandidates() {
        const keyword = searchInput.value
            .trim()
            .toLowerCase();

        const selectedPosition =
            positionFilter.value.toLowerCase();

        const minimumScore =
            Number(scoreFilter.value);

        const candidateItems =
            document.querySelectorAll(
                ".candidate-item"
            );

        let visibleCount = 0;

        candidateItems.forEach(
            function (item) {
                const name =
                    item.dataset.name || "";

                const position =
                    item.dataset.position || "";

                const score =
                    Number(item.dataset.score || 0);

                const matchesKeyword =
                    name.includes(keyword) ||
                    position.includes(keyword);

                const matchesPosition =
                    selectedPosition === "all" ||
                    position === selectedPosition;

                const matchesScore =
                    score >= minimumScore;

                if (
                    matchesKeyword &&
                    matchesPosition &&
                    matchesScore
                ) {
                    item.style.display = "flex";

                    visibleCount++;
                } else {
                    item.style.display = "none";
                }
            }
        );

        emptyResult.style.display =
            visibleCount === 0
                ? "block"
                : "none";
    }


    // ==============================
    // XUẤT DỮ LIỆU CSV
    // ==============================

    exportButton.addEventListener(
        "click",
        function () {
            const csvRows = [
                [
                    "Tên ứng viên",
                    "Vị trí ứng tuyển",
                    "Điểm phân tích"
                ]
            ];

            const candidateItems =
                document.querySelectorAll(
                    ".candidate-item"
                );

            candidateItems.forEach(
                function (item) {
                    if (
                        item.style.display === "none"
                    ) {
                        return;
                    }

                    const name = item
                        .querySelector(
                            ".candidate-info strong"
                        )
                        .textContent
                        .trim();

                    const position = item
                        .querySelector(
                            ".candidate-info span"
                        )
                        .textContent
                        .trim();

                    const score = item
                        .querySelector(
                            ".score-circle span"
                        )
                        .textContent
                        .trim();

                    csvRows.push([
                        name,
                        position,
                        score
                    ]);
                }
            );

            if (csvRows.length === 1) {
                alert(
                    "Không có dữ liệu để xuất."
                );

                return;
            }

            const csvContent = csvRows
                .map(function (row) {
                    return row
                        .map(function (cell) {
                            return `"${String(cell)
                                .replaceAll(
                                    '"',
                                    '""'
                                )}"`;
                        })
                        .join(",");
                })
                .join("\n");

            const csvBlob = new Blob(
                ["\uFEFF" + csvContent],
                {
                    type:
                        "text/csv;charset=utf-8;"
                }
            );

            const downloadUrl =
                URL.createObjectURL(csvBlob);

            const downloadLink =
                document.createElement("a");

            downloadLink.href =
                downloadUrl;

            downloadLink.download =
                "ket-qua-phan-tich-cv.csv";

            document.body.appendChild(
                downloadLink
            );

            downloadLink.click();

            downloadLink.remove();

            URL.revokeObjectURL(
                downloadUrl
            );
        }
    );


    // ==============================
    // CHỐNG CHÈN HTML
    // ==============================

    function escapeHtml(value) {
        return String(value)
            .replaceAll("&", "&amp;")
            .replaceAll("<", "&lt;")
            .replaceAll(">", "&gt;")
            .replaceAll('"', "&quot;")
            .replaceAll("'", "&#039;");
    }
});