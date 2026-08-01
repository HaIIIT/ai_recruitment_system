document.addEventListener("DOMContentLoaded", function () {
    const welcomeTitle = document.getElementById("welcomeTitle");
    const currentDateText = document.getElementById("currentDateText");

    const createJobButton = document.getElementById("createJobButton");

    const jobModal = document.getElementById("jobModal");
    const closeModalButton = document.getElementById("closeModalButton");
    const cancelModalButton = document.getElementById("cancelModalButton");

    const jobForm = document.getElementById("jobForm");

    const jobTitleInput = document.getElementById("jobTitle");
    const departmentInput = document.getElementById("department");
    const quantityInput = document.getElementById("quantity");
    const deadlineInput = document.getElementById("deadline");

    const activeJobsValue = document.getElementById("activeJobsValue");

    const yearFilter = document.getElementById("yearFilter");
    const sourceMoreButton = document.getElementById(
        "sourceMoreButton"
    );

    const toast = document.getElementById("toast");
    const toastMessage = document.getElementById("toastMessage");

    let toastTimer = null;

    /*
        Hiển thị lời chào theo thời gian
    */
    function updateWelcomeMessage() {
        const currentHour = new Date().getHours();

        let greeting = "Chào buổi sáng";

        if (currentHour >= 12 && currentHour < 18) {
            greeting = "Chào buổi chiều";
        }

        if (currentHour >= 18 || currentHour < 5) {
            greeting = "Chào buổi tối";
        }

        welcomeTitle.textContent =
            `${greeting}, HR 👋`;
    }

    /*
        Hiển thị ngày hiện tại
    */
    function updateCurrentDate() {
        const today = new Date();

        const weekdayNames = [
            "Chủ Nhật",
            "Thứ Hai",
            "Thứ Ba",
            "Thứ Tư",
            "Thứ Năm",
            "Thứ Sáu",
            "Thứ Bảy"
        ];

        const weekday = weekdayNames[today.getDay()];
        const day = today.getDate();
        const month = today.getMonth() + 1;

        currentDateText.textContent =
            `${weekday}, ${day} tháng ${month}`;
    }

    /*
        Cập nhật chiều cao biểu đồ
    */
    function renderChart(values) {
        const columns = document.querySelectorAll(".month-column");
        const maxValue = 120;

        columns.forEach(function (column, index) {
            const bar = column.querySelector(".bar");
            const number = column.querySelector(".bar-number");

            const value = values[index] || 0;
            const height = (value / maxValue) * 85;

            bar.dataset.value = value;
            bar.style.height = `${height}px`;

            number.textContent = value > 0 ? value : "";

            column.classList.toggle(
                "empty-month",
                value === 0
            );
        });
    }

    /*
        Dữ liệu biểu đồ theo năm
    */
    const chartData = {
        2026: [
            52,
            71,
            88,
            102,
            96,
            111,
            0,
            0,
            0,
            0,
            0,
            0
        ],

        2025: [
            45,
            60,
            72,
            81,
            78,
            92,
            96,
            104,
            99,
            108,
            113,
            119
        ],

        2024: [
            33,
            48,
            55,
            64,
            71,
            76,
            82,
            88,
            91,
            96,
            100,
            107
        ]
    };

    yearFilter.addEventListener("change", function () {
        const selectedYear = yearFilter.value;

        renderChart(chartData[selectedYear]);

        showToast(
            `Đã hiển thị dữ liệu năm ${selectedYear}.`
        );
    });

    /*
        Mở modal tạo tin
    */
    createJobButton.addEventListener("click", function () {
        jobModal.classList.add("show");

        setDefaultDeadline();

        jobTitleInput.focus();
    });

    closeModalButton.addEventListener("click", closeModal);
    cancelModalButton.addEventListener("click", closeModal);

    jobModal.addEventListener("click", function (event) {
        if (event.target === jobModal) {
            closeModal();
        }
    });

    function closeModal() {
        jobModal.classList.remove("show");
        jobForm.reset();
    }

    /*
        Đặt hạn tuyển mặc định sau 30 ngày
    */
    function setDefaultDeadline() {
        const deadline = new Date();

        deadline.setDate(deadline.getDate() + 30);

        const year = deadline.getFullYear();

        const month = String(
            deadline.getMonth() + 1
        ).padStart(2, "0");

        const day = String(
            deadline.getDate()
        ).padStart(2, "0");

        deadlineInput.value =
            `${year}-${month}-${day}`;
    }

    /*
        Tạo tin tuyển dụng
    */
    jobForm.addEventListener("submit", function (event) {
        event.preventDefault();

        const title = jobTitleInput.value.trim();
        const department = departmentInput.value;
        const quantity = Number(quantityInput.value);
        const deadline = deadlineInput.value;

        if (
            !title ||
            !department ||
            !quantity ||
            !deadline
        ) {
            showToast("Vui lòng nhập đầy đủ thông tin.");
            return;
        }

        const currentJobs =
            Number(activeJobsValue.textContent) || 0;

        activeJobsValue.textContent =
            currentJobs + 1;

        closeModal();

        showToast(
            `Đã tạo tin tuyển dụng "${title}".`
        );
    });

    /*
        Nút tùy chọn nguồn ứng viên
    */
    sourceMoreButton.addEventListener("click", function () {
        showToast(
            "Nguồn ứng viên: Website, LinkedIn, giới thiệu và nguồn khác."
        );
    });

    /*
        Hiện thông báo
    */
    function showToast(message) {
        toastMessage.textContent = message;

        toast.classList.add("show");

        clearTimeout(toastTimer);

        toastTimer = setTimeout(function () {
            toast.classList.remove("show");
        }, 2500);
    }

    updateWelcomeMessage();
    updateCurrentDate();
    renderChart(chartData[2026]);
});