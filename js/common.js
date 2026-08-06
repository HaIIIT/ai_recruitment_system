document.addEventListener("DOMContentLoaded", function () {
    const homeLinks = document.querySelectorAll(".go-home");

    homeLinks.forEach(function (link) {
        link.addEventListener("click", function (event) {
            event.preventDefault();

            try {
                const parentDocument = window.parent.document;

                const pageFrame =
                    parentDocument.getElementById("pageFrame");

                /*
                    Chuyển iframe về trang Tổng quan.
                */
                if (pageFrame) {
                    pageFrame.src = "html/TongQuan.html";
                }

                /*
                    Tìm tất cả menu trong sidebar.
                */
                const sidebarLinks =
                    parentDocument.querySelectorAll(
                        ".sidebar .menu-item, .sidebar-brand"
                    );

                /*
                    Xóa trạng thái active hiện tại.
                */
                sidebarLinks.forEach(function (sidebarLink) {
                    sidebarLink.classList.remove("active");
                });

                /*
                    Tìm menu Tổng quan.
                    Trong sidebar.html đang dùng:
                    data-page="TongQuan"
                */
                const overviewLink = Array
                    .from(sidebarLinks)
                    .find(function (sidebarLink) {
                        const page =
                            sidebarLink.getAttribute("data-page") || "";

                        const href =
                            sidebarLink.getAttribute("href") || "";

                        return (
                            page === "TongQuan" ||
                            page === "TongQuan.html" ||
                            href.includes("TongQuan.html")
                        );
                    });

                /*
                    Đánh dấu menu Tổng quan là active.
                */
                if (overviewLink) {
                    overviewLink.classList.add("active");
                }

                return;
            } catch (error) {
                console.log(
                    "Không thể cập nhật trang cha hoặc sidebar:",
                    error
                );
            }

            /*
                Trường hợp trang không chạy bên trong iframe.
            */
            window.location.href = "TongQuan.html";
        });
    });
});