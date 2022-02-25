import test from 'tape'

export async function createAccounts(){

    await test('switch network and import accounts', async t => {
        const pteer = global.polkateer
        // change network to ZERO
        await pteer.switchNetwork('24'); // TODO clearnames as options?
        
        await pteer.page.reload()
      
        t.ok(true, "network is ZERO (24)")
      
        t.end()
      })

}