/* =========================================================
   TOPBAR COMPONENT
   File: components/topbar.js
========================================================= */

document.addEventListener("DOMContentLoaded", function () {
    loadTopbar();
});

/* =========================================================
   1. TẢI TOPBAR.HTML
========================================================= */

async function loadTopbar() {
    const topbarContainer =
        document.getElementById("topbar");

    if (!topbarContainer) {
        console.warn(
            'Không tìm thấy phần tử có id="topbar".',
        );

        return;
    }

    try {
        const response = await fetch(
            "../components/topbar.html",
        );

        if (!response.ok) {
            throw new Error(
                `Không thể tải topbar.html. Mã lỗi: ${response.status}`,
            );
        }

        const topbarHTML =
            await response.text();

        topbarContainer.innerHTML =
            topbarHTML;

        initializeTopbar();
    } catch (error) {
        console.error(
            "Lỗi tải topbar:",
            error,
        );

        topbarContainer.innerHTML = `
            <div class="topbar-load-error">
                Không thể tải thanh điều hướng.
            </div>
        `;
    }
}

/* =========================================================
   2. KHỞI TẠO TOPBAR
========================================================= */

function initializeTopbar() {
    const pageFrame =
        document.getElementById("pageFrame");

    const breadcrumbHome =
        document.querySelector(
            ".breadcrumb-home",
        );

    const currentPage =
        document.querySelector(
            ".current-page",
        );

    const notificationButton =
        document.getElementById(
            "notificationBtn",
        );

    const helpButton =
        document.getElementById(
            "helpBtn",
        );

    const profileButton =
        document.getElementById(
            "profileBtn",
        );

    const notificationDropdown =
        initializeNotificationDropdown();

    const helpDropdown =
        createHelpDropdown();

    const profileDropdown =
        createProfileDropdown();

    initializeAccountModal();
    initializePasswordModal();
    initializeLogoutModal();
    initializeGlobalSearch();

    updateCurrentPageName(
        pageFrame,
        currentPage,
    );

    if (pageFrame) {
        pageFrame.addEventListener(
            "load",
            function () {
                updateCurrentPageName(
                    pageFrame,
                    currentPage,
                );
            },
        );
    }

    /* Trang chủ */

    if (breadcrumbHome) {
        breadcrumbHome.addEventListener(
            "click",
            function (event) {
                event.preventDefault();

                navigateToPage(
                    "TongQuan.html",
                    "Tổng quan",
                );
            },
        );
    }

    /* Thông báo */

    if (notificationButton) {
        notificationButton.addEventListener(
            "click",
            function (event) {
                event.stopPropagation();

                toggleDropdown(
                    notificationDropdown,
                    notificationButton,
                );
            },
        );
    }

    /* Trợ giúp */

    if (helpButton) {
        helpButton.addEventListener(
            "click",
            function (event) {
                event.stopPropagation();

                toggleDropdown(
                    helpDropdown,
                    helpButton,
                );
            },
        );
    }

    /* Tài khoản */

    if (profileButton) {
        profileButton.addEventListener(
            "click",
            function (event) {
                event.stopPropagation();

                toggleDropdown(
                    profileDropdown,
                    profileButton,
                );
            },
        );
    }

    /* Click ra ngoài để đóng dropdown */

    document.addEventListener(
        "click",
        function (event) {
            const clickedInsideDropdown =
                event.target.closest(
                    ".topbar-dropdown",
                );

            const clickedButton =
                event.target.closest(
                    "#notificationBtn, #helpBtn, #profileBtn",
                );

            if (
                !clickedInsideDropdown &&
                !clickedButton
            ) {
                closeAllDropdowns();
            }
        },
    );

    /* Escape */

    document.addEventListener(
        "keydown",
        function (event) {
            if (event.key !== "Escape") {
                return;
            }

            closeAllDropdowns();

            const accountModal =
                document.getElementById(
                    "accountModal",
                );

            const passwordModal =
                document.getElementById(
                    "passwordModal",
                );

            const logoutModal =
                document.getElementById(
                    "logoutModal",
                );

            if (
                accountModal &&
                accountModal.classList.contains(
                    "show",
                )
            ) {
                closeAccountModal();
            }

            if (
                passwordModal &&
                passwordModal.classList.contains(
                    "show",
                )
            ) {
                closePasswordModal();
            }

            if (
                logoutModal &&
                logoutModal.classList.contains(
                    "active",
                )
            ) {
                closeLogoutModal();
            }
        },
    );
}

/* =========================================================
   3. THÔNG BÁO
========================================================= */

