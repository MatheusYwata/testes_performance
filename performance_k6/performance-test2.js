// Dados dinâmicos

import http from 'k6/http';
import { check, sleep } from 'k6';

const BASE_URL = 'https://blog.agibank.com.br/wp-json/wp/v2/posts';

const TERMOS = [
  'mercado',
  'credito',
  'investimento',
  'financas',
  'seguro',
  'asdasd123',
  '',
];

export const options = {
  scenarios: {
    busca_valida: {
      executor: 'constant-vus',
      vus: 3,
      duration: '20s',
      exec: 'buscaValida',
    },

    busca_invalida: {
      executor: 'constant-vus',
      vus: 2,
      duration: '20s',
      exec: 'buscaInvalida',
    },

    busca_vazia: {
      executor: 'constant-vus',
      vus: 1,
      duration: '20s',
      exec: 'buscaVazia',
    },

    busca_dinamica: {
      executor: 'constant-vus',
      vus: 4,
      duration: '20s',
      exec: 'buscaDinamica',
    },
  },

  thresholds: {
    http_req_duration: ['p(95)<2000'],
    http_req_failed: ['rate<0.01'],
  },
};

export function buscaValida() {
  const res = http.get(`${BASE_URL}?search=mercado`);

  check(res, {
    'status 200 (valida)': (r) => r.status === 200,
    'retorna resultados': (r) => JSON.parse(r.body).length > 0,
  });

  sleep(1);
}

export function buscaInvalida() {
  const res = http.get(`${BASE_URL}?search=xxxx`);

  check(res, {
    'status 200 (invalida)': (r) => r.status === 200,
    'sem resultados': (r) => JSON.parse(r.body).length === 0,
  });

  sleep(1);
}

export function buscaVazia() {
  const res = http.get(`${BASE_URL}?search=`);

  check(res, {
    'status 200 (vazio)': (r) => r.status === 200,
  });

  sleep(1);
}

export function buscaDinamica() {
  const termo = TERMOS[Math.random() * TERMOS.length | 0];

  const res = http.get(`${BASE_URL}?search=${termo}`);

  check(res, {
    'status 200 (dinamica)': (r) => r.status === 200,
  });

  sleep(1);
}