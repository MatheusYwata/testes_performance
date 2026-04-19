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
  vus: 10,
  duration: '20s',

thresholds: {
    http_req_duration: ['p(95)<2000'],
    http_req_failed: ['rate<0.01'],
  },
};

export default function () {
  const termo = TERMOS[Math.floor(Math.random() * TERMOS.length)];

  const res = http.get(`${BASE_URL}?search=${termo}`);

  check(res, {
    'status 200': (r) => r.status === 200,
  });

  sleep(1);
}