import http from 'k6/http';
import { check, sleep } from 'k6';

//  🔥 VARIÁVEIS
const BASE_URL = 'https://blog.agibank.com.br/wp-json/wp/v2/posts';

const TERM_VALIDO = 'mercado';
const TERM_INVALIDO = 'xxxxxxxx';
const TERM_VAZIO = '';

// ⚙️ CONFIG
export const options = {
  scenarios: {
    busca_valida: {
      executor: 'constant-vus',
      vus: 5,
      duration: '30s',
      exec: 'buscaValida',
    },

    busca_invalida: {
      executor: 'constant-vus',
      vus: 3,
      duration: '30s',
      exec: 'buscaInvalida',
    },

    busca_sem_resultado: {
      executor: 'constant-vus',
      vus: 2,
      duration: '30s',
      exec: 'buscaSemResultado',
    },
  },

  thresholds: {
    http_req_duration: ['p(95)<2000'],
    http_req_failed: ['rate<0.01'],
  },
};


// 🔍 Cenário 1 — busca válida
export function buscaValida() {
  const res = http.get('https://blog.agibank.com.br/wp-json/wp/v2/posts?search=mercado');

  check(res, {
    'status 200 (valida)': (r) => r.status === 200,
    'retorna resultados': (r) => JSON.parse(r.body).length > 0,
  });

  sleep(1);
}


// ❌ Cenário 2 — busca inválida
export function buscaInvalida() {
  const res = http.get('https://blog.agibank.com.br/wp-json/wp/v2/posts?search=xxxxxxxx');

  check(res, {
    'status 200 (invalida)': (r) => r.status === 200,
    'sem resultados': (r) => JSON.parse(r.body).length === 0,
  });

  sleep(1);
}


// ⚠️ Cenário 3 — termo vazio
export function buscaSemResultado() {
  const res = http.get('https://blog.agibank.com.br/wp-json/wp/v2/posts?search=');

  check(res, {
    'status 200 (vazio)': (r) => r.status === 200,
  });

  sleep(1);
}