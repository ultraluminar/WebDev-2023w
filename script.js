function toggleNav(event) {
    let nav = document.getElementById("nav");
    let icon = document.getElementById("burger-menu");
    nav.style.display = nav.style.display === "flex" ? "none" : "flex";
    icon.classList.toggle('open');
    event.prefentDefault(); // prevent default ancor tag behavior
}