document.addEventListener(
    "DOMContentLoaded",
    function () {

        /* =====================================================
           1. KHAI BÁO PHẦN TỬ
        ===================================================== */

        const searchInput =
            document.getElementById(
                "searchInput",
            );

        const filterButton =
            document.getElementById(
                "filterButton",
            );

        const filterPanel =
            document.getElementById(
                "filterPanel",
            );

        const positionFilter =
            document.getElementById(
                "positionFilter",
            );

        const statusFilter =
            document.getElementById(
                "statusFilter",
            );

        const clearFilterButton =
            document.getElementById(
                "clearFilterButton",
            );

        const exportButton =
            document.getElementById(
                "exportButton",
            );

        const openAddModalButton =
            document.getElementById(
                "openAddModalButton",
            );

        const emptyAddButton =
            document.getElementById(
                "emptyAddButton",
            );

        const interviewModal =
            document.getElementById(
                "interviewModal",
            );

        const closeModalButton =
            document.getElementById(
                "closeModalButton",
            );

        const cancelModalButton =
            document.getElementById(
                "cancelModalButton",
            );

        const interviewForm =
            document.getElementById(
                "interviewForm",
            );

        const candidateNameInput =
            document.getElementById(
                "candidateName",
            );

        const candidatePositionInput =
            document.getElementById(
                "candidatePosition",
            );

        const candidateScoreInput =
            document.getElementById(
                "candidateScore",
            );

        const candidateStatusInput =
            document.getElementById(
                "candidateStatus",
            );

        const interviewDateInput =
            document.getElementById(
                "interviewDate",
            );

        const interviewTimeInput =
            document.getElementById(
                "interviewTime",
            );

        const interviewerNameInput =
            document.getElementById(
                "interviewerName",
            );

        const interviewTypeInput =
            document.getElementById(
                "interviewType",
            );

        const calendarMonthTitle =
            document.getElementById(
                "calendarMonthTitle",
            );

        const calendarGrid =
            document.getElementById(
                "calendarGrid",
            );

        const previousMonthButton =
            document.getElementById(
                "previousMonthButton",
            );

        const nextMonthButton =
            document.getElementById(
                "nextMonthButton",
            );

        const todayButton =
            document.getElementById(
                "todayButton",
            );

        const selectedDateTitle =
            document.getElementById(
                "selectedDateTitle",
            );

        const selectedDateCount =
            document.getElementById(
                "selectedDateCount",
            );

        const agendaList =
            document.getElementById(
                "agendaList",
            );

        const agendaEmpty =
            document.getElementById(
                "agendaEmpty",
            );

        const totalScheduleCount =
            document.getElementById(
                "totalScheduleCount",
            );

        const upcomingScheduleCount =
            document.getElementById(
                "upcomingScheduleCount",
            );

        const ongoingScheduleCount =
            document.getElementById(
                "ongoingScheduleCount",
            );

        const completedScheduleCount =
            document.getElementById(
                "completedScheduleCount",
            );

        const contextMenu =
            document.getElementById(
                "contextMenu",
            );

        const changeStatusButton =
            document.getElementById(
                "changeStatusButton",
            );

        const deleteInterviewButton =
            document.getElementById(
                "deleteInterviewButton",
            );

        const toast =
            document.getElementById(
                "toast",
            );

        const toastMessage =
            document.getElementById(
                "toastMessage",
            );

        /* =====================================================
           2. BIẾN TRẠNG THÁI
        ===================================================== */

        const currentDate =
            new Date();

        currentDate.setHours(
            0,
            0,
            0,
            0,
        );

        let selectedDate =
            new Date(
                currentDate,
            );

        let visibleMonth =
            new Date(
                currentDate.getFullYear(),
                currentDate.getMonth(),
                1,
            );

        let selectedInterviewId =
            null;

        let toastTimer =
            null;

        /* =====================================================
           3. DỮ LIỆU MẪU
        ===================================================== */

        let interviews = [
            {
                id: 1,

                name:
                    "Nguyễn Minh Anh",

                position:
                    "Frontend Developer",

                score:
                    92,

                status:
                    "Sắp diễn ra",

                interviewDate:
                    formatDateInput(
                        currentDate,
                    ),

                interviewTime:
                    "09:30",

                interviewer:
                    "Trần Hoàng Nam",

                type:
                    "Trực tuyến",
            },

            {
                id: 2,

                name:
                    "Trần Thanh Tùng",

                position:
                    "Backend Developer",

                score:
                    86,

                status:
                    "Đang diễn ra",

                interviewDate:
                    formatDateInput(
                        currentDate,
                    ),

                interviewTime:
                    "10:30",

                interviewer:
                    "Nguyễn Thị Mai",

                type:
                    "Trực tiếp",
            },

            {
                id: 3,

                name:
                    "Lê Ngọc Hân",

                position:
                    "UI/UX Designer",

                score:
                    79,

                status:
                    "Hoàn thành",

                interviewDate:
                    formatDateInput(
                        addDays(
                            currentDate,
                            -2,
                        ),
                    ),

                interviewTime:
                    "14:00",

                interviewer:
                    "Phạm Anh Khoa",

                type:
                    "Trực tuyến",
            },

            {
                id: 4,

                name:
                    "Phạm Quốc Thịnh",

                position:
                    "Data Analyst",

                score:
                    74,

                status:
                    "Đã hoãn",

                interviewDate:
                    formatDateInput(
                        addDays(
                            currentDate,
                            3,
                        ),
                    ),

                interviewTime:
                    "15:30",

                interviewer:
                    "Lê Minh Tuấn",

                type:
                    "Điện thoại",
            },

            {
                id: 5,

                name:
                    "Võ Hoàng Nam",

                position:
                    "Frontend Developer",

                score:
                    81,

                status:
                    "Sắp diễn ra",

                interviewDate:
                    formatDateInput(
                        addDays(
                            currentDate,
                            5,
                        ),
                    ),

                interviewTime:
                    "08:45",

                interviewer:
                    "Trần Hoàng Nam",

                type:
                    "Trực tuyến",
            },
        ];

        /* =====================================================
           4. BỘ LỌC
        ===================================================== */

        filterButton.addEventListener(
            "click",
            function () {
                const isOpen =
                    filterPanel.classList.toggle(
                        "show",
                    );

                filterButton.classList.toggle(
                    "active",
                    isOpen,
                );

                filterButton.setAttribute(
                    "aria-expanded",
                    String(
                        isOpen,
                    ),
                );

                filterPanel.setAttribute(
                    "aria-hidden",
                    String(
                        !isOpen,
                    ),
                );
            },
        );

        searchInput.addEventListener(
            "input",
            renderAll,
        );

        positionFilter.addEventListener(
            "change",
            renderAll,
        );

        statusFilter.addEventListener(
            "change",
            renderAll,
        );

        clearFilterButton.addEventListener(
            "click",
            function () {
                searchInput.value =
                    "";

                positionFilter.value =
                    "all";

                statusFilter.value =
                    "all";

                renderAll();
            },
        );

        /* =====================================================
           5. MODAL THÊM LỊCH
        ===================================================== */

        openAddModalButton.addEventListener(
            "click",
            openModal,
        );

        emptyAddButton.addEventListener(
            "click",
            openModal,
        );

        closeModalButton.addEventListener(
            "click",
            closeModal,
        );

        cancelModalButton.addEventListener(
            "click",
            closeModal,
        );

        interviewModal.addEventListener(
            "click",
            function (event) {
                if (
                    event.target ===
                    interviewModal
                ) {
                    closeModal();
                }
            },
        );

        function openModal() {
            interviewModal.classList.add(
                "show",
            );

            interviewModal.setAttribute(
                "aria-hidden",
                "false",
            );

            document.body.classList.add(
                "modal-open",
            );

            interviewDateInput.value =
                formatDateInput(
                    selectedDate,
                );

            interviewTimeInput.value =
                getRoundedTime();

            window.setTimeout(
                function () {
                    candidateNameInput.focus();
                },
                60,
            );
        }

        function closeModal() {
            interviewModal.classList.remove(
                "show",
            );

            interviewModal.setAttribute(
                "aria-hidden",
                "true",
            );

            document.body.classList.remove(
                "modal-open",
            );

            interviewForm.reset();
        }

        function getRoundedTime() {
            const now =
                new Date();

            const minutes =
                now.getMinutes();

            const roundedMinutes =
                Math.ceil(
                    minutes / 15,
                ) * 15;

            now.setMinutes(
                roundedMinutes,
                0,
                0,
            );

            return [
                String(
                    now.getHours(),
                ).padStart(
                    2,
                    "0",
                ),

                String(
                    now.getMinutes(),
                ).padStart(
                    2,
                    "0",
                ),
            ].join(
                ":",
            );
        }

        /* =====================================================
           6. THÊM LỊCH PHỎNG VẤN
        ===================================================== */

        interviewForm.addEventListener(
            "submit",
            function (event) {
                event.preventDefault();

                const newInterview = {
                    id:
                        Date.now(),

                    name:
                        candidateNameInput
                            .value
                            .trim(),

                    position:
                        candidatePositionInput
                            .value,

                    score:
                        Number(
                            candidateScoreInput
                                .value,
                        ),

                    status:
                        candidateStatusInput
                            .value,

                    interviewDate:
                        interviewDateInput
                            .value,

                    interviewTime:
                        interviewTimeInput
                            .value,

                    interviewer:
                        interviewerNameInput
                            .value
                            .trim(),

                    type:
                        interviewTypeInput
                            .value,
                };

                if (
                    !newInterview.name ||
                    !newInterview.position ||
                    Number.isNaN(
                        newInterview.score,
                    ) ||
                    !newInterview.status ||
                    !newInterview.interviewDate ||
                    !newInterview.interviewTime ||
                    !newInterview.interviewer
                ) {
                    showToast(
                        "Vui lòng nhập đầy đủ thông tin.",
                    );

                    return;
                }

                if (
                    newInterview.score < 0 ||
                    newInterview.score > 100
                ) {
                    showToast(
                        "Điểm AI phải từ 0 đến 100.",
                    );

                    return;
                }

                interviews.push(
                    newInterview,
                );

                selectedDate =
                    parseDate(
                        newInterview
                            .interviewDate,
                    );

                visibleMonth =
                    new Date(
                        selectedDate
                            .getFullYear(),

                        selectedDate
                            .getMonth(),

                        1,
                    );

                closeModal();

                renderAll();

                showToast(
                    "Đã thêm lịch phỏng vấn mới.",
                );
            },
        );

        /* =====================================================
           7. CHUYỂN THÁNG
        ===================================================== */

        previousMonthButton.addEventListener(
            "click",
            function () {
                visibleMonth =
                    new Date(
                        visibleMonth
                            .getFullYear(),

                        visibleMonth
                            .getMonth() - 1,

                        1,
                    );

                renderAll();
            },
        );

        nextMonthButton.addEventListener(
            "click",
            function () {
                visibleMonth =
                    new Date(
                        visibleMonth
                            .getFullYear(),

                        visibleMonth
                            .getMonth() + 1,

                        1,
                    );

                renderAll();
            },
        );

        todayButton.addEventListener(
            "click",
            function () {
                selectedDate =
                    new Date(
                        currentDate,
                    );

                visibleMonth =
                    new Date(
                        currentDate
                            .getFullYear(),

                        currentDate
                            .getMonth(),

                        1,
                    );

                renderAll();
            },
        );
                /* =====================================================
           8. RENDER TOÀN BỘ GIAO DIỆN
        ===================================================== */

        function renderAll() {
            renderCalendar();
            renderAgenda();
            renderStatistics();
        }

        /* =====================================================
           9. RENDER LỊCH THÁNG
        ===================================================== */

        function renderCalendar() {
            const year =
                visibleMonth
                    .getFullYear();

            const month =
                visibleMonth
                    .getMonth();

            calendarMonthTitle.textContent =
                `Tháng ${month + 1}, ${year}`;

            calendarGrid.innerHTML =
                "";

            const firstDayOfMonth =
                new Date(
                    year,
                    month,
                    1,
                );

            /*
                Chuyển Chủ nhật từ 0 thành vị trí cuối tuần.
                T2 = 0, T3 = 1, ..., CN = 6.
            */

            const startDayIndex =
                (
                    firstDayOfMonth
                        .getDay() +
                    6
                ) % 7;

            const gridStartDate =
                new Date(
                    year,
                    month,
                    1 - startDayIndex,
                );

            const filteredInterviews =
                getFilteredInterviews();

            /*
                Hiển thị 42 ô:
                6 tuần x 7 ngày.
            */

            for (
                let index = 0;
                index < 42;
                index++
            ) {
                const dayDate =
                    new Date(
                        gridStartDate,
                    );

                dayDate.setDate(
                    gridStartDate
                        .getDate() +
                    index,
                );

                const dateKey =
                    formatDateInput(
                        dayDate,
                    );

                const dayInterviews =
                    filteredInterviews.filter(
                        function (interview) {
                            return (
                                interview
                                    .interviewDate ===
                                dateKey
                            );
                        },
                    );

                const dayButton =
                    document.createElement(
                        "button",
                    );

                dayButton.type =
                    "button";

                dayButton.className =
                    "calendar-day";

                dayButton.dataset.date =
                    dateKey;

                dayButton.setAttribute(
                    "aria-label",
                    formatLongDate(
                        dayDate,
                    ),
                );

                const dayNumber =
                    document.createElement(
                        "span",
                    );

                dayNumber.className =
                    "calendar-day-number";

                dayNumber.textContent =
                    String(
                        dayDate.getDate(),
                    );

                dayButton.appendChild(
                    dayNumber,
                );

                /*
                    Ngày thuộc tháng trước hoặc tháng sau.
                */

                if (
                    dayDate.getMonth() !==
                    month
                ) {
                    dayButton.classList.add(
                        "other-month",
                    );
                }

                /*
                    Ngày hiện tại.
                */

                if (
                    isSameDate(
                        dayDate,
                        currentDate,
                    )
                ) {
                    dayButton.classList.add(
                        "today",
                    );
                }

                /*
                    Ngày đang chọn.
                */

                if (
                    isSameDate(
                        dayDate,
                        selectedDate,
                    )
                ) {
                    dayButton.classList.add(
                        "selected",
                    );
                }

                /*
                    Ngày có lịch phỏng vấn.
                */

                if (
                    dayInterviews.length >
                    0
                ) {
                    dayButton.classList.add(
                        "has-events",
                    );

                    const eventCount =
                        document.createElement(
                            "span",
                        );

                    eventCount.className =
                        "event-count";

                    eventCount.textContent =
                        String(
                            dayInterviews
                                .length,
                        );

                    dayButton.appendChild(
                        eventCount,
                    );
                }

                dayButton.addEventListener(
                    "click",
                    function () {
                        selectedDate =
                            parseDate(
                                dateKey,
                            );

                        /*
                            Nếu bấm ngày thuộc tháng khác,
                            tự chuyển sang tháng đó.
                        */

                        if (
                            selectedDate
                                .getMonth() !==
                                visibleMonth
                                    .getMonth() ||
                            selectedDate
                                .getFullYear() !==
                                visibleMonth
                                    .getFullYear()
                        ) {
                            visibleMonth =
                                new Date(
                                    selectedDate
                                        .getFullYear(),

                                    selectedDate
                                        .getMonth(),

                                    1,
                                );
                        }

                        renderAll();
                    },
                );

                calendarGrid.appendChild(
                    dayButton,
                );
            }
        }

        /* =====================================================
           10. RENDER DANH SÁCH LỊCH TRONG NGÀY
        ===================================================== */

        function renderAgenda() {
            const selectedDateKey =
                formatDateInput(
                    selectedDate,
                );

            const dayInterviews =
                getFilteredInterviews()
                    .filter(
                        function (
                            interview,
                        ) {
                            return (
                                interview
                                    .interviewDate ===
                                selectedDateKey
                            );
                        },
                    )
                    .sort(
                        function (
                            firstInterview,
                            secondInterview,
                        ) {
                            return (
                                firstInterview
                                    .interviewTime
                                    .localeCompare(
                                        secondInterview
                                            .interviewTime,
                                    )
                            );
                        },
                    );

            selectedDateTitle.textContent =
                formatLongDate(
                    selectedDate,
                );

            selectedDateCount.textContent =
                `${dayInterviews.length} lịch`;

            agendaList.innerHTML =
                "";

            const hasNoInterview =
                dayInterviews.length ===
                0;

            agendaList.hidden =
                hasNoInterview;

            agendaEmpty.hidden =
                !hasNoInterview;

            dayInterviews.forEach(
                function (interview) {
                    const agendaItem =
                        createAgendaItem(
                            interview,
                        );

                    agendaList.appendChild(
                        agendaItem,
                    );
                },
            );
        }

        /* =====================================================
           11. TẠO MỘT CARD LỊCH PHỎNG VẤN
        ===================================================== */

        function createAgendaItem(
            interview,
        ) {
            const article =
                document.createElement(
                    "article",
                );

            article.className =
                "agenda-item";

            article.dataset.id =
                String(
                    interview.id,
                );

            const initials =
                createInitials(
                    interview.name,
                );

            const avatarClass =
                getAvatarClass(
                    interview.position,
                );

            const statusClass =
                getStatusClass(
                    interview.status,
                );

            article.innerHTML = `
                <div class="agenda-time">

                    <strong>
                        ${escapeHTML(
                            interview.interviewTime,
                        )}
                    </strong>

                    <span>
                        ${escapeHTML(
                            getTimePeriod(
                                interview.interviewTime,
                            ),
                        )}
                    </span>

                </div>

                <div class="agenda-main">

                    <div class="agenda-name-row">

                        <span
                            class="agenda-avatar ${avatarClass}"
                        >
                            ${escapeHTML(
                                initials,
                            )}
                        </span>

                        <div class="agenda-name">

                            <strong>
                                ${escapeHTML(
                                    interview.name,
                                )}
                            </strong>

                            <span>
                                ${escapeHTML(
                                    interview.position,
                                )}
                            </span>

                        </div>

                    </div>

                    <div class="agenda-meta">

                        <span>

                            <i class="fa-regular fa-user"></i>

                            ${escapeHTML(
                                interview.interviewer,
                            )}

                        </span>

                        <span>

                            <i class="fa-solid fa-location-dot"></i>

                            ${escapeHTML(
                                interview.type,
                            )}

                        </span>

                        <span>

                            <i class="fa-solid fa-wand-magic-sparkles"></i>

                            ${Number(
                                interview.score,
                            )}/100

                        </span>

                    </div>

                </div>

                <div class="agenda-side">

                    <span
                        class="status-badge ${statusClass}"
                    >
                        ${escapeHTML(
                            interview.status,
                        )}
                    </span>

                    <button
                        type="button"
                        class="more-button"
                        aria-label="Mở menu thao tác"
                        title="Thao tác"
                    >

                        <i class="fa-solid fa-ellipsis"></i>

                    </button>

                </div>
            `;

            const menuButton =
                article.querySelector(
                    ".more-button",
                );

            menuButton.addEventListener(
                "click",
                function (event) {
                    event.stopPropagation();

                    selectedInterviewId =
                        interview.id;

                    openContextMenu(
                        menuButton,
                    );
                },
            );

            return article;
        }

        /* =====================================================
           12. RENDER THỐNG KÊ
        ===================================================== */

        function renderStatistics() {
            const monthInterviews =
                getFilteredInterviews()
                    .filter(
                        function (
                            interview,
                        ) {
                            const interviewDate =
                                parseDate(
                                    interview
                                        .interviewDate,
                                );

                            return (
                                interviewDate
                                    .getFullYear() ===
                                    visibleMonth
                                        .getFullYear() &&
                                interviewDate
                                    .getMonth() ===
                                    visibleMonth
                                        .getMonth()
                            );
                        },
                    );

            totalScheduleCount.textContent =
                String(
                    monthInterviews
                        .length,
                );

            const upcomingCount =
                monthInterviews.filter(
                    function (
                        interview,
                    ) {
                        return (
                            interview.status ===
                            "Sắp diễn ra"
                        );
                    },
                ).length;

            const ongoingCount =
                monthInterviews.filter(
                    function (
                        interview,
                    ) {
                        return (
                            interview.status ===
                            "Đang diễn ra"
                        );
                    },
                ).length;

            const completedCount =
                monthInterviews.filter(
                    function (
                        interview,
                    ) {
                        return (
                            interview.status ===
                            "Hoàn thành"
                        );
                    },
                ).length;

            upcomingScheduleCount.textContent =
                String(
                    upcomingCount,
                );

            ongoingScheduleCount.textContent =
                String(
                    ongoingCount,
                );

            completedScheduleCount.textContent =
                String(
                    completedCount,
                );
        }

        /* =====================================================
           13. LẤY DANH SÁCH SAU KHI LỌC
        ===================================================== */

        function getFilteredInterviews() {
            const keyword =
                normalizeText(
                    searchInput.value,
                );

            const selectedPosition =
                positionFilter.value;

            const selectedStatus =
                statusFilter.value;

            return interviews.filter(
                function (interview) {
                    const searchableContent =
                        normalizeText(
                            [
                                interview.name,
                                interview.position,
                                interview.interviewer,
                                interview.status,
                                interview.type,
                            ].join(
                                " ",
                            ),
                        );

                    const matchesKeyword =
                        !keyword ||
                        searchableContent.includes(
                            keyword,
                        );

                    const matchesPosition =
                        selectedPosition ===
                            "all" ||
                        interview.position ===
                            selectedPosition;

                    const matchesStatus =
                        selectedStatus ===
                            "all" ||
                        interview.status ===
                            selectedStatus;

                    return (
                        matchesKeyword &&
                        matchesPosition &&
                        matchesStatus
                    );
                },
            );
        }
                /* =====================================================
           14. MỞ MENU THAO TÁC
        ===================================================== */

        function openContextMenu(
            button,
        ) {
            const buttonRect =
                button.getBoundingClientRect();

            const menuWidth =
                175;

            let left =
                buttonRect.right -
                menuWidth;

            let top =
                buttonRect.bottom +
                6;

            if (left < 10) {
                left = 10;
            }

            if (
                top + 100 >
                window.innerHeight
            ) {
                top =
                    buttonRect.top -
                    92;
            }

            contextMenu.style.left =
                `${left}px`;

            contextMenu.style.top =
                `${top}px`;

            contextMenu.classList.add(
                "show",
            );

            contextMenu.setAttribute(
                "aria-hidden",
                "false",
            );
        }

        function closeContextMenu() {
            contextMenu.classList.remove(
                "show",
            );

            contextMenu.setAttribute(
                "aria-hidden",
                "true",
            );
        }

        /* =====================================================
           15. ĐỔI TRẠNG THÁI
        ===================================================== */

        changeStatusButton.addEventListener(
            "click",
            function () {
                const interview =
                    interviews.find(
                        function (
                            item,
                        ) {
                            return (
                                item.id ===
                                selectedInterviewId
                            );
                        },
                    );

                if (!interview) {
                    return;
                }

                const statuses = [
                    "Sắp diễn ra",
                    "Đang diễn ra",
                    "Hoàn thành",
                    "Đã hoãn",
                ];

                const currentIndex =
                    statuses.indexOf(
                        interview.status,
                    );

                const nextIndex =
                    currentIndex ===
                    statuses.length - 1
                        ? 0
                        : currentIndex + 1;

                interview.status =
                    statuses[nextIndex];

                closeContextMenu();

                renderAll();

                showToast(
                    "Đã cập nhật trạng thái.",
                );
            },
        );

        /* =====================================================
           16. XÓA LỊCH
        ===================================================== */

        deleteInterviewButton.addEventListener(
            "click",
            function () {
                const interview =
                    interviews.find(
                        function (
                            item,
                        ) {
                            return (
                                item.id ===
                                selectedInterviewId
                            );
                        },
                    );

                if (!interview) {
                    return;
                }

                const confirmed =
                    window.confirm(
                        `Bạn có chắc muốn xóa lịch của "${interview.name}" không?`,
                    );

                if (!confirmed) {
                    closeContextMenu();

                    return;
                }

                interviews =
                    interviews.filter(
                        function (
                            item,
                        ) {
                            return (
                                item.id !==
                                selectedInterviewId
                            );
                        },
                    );

                selectedInterviewId =
                    null;

                closeContextMenu();

                renderAll();

                showToast(
                    "Đã xóa lịch phỏng vấn.",
                );
            },
        );

        /* =====================================================
           17. ĐÓNG MENU KHI CLICK RA NGOÀI
        ===================================================== */

        document.addEventListener(
            "click",
            function (event) {
                if (
                    !contextMenu.contains(
                        event.target,
                    ) &&
                    !event.target.closest(
                        ".more-button",
                    )
                ) {
                    closeContextMenu();
                }
            },
        );

        window.addEventListener(
            "scroll",
            closeContextMenu,
        );

        window.addEventListener(
            "resize",
            closeContextMenu,
        );

        /* =====================================================
           18. PHÍM ESCAPE
        ===================================================== */

        document.addEventListener(
            "keydown",
            function (event) {
                if (
                    event.key !==
                    "Escape"
                ) {
                    return;
                }

                closeContextMenu();

                if (
                    interviewModal
                        .classList
                        .contains(
                            "show",
                        )
                ) {
                    closeModal();
                }
            },
        );

        /* =====================================================
           19. XUẤT CSV
        ===================================================== */

        exportButton.addEventListener(
            "click",
            function () {
                const rows = [
                    [
                        "Ứng viên",
                        "Vị trí",
                        "Điểm AI",
                        "Trạng thái",
                        "Ngày phỏng vấn",
                        "Giờ phỏng vấn",
                        "Người phỏng vấn",
                        "Hình thức",
                    ],
                ];

                getFilteredInterviews()
                    .forEach(
                        function (
                            interview,
                        ) {
                            rows.push(
                                [
                                    interview.name,
                                    interview.position,
                                    `${interview.score}/100`,
                                    interview.status,
                                    interview.interviewDate,
                                    interview.interviewTime,
                                    interview.interviewer,
                                    interview.type,
                                ],
                            );
                        },
                    );

                const csvContent =
                    rows
                        .map(
                            function (
                                row,
                            ) {
                                return row
                                    .map(
                                        function (
                                            cell,
                                        ) {
                                            const escapedCell =
                                                String(
                                                    cell,
                                                ).replace(
                                                    /"/g,
                                                    '""',
                                                );

                                            return `"${escapedCell}"`;
                                        },
                                    )
                                    .join(
                                        ",",
                                    );
                            },
                        )
                        .join(
                            "\n",
                        );

                const blob =
                    new Blob(
                        [
                            "\uFEFF" +
                            csvContent,
                        ],
                        {
                            type:
                                "text/csv;charset=utf-8;",
                        },
                    );

                const downloadUrl =
                    URL.createObjectURL(
                        blob,
                    );

                const link =
                    document.createElement(
                        "a",
                    );

                link.href =
                    downloadUrl;

                link.download =
                    "lich-phong-van.csv";

                document.body.appendChild(
                    link,
                );

                link.click();

                link.remove();

                URL.revokeObjectURL(
                    downloadUrl,
                );

                showToast(
                    "Đã xuất dữ liệu CSV.",
                );
            },
        );

        /* =====================================================
           20. TẠO CHỮ VIẾT TẮT
        ===================================================== */

        function createInitials(
            name,
        ) {
            const words =
                String(
                    name,
                )
                    .trim()
                    .split(
                        /\s+/,
                    )
                    .filter(
                        Boolean,
                    );

            if (
                words.length ===
                0
            ) {
                return "UV";
            }

            if (
                words.length ===
                1
            ) {
                return words[0]
                    .slice(
                        0,
                        2,
                    )
                    .toUpperCase();
            }

            return (
                words[0]
                    .charAt(
                        0,
                    ) +
                words[
                    words.length - 1
                ].charAt(
                    0,
                )
            ).toUpperCase();
        }

        /* =====================================================
           21. MÀU AVATAR
        ===================================================== */

        function getAvatarClass(
            position,
        ) {
            if (
                position ===
                "Frontend Developer"
            ) {
                return "avatar-purple";
            }

            if (
                position ===
                "Backend Developer"
            ) {
                return "avatar-blue";
            }

            if (
                position ===
                "UI/UX Designer"
            ) {
                return "avatar-orange";
            }

            return "avatar-green";
        }

        /* =====================================================
           22. CLASS TRẠNG THÁI
        ===================================================== */

        function getStatusClass(
            status,
        ) {
            const statusClasses = {
                "Sắp diễn ra":
                    "status-upcoming",

                "Đang diễn ra":
                    "status-ongoing",

                "Hoàn thành":
                    "status-completed",

                "Đã hoãn":
                    "status-postponed",
            };

            return (
                statusClasses[
                    status
                ] ||
                "status-upcoming"
            );
        }

        /* =====================================================
           23. BUỔI TRONG NGÀY
        ===================================================== */

        function getTimePeriod(
            time,
        ) {
            const hour =
                Number(
                    String(
                        time,
                    ).split(
                        ":",
                    )[0],
                );

            if (hour < 12) {
                return "Buổi sáng";
            }

            if (hour < 18) {
                return "Buổi chiều";
            }

            return "Buổi tối";
        }

        /* =====================================================
           24. ĐỊNH DẠNG NGÀY YYYY-MM-DD
        ===================================================== */

        function formatDateInput(
            date,
        ) {
            const year =
                date.getFullYear();

            const month =
                String(
                    date.getMonth() +
                    1,
                ).padStart(
                    2,
                    "0",
                );

            const day =
                String(
                    date.getDate(),
                ).padStart(
                    2,
                    "0",
                );

            return (
                `${year}-${month}-${day}`
            );
        }

        /* =====================================================
           25. CHUYỂN CHUỖI THÀNH DATE
        ===================================================== */

        function parseDate(
            value,
        ) {
            const parts =
                String(
                    value,
                )
                    .split(
                        "-",
                    )
                    .map(
                        Number,
                    );

            return new Date(
                parts[0],
                parts[1] - 1,
                parts[2],
            );
        }

        /* =====================================================
           26. ĐỊNH DẠNG NGÀY DÀI
        ===================================================== */

        function formatLongDate(
            date,
        ) {
            const weekDays = [
                "Chủ nhật",
                "Thứ hai",
                "Thứ ba",
                "Thứ tư",
                "Thứ năm",
                "Thứ sáu",
                "Thứ bảy",
            ];

            return (
                `${weekDays[
                    date.getDay()
                ]}, ` +
                `${date.getDate()} ` +
                `tháng ${
                    date.getMonth() +
                    1
                }`
            );
        }

        /* =====================================================
           27. SO SÁNH HAI NGÀY
        ===================================================== */

        function isSameDate(
            firstDate,
            secondDate,
        ) {
            return (
                firstDate
                    .getFullYear() ===
                    secondDate
                        .getFullYear() &&
                firstDate
                    .getMonth() ===
                    secondDate
                        .getMonth() &&
                firstDate
                    .getDate() ===
                    secondDate
                        .getDate()
            );
        }

        /* =====================================================
           28. CỘNG/TRỪ NGÀY
        ===================================================== */

        function addDays(
            date,
            numberOfDays,
        ) {
            const newDate =
                new Date(
                    date,
                );

            newDate.setDate(
                newDate.getDate() +
                numberOfDays,
            );

            return newDate;
        }

        /* =====================================================
           29. CHUẨN HÓA TÌM KIẾM
        ===================================================== */

        function normalizeText(
            value,
        ) {
            return String(
                value,
            )
                .toLocaleLowerCase(
                    "vi",
                )
                .normalize(
                    "NFD",
                )
                .replace(
                    /[\u0300-\u036f]/g,
                    "",
                )
                .replace(
                    /đ/g,
                    "d",
                );
        }

        /* =====================================================
           30. TOAST
        ===================================================== */

        function showToast(
            message,
        ) {
            toastMessage.textContent =
                message;

            toast.classList.add(
                "show",
            );

            window.clearTimeout(
                toastTimer,
            );

            toastTimer =
                window.setTimeout(
                    function () {
                        toast.classList.remove(
                            "show",
                        );
                    },
                    2500,
                );
        }

        /* =====================================================
           31. CHỐNG CHÈN HTML
        ===================================================== */

        function escapeHTML(
            value,
        ) {
            return String(
                value,
            )
                .replace(
                    /&/g,
                    "&amp;",
                )
                .replace(
                    /</g,
                    "&lt;",
                )
                .replace(
                    />/g,
                    "&gt;",
                )
                .replace(
                    /"/g,
                    "&quot;",
                )
                .replace(
                    /'/g,
                    "&#039;",
                );
        }

        /* =====================================================
           32. KHỞI CHẠY
        ===================================================== */

        renderAll();
    },
);