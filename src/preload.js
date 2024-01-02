const { ipcRenderer } = require("electron");
const shell = require("electron").shell;

let facebookButton = document.getElementById("facebook_button");
let instagramButton = document.getElementById("instagram_button");
let twitterButton = document.getElementById("twitter_button");
let youtubeButton = document.getElementById("youtube_button");
let linkedinButton = document.getElementById("linkedin_button");

let inputUser = document.querySelector('input[name="username"]');
let inputPassword = document.querySelector('input[name="password"]');
let inputSearch = document.querySelector('input[name="search"]');
let selectValue = document.querySelector('select[name="choose"]');

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

const checkStart = (event) => {
  
}

inputUser.addEventListener("keypress", function (event) {
  if (
    event.key === "Enter" &&
    document.querySelector("input[type=text]").value != ""
  ) {
    event.preventDefault();
    document.getElementById("run").click();
  }
});
inputPassword.addEventListener("keypress", function (event) {
  if (
    event.key === "Enter" &&
    document.querySelector("input[type=text]").value != ""
  ) {
    event.preventDefault();
    document.getElementById("run").click();
  }
});
inputSearch.addEventListener("keypress", function (event) {
  if (
    event.key === "Enter" &&
    document.querySelector("input[type=text]").value != ""
  ) {
    event.preventDefault();
    document.getElementById("run").click();
  }
});

document.getElementById("run").addEventListener("click", () => {
  inputUser = inputUser.value;
  inputPassword = inputPassword.value;
  inputSearch = inputSearch.value;
  selectValue = selectValue.value;

  const allThem = [inputUser, inputPassword, inputSearch, selectValue];
  ipcRenderer.send("call-them", allThem);
});
