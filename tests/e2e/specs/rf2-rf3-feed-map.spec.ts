import { test, expect } from '../fixtures/test-base';

test.describe('RF-2 & RF-3: Feed Comunitario, Publicación y Mapa Leaflet', () => {
  test('TC-201: Carga inicial del Feed comunitario y disponibilidad de controles táctiles', async ({
    feedMapPage,
  }) => {
    await test.step('Navegar a la pantalla principal del Feed', async () => {
      await feedMapPage.gotoFeed();
    });

    await test.step('Verificar presencia de botones principales de interacción', async () => {
      await expect(feedMapPage.publicButton).toBeVisible();
      await expect(feedMapPage.filterToggleButton).toBeVisible();
      await expect(feedMapPage.guiaButton).toBeVisible();
    });

    await test.step('Desplegar panel de filtros y alternar entre Perdidos, Encontrados y Todos', async () => {
      await feedMapPage.toggleFilterPanel();

      await expect(feedMapPage.filterOptionTodos).toBeVisible();
      await expect(feedMapPage.filterOptionPerdidos).toBeVisible();
      await expect(feedMapPage.filterOptionEncontrados).toBeVisible();

      // Filtrar por Perdidos
      await feedMapPage.selectFilter('Perdidos');
      await expect(feedMapPage.filterToggleButton).toBeVisible();

      // Filtrar por Encontrados
      await feedMapPage.selectFilter('Encontrados');
      await expect(feedMapPage.filterToggleButton).toBeVisible();

      // Volver a Todos
      await feedMapPage.selectFilter('Todos');
      await expect(feedMapPage.filterToggleButton).toBeVisible();
    });
  });

  test('TC-202: Gate de seguridad en Publicación de Alertas para usuarios invitados', async ({
    feedMapPage,
    authPage,
  }) => {
    await test.step('Navegar a Publicar Alerta sin autenticación previa', async () => {
      await feedMapPage.gotoPublicarAlerta();
    });

    await test.step('Comprobar que el Gate de seguridad bloquea el formulario', async () => {
      await expect(feedMapPage.authGateTitle).toBeVisible();
      await expect(feedMapPage.authGateMessage).toBeVisible();
      await expect(feedMapPage.authGateLoginButton).toBeVisible();
    });

    await test.step('Presionar INICIAR SESIÓN y verificar redirección hacia el Login', async () => {
      await feedMapPage.authGateLoginButton.click();
      await expect(authPage.loginEmailInput).toBeVisible({ timeout: 10000 });
      await expect(authPage.loginIngresarButton).toBeVisible();
    });
  });

  test('TC-301 & TC-601: Montaje y visibilidad del Mapa interactivo Leaflet con OpenStreetMap sin API Key de Google', async ({
    feedMapPage,
  }) => {
    await test.step('Navegar al Mapa Comunitario', async () => {
      await feedMapPage.gotoMapa();
      await expect(feedMapPage.mapTitle).toBeVisible();
      await expect(feedMapPage.mapSubtitle).toBeVisible();
    });

    await test.step('Verificar que el iframe de Leaflet 1.9.4 se monta en el DOM', async () => {
      await expect(feedMapPage.mapIframe).toBeVisible({ timeout: 15000 });
    });

    await test.step('Acceder al contexto interno del iframe y verificar la capa Leaflet y teselas OpenStreetMap', async () => {
      const mapFrame = feedMapPage.page.frameLocator('iframe[title="Mapa Leaflet Web"]');
      await expect(mapFrame.locator('#map')).toBeVisible({ timeout: 15000 });
      await expect(mapFrame.locator('.leaflet-container')).toBeVisible({ timeout: 15000 });
      await expect(mapFrame.getByRole('link', { name: /OpenStreetMap/i })).toBeVisible({ timeout: 15000 });
    });
  });
});
