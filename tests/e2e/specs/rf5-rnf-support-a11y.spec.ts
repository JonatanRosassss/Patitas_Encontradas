import { test, expect } from '../fixtures/test-base';
import { SUPPORT_TICKET_DATA } from '../data/testData';

test.describe('RF-5 & RNF: Centro de Ayuda, Validación de Tickets y Accesibilidad', () => {
  test('TC-503: Navegación por FAQs, filtrado reactivo por categorías y expansión de acordeón', async ({
    supportPage,
  }) => {
    await test.step('Navegar al Centro de Ayuda', async () => {
      await supportPage.gotoSupport();
      await expect(supportPage.screenTitle).toBeVisible();
      await expect(supportPage.tabFaqs).toBeVisible();
    });

    await test.step('Filtrar FAQs por categorías: Mapa, Publicaciones y Cuenta', async () => {
      // 1. Filtrar por Mapa
      await supportPage.selectCategory('Mapa');
      await expect(supportPage.page.getByRole('button', { name: /^Pregunta:/i }).first()).toBeVisible();

      // 2. Filtrar por Publicaciones
      await supportPage.selectCategory('Publicaciones');
      await expect(supportPage.page.getByRole('button', { name: /^Pregunta:/i }).first()).toBeVisible();

      // 3. Filtrar por Cuenta
      await supportPage.selectCategory('Cuenta');
      await expect(supportPage.page.getByRole('button', { name: /^Pregunta:/i }).first()).toBeVisible();
    });

    await test.step('Expandir una pregunta frecuente y verificar despliegue de respuesta en el DOM', async () => {
      const { respuesta } = await supportPage.expandFirstFaq();
      await expect(respuesta).toBeVisible();
    });
  });

  test('TC-505: Validación interactiva en caliente del formulario de Tickets sin impacto en Firestore', async ({
    supportPage,
  }) => {
    await test.step('Navegar a la pestaña Generar Ticket', async () => {
      await supportPage.gotoSupport();
      await supportPage.switchTab('TICKET');
      await expect(supportPage.ticketNombreInput).toBeVisible();
      await expect(supportPage.ticketSubmitButton).toBeVisible();
    });

    await test.step('Intentar enviar el formulario vacío y verificar mensajes de error en caliente', async () => {
      await supportPage.triggerHotValidation();

      await expect(supportPage.errorNombreRequired).toBeVisible();
      await expect(supportPage.errorEmailRequired).toBeVisible();
      await expect(supportPage.errorTituloRequired).toBeVisible();
    });

    await test.step('Ingresar descripción corta (< 15 caracteres) y validar regla específica', async () => {
      await supportPage.ticketDescripcionInput.fill(SUPPORT_TICKET_DATA.descripcionCorta);
      await supportPage.ticketDescripcionInput.blur();

      await expect(supportPage.errorDescripcionCorta).toBeVisible();
    });
  });

  test('TC-605: Verificación de accesibilidad táctil móvil (Área de toque >= 44px)', async ({
    supportPage,
  }) => {
    await test.step('Navegar al Centro de Ayuda en viewport móvil estándar (390x844)', async () => {
      await supportPage.gotoSupport();
      await expect(supportPage.screenTitle).toBeVisible();
    });

    await test.step('Medir altura de los chips de filtrado FAQ (minHeight >= 44px)', async () => {
      const chipHeight = await supportPage.measureElementHeight(supportPage.chipMapa);
      expect(chipHeight).toBeGreaterThanOrEqual(44);
    });

    await test.step('Medir altura del botón de envío de ticket y campos de texto (minHeight >= 44px)', async () => {
      await supportPage.switchTab('TICKET');
      const inputHeight = await supportPage.measureElementHeight(supportPage.ticketNombreInput);
      const submitBtnHeight = await supportPage.measureElementHeight(supportPage.ticketSubmitButton);

      expect(inputHeight).toBeGreaterThanOrEqual(44);
      expect(submitBtnHeight).toBeGreaterThanOrEqual(44);
    });
  });
});
