import http from 'k6/http';
import { sleep } from 'k6';
import { BASE_URL, TERMOS } from '../data/searchData.js';
import { validarResposta } from '../utils/helpers.js';

export function buscaValida() {
  let res = http.get(`${BASE_URL}?search=mercado`);
  validarResposta(res, 'valida');
  sleep(1);
}

export function buscaDinamica() {
  const termo = TERMOS[Math.random() * TERMOS.length | 0];

  let res = http.get(`${BASE_URL}?search=${termo}`);
  validarResposta(res, 'dinamica');
  sleep(1);
}