function initializeNotificationDropdown() {
    const dropdown =
        document.getElementById(
            "notificationDropdown",
        );

    if (!dropdown) {
        console.warn(
            "Không tìm thấy notificationDropdown.",
        );

        return null;
    }

    dropdown.classList.add(
        "topbar-dropdown",
    );

    const notificationItems =
        dropdown.querySelectorAll(
            ".notification-item",
        );

    notificationItems.forEach(
        function (item) {
            item.addEventListener(
                "click",
                function () {
                    item.classList.remove(
                        "unread",
                    );

                    updateNotificationBadge();

                    const type =
                        item.dataset.notificationType;

                    const routes = {
                        interview: {
                            page:
                                "LichPhongVan.html",

                            title:
                                "Lịch phỏng vấn",
                        },

                        candidate: {
                            page:
                                "UngVien.html",

                            title:
                                "Ứng viên",
                        },

                        job: {
                            page:
                                "TinTuyenDung.html",

                            title:
                                "Tin tuyển dụng",
                        },
                    };

                    const route =
                        routes[type];

                    if (route) {
                        navigateToPage(
                            route.page,
                            route.title,
                        );
                    }
                },
            );
        },
    );

    const markAllReadButton =
        dropdown.querySelector(
            "#markAllReadBtn",
        );

    if (markAllReadButton) {
        markAllReadButton.addEventListener(
            "click",
            function (event) {
                event.stopPropagation();

                markAllNotificationsRead();

                showTopbarToast(
                    "Đã đánh dấu tất cả thông báo là đã đọc.",
                    "success",
                );
            },
        );
    }

    const viewAllButton =
        dropdown.querySelector(
            "#viewAllNotificationsBtn",
        );

    if (viewAllButton) {
        viewAllButton.addEventListener(
            "click",
            function (event) {
                event.stopPropagation();

                showTopbarToast(
                    "Hiện chưa có trang thông báo riêng.",
                    "warning",
                );

                closeAllDropdowns();
            },
        );
    }

    updateNotificationBadge();

    return dropdown;
}

function markAllNotificationsRead() {
    const unreadItems =
        document.querySelectorAll(
            "#notificationDropdown .notification-item.unread",
        );

    unreadItems.forEach(
        function (item) {
            item.classList.remove(
                "unread",
            );
        },
    );

    updateNotificationBadge();
}

function updateNotificationBadge() {
    const unreadItems =
        document.querySelectorAll(
            "#notificationDropdown .notification-item.unread",
        );

    const unreadCount =
        unreadItems.length;

    const badge =
        document.getElementById(
            "notificationBadge",
        );

    const newCount =
        document.getElementById(
            "notificationNewCount",
        );

    const description =
        document.getElementById(
            "notificationDescription",
        );

    const markAllButton =
        document.getElementById(
            "markAllReadBtn",
        );

    if (badge) {
        badge.textContent =
            String(unreadCount);

        badge.classList.toggle(
            "hidden",
            unreadCount === 0,
        );
    }

    if (newCount) {
        newCount.textContent =
            `${unreadCount} mới`;

        newCount.hidden =
            unreadCount === 0;
    }

    if (description) {
        description.textContent =
            unreadCount > 0
                ? `Bạn có ${unreadCount} thông báo mới`
                : "Bạn đã xem tất cả thông báo";
    }

    if (markAllButton) {
        markAllButton.disabled =
            unreadCount === 0;
    }
}

/* =========================================================
   4. DROPDOWN TRỢ GIÚP
========================================================= */

function createHelpDropdown() {
    const button =
        document.getElementById(
            "helpBtn",
        );

    if (!button) {
        return null;
    }

    const wrapper =
        createButtonWrapper(
            button,
            "help-wrapper",
        );

    const dropdown =
        document.createElement(
            "div",
        );

    dropdown.className =
        "topbar-dropdown help-dropdown";

    dropdown.id =
        "helpDropdown";

    dropdown.setAttribute(
        "aria-hidden",
        "true",
    );

    dropdown.innerHTML = `
        <div class="dropdown-header">
            <h3>Trợ giúp</h3>
        </div>

        <div class="help-list">
            <button
                type="button"
                class="help-item"
                id="openHelpDesk"
            >
                <i class="fa-regular fa-circle-question"></i>

                <span class="help-item-content">
                    <strong>Trung tâm HelpDesk</strong>

                    <span>
                        Tìm câu trả lời và gửi yêu cầu hỗ trợ.
                    </span>
                </span>
            </button>

            <button
                type="button"
                class="help-item"
                id="contactSupport"
            >
                <i class="fa-regular fa-envelope"></i>

                <span class="help-item-content">
                    <strong>Liên hệ hỗ trợ</strong>

                    <span>
                        Gửi yêu cầu đến đội ngũ kỹ thuật.
                    </span>
                </span>
            </button>
        </div>
    `;

    wrapper.appendChild(
        dropdown,
    );

    const helpDeskButton =
        dropdown.querySelector(
            "#openHelpDesk",
        );

    const contactSupportButton =
        dropdown.querySelector(
            "#contactSupport",
        );

    if (helpDeskButton) {
        helpDeskButton.addEventListener(
            "click",
            function () {
                navigateToPage(
                    "helpdesk.html",
                    "Trung tâm trợ giúp",
                );
            },
        );
    }

    if (contactSupportButton) {
        contactSupportButton.addEventListener(
            "click",
            function () {
                navigateToPage(
                    "helpdesk.html",
                    "Trung tâm trợ giúp",
                );
            },
        );
    }

    return dropdown;
}

