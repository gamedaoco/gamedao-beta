import { Page } from 'puppeteer';
export interface deriveAccountOptions {
    name?: string;
    password?: string;
}
export declare const deriveAccount: (page: Page) => (options: deriveAccountOptions) => Promise<void>;
