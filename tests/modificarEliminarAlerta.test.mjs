
import test from 'node:test';
import assert from 'node:assert/strict';

// Simula una publicación y sus operaciones de persistencia.
// No se conecta a Firebase ni modifica datos reales.
function crearRepositorioPrueba(publicacionesIniciales = []) {
  const publicaciones = new Map(
    publicacionesIniciales.map((p) => [p.id, { ...p }])
  );

  return {
    async modificar(id, cambios) {
      if (!publicaciones.has(id)) {
        throw new Error('La publicación no existe.');
      }

      publicaciones.set(id, {
        ...publicaciones.get(id),
        ...cambios,
      });
    },

    async eliminar(id) {
      if (!publicaciones.has(id)) {
        throw new Error('La publicación no existe.');
      }

      publicaciones.delete(id);
    },

    obtener(id) {
      return publicaciones.get(id) ?? null;
    },
  };
}

test('modificar: actualiza los datos de una publicación', async () => {
  const repo = crearRepositorioPrueba([
    { id: 'test-1', nombre: 'Luna', descripcion: 'Perdida' },
  ]);

  await repo.modificar('test-1', {
    descripcion: 'Perdida en Pilar',
  });

  assert.deepEqual(repo.obtener('test-1'), {
    id: 'test-1',
    nombre: 'Luna',
    descripcion: 'Perdida en Pilar',
  });
});

test('modificar: conserva los campos que no se actualizaron', async () => {
  const repo = crearRepositorioPrueba([
    { id: 'test-1', nombre: 'Luna', estado: 'PERDIDO' },
  ]);

  await repo.modificar('test-1', { nombre: 'Luna actualizada' });

  assert.equal(repo.obtener('test-1').estado, 'PERDIDO');
});

test('eliminar: quita la publicación del repositorio', async () => {
  const repo = crearRepositorioPrueba([
    { id: 'test-1', nombre: 'Luna' },
  ]);

  await repo.eliminar('test-1');

  assert.equal(repo.obtener('test-1'), null);
});

test('eliminar: informa un error si la publicación no existe', async () => {
  const repo = crearRepositorioPrueba();

  await assert.rejects(
    repo.eliminar('inexistente'),
    { message: 'La publicación no existe.' }
  );
});
