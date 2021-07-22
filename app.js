const prompt = require('prompt-sync')({sigint: true});
const puppeteer = require('puppeteer')
const colors = require('colors');
const dialog = require('dialog');
const setTitle = require('node-bash-title');

setTitle("💻 Discord Invite Checker  📱 - Scr1pp3d");
var errorText = 'ERROR: '.red + 'An error occcured.'.white + "\n" + 'CTRL + C to quit.';

function displayName() {
    process.stdout.write('\033c');
    console.log()
    console.log(' █▀▄ █ █▀ █▀▀ █▀█ █▀█ █▀▄   █ █▄░█ █░█ █ ▀█▀ █▀▀   █▀▀ █░█ █▀▀ █▀▀ █▄▀ █▀▀ █▀█'.brightCyan)
    console.log(' █▄▀ █ ▄█ █▄▄ █▄█ █▀▄ █▄▀   █ █░▀█ ▀▄▀ █ ░█░ ██▄   █▄▄ █▀█ ██▄ █▄▄ █░█ ██▄ █▀▄ '.brightBlue)
    console.log(' By Scr1pp3d'.white)
    console.log(' ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━'.white)
    console.log()
}

displayName()

prompt('Press any key to start: ')

requestUrls()

function requestUrls() {

    displayName()

    var urls = prompt('Enter invite links (right click to paste): ')


    if (!urls.includes('http')) {
        requestUrls()
    }
    else if (!urls.includes('discord')) {
        requestUrls()
    }
    else if (urls.includes('discord.com') && !urls.includes('invite')) {
        requestUrls()
    }
    else {
        if (urls.includes("\r")) {
            var urls = urls.split("\r").join("\n")
            var urls = urls.replace(/\n/g, ',')
            var urls = urls.split(',')
            urls.unshift('')
        }
        else if (urls.includes('http') && !urls.includes(', ')) {
            var urls = urls.replace(/http/g, ', http');
            var urls = urls.replace(/, /g, ',');
            var urls = urls.replace(/ /g, '');
            var urls = urls.split(',')
        }
        else if (urls.includes('http') && urls.includes(', ')) {
            var urls = urls.replace(/, http/g, ',http');
            var urls = urls.split(',')
            urls.unshift('')

        }

        checkDiscordInvite().catch(error => {
            console.log()
            console.log(errorText)
        });
        

        //console.log(urls)
    }
    
    var ValidLinks = 0;
    var InvalidLinks = 0;

    async function checkDiscordInvite() {

        const browser = await puppeteer.launch({ executablePath: './chromium/win64-884014/chrome-win/chrome.exe', headless: true});
        const page = await browser.newPage()
        
        for (let i = 1; i < urls.length; i++) {
            const url = urls[i];

            page.goto(url);
            await page.waitForNavigation();

            await page.waitForSelector('h3.title-jXR8lp')
            await page.waitForSelector('.colorHeaderSecondary-3Sp3Ft')
            

            

            var validityText = await eval(`page.evaluate(() => {
                return document.querySelector('h3.title-jXR8lp').textContent;
            })`);

            var classL = await eval(`page.evaluate(() => {
                return document.querySelector('h3.title-jXR8lp').classList.toString();
            })`);

            console.log()


            if (!classL.includes('title-2_aCTw')) {

                console.log('[INVALID INVITE] '.red + url)
                console.log()

                InvalidLinks++
            }
            else {
                console.log('[VALID INVITE] '.green + url)
                console.log('SERVER NAME: ' + validityText.white)
                console.log()

                ValidLinks++
            }
            
        }

        dialog.info('Found ' + ValidLinks + ' valid link(s) and ' + InvalidLinks + ' invalid link(s).')

        prompt('Press any key to quit: ')   
        await browser.close()
    } 
}



/*
examples:

https://discord.com/invite/WDS3cSXrHF https://discord.com/invite/NgDBtKcWzD
https://discord.com/invite/WDS3cSXrHF, https://discord.com/invite/NgDBtKcWzD

https://discord.com/invite/WDS3cSXrHF
https://discord.com/invite/NgDBtKcWzD

https://discord.com/invite/WDS3cSXrHF\r
https://discord.com/invite/NgDBtKcWzD


*/