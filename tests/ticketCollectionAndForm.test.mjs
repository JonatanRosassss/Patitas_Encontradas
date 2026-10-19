import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import path from 'node:path';

const projectRoot = process.cwd();

// ============================================================================
// 1. CONTRACTS CHECK (types/Ticket.ts)
// ============================================================================

test('contracts: Ticket.ts defines TicketSoporte, TipoTicket and EstadoTicket', () => {
  const filePath = path.join(projectRoot, 'types', 'Ticket.ts');
  assert.ok(fs.existsSync(filePath), 'types/Ticket.ts must exist');

  const content = fs.readFileSync(filePath, 'utf8');

  assert.ok(content.includes('export type TipoTicket'), 'Must export TipoTicket');
  assert.ok(content.includes('export type EstadoTicket'), 'Must export EstadoTicket');
  assert.ok(content.includes('export interface TicketSoporte'), 'Must export TicketSoporte');
  assert.ok(content.includes('export type NuevoTicketInput'), 'Must export NuevoTicketInput');

  // Verify Firestore collection fields in contract
  assert.ok(content.includes('id: string'), 'TicketSoporte must have id: string');
  assert.ok(content.includes('usuarioId: string | null'), 'TicketSoporte must have usuarioId');
  assert.ok(content.includes('emailContacto: string'), 'TicketSoporte must have emailContacto');
  assert.ok(content.includes('tipoProblema: TipoTicket'), 'TicketSoporte must have tipoProblema');
  assert.ok(content.includes('estado: EstadoTicket'), 'TicketSoporte must have estado');
  assert.ok(content.includes('fechaCreacion: string'), 'TicketSoporte must have fechaCreacion');
});

// ============================================================================
// 2. SERVICE LAYER CHECK (services/soporteService.ts)
// ============================================================================

test('service: soporteService.ts uses ConexionFirebase singleton and target collection tickets_soporte', () => {
  const filePath = path.join(projectRoot, 'services', 'soporteService.ts');
  assert.ok(fs.existsSync(filePath), 'services/soporteService.ts must exist');

  const content = fs.readFileSync(filePath, 'utf8');

  // Must use ConexionFirebase singleton
  assert.ok(
    content.includes("from '@/services/ConexionFirebase'"),
    'Must import ConexionFirebase singleton'
  );
  assert.ok(
    content.includes('ConexionFirebase.obtenerFirestore()'),
    'Must obtain Firestore through ConexionFirebase singleton'
  );

  // Must target tickets_soporte collection
  assert.ok(
    content.includes("'tickets_soporte'"),
    'Must define tickets_soporte as collection'
  );

  // Must export enviarTicketSoporte
  assert.ok(
    content.includes('export async function enviarTicketSoporte'),
    'Must export enviarTicketSoporte'
  );

  // Check no console.log
  assert.ok(
    !content.includes('console.log'),
    'soporteService.ts must NOT contain console.log'
  );
});

// ============================================================================
// 3. UI FORM CHECK (components/soporte/TicketForm.tsx)
// ============================================================================

test('form: TicketForm.tsx implements live validation, reason selector, ActivityIndicator and Modal', () => {
  const filePath = path.join(projectRoot, 'components', 'soporte', 'TicketForm.tsx');
  assert.ok(fs.existsSync(filePath), 'components/soporte/TicketForm.tsx must exist');

  const content = fs.readFileSync(filePath, 'utf8');

  // Check for live validation presence
  assert.ok(
    content.includes('error') || content.includes('Error'),
    'Must contain error validation tracking'
  );

  // Check for reason selector (TipoTicket)
  assert.ok(
    content.includes('ERROR_TECNICO') &&
    content.includes('PROBLEMA_MAPA') &&
    content.includes('REPORTE_FALSO') &&
    content.includes('CONSULTA_GENERAL') &&
    content.includes('OTRO'),
    'Must support selecting from all TipoTicket options'
  );

  // Check for ActivityIndicator loading state
  assert.ok(
    content.includes('ActivityIndicator'),
    'Must include ActivityIndicator during submission'
  );

  // Check for Modal with generated ticket code
  assert.ok(
    content.includes('<Modal'),
    'Must render a native Modal for success announcement'
  );
  assert.ok(
    content.includes('ticketGeneradoId') || content.includes('codigo'),
    'Modal must display generated ticket identifier'
  );

  // Check zero any
  const anyMatches = content.match(/:\s*any\b/g) || [];
  assert.equal(
    anyMatches.length,
    0,
    `Found "any" types in TicketForm: ${anyMatches.length}`
  );

  // Check zero console.log
  assert.ok(
    !content.includes('console.log'),
    'TicketForm.tsx must NOT contain console.log'
  );

  // Check zero hardcoded hex colors
  const hexMatches = content.match(/#[0-9a-fA-F]{3,8}\b/g) || [];
  assert.equal(
    hexMatches.length,
    0,
    `Found hardcoded hex colors in TicketForm: ${hexMatches.join(', ')}`
  );
});