/* =========================================================
   5. DROPDOWN TÀI KHOẢN
========================================================= */

function createProfileDropdown() {
    const button =
        document.getElementById(
            "profileBtn",
        );

    if (!button) {
        return null;
    }

    const wrapper =
        createButtonWrapper(
            button,
            "profile-wrapper",
        );

    const dropdown =
        document.createElement(
            "div",
        );

    dropdown.className =
        "topbar-dropdown profile-dropdown";

    dropdown.id =
        "profileDropdown";

    dropdown.setAttribute(
        "aria-hidden",
        "true",
    );

    dropdown.innerHTML = `
        <div class="profile-dropdown-header">

            <div class="profile-avatar">
                HR
            </div>

            <div class="profile-dropdown-info">
                <strong>
                    Nhân viên tuyển dụng
                </strong>

                <span>
                    HR Recruiter
                </span>
            </div>

        </div>

        <div class="profile-menu">

            <button
                type="button"
                class="profile-menu-item"
                id="profileInfoButton"
            >
                <i class="fa-regular fa-user"></i>
                Hồ sơ tài khoản
            </button>

            <button
                type="button"
                class="profile-menu-item logout"
                id="logoutButton"
            >
                <i class="fa-solid fa-arrow-right-from-bracket"></i>
                Đăng xuất
            </button>

        </div>
    `;

    wrapper.appendChild(
        dropdown,
    );

    const profileInfoButton =
        dropdown.querySelector(
            "#profileInfoButton",
        );

    const logoutButton =
        dropdown.querySelector(
            "#logoutButton",
        );

    if (profileInfoButton) {
        profileInfoButton.addEventListener(
            "click",
            function () {
                closeAllDropdowns();
                openAccountModal();
            },
        );
    }

    if (logoutButton) {
        logoutButton.addEventListener(
            "click",
            function () {
                logoutAccount();
            },
        );
    }

    return dropdown;
}

/* =========================================================
   6. MODAL HỒ SƠ TÀI KHOẢN
========================================================= */

function initializeAccountModal() {
    const modal =
        document.getElementById(
            "accountModal",
        );

    if (!modal) {
        console.warn(
            "Không tìm thấy accountModal.",
        );

        return;
    }

    const closeButton =
        document.getElementById(
            "accountModalClose",
        );

    const cancelButton =
        document.getElementById(
            "accountModalCancel",
        );

    const overlay =
        document.getElementById(
            "accountModalOverlay",
        );

    const openPasswordButton =
        document.getElementById(
            "openChangePasswordButton",
        );

    if (closeButton) {
        closeButton.addEventListener(
            "click",
            closeAccountModal,
        );
    }

    if (cancelButton) {
        cancelButton.addEventListener(
            "click",
            closeAccountModal,
        );
    }

    if (overlay) {
        overlay.addEventListener(
            "click",
            closeAccountModal,
        );
    }

    if (openPasswordButton) {
        openPasswordButton.addEventListener(
            "click",
            function () {
                closeAccountModal();
                openPasswordModal();
            },
        );
    }
}

function openAccountModal() {
    const modal =
        document.getElementById(
            "accountModal",
        );

    if (!modal) {
        return;
    }

    modal.classList.add(
        "show",
    );

    modal.setAttribute(
        "aria-hidden",
        "false",
    );

    document.body.classList.add(
        "modal-open",
    );

    const closeButton =
        document.getElementById(
            "accountModalClose",
        );

    if (closeButton) {
        window.setTimeout(
            function () {
                closeButton.focus();
            },
            50,
        );
    }
}

function closeAccountModal() {
    const modal =
        document.getElementById(
            "accountModal",
        );

    if (!modal) {
        return;
    }

    modal.classList.remove(
        "show",
    );

    modal.setAttribute(
        "aria-hidden",
        "true",
    );

    document.body.classList.remove(
        "modal-open",
    );
}

/* =========================================================
   7. MODAL ĐỔI MẬT KHẨU
========================================================= */

