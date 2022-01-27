import test from 'tape'

export async function openExplorer(){
    await test("open pdot explorer with zero endpoint", async t => {
        const pteer = global.polkateer
    
        const explorerPage = await browser.newPage()
        await explorerPage.goto("https://polkadot.js.org/apps/?rpc=wss%3A%2F%2Falphaville.zero.io#/explorer")
    
        t.ok(explorerPage, "Zero Explorer Loaded")
        
        await pteer.allow(pteer.page);
        await explorerPage.bringToFront()
    
        t.ok(true, "Allow Wallet Access for ZERO Explorer")
        t.end()
    
        return explorer
    })
}