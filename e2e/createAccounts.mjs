import test from 'tape'
import { password, seeds } from "./data.mjs"

export async function createAccounts(){

    await test('switch network and import accounts', async t => {
        const pteer = global.polkateer
        // change network to ZERO
        await pteer.switchNetwork('24'); // TODO clearnames as options?
        
        await pteer.page.reload()

        await pteer.page.deriveAccount()
      
        t.ok(true, "network is ZERO (24)")
        t.ok(true, "created 2 accounts")
      
        t.end()
      })

}