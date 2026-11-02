import { type Page, type Locator, expect } from '@playwright/test';

/**
 * Page Object Model para Centro de Ayuda y Soporte (RF-5, RNF-Usabilidad / A11y).
 * Implementado bajo Playwright TypeScript y Clean Architecture.
 */
export class SupportCenterPage {
  readonly page: Page;

  // Header y Pestañas
  readonly screenTitle: Locator;
  readonly tabFaqs: Locator;
  readonly tabTicket: Locator;

  // Chips de FAQs
  readonly chipTodas: Locator;
  readonly chipPublicaciones: Locator;
  readonly chipMapa: Locator;
  readonly chipAvistamientos: Locator;
  readonly chipCuenta: Locator;

  // Formulario de Ticket
  readonly ticketNombreInput: Locator;
  readonly ticketEmailInput: Locator;
  readonly ticketTituloInput: Locator;
  readonly ticketDescripcionInput: Locator;
  readonly ticketSubmitButton: Locator;

  // Mensajes de error en caliente
  readonly errorNombreRequired: Locator;
  readonly errorEmailRequired: Locator;
  readonly errorTituloRequired: Locator;
  readonly errorDescripcionCorta: Locator;

  constructor(page: Page) {
    this.page = page;

    // Header y pestañas
    this.screenTitle = page.getByText('Centro de Ayuda');
    this.tabFaqs = page.getByRole('tab', { name: /Preguntas Frecuentes/i });
    this.tabTicket = page.getByRole('tab', { name: /Generar Ticket/i });

    // Chips FAQ
    this.chipTodas = page.getByRole('button', { name: /categoría Todas/i });
    this.chipPublicaciones = page.getByRole('button', { name: /categoría Publicaciones/i });
    this.chipMapa = page.getByRole('button', { name: /categoría Mapa/i });
    this.chipAvistamientos = page.getByRole('button', { name: /categoría Avistamientos/i });
    this.chipCuenta = page.getByRole('button', { name: /categoría Cuenta/i });

    // Ticket Form
    this.ticketNombreInput = page.getByPlaceholder('Ej: Juan Pérez');
    this.ticketEmailInput = page.getByPlaceholder('tu-correo@ejemplo.com');
    this.ticketTituloInput = page.getByPlaceholder(/No se cargan las fotos/i);
    this.ticketDescripcionInput = page.getByPlaceholder(/Explicá lo sucedido con el mayor detalle posible/i);
    this.ticketSubmitButton = page.getByRole('button', { name: /Enviar Ticket a Soporte/i });

    // Errores en caliente
    this.errorNombreRequired = page.getByText('El nombre de contacto es obligatorio.');
    this.errorEmailRequired = page.getByText('El correo de contacto es obligatorio.');
    this.errorTituloRequired = page.getByText('El título o asunto es obligatorio.');
    this.errorDescripcionCorta = page.getByText('Explicá lo sucedido con más detalle (mínimo 15 caracteres).');
  }

  async gotoSupport(): Promise<void> {
    await this.page.goto('/reporte_error');
    await this.page.waitForLoadState('domcontentloaded');
  }

  async switchTab(tab: 'FAQS' | 'TICKET'): Promise<void> {
    if (tab === 'FAQS') {
      await this.tabFaqs.click();
    } else {
      await this.tabTicket.click();
    }
  }

  async selectCategory(cat: 'Todas' | 'Publicaciones' | 'Mapa' | 'Avistamientos' | 'Cuenta'): Promise<void> {
    const chipMap: Record<string, Locator> = {
      Todas: this.chipTodas,
      Publicaciones: this.chipPublicaciones,
      Mapa: this.chipMapa,
      Avistamientos: this.chipAvistamientos,
      Cuenta: this.chipCuenta,
    };
    await chipMap[cat].click();
  }

  async expandFirstFaq(): Promise<{ pregunta: string; respuesta: Locator }> {
    const firstAccordionHeader = this.page.getByRole('button', { name: /^Pregunta:/i }).first();
    const preguntaTexto = await firstAccordionHeader.innerText();
    await firstAccordionHeader.click();
    const expandedButton = this.page.getByRole('button', { name: /Toca para colapsar/i });
    return { pregunta: preguntaTexto, respuesta: expandedButton };
  }

  async triggerHotValidation(): Promise<void> {
    // Al presionar enviar sin completar campos obligatorios, se marcan como tocados y aparecen los mensajes
    await this.ticketSubmitButton.click();
  }

  async measureElementHeight(locator: Locator): Promise<number> {
    const box = await locator.boundingBox();
    if (!box) {
      throw new Error('Element boundingBox was null');
    }
    return box.height;
  }
}
