function toggleNav(event) {
    let nav = document.getElementById("nav");
    let icon = document.getElementById("burger-menu");
    let main = document.getElementById("main");
    nav.style.transform = nav.style.transform === "translateY(0%)" ? "translateY(-12.75em)" : "translateY(0%)";
    main.style.transform = main.style.transform === "translateY(0%)" ? "translateY(-12.75em)" : "translateY(0%)";
    icon.classList.toggle('open');
    event.prefentDefault(); // prevent default ancor tag behavior
}