function initializePasswordModal() {
    const passwordModal =
        document.getElementById(
            "passwordModal",
        );

    if (!passwordModal) {
        console.warn(
            "Không tìm thấy passwordModal.",
        );

        return;
    }

    const overlay =
        document.getElementById(
            "passwordModalOverlay",
        );

    const closeButton =
        document.getElementById(
            "passwordModalClose",
        );

    const cancelButton =
        document.getElementById(
            "passwordModalCancel",
        );

    const form =
        document.getElementById(
            "changePasswordForm",
        );

    const newPasswordInput =
        document.getElementById(
            "newPassword",
        );

    const confirmPasswordInput =
        document.getElementById(
            "confirmPassword",
        );

    if (overlay) {
        overlay.addEventListener(
            "click",
            closePasswordModal,
        );
    }

    if (closeButton) {
        closeButton.addEventListener(
            "click",
            closePasswordModal,
        );
    }

    if (cancelButton) {
        cancelButton.addEventListener(
            "click",
            closePasswordModal,
        );
    }

    const toggleButtons =
        passwordModal.querySelectorAll(
            ".password-toggle-button",
        );

    toggleButtons.forEach(
        function (button) {
            button.addEventListener(
                "click",
                function () {
                    togglePasswordVisibility(
                        button,
                    );
                },
            );
        },
    );

    if (newPasswordInput) {
        newPasswordInput.addEventListener(
            "input",
            function () {
                updatePasswordRequirements(
                    newPasswordInput.value,
                );

                clearPasswordFieldError(
                    newPasswordInput,
                    "newPasswordError",
                );
            },
        );
    }

    if (confirmPasswordInput) {
        confirmPasswordInput.addEventListener(
            "input",
            function () {
                clearPasswordFieldError(
                    confirmPasswordInput,
                    "confirmPasswordError",
                );
            },
        );
    }

    if (form) {
        form.addEventListener(
            "submit",
            handlePasswordSubmit,
        );
    }
}

function openPasswordModal() {
    const passwordModal =
        document.getElementById(
            "passwordModal",
        );

    if (!passwordModal) {
        return;
    }

    resetPasswordForm();

    passwordModal.classList.add(
        "show",
    );

    passwordModal.setAttribute(
        "aria-hidden",
        "false",
    );

    document.body.classList.add(
        "password-modal-open",
    );

    const currentPasswordInput =
        document.getElementById(
            "currentPassword",
        );

    if (currentPasswordInput) {
        window.setTimeout(
            function () {
                currentPasswordInput.focus();
            },
            80,
        );
    }
}

function closePasswordModal() {
    const passwordModal =
        document.getElementById(
            "passwordModal",
        );

    if (!passwordModal) {
        return;
    }

    passwordModal.classList.remove(
        "show",
    );

    passwordModal.setAttribute(
        "aria-hidden",
        "true",
    );

    document.body.classList.remove(
        "password-modal-open",
    );

    resetPasswordForm();
}

function togglePasswordVisibility(button) {
    const targetId =
        button.dataset.target;

    const input =
        document.getElementById(
            targetId,
        );

    const icon =
        button.querySelector("i");

    if (!input) {
        return;
    }

    const isHidden =
        input.type === "password";

    input.type =
        isHidden
            ? "text"
            : "password";

    if (icon) {
        icon.className =
            isHidden
                ? "fa-regular fa-eye-slash"
                : "fa-regular fa-eye";
    }

    button.setAttribute(
        "aria-label",
        isHidden
            ? "Ẩn mật khẩu"
            : "Hiển thị mật khẩu",
    );
}

function handlePasswordSubmit(event) {
    event.preventDefault();

    const currentPasswordInput =
        document.getElementById(
            "currentPassword",
        );

    const newPasswordInput =
        document.getElementById(
            "newPassword",
        );

    const confirmPasswordInput =
        document.getElementById(
            "confirmPassword",
        );

    if (
        !currentPasswordInput ||
        !newPasswordInput ||
        !confirmPasswordInput
    ) {
        return;
    }

    const currentPassword =
        currentPasswordInput.value;

    const newPassword =
        newPasswordInput.value;

    const confirmPassword =
        confirmPasswordInput.value;

    clearAllPasswordErrors();

    let isValid = true;

    if (!currentPassword) {
        showPasswordFieldError(
            currentPasswordInput,
            "currentPasswordError",
            "Vui lòng nhập mật khẩu hiện tại.",
        );

        isValid = false;
    }

    if (!newPassword) {
        showPasswordFieldError(
            newPasswordInput,
            "newPasswordError",
            "Vui lòng nhập mật khẩu mới.",
        );

        isValid = false;
    } else if (
        !isStrongPassword(
            newPassword,
        )
    ) {
        showPasswordFieldError(
            newPasswordInput,
            "newPasswordError",
            "Mật khẩu mới chưa đáp ứng đầy đủ yêu cầu.",
        );

        isValid = false;
    }

    if (!confirmPassword) {
        showPasswordFieldError(
            confirmPasswordInput,
            "confirmPasswordError",
            "Vui lòng xác nhận mật khẩu mới.",
        );

        isValid = false;
    } else if (
        newPassword !==
        confirmPassword
    ) {
        showPasswordFieldError(
            confirmPasswordInput,
            "confirmPasswordError",
            "Mật khẩu xác nhận không trùng khớp.",
        );

        isValid = false;
    }

    if (
        currentPassword &&
        newPassword &&
        currentPassword ===
            newPassword
    ) {
        showPasswordFieldError(
            newPasswordInput,
            "newPasswordError",
            "Mật khẩu mới phải khác mật khẩu hiện tại.",
        );

        isValid = false;
    }

    if (!isValid) {
        return;
    }

    /*
     * Hiện tại là giao diện mô phỏng.
     * Khi kết nối PHP, gọi change_password.php tại đây.
     */

    closePasswordModal();

    showTopbarToast(
        "Đổi mật khẩu thành công.",
        "success",
    );
}

