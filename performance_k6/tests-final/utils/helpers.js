import { check } from 'k6';

export function validarResposta(res, tipo) {
  return check(res, {
    [`status 200 (${tipo})`]: (r) => r.status === 200,
  });
}