const { ipcRenderer } = require("electron");
const shell = require("electron").shell;

let facebookButton = document.getElementById("facebook_button");
let instagramButton = document.getElementById("instagram_button");
let twitterButton = document.getElementById("twitter_button");
let youtubeButton = document.getElementById("youtube_button");
let linkedinButton = document.getElementById("linkedin_button");

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

document.getElementById("run").addEventListener("click", () => {
  const inputUser = document.getElementsByName("username")[0].value;
  const inputPassword = document.getElementsByName("password")[0].value;
  const inputSearch = document.getElementsByName("search")[0].value;
  const selectValue = document.getElementsByName("choose")[0].value;
  const allThem = [inputUser, inputPassword, inputSearch, selectValue];
  ipcRenderer.send("call-them", allThem);
});