function isStrongPassword(password) {
    const requirements = {
        length:
            password.length >= 8,

        uppercase:
            /[A-Z]/.test(
                password,
            ),

        number:
            /\d/.test(
                password,
            ),

        special:
            /[^A-Za-z0-9]/.test(
                password,
            ),
    };

    return Object.values(
        requirements,
    ).every(Boolean);
}

function updatePasswordRequirements(password) {
    const requirements = {
        length:
            password.length >= 8,

        uppercase:
            /[A-Z]/.test(
                password,
            ),

        number:
            /\d/.test(
                password,
            ),

        special:
            /[^A-Za-z0-9]/.test(
                password,
            ),
    };

    Object.entries(
        requirements,
    ).forEach(
        function ([rule, isValid]) {
            const item =
                document.querySelector(
                    `.password-requirements [data-rule="${rule}"]`,
                );

            if (item) {
                item.classList.toggle(
                    "valid",
                    isValid,
                );
            }
        },
    );
}

function showPasswordFieldError(
    input,
    errorId,
    message,
) {
    const errorElement =
        document.getElementById(
            errorId,
        );

    input.classList.add(
        "invalid",
    );

    if (errorElement) {
        errorElement.textContent =
            message;

        errorElement.classList.add(
            "show",
        );
    }
}

function clearPasswordFieldError(
    input,
    errorId,
) {
    const errorElement =
        document.getElementById(
            errorId,
        );

    input.classList.remove(
        "invalid",
    );

    if (errorElement) {
        errorElement.textContent =
            "";

        errorElement.classList.remove(
            "show",
        );
    }
}

function clearAllPasswordErrors() {
    const fields = [
        {
            inputId:
                "currentPassword",

            errorId:
                "currentPasswordError",
        },

        {
            inputId:
                "newPassword",

            errorId:
                "newPasswordError",
        },

        {
            inputId:
                "confirmPassword",

            errorId:
                "confirmPasswordError",
        },
    ];

    fields.forEach(
        function (field) {
            const input =
                document.getElementById(
                    field.inputId,
                );

            if (input) {
                clearPasswordFieldError(
                    input,
                    field.errorId,
                );
            }
        },
    );
}

function resetPasswordForm() {
    const form =
        document.getElementById(
            "changePasswordForm",
        );

    if (form) {
        form.reset();
    }

    clearAllPasswordErrors();

    updatePasswordRequirements("");

    const passwordInputs =
        document.querySelectorAll(
            "#passwordModal input",
        );

    passwordInputs.forEach(
        function (input) {
            input.type =
                "password";
        },
    );

    const toggleIcons =
        document.querySelectorAll(
            "#passwordModal .password-toggle-button i",
        );

    toggleIcons.forEach(
        function (icon) {
            icon.className =
                "fa-regular fa-eye";
        },
    );
}

/* =========================================================
   8. MODAL XÁC NHẬN ĐĂNG XUẤT
========================================================= */

function initializeLogoutModal() {
    const logoutModal =
        document.getElementById(
            "logoutModal",
        );

    if (!logoutModal) {
        console.warn(
            "Không tìm thấy logoutModal.",
        );

        return;
    }

    const overlay =
        document.getElementById(
            "logoutModalOverlay",
        );

    const closeButton =
        document.getElementById(
            "logoutModalClose",
        );

    const cancelButton =
        document.getElementById(
            "logoutModalCancel",
        );

    const confirmButton =
        document.getElementById(
            "logoutModalConfirm",
        );

    if (overlay) {
        overlay.addEventListener(
            "click",
            closeLogoutModal,
        );
    }

    if (closeButton) {
        closeButton.addEventListener(
            "click",
            closeLogoutModal,
        );
    }

    if (cancelButton) {
        cancelButton.addEventListener(
            "click",
            closeLogoutModal,
        );
    }

    if (confirmButton) {
        confirmButton.addEventListener(
            "click",
            performLogout,
        );
    }
}

function logoutAccount() {
    openLogoutModal();
}

function openLogoutModal() {
    const logoutModal =
        document.getElementById(
            "logoutModal",
        );

    if (!logoutModal) {
        return;
    }

    closeAllDropdowns();
    closeAccountModal();
    closePasswordModal();

    logoutModal.classList.add(
        "active",
    );

    logoutModal.setAttribute(
        "aria-hidden",
        "false",
    );

    document.body.classList.add(
        "logout-modal-open",
    );

    const cancelButton =
        document.getElementById(
            "logoutModalCancel",
        );

    if (cancelButton) {
        window.setTimeout(
            function () {
                cancelButton.focus();
            },
            100,
        );
    }
}

