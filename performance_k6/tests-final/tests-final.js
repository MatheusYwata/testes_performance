import { options } from './config/config.js';
import { buscaValida, buscaDinamica } from './scenarios/searchScenarios.js';

export { options };
export { buscaValida, buscaDinamica };


//  setup
export function setup() {
  console.log('Iniciando testes');
}


//  teardown
export function teardown() {
  console.log('Finalizando testes');
} 