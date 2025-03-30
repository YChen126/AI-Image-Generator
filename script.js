const themeToggle = document.querySelector(".theme-toggle");
const promptBtn = document.querySelector(".prompt-btn");
const promptInput = document.querySelector(".prompt-input");
const promptForm = document.querySelector(".prompt-form");
const modelSelect = document.getElementById("model-select");
const countSelect = document.getElementById("count-select");
const ratioSelect = document.getElementById("ratio-select");
const gridGallery = document.querySelector(".gallery-grid");
const API_KEY = ""; //Hugging face API KEY

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

//calculate width/height based on chosen ratio
const getImageDimensions = (aspectRatio, baseSize = 512) => {
    [width, height] = aspectRatio.split("/").map(Number);
    const scaleFactor = baseSize/Math.sqrt(width*height);

    let calculatedWidth = Math.round(width * scaleFactor);
    let calculatedHeight = Math.round(height * scaleFactor);

    //ensure dimensions are multiples of 16 (AI model requirements)
    calculatedWidth = Math.floor(calculatedWidth / 16) * 16;
    calculatedHeight = Math.floor(calculatedHeight / 16) * 16;

    return {width : calculatedWidth, height : calculatedHeight};
}

//replace loading spinner with the actual image
const updateImageCard = (imgIndex, imgURL) => {
    const imgCard = document.getElementById(`img-card-${imgIndex}`);
    if(!imgCard) return;

    imgCard.classList.remove("loading");
    imgCard.innerHTML = `<img src="${imgURL}" alt="" class="result-img">
                    <div class="img-overlay">
                        <a href="${imgURL}" class="img-download-btn" download="${Date.now()}.png">
                            <i class="fa-solid fa-download"></i>
                        </a>
                    </div>`;
}

//send requests to Hugging Face API to create images
const generateImages = async (selectModel, imageCount, aspectRatio, promptText) => {
    MODEL_URL = `https://router.huggingface.co/hf-inference/models/${selectModel}`;
    const {width, height} = getImageDimensions(aspectRatio);

    //create an array of image generation promises
    const imagePromises = Array.from ({length: imageCount}, async(API_KEY, i) => {
        //send request to the AI model API
        try {
            const response =await fetch (MODEL_URL, {
                headers: {
                    //have to go to the website and get the API_KEY to access model
                    Authorization: `Bearer ${API_KEY}`,
                    "Content-Type" : "application/json",
                    "x-use-cache" : "false",
                },
                method: "POST",
                body: JSON.stringify({
                    input : promptText,
                    parameter: {width, height},
                }),
            });

            if (!response.ok) throw new Error((await response.json())?.error);

            //convert response to an image URL and update the image card
            const result = await response.blob();
            updateImageCard(i, URL.createObjectURL(result));
        }catch(error) {
            console.log(error);
        }
    });

    await Promise.allSettled(imagePromises);
}

//create placeholder cards with loading spinners
const createImageCards = (selectModel, imageCount, aspectRatio, promptText) => {
    gridGallery.innerHTML = "";

    for (let i=0;i<imageCount;i++) {
        gridGallery.innerHTML += `<div class="img-card loading" id="img-card-${i}" style="aspect-ratio: ${aspectRatio}">
                        <div class="status-container">
                            <div class="spinner"></div>
                            <i class="fa-solid fa-triangle-exclamation"></i>
                            <p class="status-text">Generating...</p>
                        </div>
                    </div>`
    }

    generateImages(selectModel, imageCount, aspectRatio, promptText);
} 

//handling the form submission
const handleFormSubmit = (e) => {
    e.preventDefault();

    const selectModel = modelSelect.value;
    const imageCount = parseInt(countSelect.value) || 1;
    const aspectRatio = ratioSelect.value || "1/1";
    const promptText = promptInput.value.trim();

    createImageCards(selectModel, imageCount, aspectRatio, promptText);
}

//fill the prompt input with random example
promptBtn.addEventListener("click", () => {
    const promptContent = examplePrompts[Math.floor(Math.random()*examplePrompts.length)];
    promptInput.value = promptContent;
    promptInput.focus();
})

promptForm.addEventListener("submit", handleFormSubmit);
themeToggle.addEventListener("click", toggleTheme);