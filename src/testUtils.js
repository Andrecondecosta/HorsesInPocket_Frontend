// Utilitários partilhados pelos testes

// Simula uma resposta de fetch com status e corpo JSON
export const jsonResponse = (status, body = {}) =>
  Promise.resolve({
    ok: status >= 200 && status < 300,
    status,
    json: () => Promise.resolve(body),
  });
