import { type Page, type Locator, expect } from '@playwright/test';

/**
 * Page Object Model para Bienvenida y Autenticación (RF-1).
 * Implementado bajo Playwright TypeScript y Clean Architecture.
 */
export class WelcomeAndAuthPage {
  readonly page: Page;

  // Locators de Bienvenida
  readonly saltarButton: Locator;
  readonly comenzarAhoraButton: Locator;
  readonly explorarInvitadoButton: Locator;
  readonly pillMapa: Locator;
  readonly pillReporte: Locator;
  readonly pillComunidad: Locator;

  // Locators de Login
  readonly loginEmailInput: Locator;
  readonly loginPasswordInput: Locator;
  readonly loginIngresarButton: Locator;
  readonly loginCrearCuentaButton: Locator;
  readonly loginOlvidePasswordLink: Locator;

  // Locators de Registro
  readonly registerNombreInput: Locator;
  readonly registerEmailInput: Locator;
  readonly registerTelefonoInput: Locator;
  readonly registerPasswordInput: Locator;
  readonly registerConfirmPasswordInput: Locator;
  readonly registerSubmitButton: Locator;

  // Locators de Olvidé Contraseña
  readonly forgotEmailInput: Locator;
  readonly forgotSubmitButton: Locator;

  constructor(page: Page) {
    this.page = page;

    // Bienvenida
    this.saltarButton = page.getByRole('button', { name: /saltar/i });
    this.comenzarAhoraButton = page.getByRole('button', { name: /comenzar ahora/i });
    this.explorarInvitadoButton = page.getByRole('button', { name: /explorar como invitado/i });
    this.pillMapa = page.getByRole('tab', { name: /mapa en vivo/i });
    this.pillReporte = page.getByRole('tab', { name: /reporte rápido/i });
    this.pillComunidad = page.getByRole('tab', { name: /comunidad/i });

    // Login
    this.loginEmailInput = page.getByPlaceholder('Mail');
    this.loginPasswordInput = page.getByPlaceholder('Contraseña');
    this.loginIngresarButton = page.getByRole('button', { name: 'Ingresar' }).or(page.getByText('Ingresar', { exact: true }));
    this.loginCrearCuentaButton = page.getByRole('button', { name: 'Crear cuenta' }).or(page.getByText('Crear cuenta', { exact: true }));
    this.loginOlvidePasswordLink = page.getByText(/olvidaste tu contrasenia\?/i);

    // Registro
    this.registerNombreInput = page.getByPlaceholder(/Juan Pérez/i);
    this.registerEmailInput = page.getByPlaceholder(/ejemplo@correo\.com/i);
    this.registerTelefonoInput = page.getByPlaceholder(/11 1234-5678/i);
    this.registerPasswordInput = page.getByPlaceholder('Mínimo 6 caracteres');
    this.registerConfirmPasswordInput = page.getByPlaceholder('Repetir contraseña');
    this.registerSubmitButton = page.getByRole('button', { name: 'Registrarme' }).or(page.getByText('Registrarme', { exact: true }));

    // Olvidé contraseña
    this.forgotEmailInput = page.getByPlaceholder('Mail');
    this.forgotSubmitButton = page.getByRole('button', { name: /enviar codigo de verificacion/i }).or(page.getByText('Enviar codigo de verificacion', { exact: true }));
  }

  async gotoBienvenida(): Promise<void> {
    await this.page.goto('/bienvenida');
    await this.page.waitForLoadState('domcontentloaded');
  }

  async gotoLogin(): Promise<void> {
    await this.page.goto('/login');
    await this.page.waitForLoadState('domcontentloaded');
  }

  async gotoRegister(): Promise<void> {
    await this.page.goto('/register');
    await this.page.waitForLoadState('domcontentloaded');
  }

  async gotoForgotPassword(): Promise<void> {
    await this.page.goto('/forgetPassword');
    await this.page.waitForLoadState('domcontentloaded');
  }

  async selectPillar(id: 'mapa' | 'reporte' | 'comunidad'): Promise<void> {
    const pill = id === 'mapa' ? this.pillMapa : id === 'reporte' ? this.pillReporte : this.pillComunidad;
    await pill.click();
  }

  async login(email: string, pass: string): Promise<void> {
    await this.loginEmailInput.fill(email);
    await this.loginPasswordInput.fill(pass);
  }

  async clickIngresarWithDialog(): Promise<string> {
    let message = '';
    const dialogPromise = new Promise<void>((resolve) => {
      this.page.once('dialog', async (dialog) => {
        message = dialog.message();
        await dialog.accept();
        resolve();
      });
    });
    await this.loginIngresarButton.click();
    await dialogPromise;
    return message;
  }

  async fillRegister(data: {
    nombre?: string;
    email?: string;
    telefono?: string;
    password?: string;
    confirmPassword?: string;
  }): Promise<void> {
    if (data.nombre !== undefined) await this.registerNombreInput.fill(data.nombre);
    if (data.email !== undefined) await this.registerEmailInput.fill(data.email);
    if (data.telefono !== undefined) await this.registerTelefonoInput.fill(data.telefono);
    if (data.password !== undefined) await this.registerPasswordInput.fill(data.password);
    if (data.confirmPassword !== undefined) await this.registerConfirmPasswordInput.fill(data.confirmPassword);
  }

  async clickRegistrarmeWithDialog(): Promise<string> {
    let message = '';
    const dialogPromise = new Promise<void>((resolve) => {
      this.page.once('dialog', async (dialog) => {
        message = dialog.message();
        await dialog.accept();
        resolve();
      });
    });
    await this.registerSubmitButton.click();
    await dialogPromise;
    return message;
  }
}
