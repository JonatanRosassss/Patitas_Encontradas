import { test, expect } from '../fixtures/test-base';
import {
  TEST_CREDENTIALS,
  EXPECTED_MESSAGES,
  WELCOME_PILLARS_DATA,
} from '../data/testData';

test.describe('RF-1: Onboarding y Autenticación Segura', () => {
  test('TC-101: Interacción completa con Portada de Bienvenida y Pilares Activos', async ({
    authPage,
  }) => {
    await test.step('Navegar a la pantalla de bienvenida', async () => {
      await authPage.gotoBienvenida();
      await expect(authPage.comenzarAhoraButton).toBeVisible();
      await expect(authPage.explorarInvitadoButton).toBeVisible();
    });

    await test.step('Intercambiar píldoras interactivas (Mapa, Reporte, Comunidad)', async () => {
      // 1. Pilar Mapa en vivo
      await authPage.selectPillar('mapa');
      await expect(authPage.pillMapa).toBeVisible();
      await expect(authPage.page.getByText(/Tu red barrial para/i)).toBeVisible();

      // 2. Pilar Reporte rápido
      await authPage.selectPillar('reporte');
      await expect(authPage.pillReporte).toBeVisible();
      await expect(authPage.page.getByText(/Publicá una alerta/i)).toBeVisible();

      // 3. Pilar Comunidad
      await authPage.selectPillar('comunidad');
      await expect(authPage.pillComunidad).toBeVisible();
      await expect(authPage.page.getByText(/Vecinos unidos sin/i)).toBeVisible();
    });

    await test.step('Verificar que el botón Comenzar Ahora redirige a Login', async () => {
      await authPage.comenzarAhoraButton.click();
      await expect(authPage.loginEmailInput).toBeVisible({ timeout: 10000 });
      await expect(authPage.loginIngresarButton).toBeVisible();
    });
  });

  test('TC-105: Validación estricta de credenciales inválidas en Login con Zod y Alert Dialog', async ({
    authPage,
  }) => {
    await test.step('Navegar al formulario de Login', async () => {
      await authPage.gotoLogin();
      await expect(authPage.loginEmailInput).toBeVisible();
      await expect(authPage.loginPasswordInput).toBeVisible();
    });

    await test.step('Ingresar correo con formato inválido y contraseña corta', async () => {
      await authPage.login(
        TEST_CREDENTIALS.emailInvalido,
        TEST_CREDENTIALS.passwordCorta
      );
    });

    await test.step('Presionar Ingresar y capturar el diálogo web nativo con el error de Zod', async () => {
      const dialogMessage = await authPage.clickIngresarWithDialog();
      expect(dialogMessage).toContain(EXPECTED_MESSAGES.loginEmailInvalido);
    });
  });

  test('TC-106: Rechazo preventivo en Registro por contraseñas no coincidentes o campos incompletos', async ({
    authPage,
  }) => {
    await test.step('Navegar a Registro de cuenta', async () => {
      await authPage.gotoRegister();
      await expect(authPage.registerNombreInput).toBeVisible();
      await expect(authPage.registerSubmitButton).toBeVisible();
    });

    await test.step('Intentar registrar con formulario vacío y verificar rechazo', async () => {
      const emptyDialog = await authPage.clickRegistrarmeWithDialog();
      expect(emptyDialog).toContain(EXPECTED_MESSAGES.registerCamposRequeridos);
    });

    await test.step('Completar datos pero con contraseñas no coincidentes', async () => {
      await authPage.fillRegister({
        nombre: TEST_CREDENTIALS.nombreCompleto,
        email: TEST_CREDENTIALS.emailValido,
        telefono: TEST_CREDENTIALS.telefonoValido,
        password: TEST_CREDENTIALS.passwordValida,
        confirmPassword: TEST_CREDENTIALS.passwordNoCoincide,
      });

      const mismatchDialog = await authPage.clickRegistrarmeWithDialog();
      expect(mismatchDialog).toContain(EXPECTED_MESSAGES.registerPassNoCoinciden);
    });
  });

  test('TC-107: Navegación y estructura de recuperación de contraseña', async ({
    authPage,
  }) => {
    await test.step('Navegar a Olvidé Contraseña', async () => {
      await authPage.gotoForgotPassword();
      await expect(authPage.forgotEmailInput).toBeVisible();
      await expect(authPage.forgotSubmitButton).toBeVisible();
    });

    await test.step('Ingresar correo para solicitud de restablecimiento', async () => {
      await authPage.forgotEmailInput.fill(TEST_CREDENTIALS.emailValido);
      await expect(authPage.forgotEmailInput).toHaveValue(TEST_CREDENTIALS.emailValido);
    });
  });
});
