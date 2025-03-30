const themeToggle = document.querySelector(".theme-toggle");


//set the theme based on system preference or system default
( () => {
    const savedTheme = localStorage.getItem("theme");
    const systemPreferDark = window.matchMedia("prefers-color-scheme : dark").matches;

    const isDarkTheme = savedTheme === "dark" || (!savedTheme && systemPreferDark);
    document.body.classList.toggle("dark-theme", isDarkTheme)
    themeToggle.querySelector("i").className = isDarkTheme? "fa-solid fa-sun" : "fa-solid fa-moon";
})

// switch between light and dark theme
const toggleTheme = () => {
    const isDarkTheme = document.body.classList.toggle("dark-theme");
    localStorage.setItem("theme", isDarkTheme ? "dark" : "light");
    themeToggle.querySelector("i").className = isDarkTheme? "fa-solid fa-sun" : "fa-solid fa-moon";
}

themeToggle.addEventListener("click", toggleTheme);