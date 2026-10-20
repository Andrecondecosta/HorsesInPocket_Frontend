// Configuração global do Jest (carregada automaticamente pelo react-scripts)
import '@testing-library/jest-dom';

beforeEach(() => {
  localStorage.clear();
});

afterEach(() => {
  vi.restoreAllMocks();
  delete global.fetch;
});
