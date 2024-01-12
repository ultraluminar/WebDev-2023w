function toggleNav(event) {
    let nav = document.getElementById("nav");
    let icon = document.getElementById("burger-menu");
    nav.style.transform = nav.style.transform === "translateY(0%)" ? "translateY(-17.5em)" : "translateY(0%)";
    nav.style.boxShadow = nav.style.boxShadow === "0px 0px 50px -20px #b6b6b6;" ? "none" : "0px 0px 50px -20px #b6b6b6;";
    icon.classList.toggle('open');
    event.preventDefault(); // prevent default ancor tag behavior
}