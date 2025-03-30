const themeToggle = document.querySelector(".theme-toggle");
const promptBtn = document.querySelector(".prompt-btn");
const promptInput = document.querySelector(".prompt-input")

const examplePrompts = [
    "A magic forest with glowing plants and fairy homes among giant mushrooms",
    "An old steampunk airship floating through golden clouds at sunset",
    "A future Mars colony with glass domes and gardens against red mountains",
    "A dragon sleeping on gold coins in a crystal cave",
    "An underwater kingdom with merpeople and glowing coral buildings",
    "A floating island with waterfalls pouring into clouds below",
    "A witch's cottage in fall with magic herbs in the garden",
    "A robot painting in a sunny studio with art supplies around it",
    "A magical library with floating glowing books and spiral staircases",
    "A Japanese shrine during cherry blossom season with lanterns and misty mountains",
    "A cosmic beach with glowing sand and an aurora in the night sky",
    "A medieval marketplace with colorful tents and street performers",
    "A cyberpunk city with neon signs and flying cars at night",
    "A peaceful bamboo forest with a hidden ancient temple",
    "A giant turtle carrying a village on its back in the ocean",
    "A serene Chinese mountain village at dawn, with misty peaks and traditional wooden houses surrounded by bamboo groves.",
    "An elegant empress in a flowing silk robe, standing beneath blooming cherry blossoms in an imperial garden, ancient palace in the background.",
    "A legendary dragon soaring over the Great Wall of China at sunset, glowing clouds and golden light filling the sky.",
    "A peaceful Taoist temple hidden in the misty mountains, with stone steps, hanging lanterns, and monks meditating nearby.",
    "An ancient Chinese market street during the Tang Dynasty, filled with red lanterns, merchants, and people in traditional attire.",
    "A mystical Chinese lake under the moonlight, with lotus flowers, floating candles, and a lady playing the guzheng on a wooden boat.",
    "A warrior poet standing alone in a snowy bamboo forest, wearing a cloak and holding a calligraphy scroll.",
    "A fantasy landscape inspired by Chinese ink wash painting, featuring mountains, waterfalls, and cranes flying through the mist.",
    "A grand dragon dance celebration at night during the Lunar New Year, with fireworks, lanterns, and cheering crowds.",
    "An ethereal fairy from Chinese folklore walking across a bridge of clouds, surrounded by celestial scenery and glowing stars."
];

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

//fill the prompt input with random example
promptBtn.addEventListener("click", () => {
    const promptContent = examplePrompts[Math.floor(Math.random()*examplePrompts.length)];
    promptInput.value = promptContent;
    promptInput.focus();
})

themeToggle.addEventListener("click", toggleTheme);