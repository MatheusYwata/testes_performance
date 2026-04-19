export const options = {
  scenarios: {
    busca_valida: {
      executor: 'constant-vus',
      vus: 3,
      duration: '20s',
      exec: 'buscaValida',
    },
  },

  thresholds: {
    http_req_duration: ['p(95)<2000'],
  },
};