function closeLogoutModal() {
    const logoutModal =
        document.getElementById(
            "logoutModal",
        );

    if (!logoutModal) {
        return;
    }

    logoutModal.classList.remove(
        "active",
    );

    logoutModal.setAttribute(
        "aria-hidden",
        "true",
    );

    document.body.classList.remove(
        "logout-modal-open",
    );
}

function performLogout() {
    closeLogoutModal();
    closeAccountModal();
    closePasswordModal();
    closeAllDropdowns();

    sessionStorage.clear();

    /*
     * Giữ đường dẫn màn hình chính hiện tại của bạn.
     */
    window.location.href =
        "../html/index.html";

    /*
     * Sau này dùng PHP:
     *
     * window.location.href =
     *     "php/logout.php";
     */
}

/* =========================================================
   9. WRAPPER
========================================================= */

function createButtonWrapper(
    button,
    wrapperClass,
) {
    const existingWrapper =
        button.closest(
            `.${wrapperClass}`,
        );

    if (existingWrapper) {
        return existingWrapper;
    }

    const wrapper =
        document.createElement(
            "div",
        );

    wrapper.className =
        wrapperClass;

    button.parentNode.insertBefore(
        wrapper,
        button,
    );

    wrapper.appendChild(
        button,
    );

    return wrapper;
}

/* =========================================================
   10. MỞ VÀ ĐÓNG DROPDOWN
========================================================= */

function toggleDropdown(
    dropdown,
    button,
) {
    if (!dropdown) {
        return;
    }

    const isOpening =
        !dropdown.classList.contains(
            "show",
        );

    closeAllDropdowns();

    if (isOpening) {
        dropdown.classList.add(
            "show",
        );

        dropdown.setAttribute(
            "aria-hidden",
            "false",
        );

        if (button) {
            button.classList.add(
                "active",
            );

            button.setAttribute(
                "aria-expanded",
                "true",
            );
        }
    }
}

function closeAllDropdowns() {
    const dropdowns =
        document.querySelectorAll(
            ".topbar-dropdown.show",
        );

    dropdowns.forEach(
        function (dropdown) {
            dropdown.classList.remove(
                "show",
            );

            dropdown.setAttribute(
                "aria-hidden",
                "true",
            );
        },
    );

    const activeButtons =
        document.querySelectorAll(
            "#notificationBtn.active, #helpBtn.active, #profileBtn.active",
        );

    activeButtons.forEach(
        function (button) {
            button.classList.remove(
                "active",
            );

            button.setAttribute(
                "aria-expanded",
                "false",
            );
        },
    );
}

/* =========================================================
   11. CHUYỂN TRANG
========================================================= */

function navigateToPage(
    pagePath,
    pageTitle,
) {
    const pageFrame =
        document.getElementById(
            "pageFrame",
        );

    const currentPage =
        document.querySelector(
            ".current-page",
        );

    if (!pageFrame) {
        console.warn(
            'Không tìm thấy iframe có id="pageFrame".',
        );

        return;
    }

    pageFrame.src =
        pagePath;

    if (
        currentPage &&
        pageTitle
    ) {
        currentPage.textContent =
            pageTitle;
    }

    updateSidebarActive(
        pagePath,
    );

    closeAllDropdowns();
}

/* =========================================================
   12. BREADCRUMB
========================================================= */

function updateCurrentPageName(
    pageFrame,
    currentPageElement,
) {
    if (
        !pageFrame ||
        !currentPageElement
    ) {
        return;
    }

    const source =
        pageFrame.getAttribute(
            "src",
        ) || "";

    currentPageElement.textContent =
        getPageTitleFromPath(
            source,
        );
}

function getPageTitleFromPath(path) {
    const fileName =
        path
            .split("/")
            .pop()
            .split("?")[0]
            .split("#")[0];

    const pageTitles = {
        "TongQuan.html":
            "Tổng quan",

        "TinTuyenDung.html":
            "Tin tuyển dụng",

        "UngVien.html":
            "Ứng viên",

        "AI.html":
            "AI phân tích CV",

        "QuyTrinhTuyenDung.html":
            "Quy trình tuyển dụng",

        "LichPhongVan.html":
            "Lịch phỏng vấn",

        "BaoCaoThongKe.html":
            "Báo cáo & thống kê",

        "helpdesk.html":
            "Trung tâm trợ giúp",

        "HelpDesk.html":
            "Trung tâm trợ giúp",
    };

    return (
        pageTitles[fileName] ||
        "Trang hệ thống"
    );
}

/* =========================================================
   13. SIDEBAR ACTIVE
========================================================= */

