document.addEventListener("DOMContentLoaded", async function () {
    document.getElementById("burger-menu").addEventListener("click", toggleNav);

    function toggleNav() {
        let nav = document.getElementById("nav");
        let icon = document.getElementById("burger-menu");
        nav.style.transform = nav.style.transform === "translateY(0%)" ? "translateY(-17.5em)" : "translateY(0%)";
        icon.classList.toggle('open');
    }

});