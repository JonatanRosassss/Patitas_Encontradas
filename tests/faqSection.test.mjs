import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import path from 'node:path';

const projectRoot = process.cwd();

// ============================================================================
// 1. DATASET VALIDATION (data/faqsData.ts)
// ============================================================================

test('faqsData: dataset file exists and contains exactly 9 contextualized questions', () => {
  const filePath = path.join(projectRoot, 'data', 'faqsData.ts');
  assert.ok(fs.existsSync(filePath), 'data/faqsData.ts must exist');

  const content = fs.readFileSync(filePath, 'utf8');

  // Verify exported symbol
  assert.ok(content.includes('export const PREGUNTAS_FRECUENTES'), 'Must export PREGUNTAS_FRECUENTES');

  // Extract FAQ items by id
  const faqIdMatches = content.match(/id:\s*['"]faq-\d+['"]/g) || [];
  assert.equal(
    faqIdMatches.length,
    9,
    `Must contain exactly 9 FAQs, found: ${faqIdMatches.length}`
  );
});

test('faqsData: covers all 4 required categories (PUBLICACIONES, MAPA, AVISTAMIENTOS, CUENTA)', () => {
  const filePath = path.join(projectRoot, 'data', 'faqsData.ts');
  const content = fs.readFileSync(filePath, 'utf8');

  const requiredCategories = ['PUBLICACIONES', 'MAPA', 'AVISTAMIENTOS', 'CUENTA'];
  for (const cat of requiredCategories) {
    const regex = new RegExp(`categoria:\\s*['"]${cat}['"]`, 'g');
    const matches = content.match(regex);
    assert.ok(
      matches && matches.length > 0,
      `Category ${cat} must be present in PREGUNTAS_FRECUENTES`
    );
  }
});

// ============================================================================
// 2. COMPONENT ARCHITECTURE & CONVENTIONS (components/soporte/FaqAccordion.tsx)
// ============================================================================

test('FaqAccordion: component file exists and satisfies mobile architecture rules', () => {
  const filePath = path.join(projectRoot, 'components', 'soporte', 'FaqAccordion.tsx');
  assert.ok(fs.existsSync(filePath), 'components/soporte/FaqAccordion.tsx must exist');

  const content = fs.readFileSync(filePath, 'utf8');

  // Check interface props
  assert.ok(
    content.includes('interface FaqAccordionProps'),
    'Component must define typed interface FaqAccordionProps'
  );

  // Check category chips presence
  assert.ok(
    content.includes('PUBLICACIONES') &&
    content.includes('MAPA') &&
    content.includes('AVISTAMIENTOS') &&
    content.includes('CUENTA'),
    'FaqAccordion must support filtering by the 4 categories'
  );

  // Check accessibility attributes
  assert.ok(
    content.includes('accessibilityRole="button"'),
    'FaqAccordion interactive elements must define accessibilityRole="button"'
  );
  assert.ok(
    content.includes('accessibilityState='),
    'Accordion headers must define accessibilityState with expanded'
  );

  // Check design system compliance
  assert.ok(
    content.includes("from '@/constants/theme'"),
    'Must import tokens from @/constants/theme'
  );

  // Check for hardcoded hex colors
  const hexMatches = content.match(/#[0-9a-fA-F]{3,8}\b/g) || [];
  assert.equal(
    hexMatches.length,
    0,
    `Found hardcoded hex colors in FaqAccordion: ${hexMatches.join(', ')}`
  );

  // Check zero console.log
  assert.ok(
    !content.includes('console.log'),
    'FaqAccordion must NOT contain console.log statements'
  );
});

// ============================================================================
// 3. INTEGRATION WITH SOPORTE SCREEN (app/(tabs)/reporte_error.tsx)
// ============================================================================

test('reporte_error screen: integrates FaqAccordion in tab switching', () => {
  const filePath = path.join(projectRoot, 'app', '(tabs)', 'reporte_error.tsx');
  assert.ok(fs.existsSync(filePath), 'app/(tabs)/reporte_error.tsx must exist');

  const content = fs.readFileSync(filePath, 'utf8');
  assert.ok(
    content.includes("import { FaqAccordion } from '@/components/soporte/FaqAccordion'"),
    'reporte_error.tsx must import FaqAccordion'
  );
  assert.ok(
    content.includes('<FaqAccordion'),
    'reporte_error.tsx must render <FaqAccordion'
  );
});
