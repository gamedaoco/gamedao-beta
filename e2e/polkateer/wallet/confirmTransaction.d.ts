import { Page } from 'puppeteer';
export declare const confirmTransaction: (page: Page) => (password: string) => Promise<void>;