function updateSidebarActive(pagePath) {
    const sidebarItems =
        document.querySelectorAll(
            ".sidebar-menu .menu-item",
        );

    const targetFile =
        pagePath
            .split("/")
            .pop()
            .split("?")[0]
            .split("#")[0];

    sidebarItems.forEach(
        function (item) {
            item.classList.remove(
                "active",
            );

            const itemPage =
                item.dataset.page ||
                item.getAttribute(
                    "href",
                ) ||
                "";

            const itemFile =
                itemPage
                    .split("/")
                    .pop()
                    .split("?")[0]
                    .split("#")[0];

            if (
                itemFile === targetFile
            ) {
                item.classList.add(
                    "active",
                );
            }
        },
    );
}

/* =========================================================
   14. TÌM KIẾM NHANH
========================================================= */

function normalizeSearchText(value) {
    return String(value)
        .trim()
        .toLocaleLowerCase("vi")
        .normalize("NFD")
        .replace(
            /[\u0300-\u036f]/g,
            "",
        )
        .replace(
            /đ/g,
            "d",
        );
}

function initializeGlobalSearch() {
    const searchInput =
        document.getElementById(
            "globalSearch",
        );

    const suggestionBox =
        document.getElementById(
            "searchSuggestions",
        );

    if (
        !searchInput ||
        !suggestionBox
    ) {
        return;
    }

    const sidebarPages = [
        {
            name: "Tổng quan",
            icon: "fa-solid fa-house",
            page: "TongQuan.html",

            keywords: [
                "tong quan",
                "trang chu",
                "dashboard",
                "home",
            ],
        },

        {
            name: "Tin tuyển dụng",
            icon: "fa-solid fa-briefcase",
            page: "TinTuyenDung.html",

            keywords: [
                "tin tuyen dung",
                "tuyen dung",
                "viec lam",
                "job",
                "vi tri tuyen dung",
            ],
        },

        {
            name: "Ứng viên",
            icon: "fa-solid fa-users",
            page: "UngVien.html",

            keywords: [
                "ung vien",
                "ho so",
                "cv",
                "candidate",
                "danh sach ung vien",
            ],
        },

        {
            name: "AI phân tích CV",
            icon: "fa-solid fa-robot",
            page: "AI.html",

            keywords: [
                "ai",
                "phan tich cv",
                "danh gia cv",
                "cham diem cv",
            ],
        },

        {
            name: "Quy trình tuyển dụng",
            icon:
                "fa-solid fa-diagram-project",

            page:
                "QuyTrinhTuyenDung.html",

            keywords: [
                "quy trinh",
                "quy trinh tuyen dung",
                "giai doan",
                "tien trinh",
            ],
        },

        {
            name: "Lịch phỏng vấn",
            icon:
                "fa-solid fa-calendar-days",

            page:
                "LichPhongVan.html",

            keywords: [
                "lich phong van",
                "phong van",
                "lich hen",
                "hen phong van",
            ],
        },

        {
            name: "Báo cáo & thống kê",
            icon:
                "fa-solid fa-chart-column",

            page:
                "BaoCaoThongKe.html",

            keywords: [
                "bao cao",
                "thong ke",
                "report",
                "so lieu",
                "bieu do",
            ],
        },

        {
            name: "Trung tâm trợ giúp",
            icon:
                "fa-solid fa-circle-question",

            page:
                "helpdesk.html",

            keywords: [
                "tro giup",
                "ho tro",
                "help",
                "helpdesk",
                "lien he",
            ],
        },
    ];

    let filteredPages = [];
    let activeIndex = -1;

    function searchPages(keyword) {
        const normalizedKeyword =
            normalizeSearchText(
                keyword,
            );

        if (!normalizedKeyword) {
            return [];
        }

        return sidebarPages.filter(
            function (item) {
                const searchContent = [
                    item.name,
                    ...item.keywords,
                ]
                    .map(
                        normalizeSearchText,
                    )
                    .join(" ");

                return searchContent.includes(
                    normalizedKeyword,
                );
            },
        );
    }

    function closeSuggestions() {
        suggestionBox.classList.remove(
            "show",
        );

        suggestionBox.innerHTML = "";

        filteredPages = [];
        activeIndex = -1;
    }

   function openPage(item) {
    searchInput.value = "";
    closeSuggestions();

    /* Trung tâm trợ giúp mở thành trang độc lập */
    if (item.page === "helpdesk.html") {
        window.location.href = "helpdesk.html";
        return;
    }

    /* Các chức năng còn lại vẫn mở trong Dashboard */
    navigateToPage(
        item.page,
        item.name,
    );
}

    function renderSuggestions(
        results,
        keyword,
    ) {
        suggestionBox.innerHTML = "";
        activeIndex = -1;

        if (!keyword.trim()) {
            closeSuggestions();

            return;
        }

        suggestionBox.classList.add(
            "show",
        );

        if (results.length === 0) {
            suggestionBox.innerHTML = `
                <div class="search-empty">
                    Không tìm thấy chức năng phù hợp
                </div>
            `;

            return;
        }

        results.forEach(
            function (item, index) {
                const button =
                    document.createElement(
                        "button",
                    );

                button.type = "button";

                button.className =
                    "search-suggestion-item";

                button.innerHTML = `
                    <span class="search-suggestion-icon">
                        <i class="${item.icon}"></i>
                    </span>

                    <span class="search-suggestion-name">
                        ${item.name}
                    </span>
                `;

                button.addEventListener(
                    "click",
                    function () {
                        openPage(item);
                    },
                );

                button.addEventListener(
                    "mouseenter",
                    function () {
                        activeIndex = index;
                        updateActiveItem();
                    },
                );

                suggestionBox.appendChild(
                    button,
                );
            },
        );
    }

    function updateActiveItem() {
        const items =
            suggestionBox.querySelectorAll(
                ".search-suggestion-item",
            );

        items.forEach(
            function (item, index) {
                item.classList.toggle(
                    "active",
                    index === activeIndex,
                );
            },
        );

        if (items[activeIndex]) {
            items[
                activeIndex
            ].scrollIntoView({
                block: "nearest",
            });
        }
    }

    searchInput.addEventListener(
        "input",
        function () {
            filteredPages =
                searchPages(
                    searchInput.value,
                );

            renderSuggestions(
                filteredPages,
                searchInput.value,
            );
        },
    );

    searchInput.addEventListener(
        "focus",
        function () {
            const keyword =
                searchInput.value.trim();

            if (!keyword) {
                return;
            }

            filteredPages =
                searchPages(keyword);

            renderSuggestions(
                filteredPages,
                keyword,
            );
        },
    );

    searchInput.addEventListener(
        "keydown",
        function (event) {
            if (
                !suggestionBox.classList.contains(
                    "show",
                )
            ) {
                return;
            }

            if (event.key === "ArrowDown") {
                event.preventDefault();

                activeIndex =
                    activeIndex <
                    filteredPages.length - 1
                        ? activeIndex + 1
                        : 0;

                updateActiveItem();
            }

            if (event.key === "ArrowUp") {
                event.preventDefault();

                activeIndex =
                    activeIndex > 0
                        ? activeIndex - 1
                        : filteredPages.length - 1;

                updateActiveItem();
            }

            if (event.key === "Enter") {
                event.preventDefault();

                const selectedPage =
                    filteredPages[
                        activeIndex
                    ] ||
                    filteredPages[0];

                if (selectedPage) {
                    openPage(
                        selectedPage,
                    );
                }
            }

            if (event.key === "Escape") {
                closeSuggestions();
                searchInput.blur();
            }
        },
    );

    document.addEventListener(
        "click",
        function (event) {
            if (
                !event.target.closest(
                    ".topbar-search",
                )
            ) {
                closeSuggestions();
            }
        },
    );
}

