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
    if(driver = await new Builder().forBrowser("chrome").build()) {await driver.quit()}
    driver = await new Builder()
      .forBrowser("chrome")
      // .setChromeOptions(options)
      .build();
    await driver.manage().window().maximize();
    // Link
    let url = "https://www.linkedin.com/";
    await driver.get(url);

    let currentUrl = await driver.getCurrentUrl();
    // login
    // user
    await driver
      .findElement(
        By.xpath(
          "/html/body/main/section[1]/div/div/form/div[1]/div[1]/div/div/input"
        )
      )
      .sendKeys(inputUser);
    // password
    await driver
      .findElement(
        By.xpath(
          "/html/body/main/section[1]/div/div/form/div[1]/div[2]/div/div/input"
        )
      )
      .sendKeys(inputPassword, Key.ENTER);
    await driver.sleep(1000);
    let runScript = true;
    while (runScript) {
      currentUrl = await driver.getCurrentUrl();
      if (currentUrl.includes("homepage")) {
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
          case "groupes":
            await driver.get("https://www.linkedin.com/search/results/groups/");
            break;
          case "services":
            await driver.get("https://www.linkedin.com/search/results/services/");
            break;
          default:
            break;
        }
        // just for Jobs
        const uploadDataJobs = async () => {
          const numberElement = await driver.findElements(By.xpath('/html/body/div[5]/div[3]/div[4]/div/div/main/div[2]/div[1]/div/ul/li'))
          await driver.executeScript("document.querySelector('.jobs-search-results-list').scrollTop = 4600");
          await driver.sleep(1000);
          for (let index = 1; index < numberElement.length + 1; index++) {
            const offreText = await driver.findElement(By.xpath(`/html/body/div[5]/div[3]/div[4]/div/div/main/div[2]/div[1]/div/ul/li[${index}]/div/div[1]/div[1]/div[2]/div[1]/a/strong`)).getText()
            const offreLink = await driver.findElement(By.xpath(`/html/body/div[5]/div[3]/div[4]/div/div/main/div[2]/div[1]/div/ul/li[${index}]/div/div[1]/div[1]/div[2]/div[1]/a`)).getAttribute('href')
            const offreLocalization = await driver.findElement(By.xpath(`/html/body/div[5]/div[3]/div[4]/div/div/main/div[2]/div[1]/div/ul/li[${index}]/div/div[1]/div[1]/div[2]/div[3]/ul/li`)).getText()
            const offreDate = await driver.findElement(By.xpath(`/html/body/div[5]/div[3]/div[4]/div/div/main/div[2]/div[1]/div/ul/li[${index}]/div/div[1]/ul/li/time`)).getText()
            const data = [offreText, offreLink, offreLocalization, offreDate]
            console.log(data)
            await driver.sleep(1000);
          }
        }
        // search input
        if (selectValue === "emplois") {
          await driver
            .findElement(By.css('[id^="jobs-search-box-keyword-id-"]'))
            .sendKeys(inputSearch, Key.ENTER);
            await driver.sleep(3000);
          await uploadDataJobs()
          } else {
          await driver
            .findElement(By.css(".search-global-typeahead__input"))
            .sendKeys(inputSearch, Key.ENTER);
            await driver.sleep(3000);
            await uploadDataWithoutJobs()
        }

        
        // navigation changes only between services and jobs but for services you just click on more pages which makes it easier like all pages
        const checkPages = async () => {
          let isValue;
          await driver.sleep(3000);
          let scrollDown = await driver.executeScript(
            "window.scrollTo(0, document.body.scrollHeight);"
          );
          const newUrl = await driver.getCurrentUrl();
          if (newUrl !== currentUrl) {
            if (selectValue === "services") {
              console.log("is services");
              scrollDown;
              await driver
                .findElement(By.css(".search-results__cluster-bottom-banner"))
                .click();
              scrollDown;
              isValue = await driver
                .findElement(
                  By.xpath(
                    "/html/body/div[5]/div[3]/div[2]/div/div[1]/main/div/div/div[4]/div/div/ul/li[last()]"
                  )
                )
                .getAttribute("data-test-pagination-page-btn");
            } else {
              console.log("is all");
              scrollDown;
              isValue = await driver
                .findElement(
                  By.xpath(
                    "/html/body/div[5]/div[3]/div[2]/div/div[1]/main/div/div/div[4]/div/div/ul/li[last()]"
                  )
                )
                .getAttribute("data-test-pagination-page-btn");
            }
            return isValue;
          }
        };
        // this for all without jobs
        const uploadDataWitoutJobs = async () => {
          const numberPages = await checkPages();
          const nextPage = await driver.findElement(
            By.xpath(
              "/html/body/div[5]/div[3]/div[2]/div/div[1]/main/div/div/div[4]/div/div/button[2]"
            )
          );
          let scrollDown = await driver.executeScript(
            "window.scrollTo(0, document.body.scrollHeight);"
          );
          let data = [];
          for (let index = 0; index < numberPages.length; index++) {
            nextPage.click();
            await scrollDown;
            let names = await driver
              .findElements(
                By.xpath(
                  "/html/body/div[5]/div[3]/div[2]/div/div[1]/main/div/div/div[2]/div/ul/li/div/div/div/div[2]/div[1]/div[1]/div/span[1]/span/a/span/span[1]"
                )
              )
              .getText();
            let jobs = await driver
              .findElements(
                By.xpath(
                  "/html/body/div[5]/div[3]/div[2]/div/div[1]/main/div/div/div[2]/div/ul/li/div/div/div/div[2]/div[1]/div[2]"
                )
              )
              .getText();
            let zones = await driver
              .findElements(
                By.xpath(
                  "/html/body/div[5]/div[3]/div[2]/div/div[1]/main/div/div/div[2]/div/ul/li/div/div/div/div[2]/div[1]/div[3]"
                )
              )
              .getText();
            let hisLink = await driver
              .findElements(
                By.xpath(
                  "/html/body/div[5]/div[3]/div[2]/div/div[1]/main/div/div/div[2]/div/ul/li/div/div/div/div[2]/div[1]/div[1]/div/span[1]/span/a"
                )
              )
              .getAttribute("href")
              .getText();

            data = [names, jobs, zones, hisLink]
            console.log(data)
          }
        };

        const exitDriver = async () => {
          await driver.quit();
        };
        // uploadData();
      } else if (currentUrl.includes("checkpoint/challenge")) {
        await driver.sleep(3000);
      }
    }
  } catch (error) {
    console.log("the error is :", error);
    // await driver.quit();
  }
});
