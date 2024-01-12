document.addEventListener("DOMContentLoaded", function() {
    let currentPage = window.location.pathname;
    console.log(currentPage);
    let navLinks = document.querySelectorAll("#nav a");
    navLinks.forEach(function(link) {
        console.log(link.getAttribute("href"));
        if (link.getAttribute("href").substring(2) === currentPage) {
            link.style.backgroundColor = "var(--secondary-color)";
            link.style.color = "var(--text-color)";
        }
    });
});

function toggleNav(event) {
    let nav = document.getElementById("nav");
    let icon = document.getElementById("burger-menu");
    nav.style.transform = nav.style.transform === "translateY(0%)" ? "translateY(-16em)" : "translateY(0%)";
    icon.classList.toggle('open');
    event.preventDefault(); // prevent default ancor tag behavior
}