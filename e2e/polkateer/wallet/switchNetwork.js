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
exports.switchNetwork = void 0;
// eslint-disable-next-line @typescript-eslint/no-unused-vars
exports.switchNetwork = (page) => (networkId) => __awaiter(void 0, void 0, void 0, function* () {
    yield page.bringToFront();
    yield page.waitForSelector(".popupToggle");
    const t = yield page.$$(".popupToggle");
    t[1].click();
    yield page.waitForSelector("select");
    yield page.select('select', networkId || '24');
    // close popup again
    yield page.waitForSelector(".popupToggle");
    const toggles = yield page.$$(".popupToggle");
    toggles[1].click();
    yield page.waitForTimeout(1000);
    /*
    const networkIndex = await page.evaluate((network) => {
      const elements = document.querySelectorAll('li.dropdown-menu-item');
      for (let i = 0; i < elements.length; i++) {
       const element = elements[i];
        if ((element as HTMLLIElement).innerText.toLowerCase().includes(network.toLowerCase())) {
          return i;
        }
      }
      return 0;
    }, network);
    */
});
