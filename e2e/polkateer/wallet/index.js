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
exports.getPolkadotjs = void 0;
const allow_1 = require("./allow");
const confirmTransaction_1 = require("./confirmTransaction");
const getAccountsData_1 = require("./getAccountsData");
const deriveAccount_1 = require("./deriveAccount");
const importSeed_1 = require("./importSeed");
const switchNetwork_1 = require("./switchNetwork");
exports.getPolkadotjs = (page, version) => __awaiter(void 0, void 0, void 0, function* () {
    return {
        allow: allow_1.allow(page),
        confirmTransaction: confirmTransaction_1.confirmTransaction(page),
        importSeed: importSeed_1.importSeed(page),
        switchNetwork: switchNetwork_1.switchNetwork(page),
        openAccountsPopup: openAccountsPopup(page),
        openSettingsPopup: openSettingsPopup(page),
        getAccountsData: getAccountsData_1.getAccountsData(page),
        deriveAccount: deriveAccount_1.deriveAccount(page),
        page,
    };
});
function openAccountsPopup(page) {
    return () => __awaiter(this, void 0, void 0, function* () {
        yield page.waitForSelector('.popupToggle');
        yield page.evaluate(() => {
            /* @ts-ignore */
            document.querySelectorAll(".popupToggle")[0].click();
        });
        return yield page.waitForTimeout(500);
    });
}
function openSettingsPopup(page) {
    return () => __awaiter(this, void 0, void 0, function* () {
        yield page.waitForSelector('.popupToggle');
        yield page.evaluate(() => {
            /* @ts-ignore */
            document.querySelectorAll(".popupToggle")[1].click();
        });
        return yield page.waitForTimeout(500);
    });
}
