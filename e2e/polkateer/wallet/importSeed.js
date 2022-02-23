"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.importSeed = void 0;
// eslint-disable-next-line @typescript-eslint/no-unused-vars
exports.importSeed = (page) => (options) => __awaiter(void 0, void 0, void 0, function* () {
    if (!options.seed)
        throw Error("Seed is Mandatory");
    if (!options.password)
        throw Error("Password is Mandatory");
    if (!options.name)
        throw Error("Name is Mandatory");
    const { seed, password, name } = options;
    yield page.waitForSelector('.popupToggle');
    yield page.evaluate(() => {
        /* @ts-ignore */
        document.querySelectorAll(".popupToggle")[0].click();
    });
    yield page.waitForSelector('svg[data-icon=key]');
    yield page.evaluate(() => {
        /* @ts-ignore */
        document.querySelector("svg[data-icon=key]").parentElement.click();
    });
    const seedPhraseInput = yield page.waitForSelector('textarea');
    yield seedPhraseInput.click();
    yield seedPhraseInput.type(seed);
    if (options.derivationPath) {
        const advanced = yield page.waitForSelector(".advancedToggle");
        yield advanced.click();
        const pathInput = yield page.waitForSelector(".derivationPath input");
        yield pathInput.focus();
        yield pathInput.type(options.derivationPath);
    }
    yield page.waitForSelector('button');
    yield page.evaluate(() => document.querySelector("button").click());
    const acc = yield page.waitForSelector("input");
    yield acc.focus();
    yield acc.type(name);
    const inputPw = yield page.waitForSelector("input[type='password']");
    yield inputPw.click();
    yield inputPw.type(password);
    const validatePw = yield page.$$("input[type='password']");
    yield validatePw[1].click();
    yield validatePw[1].type(password);
    const buttons = yield page.$$("button");
    yield buttons[1].click(); // next button is 2nd
    return;
});
