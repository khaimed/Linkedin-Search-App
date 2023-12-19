const { ipcRenderer } = require("electron")

let khaimedButton = document.getElementById("khaimed_button");
let facebookButton = document.getElementById("facebook_button");
let instagramButton = document.getElementById("instagram_button");
let twitterButton = document.getElementById("twitter_button");
let youtubeButton = document.getElementById("youtube_button");
let linkedinButton = document.getElementById("linkedin_button");

// click for my link
khaimedButton.addEventListener("click", () => {
  shell.openExternal("https://www.khaimed.com/");
});
// click for open browser
facebookButton.addEventListener("click", () => {
  shell.openExternal("https://www.facebook.com/khaimedev");
});
instagramButton.addEventListener("click", () => {
  shell.openExternal("https://www.instagram.com/khaimedev");
});
twitterButton.addEventListener("click", () => {
  shell.openExternal("https://www.twitter.com/khaimed1");
});
linkedinButton.addEventListener("click", () => {
  shell.openExternal("https://www.linkedin.com/in/khaimed");
});
youtubeButton.addEventListener("click", () => {
  shell.openExternal("https://www.youtube.com/@khaimedev");
});

document.querySelector(".search").addEventListener("click", () => {
    const selectValue = document.querySelector("select").value;
    const inputValue = document.querySelector("input[type=text]").value;
    switch (selectValue) {
        case "tout":
            ipcRenderer.send("tout-caller", inputValue);
        break;
        case "personnes":
            ipcRenderer.send("personnes-caller", inputValue);
        break;
        case "emplois":
            ipcRenderer.send("emplois-caller", inputValue);
        break;
        case "entreprises":
            ipcRenderer.send("entreprises-caller", inputValue);
        break;
        case "produits":
            ipcRenderer.send("produits-caller", inputValue);
        break;
        case "groupes":
            ipcRenderer.send("groupes-caller", inputValue);
        break;
        case "services":
            ipcRenderer.send("services-caller", inputValue);
        break;
        case "evenements":
            ipcRenderer.send("evenements-caller", inputValue);
        break;
        case "cours":
            ipcRenderer.send("cours-caller", inputValue);
        break;
        case "ecoles":
            ipcRenderer.send("ecoles-caller", inputValue);
        break;
        default:
        break;
    }
  });