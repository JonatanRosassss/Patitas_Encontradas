import { type Page, type Locator, expect } from '@playwright/test';

/**
 * Page Object Model para Feed Comunitario y Mapa Interactivo (RF-2, RF-3).
 * Implementado bajo Playwright TypeScript y Clean Architecture.
 */
export class FeedAndMapPage {
  readonly page: Page;

  // Locators del Feed Principal
  readonly publicButton: Locator;
  readonly filterToggleButton: Locator;
  readonly guiaButton: Locator;
  readonly notificationsButton: Locator;
  readonly filterOptionTodos: Locator;
  readonly filterOptionPerdidos: Locator;
  readonly filterOptionEncontrados: Locator;
  readonly cerrarGuiaButton: Locator;

  // Gate de autenticación en Publicar Alerta
  readonly authGateTitle: Locator;
  readonly authGateMessage: Locator;
  readonly authGateLoginButton: Locator;

  // Locators del Mapa Comunitario
  readonly mapTitle: Locator;
  readonly mapSubtitle: Locator;
  readonly mapSearchBar: Locator;
  readonly mapIframe: Locator;

  constructor(page: Page) {
    this.page = page;

    // Feed
    this.publicButton = page.getByRole('button', { name: /publicar mascota perdida o encontrada/i });
    this.filterToggleButton = page.getByRole('button', { name: /abrir filtros de estado/i });
    this.guiaButton = page.getByRole('button', { name: /ver guía de uso interactiva/i });
    this.notificationsButton = page.getByRole('button', { name: /ver notificaciones comunitarias/i });
    this.filterOptionTodos = page.getByText('Todos', { exact: true });
    this.filterOptionPerdidos = page.getByText('Perdidos', { exact: true });
    this.filterOptionEncontrados = page.getByText('Encontrados', { exact: true });
    this.cerrarGuiaButton = page.getByRole('button', { name: 'Cerrar guía' });

    // Gate de Auth en Publicar Alerta
    this.authGateTitle = page.getByText('Iniciá sesión para publicar');
    this.authGateMessage = page.getByText('Necesitás una cuenta para compartir una alerta de una mascota.');
    this.authGateLoginButton = page.getByText('INICIAR SESIÓN', { exact: true });

    // Mapa
    this.mapTitle = page.getByText(/mapa comunitario/i);
    this.mapSubtitle = page.getByText(/radar de alertas y campañas en pilar/i);
    this.mapSearchBar = page.getByPlaceholder(/buscar/i);
    this.mapIframe = page.locator('iframe[title="Mapa Leaflet Web"]');
  }

  async gotoFeed(): Promise<void> {
    await this.page.goto('/bienvenida');
    await this.page.waitForLoadState('domcontentloaded');
    const invitadoButton = this.page.getByRole('button', { name: /explorar como invitado/i });
    await expect(invitadoButton).toBeVisible();
    await invitadoButton.click();
    await this.dismissGuiaIfPresent();
  }

  async dismissGuiaIfPresent(): Promise<void> {
    try {
      await expect(this.cerrarGuiaButton).toBeVisible({ timeout: 3000 });
      await this.cerrarGuiaButton.click();
      await expect(this.cerrarGuiaButton).toBeHidden();
    } catch {
      // Si la guía no estaba visible, continuar silenciosamente
    }
  }

  async toggleFilterPanel(): Promise<void> {
    await this.filterToggleButton.click();
  }

  async selectFilter(tipo: 'Todos' | 'Perdidos' | 'Encontrados'): Promise<void> {
    if (tipo === 'Todos') {
      await this.filterOptionTodos.click();
    } else if (tipo === 'Perdidos') {
      await this.filterOptionPerdidos.click();
    } else {
      await this.filterOptionEncontrados.click();
    }
  }

  async gotoPublicarAlerta(): Promise<void> {
    await this.page.goto('/publicar-alerta');
    await this.page.waitForLoadState('domcontentloaded');
  }

  async gotoMapa(): Promise<void> {
    await this.page.goto('/mapa');
    await this.page.waitForLoadState('domcontentloaded');
  }
}
