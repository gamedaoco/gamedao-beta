import test from 'tape'

export async function closeBrowser(){

    await test("Good Bye. I love you.", async  t => {

        t.ok(true, "exit process")
        t.end()

        await global.browser.close()
    })

}