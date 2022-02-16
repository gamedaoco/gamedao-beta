import test from 'tape'
import puppeteer from 'puppeteer';
import polkateer from './polkateer/index.js';

import { createAccounts } from './createAccounts.mjs'
import { openExplorer } from './openExplorer.mjs'
import { createNoFeesOpenDAO } from './createNoFeesOpenDAO.mjs'
import { closeBrowser } from './closeBrowser.mjs'


let browser, pteer, gamedaoPage, explorerPage

const URL = "http://localhost:8000"

browser = await polkateer.launch(puppeteer, { 
  devtools: false,
  version: 'v0.42.6' 
});
const context = browser.defaultBrowserContext();
context.overridePermissions(URL,['clipboard-read', 'clipboard-write'])
pteer = await polkateer.setupPolkadotjs(browser);

global.polkateer = pteer
global.browser = browser

async function main(){


  // onmousemove = function(e){console.log(`mouse location = X: ${e.x}, Y: ${e.y}`)}

  // create accounts froms eeds
  await createAccounts()

  // polkadot js apps for executing calls and getting state
  // global.explorer = await openExplorer()
  
  // tests
  await test("test gameDAO", async t => {
    // gameDAO
    //
    gamedaoPage  = await browser.newPage()
    await gamedaoPage.goto(URL)
  
    t.ok(gamedaoPage, "GameDAO Loaded")
  
    const enter = await gamedaoPage.waitForSelector('button')
    await gamedaoPage.waitForTimeout(500000)

    await enter.click()

    // click connect and allow access with polkateer for gameDAO
    const connect = await gamedaoPage.waitForSelector("button")
    await connect.click()
    await pteer.allow(pteer.page);
    await gamedaoPage.bringToFront()

    await gamedaoPage.waitForTimeout(1000)
  
    t.ok(true, "Allow Wallet Access for gameDAO")

    const acc = await gamedaoPage.waitForSelector("select[name=account]")

    // Click on account selector coords
    await gamedaoPage.mouse.click(635, 35);
    await gamedaoPage.keyboard.press('ArrowDown');
    await gamedaoPage.keyboard.press('ArrowDown');
    await gamedaoPage.keyboard.press('ArrowDown');
    await gamedaoPage.keyboard.press('Enter');
    
    await createNoFeesOpenDAO(gamedaoPage)
    await closeBrowser()
    t.end()
  })

}

setTimeout( () => {
  main()
}, 1000)