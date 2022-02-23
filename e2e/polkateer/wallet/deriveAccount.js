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
exports.deriveAccount = void 0;
// eslint-disable-next-line @typescript-eslint/no-unused-vars
exports.deriveAccount = (page) => (options) => __awaiter(void 0, void 0, void 0, function* () {
    const password = (options === null || options === void 0 ? void 0 : options.password) || "password1234";
    const name = (options === null || options === void 0 ? void 0 : options.name) || "DerivedAccount_" + Date.now().toString();
    yield page.waitForSelector('.popupToggle');
    yield page.evaluate(() => {
        /* @ts-ignore */
        document.querySelectorAll(".popupToggle")[0].click();
    });
    yield page.waitForSelector('svg[data-icon=code-branch]');
    yield page.evaluate(() => {
        /* @ts-ignore */
        document.querySelector("svg[data-icon=code-branch]").parentElement.click();
    });
    const pw = yield page.waitForSelector("input");
    yield pw.focus();
    yield pw.type("password1234");
    yield page.waitForTimeout(500);
    yield page.evaluate(() => {
        const btn = document.querySelectorAll("button")[1];
        btn.click();
        return;
    });
    const nameInput = yield page.waitForSelector("input");
    yield nameInput.focus();
    yield nameInput.type(name);
    const pwDerived = yield page.waitForSelector("input[type=password]");
    yield pwDerived.focus();
    yield pwDerived.type(password);
    yield page.waitForTimeout(500);
    const validatePw = yield page.$$("input[type='password']");
    yield validatePw[1].click();
    yield validatePw[1].type(password);
    yield page.waitForTimeout(500);
    const buttons = yield page.$$("button");
    yield buttons[1].click();
    yield page.waitForTimeout(1000);
    return;
});
