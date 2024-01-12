function toggleNav(event) {
    let nav = document.getElementById("nav");
    let icon = document.getElementById("burger-menu");
    nav.style.transform = nav.style.transform === "translateY(0%)" ? "translateY(-13em)" : "translateY(0%)";
    icon.classList.toggle('open');
    event.prefentDefault(); // prevent default ancor tag behavior
}