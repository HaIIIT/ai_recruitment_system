document.addEventListener("DOMContentLoaded", function () {
    const sidebarContainer =
        document.getElementById("sidebar");

    const pageFrame =
        document.getElementById("pageFrame");

    if (!sidebarContainer || !pageFrame) {
        console.error(
            "Không tìm thấy sidebar hoặc iframe."
        );

        return;
    }

    /*
    =========================================
        TẢI SIDEBAR
    =========================================
    */

    fetch("components/sidebar.html")
        .then(function (response) {
            if (!response.ok) {
                throw new Error(
                    "Không tải được sidebar.html"
                );
            }

            return response.text();
        })
        .then(function (html) {
            sidebarContainer.innerHTML = html;

            initializeSidebar();
        })
        .catch(function (error) {
            console.error(
                "Lỗi khi tải sidebar:",
                error
            );
        });

    /*
    =========================================
        KHỞI TẠO SIDEBAR
    =========================================
    */

    function initializeSidebar() {
        const menuItems =
            sidebarContainer.querySelectorAll(
                "[data-page]"
            );

        const defaultPage =
            "html/TongQuan.html";

        /*
        Mỗi lần mở index.html
        luôn hiển thị trang Tổng quan
        */

        pageFrame.src = defaultPage;

        setActiveMenu(defaultPage);

        /*
        Xóa trang đã lưu trước đó
        để trình duyệt không mở lại AI
        hoặc trang khác
        */

        localStorage.removeItem(
            "selectedSidebarPage"
        );

        /*
        Gắn sự kiện cho từng mục menu
        */

        menuItems.forEach(function (menuItem) {
            menuItem.addEventListener(
                "click",
                function (event) {
                    event.preventDefault();

                    const page =
                        menuItem.dataset.page;

                    if (!page) {
                        return;
                    }

                    const pagePath =
                        normalizePagePath(page);

                    openPage(pagePath);
                }
            );
        });
    }

    /*
    =========================================
        MỞ TRANG TRONG IFRAME
    =========================================
    */

    function openPage(pagePath) {
        pageFrame.src = pagePath;

        setActiveMenu(pagePath);
    }

    /*
    =========================================
        CHUẨN HÓA ĐƯỜNG DẪN
    =========================================
    */

    function normalizePagePath(page) {
        let value =
            String(page || "").trim();

        value =
            value.replace(/^\/+/, "");

        if (value.startsWith("html/")) {
            return value.endsWith(".html")
                ? value
                : value + ".html";
        }

        if (value.endsWith(".html")) {
            return "html/" + value;
        }

        return "html/" + value + ".html";
    }

    /*
    =========================================
        ĐỔI MÀU MENU ĐANG CHỌN
    =========================================
    */

    function setActiveMenu(currentPage) {
        const menuItems =
            sidebarContainer.querySelectorAll(
                "[data-page]"
            );

        menuItems.forEach(function (item) {
            const itemPage =
                normalizePagePath(
                    item.dataset.page
                );

            item.classList.toggle(
                "active",
                itemPage === currentPage
            );
        });
    }

    /*
    =========================================
        CHO common.js GỌI ĐƯỢC
    =========================================
    */

    window.openSidebarPage = function (page) {
        const pagePath =
            normalizePagePath(page);

        openPage(pagePath);
    };

    window.setSidebarActive = function (page) {
        const pagePath =
            normalizePagePath(page);

        setActiveMenu(pagePath);
    };
});