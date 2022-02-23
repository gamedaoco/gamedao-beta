import * as puppeteer from 'puppeteer';
import { Page } from 'puppeteer';
import { getPolkadotjs } from './wallet';
import { Path } from './polkadotjsDownloader';
import { importSeedOptions } from './wallet/importSeed';
export { getPolkadotjs };
export declare type LaunchOptions = Parameters<typeof puppeteer['launch']>[0] & {
    version: 'v0.42.6' | 'latest' | string;
    pathLocation?: Path;
};
export declare type PolkadotjsOptions = {
    seed?: string;
    password?: string;
    showTestNets?: boolean;
    hideSeed?: boolean;
    name?: string;
};
export declare type AddNetwork = {
    networkName: string;
    rpc: string;
    chainId: number;
    symbol?: string;
    explorer?: string;
};
export declare type Polkateer = {
    allow: () => Promise<void>;
    getAccountsData: () => Object;
    openAccountsPopup: () => Promise<void>;
    openSettingsPopup: () => Promise<void>;
    importSeed: (options: importSeedOptions) => Promise<void>;
    switchNetwork: (network: string) => Promise<void>;
    confirmTransaction: (password: string) => Promise<void>;
    deriveAccount: (deriveAccountOptions: any) => Promise<void>;
    page: Page;
};
export declare type TransactionOptions = {
    gas?: number;
    gasLimit?: number;
};
export declare const RECOMMENDED_POLKADOTJS_VERSION = "v0.42.6";
/**
 * Launch Puppeteer chromium instance with Polkadotjs plugin installed
 * */
export declare function launch(puppeteerLib: typeof puppeteer, options: LaunchOptions): Promise<puppeteer.Browser>;
export declare function setupPolkadotjs(browser: puppeteer.Browser, options?: PolkadotjsOptions): Promise<Polkateer>;
export declare function confirmWelcomeScreen(polkadotjsPage: puppeteer.Page): Promise<void>;
/**
 * Return Polkadotjs instance
 * */
export declare function getPolkadotjsWindow(browser: puppeteer.Browser, version?: string): Promise<Polkateer>;
