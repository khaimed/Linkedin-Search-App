const { app, BrowserWindow, ipcMain } = require("electron");
const path = require("path");
const { Builder, Key, By } = require("selenium-webdriver");
const chrome = require("selenium-webdriver/chrome");

let options = new chrome.Options();
options.addArguments("--headless");

// Handle creating/removing shortcuts on Windows when installing/uninstalling.
if (require("electron-squirrel-startup")) {
  app.quit();
}

const createWindow = () => {
  // Create the browser window.
  const mainWindow = new BrowserWindow({
    width: 800,
    height: 600,
    webPreferences: {
      nodeIntegration: true,
      preload: path.join(__dirname, "src/preload.js"),
      contextIsolation: false,
      contentSecurityPolicy:
        "script-src 'self' 'unsafe-eval' 'zwxpBwzZbURUl3JTSABruEg1kvcUuFAJ' 'sha256-2l30QxSunNDaaNuCPRFcr2eKTYDRur0Sa2UznSlq8LQ='",
    },
  });

  // and load the index.html of the app.
  mainWindow.loadFile(path.join(__dirname, "index.html"));

  // Open the DevTools.
  // mainWindow.webContents.openDevTools();
};

// This method will be called when Electron has finished
// initialization and is ready to create browser windows.
// Some APIs can only be used after this event occurs.
app.on("ready", createWindow);

// Quit when all windows are closed, except on macOS. There, it's common
// for applications and their menu bar to stay active until the user quits
// explicitly with Cmd + Q.
app.on("window-all-closed", () => {
  if (process.platform !== "darwin") {
    app.quit();
  }
});

app.on("activate", () => {
  // On OS X it's common to re-create a window in the app when the
  // dock icon is clicked and there are no other windows open.
  if (BrowserWindow.getAllWindows().length === 0) {
    createWindow();
  }
});

// this is the beginning of code

ipcMain.on("call-them", async (event, allThem) => {
  let inputUser = allThem[0];
  let inputPassword = allThem[1];
  let inputSearch = allThem[2];
  let selectValue = allThem[3];

  // Run
  try {
    driver = await new Builder()
      .forBrowser("chrome")
      // .setChromeOptions(options)
      .build();
    await driver.manage().window().maximize();
    // Link
    let url = "https://www.linkedin.com/";
    await driver.get(url);

    // login
    await driver
      .findElement(
        By.xpath(
          "/html/body/main/section[1]/div/div/form/div[1]/div[1]/div/div/input"
        )
      )
      .sendKeys(inputUser);
    await driver
      .findElement(
        By.xpath(
          "/html/body/main/section[1]/div/div/form/div[1]/div[2]/div/div/input"
        )
      )
      .sendKeys(inputPassword, Key.ENTER);

    // link search
    switch (selectValue) {
      case "personnes":
        await driver.get("https://www.linkedin.com/search/results/people/");
        break;
      case "emplois":
        await driver.get("https://www.linkedin.com/jobs/search/");
        break;
      case "entreprises":
        await driver.get("https://www.linkedin.com/search/results/companies/");
        break;
      case "produits":
        await driver.get("https://www.linkedin.com/search/results/products/");
        break;
      case "groupes":
        await driver.get("https://www.linkedin.com/search/results/groups/");
        break;
      case "services":
        await driver.get("https://www.linkedin.com/search/results/services/");
        break;
      case "evenements":
        await driver.get("https://www.linkedin.com/search/results/events/");
        break;
      case "cours":
        await driver.get("https://www.linkedin.com/search/results/learning/");
        break;
      case "école":
        await driver.get("https://www.linkedin.com/search/results/schools/");
        break;
      default:
        break;
    }

    // search input
    if (selectValue === "emplois") {
      await driver
        .findElement(By.css('[id^="jobs-search-box-keyword-id-"]'))
        .sendKeys(inputSearch, Key.ENTER);
    } else {
      await driver
        .findElement(By.css(".search-global-typeahead__input"))
        .sendKeys(inputSearch, Key.ENTER);
    }

    // navigation changes only between services and jobs but for services you just click on more pages which makes it easier like all pages
    const checkPages = async () => {
      let isValue;
    
      if (selectValue === "emplois") {
        let checkExist = await driver.findElement(
          By.css(".artdeco-pagination__pages li:nth-last-child(2)")
        );
        const checkExistValue = await checkExist.getAttribute(
          "data-test-pagination-page-btn"
        );
    
        while (checkExistValue) {
          isValue = parseInt(await checkExist.getText()) + 1;
          return isValue;
        }
      } else if (selectValue === "services") {
        await driver
          .findElement(By.css(".search-results__cluster-bottom-banner"))
          .click();
        isValue = await driver
          .findElement(By.css(".artdeco-pagination__pages li:last-child"))
          .getAttribute("data-test-pagination-page-btn");
      } else {
        isValue = await driver
          .findElement(By.css(".artdeco-pagination__pages li:last-child"))
          .getAttribute("data-test-pagination-page-btn");
      }
    
      return isValue.getText();
    };
    

    checkPages();

    const navigatePages = async () => {};

    const uploadData = async () => {};

    const exitDriver = async () => {
      await driver.quit();
    };
    // await driver.quit();
  } catch (error) {
    console.log("the error is :", error);
    await driver.quit();
  }
});