/* =========================================================
   15. TOAST
========================================================= */

function showTopbarToast(
    message,
    type = "success",
) {
    let toastContainer =
        document.querySelector(
            ".topbar-toast-container",
        );

    if (!toastContainer) {
        toastContainer =
            document.createElement(
                "div",
            );

        toastContainer.className =
            "topbar-toast-container";

        document.body.appendChild(
            toastContainer,
        );
    }

    const icons = {
        success:
            "fa-solid fa-circle-check",

        warning:
            "fa-solid fa-triangle-exclamation",

        error:
            "fa-solid fa-circle-xmark",
    };

    const toast =
        document.createElement(
            "div",
        );

    toast.className =
        `topbar-toast ${type}`;

    toast.innerHTML = `
        <i class="${icons[type] || icons.success}"></i>

        <span>
            ${escapeHTML(message)}
        </span>

        <button
            type="button"
            aria-label="Đóng thông báo"
        >
            <i class="fa-solid fa-xmark"></i>
        </button>
    `;

    toastContainer.appendChild(
        toast,
    );

    requestAnimationFrame(
        function () {
            toast.classList.add(
                "show",
            );
        },
    );

    const closeButton =
        toast.querySelector(
            "button",
        );

    const timer =
        window.setTimeout(
            function () {
                removeToast(toast);
            },
            3500,
        );

    if (closeButton) {
        closeButton.addEventListener(
            "click",
            function () {
                window.clearTimeout(
                    timer,
                );

                removeToast(toast);
            },
        );
    }
}

function removeToast(toast) {
    if (!toast) {
        return;
    }

    toast.classList.remove(
        "show",
    );

    window.setTimeout(
        function () {
            toast.remove();
        },
        250,
    );
}

function escapeHTML(value) {
    const element =
        document.createElement(
            "div",
        );

    element.textContent =
        String(value);

    return element.innerHTML;
}