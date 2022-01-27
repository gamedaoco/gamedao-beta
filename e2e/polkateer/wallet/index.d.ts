import { Page } from 'puppeteer';
import { Polkateer } from '..';
export declare const getPolkadotjs: (page: Page, version?: string) => Promise<Polkateer>;
