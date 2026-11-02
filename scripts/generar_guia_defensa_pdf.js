const { chromium } = require('@playwright/test');
const fs = require('fs');
const path = require('path');

async function generarPdf() {
  console.log('Iniciando compilación del PDF de Defensa...');

  const templatePath = path.resolve(__dirname, 'guia_defensa_template.html');
  if (!fs.existsSync(templatePath)) {
    throw new Error(`No se encontró la plantilla en: ${templatePath}`);
  }

  const htmlContent = fs.readFileSync(templatePath, 'utf8');

  const browser = await chromium.launch();
  const page = await browser.newPage();

  await page.setContent(htmlContent, { waitUntil: 'load' });

  // Rutas de salida: Raíz del proyecto y docs/informes
  const rutaPdfRaiz = path.resolve(__dirname, '..', 'GUIA_DEFENSA_PROYECTO_PATITAS.pdf');
  const dirInformes = path.resolve(__dirname, '..', 'docs', 'informes');
  const rutaPdfDocs = path.resolve(dirInformes, 'GUIA_DEFENSA_PROYECTO_PATITAS.pdf');

  if (!fs.existsSync(dirInformes)) {
    fs.mkdirSync(dirInformes, { recursive: true });
  }

  await page.pdf({
    path: rutaPdfRaiz,
    format: 'A4',
    printBackground: true,
    margin: {
      top: '18mm',
      bottom: '20mm',
      left: '16mm',
      right: '16mm',
    },
    displayHeaderFooter: true,
    headerTemplate: '<div></div>',
    footerTemplate: `
      <div style="font-family: 'Segoe UI', Roboto, sans-serif; font-size: 8.5pt; color: #8D735C; width: 100%; display: flex; justify-content: space-between; padding: 0 16mm;">
        <span>🐾 Patitas Encontradas — Guía de Defensa Técnica</span>
        <span>Página <span class="pageNumber"></span> de <span class="totalPages"></span></span>
      </div>
    `,
  });

  fs.copyFileSync(rutaPdfRaiz, rutaPdfDocs);

  await browser.close();
  console.log('¡PDF generado exitosamente!');
  console.log('Ubicación 1 (Raíz):', rutaPdfRaiz);
  console.log('Ubicación 2 (Docs):', rutaPdfDocs);
}

generarPdf().catch((err) => {
  console.error('Error generando PDF:', err);
  process.exit(1);
});
