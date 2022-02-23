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
var __rest = (this && this.__rest) || function (s, e) {
    var t = {};
    for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p) && e.indexOf(p) < 0)
        t[p] = s[p];
    if (s != null && typeof Object.getOwnPropertySymbols === "function")
        for (var i = 0, p = Object.getOwnPropertySymbols(s); i < p.length; i++) {
            if (e.indexOf(p[i]) < 0 && Object.prototype.propertyIsEnumerable.call(s, p[i]))
                t[p[i]] = s[p[i]];
        }
    return t;
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.getPolkadotjsWindow = exports.confirmWelcomeScreen = exports.setupPolkadotjs = exports.launch = exports.RECOMMENDED_POLKADOTJS_VERSION = exports.getPolkadotjs = void 0;
const wallet_1 = require("./wallet");
Object.defineProperty(exports, "getPolkadotjs", { enumerable: true, get: function () { return wallet_1.getPolkadotjs; } });
const polkadotjsDownloader_1 = __importDefault(require("./polkadotjsDownloader"));
const utils_1 = require("./utils");
const importSeed_1 = require("./wallet/importSeed");
exports.RECOMMENDED_POLKADOTJS_VERSION = 'v0.42.6';
/**
 * Launch Puppeteer chromium instance with Polkadotjs plugin installed
 * */
function launch(puppeteerLib, options) {
    return __awaiter(this, void 0, void 0, function* () {
        if (!options || !options.version)
            throw new Error(`Pleas provide "version" (use recommended "${exports.RECOMMENDED_POLKADOTJS_VERSION}" or "latest" to always get latest release of Polkadotjs)`);
        const { args, version, pathLocation } = options, rest = __rest(options, ["args", "version", "pathLocation"]);
        /* eslint-disable no-console */
        console.log(); // new line
        if (version === 'latest')
            console.warn('\x1b[33m%s\x1b[0m', `It is not recommended to run polkadotjs with "latest" version. Use it at your own risk or set to the recommended version "${exports.RECOMMENDED_POLKADOTJS_VERSION}".`);
        else if (utils_1.isNewerVersion(exports.RECOMMENDED_POLKADOTJS_VERSION, version))
            console.warn('\x1b[33m%s\x1b[0m', `Seems you are running newer version of Polkadotjs that recommended by team.
      Use it at your own risk or set to the recommended version "${exports.RECOMMENDED_POLKADOTJS_VERSION}".`);
        else if (utils_1.isNewerVersion(version, exports.RECOMMENDED_POLKADOTJS_VERSION))
            console.warn('\x1b[33m%s\x1b[0m', `Seems you are running older version of Polkadotjs that recommended by team.
      Use it at your own risk or set the recommended version "${exports.RECOMMENDED_POLKADOTJS_VERSION}".`);
        else
            console.log(`Running tests on Polkadotjs version ${version}`);
        console.log(); // new line
        /* eslint-enable no-console */
        // eslint-disable-next-line @typescript-eslint/naming-convention
        const POLKADOTJS_PATH = yield polkadotjsDownloader_1.default(version, pathLocation);
        return puppeteerLib.launch(Object.assign({ headless: false, ignoreDefaultArgs: ["--disable-extensions"], args: ["--enable-automation", `--disable-extensions-except=${POLKADOTJS_PATH}`, `--load-extension=${POLKADOTJS_PATH}`, ...(args || [])] }, rest));
    });
}
exports.launch = launch;
/**
 * Setup Polkadotjs with base account
 * */
const defaultPolkadotjsOptions = {
    showTestNets: true,
};
function setupPolkadotjs(browser, options = defaultPolkadotjsOptions) {
    return __awaiter(this, void 0, void 0, function* () {
        // set default values of not provided values (but required)
        for (const key of Object.keys(defaultPolkadotjsOptions)) {
            if (options[key] === undefined)
                options[key] = defaultPolkadotjsOptions[key];
        }
        const page = yield getExtensionPage(browser);
        page.bringToFront();
        yield confirmWelcomeScreen(page);
        yield importSeed_1.importSeed(page)({
            seed: options.seed || 'bottom drive obey lake curtain smoke basket hold race lonely fit walk',
            password: options.password || 'password1234',
            name: options.name || "Alice",
        });
        return wallet_1.getPolkadotjs(page);
    });
}
exports.setupPolkadotjs = setupPolkadotjs;
function confirmWelcomeScreen(polkadotjsPage) {
    return __awaiter(this, void 0, void 0, function* () {
        const trigger = yield polkadotjsPage.waitForSelector('button');
        yield trigger.click();
    });
}
exports.confirmWelcomeScreen = confirmWelcomeScreen;
/**
 * Return Polkadotjs instance
 * */
function getPolkadotjsWindow(browser, version) {
    return __awaiter(this, void 0, void 0, function* () {
        const polkadotjsPage = yield new Promise((resolve) => {
            browser.pages().then((pages) => {
                for (const page of pages) {
                    if (page.url().includes('chrome-extension'))
                        resolve(page);
                }
            });
        });
        return wallet_1.getPolkadotjs(polkadotjsPage);
    });
}
exports.getPolkadotjsWindow = getPolkadotjsWindow;
// extract extension id
function getExtensionPage(browser) {
    return __awaiter(this, void 0, void 0, function* () {
        const page = yield browser.newPage();
        yield page.goto("chrome://extensions/");
        yield page.waitForSelector("extensions-manager");
        const id = yield page.evaluate(() => {
            let manager = document.querySelector("extensions-manager").shadowRoot;
            let extensionList = manager.querySelector("extensions-item-list").shadowRoot;
            let extensionId = extensionList.querySelector("extensions-item").id;
            return extensionId;
        });
        yield page.goto(`chrome-extension://${id}/index.html#/`);
        return page;
    });
}
