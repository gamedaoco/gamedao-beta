import { Page } from 'puppeteer';
export interface importSeedOptions {
    seed: string;
    password: string;
    name: string;
}
export declare const importSeed: (page: Page) => (options: importSeedOptions) => Promise<void>;
