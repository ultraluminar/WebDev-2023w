function toggleNav() {
    let nav = document.getElementById("nav");
    let icon = document.getElementById("burger-menu");
    nav.style.display = nav.style.display === "flex" ? "none" : "flex";
    icon.classList.toggle('open');
}