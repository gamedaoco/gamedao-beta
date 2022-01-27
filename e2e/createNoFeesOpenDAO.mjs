import test from 'tape'
import path from 'path';


const data = {
    name: "BotChanNoFeesOpenDAO",
    email: "botchan@zero.io",
    body: "3",
    country: "ch",
    logo: "e2e/testerchan.jpg",
    description: `This DAO was created by botchan. 
    its a swiss open dao without fees!
    Automated Testing Bot. Hai!`,
    website: "https://zero.io"
}



export async function createNoFeesOpenDAO(page){

    await test("Navigate to Create Organisation Page", async  t => {
        page.bringToFront()

        const menuOrgs = await page.$("a[href='/app/organisations']")
        await menuOrgs.click()
    
        // create orga
        await page.waitForSelector("button.MuiButton-outlined")
        const create = await page.$("button.MuiButton-outlined")
        await create.click()

        t.ok(true, "Opened Create Organisation Form")
        t.end()
    })

    await test("Enter Data into Create Organisation Form", async t => {

        // get accounts
        const accounts = await global.polkateer.getAccountsData()

        await page.bringToFront()
        // form
        const name = await page.waitForSelector("input[name=name]")
        await name.type(data.name)

        const email = await page.waitForSelector("input[name=email]")
        await email.type(data.email)

        await page.evaluate(() => {
            document.querySelector('select[name=body]').scrollIntoView();
        });

        await page.waitForSelector("select[name=body]")
        await page.select('select[name=body]', data.body);

        await page.waitForSelector("select[name=body]")
        await page.select('select[name=country]', data.country);

        await page.$("div[name=logo]")

        const filePath = path.relative(process.cwd(), data.logo);
        console.log(filePath)
        const [fileChooser] = await Promise.all([
            page.waitForFileChooser(),
            page.click('div[name=logo]'), // some button that triggers file selection
        ]);
        
        await fileChooser.accept([filePath]);

        const textarea = await page.$("textarea[name=description]")
        await textarea.type(data.description)

        const website = await page.$("input[name=website]")
        await website.type(data.website)

        const ctrl = accounts.find( x => x.name === "Controller")
        const treasure = accounts.find( x => x.name === "Treasury")
        
        await page.bringToFront()

        const controller = await page.$("input[name=controller]")
        await controller.type('X')
        const oldController = await page.$eval('input[name=controller]', el => el.value);
        for (let i = 0; i < oldController.length; i++) {
            await page.keyboard.press('Backspace');
        }
        await controller.type(ctrl.address)

        const treasury = await page.$("input[name=treasury]")
        await treasury.type('X')
        const oldTreasury = await page.$eval('input[name=treasury]', el => el.value);
        for (let i = 0; i < oldTreasury.length; i++) {
            await page.keyboard.press('Backspace');
        }
        await treasury.type(treasure.address)

        const limit = await page.$("input[name=member_limit]")
        await limit.type("0")

        await page.waitForTimeout(3000)

        // click last button (tx button)
        await page.evaluate( () => {
            document.querySelector("button[type=submit]").click()
        })

        await page.waitForTimeout(500)

        await global.polkateer.confirmTransaction("password1234")

        await page.bringToFront()
        await page.waitForTimeout(6000)
        
        t.ok(true, "Form Data Entered and Validated")
        t.end()
    })

}