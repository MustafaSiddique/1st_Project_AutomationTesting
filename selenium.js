const { Builder, By, until, Key } = require('selenium-webdriver');
const chrome = require('selenium-webdriver/chrome');

async function openGoogleChrome() {
    let options = new chrome.Options();
    // Launch directly in fullscreen
    options.addArguments('--start-fullscreen');

    let driver = await new Builder()
        .forBrowser('chrome')
        .setChromeOptions(options)
        .build();

    try {
        console.log("🚀 Starting browser...");
        await driver.get('https://www.google.com');

        console.log("🔍 Searching for Agree button...");

        // This XPath looks for any button containing common 'Accept' text
        const agreeXPath = "//button[.//div[contains(text(), 'Accept all')]]";

        // Increased timeout to 15 seconds to handle slow network/loading
        const agreeButton = await driver.wait(
            until.elementLocated(By.xpath(agreeXPath)),
            15000
        );

        // Wait for the button to be ready for interaction
        await driver.wait(until.elementIsVisible(agreeButton), 10000);
        await agreeButton.click();

        console.log('✅ Success: Consent button clicked!');

        // Navigate to YouTube
        await driver.get('https://www.youtube.com');
        console.log('✅ Success: YouTube opened!');
        // await driver.sleep(5000);
        await new Promise(resolve => setTimeout(resolve,5000));

        console.log('🔍 searching for the accept button on youtube consent page.....');

        const youtubeAcceptXPath = "//button[contains(., 'Accept') or contains(., 'Agree') or contains(., 'akzeptieren')]"

        try {
            const acceptButtonOfYoutube = await driver.wait(until.elementLocated(By.xpath(youtubeAcceptXPath)), 15000);
            await driver.wait(until.elementIsVisible(acceptButtonOfYoutube), 10000);
            console.log('✅ Success: Youtube Accept button found!');

            await acceptButtonOfYoutube.click();
            console.log('✅ Success: Accept button clicked!');

            try {

                console.log("🔍 Searching for the YouTube search bar...");

                let searchBar;
                // retry fro 3 times
                for (let i = 0; i < 3; i++) {
                    try {
                        searchBar = await driver.wait(until.elementLocated(By.name('search_query')), 15000);
                        console.log('✅ Success: Youtube Search bar found!');
                        await driver.wait(until.elementIsVisible(searchBar),10000);
                        await searchBar.click();

                        await searchBar.sendKeys('Hello World Baby', Key.ENTER);
                        break;
                    } catch (error) {
                        if (error.name === 'StaleElementReferenceError') {
                            console.log("🔄 Element went stale, retrying...");
                            continue;
                        } else {
                            throw error; // If it's a different error, stop
                        }
                    }
                }

                console.log('✅ Success: Search query submitted!');
                // Wait for the results to load
                await driver.wait(until.elementLocated(By.id('video-title')), 15000);
                console.log('✅ Success: Results are visible!');

            } catch (error) {
                console.error('❌ Error details:', error.message);
            }

        } catch (error) {
            console.error('❌ Error details:', error.message);
        }

        await driver.sleep(10000);

    } catch (error) {
        console.error('❌ Error details:', error.message);
    } finally {
        await driver.quit();
        console.log("🏁 Browser session ended.");
    }
}

openGoogleChrome();
