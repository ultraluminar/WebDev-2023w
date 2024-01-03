function toggleNav(event) {
    event.prefentDefault(); // prevent default ancor tag behavior
    let nav = document.getElementById("nav");
    let icon = document.getElementById("burger-menu");
    nav.style.display = nav.style.display === "flex" ? "none" : "flex";
    icon.classList.toggle('open');
}