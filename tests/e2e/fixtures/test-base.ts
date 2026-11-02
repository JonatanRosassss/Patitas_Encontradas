import { test as base, expect } from '@playwright/test';
import { WelcomeAndAuthPage } from '../pages/WelcomeAndAuthPage';
import { FeedAndMapPage } from '../pages/FeedAndMapPage';
import { SupportCenterPage } from '../pages/SupportCenterPage';

/**
 * Fixture de inyección de dependencias para Playwright.
 * Cumple con la regla TOP: Inyección declarativa de Page Objects,
 * evitando instanciaciones manuales dentro de los specs de prueba.
 */
export interface PatitasFixtures {
  authPage: WelcomeAndAuthPage;
  feedMapPage: FeedAndMapPage;
  supportPage: SupportCenterPage;
}

export const test = base.extend<PatitasFixtures>({
  authPage: async ({ page }, use) => {
    const authPage = new WelcomeAndAuthPage(page);
    await use(authPage);
  },
  feedMapPage: async ({ page }, use) => {
    const feedMapPage = new FeedAndMapPage(page);
    await use(feedMapPage);
  },
  supportPage: async ({ page }, use) => {
    const supportPage = new SupportCenterPage(page);
    await use(supportPage);
  },
});

export { expect };
