# 🚀 Testes de Performance – Guia de Estudos

Este repositório contém meus estudos práticos sobre testes de performance, utilizando inicialmente k6 e posteriormente JMeter.

O objetivo é consolidar conhecimento teórico e prático, servindo como material de consulta rápida.

---

# 🧠 O que é teste de performance?

Teste de performance avalia como um sistema se comporta sob diferentes níveis de carga.

Principais pontos analisados:

* Tempo de resposta
* Estabilidade
* Taxa de erro
* Comportamento sob carga

---

# 🎯 Tipos de teste

## 🔹 Teste de carga

Simula usuários reais acessando o sistema.

👉 Objetivo: validar comportamento em uso normal

---

## 🔹 Teste de stress

Leva o sistema ao limite.

👉 Objetivo: descobrir quando ele quebra

---

## 🔹 Teste de pico

Aumenta usuários rapidamente.

👉 Objetivo: ver como o sistema reage a picos

---

# ⚡ k6 – Fundamentos

## 📌 O que é k6?

Ferramenta de teste de performance baseada em JavaScript.

---

## 🧱 Estrutura básica de um teste

```js
import http from 'k6/http';
import { check, sleep } from 'k6';

export const options = {
  vus: 10,
  duration: '10s',
};

export default function () {
  let res = http.get('https://exemplo.com');

  check(res, {
    'status 200': (r) => r.status === 200,
  });

  sleep(1);
}
```

---

# 🧠 Conceitos importantes (k6)

## 👥 vus (Virtual Users)

Quantidade de usuários simultâneos

---

## ⏱ duration

Tempo total do teste

---

## 🔁 default function

Define o comportamento de cada usuário

---

## ✅ check

Valida respostas

---

## 😴 sleep

Simula tempo de espera do usuário

---

# 🔥 Evolução dos testes

## 📈 Teste com carga progressiva

```js
stages: [
  { duration: '10s', target: 10 },
  { duration: '20s', target: 30 },
  { duration: '10s', target: 0 },
]
```
💥 O que isso faz
* começa com poucos usuários
* aumenta gradualmente
* depois reduz

👉 💥 isso é teste de carga real

---

## ⏱ Validar tempo de resposta
```js
check(res, {
  'status é 200': (r) => r.status === 200,
  'tempo < 2s': (r) => r.timings.duration < 2000,
});
```
Antes você só validava:

👉 “funcionou”

Agora queremos:

👉 “funcionou rápido”

---

## 🎯 Thresholds (regras de performance)

```js
thresholds: {
  http_req_duration: ['p(95)<2000'],
  http_req_failed: ['rate<0.01'],
}
```

## 🧠 Explicação

* p(95) → 95% das requisições
* <2000 → devem responder em menos de 2 segundos

💥 Tradução:
* 95% das requisições < 2s
* menos de 1% pode falhar

👉 💥 isso é SLA básico

---

## Validar respostas corretamente


# 📊 Métricas importantes

## ⏱ http_req_duration

Tempo de resposta

## ❌ http_req_failed

Taxa de erro

## 📦 data_received

Quantidade de dados recebidos

---
#### Certo, agora vamos evoluir para múltiplos cenários:

💥 múltiplos cenários = simular usuários diferentes fazendo coisas diferentes

🧠 Antes de código: entenda o conceito

#### Até agora você tinha:

👉 todos usuários fazendo a mesma coisa

#### Agora você vai ter:

👉 usuários fazendo coisas diferentes ao mesmo tempo

## 🎯 Exemplo real

No seu sistema:

usuário 1 → busca válida
usuário 2 → busca inválida
usuário 3 → busca sem resultado

💥 isso é comportamento real

COMO FAZER ISSO NO k6

Você usa:

* cenários (scenarios)

#### PASSO 1 — Estrutura base com cenários

```js
export const options = {
  scenarios: {
    nome_do_cenario: {
      executor: 'constant-vus',
      vus: 5,
      duration: '30s',
      exec: 'funcaoQueVaiRodar',
    },
  },
};
```

🧠 Tradução
executor → tipo de execução
vus → quantos usuários
exec → qual função roda

#### PASSO 2 — Criando seus cenários

```js
import http from 'k6/http';
import { check, sleep } from 'k6';

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
```

* Aqui os termos das buscas dos cenários são colocados em query params na URL

No teste estamos chamando uma API:
```js
http.get('https://blog.agibank.com.br/wp-json/wp/v2/posts?search=mercado')
```
👉 o que muda o comportamento é:

💥 o valor do `search=`


Outra forma mais organizada de fazer:
```js
const BASE_URL = 'https://blog.agibank.com.br/wp-json/wp/v2/posts';

const TERM_VALIDO = 'mercado';
const TERM_INVALIDO = 'xxxxxxxx';
const TERM_VAZIO = '';
```

e nos cenários:
```js
http.get(`${BASE_URL}?search=${TERM_VALIDO}`);
```
---

* Mas e se cada usuário fizer uma busca diferente?
💥 até agora: todos usuários fazem a mesma busca
💥 agora: cada usuário faz uma busca diferente (igual mundo real)

Agora queremos:

👉 usuário 1 → mercado
👉 usuário 2 → crédito
👉 usuário 3 → investimento
👉 usuário 4 → qualquer coisa

💥 isso é dados dinâmicos

Vamos para o arquivo [performance-test1.js](performance-test1.js) aprender sobre dados dinâmicos

#### 🚀 PASSO 1 — Criar lista de termos
```js
const BASE_URL = 'https://blog.agibank.com.br/wp-json/wp/v2/posts';

const TERMOS = [
  'mercado',
  'credito',
  'investimento',
  'financas',
  'seguro',
  'asdasd123', // inválido
  '',          // vazio
];
```
#### 🚀 PASSO 2 — escolher um termo automaticamente
Dentro da função:
```js
const termo = TERMOS[Math.floor(Math.random() * TERMOS.length)];
```
🧠 Explicação simples

👉 o k6 vai:

pegar um termo aleatório
a cada execução

💥 simula comportamento real

#### 🚀 PASSO 3 — usar no request

```js
const res = http.get(`${BASE_URL}?search=${termo}`);
```
💥 O que você acabou de fazer

Antes:
👉 teste repetitivo

Agora:
👉 💥 simulação real de usuários


 🧠 Agora o pulo do gato (nível QA)
Você pode validar diferente dependendo do termo

#### 🚀 PASSO 4 — comportamento inteligente
```js
check(res, {
  'status 200': (r) => r.status === 200,

  'retorna resultado quando válido': (r) => {
    if (termo === 'asdasd123') return true;
    if (termo === '') return true;

    return JSON.parse(r.body).length > 0;
  },
});
```

Porém somente o dinâmico não garante que serão testados todos os dados (válidos e inválidos).
Por isso o ideal é mesclar `cenários controlados + dados dinâmicos`

Vamos exemplificar no [performance-test2.js](performance-test2.js):

Você cria cenários separados para garantir cobertura:
```js
scenarios: {
  valido: { exec: 'buscaValida', ... },
  invalido: { exec: 'buscaInvalida', ... },
  dinamico: { exec: 'buscaDinamica', ... },
  vazio: {exec: 'buscaVazia', ... },
}
```
Exemplo:

```js
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
};
```
Funções:
```js

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

  let res = http.get(`${BASE_URL}?search=${termo}`);

  check(res, {
    'status 200 (dinamica)': (r) => r.status === 200,
  });

  sleep(1);
}
```

O padrão deve sempre ser:
```js
const res = http.get(...);

check(res, {
  'alguma validação': (r) => ...
});

sleep(1);
```

Isso é `obrigatório`em TODO cenário

🎯 Outro ponto importante

Se você estiver na dúvida, use esse checklist:

✔ tem request?
✔ tem validação?
✔ tem sleep?

👉 se faltar algo → tem problema

---
# Estrutura

#### Podemos fazer um paralelo com Robot para facilitar o entendimento:

| k6             | Robot                |
| -------------- | -------------------- |
| import         | Library              |
| const          | Variables            |
| options        | Settings             |
| scenarios      | Test Cases           |
| function       | Keywords             |
| setup/teardown | Suite Setup/Teardown |

#### 💻 Estrutura completa

```js
// 1. IMPORTS
import http from 'k6/http';
import { check, sleep } from 'k6';


// 2. VARIÁVEIS (CONFIG/DADOS)
const BASE_URL = 'https://...';
const TERMOS = ['mercado', 'credito'];


// 3. CONFIGURAÇÃO (SETTINGS)
export const options = {
// TEST CASES 
  scenarios: {
    busca_valida: {
      executor: 'constant-vus',
      vus: 5,
      duration: '30s',
      exec: 'buscaValida',
    },
  },
};


// 4. SETUP (opcional)
export function setup() {
  console.log('setup geral');
}


// 5. TESTES (KEYWORDS)
export function buscaValida() {
  const res = http.get(`${BASE_URL}?search=mercado`);

  check(res, {
    'status 200': (r) => r.status === 200,
  });

  sleep(1);
}


// 6. TEARDOWN (opcional)
export function teardown() {
  console.log('finalizando');
}
```

🧠 Agora traduzindo pra Robot

```bash
*** Settings ***
Library    SeleniumLibrary

*** Variables ***
${BASE_URL}    https://...

*** Test Cases ***
Busca válida
    Busca Valida

*** Keywords ***
Busca Valida
    # lógica aqui
```

🎯 Regra prática pra você agora

👉 sempre começa com:
```js
import http from 'k6/http';
import { check, sleep } from 'k6';
```
💥 esse `import` resolve 90% dos casos 

####  Resumo final (guarda isso):

IMPORTS → bibliotecas
CONST → dados
OPTIONS → configuração
SCENARIOS → execução
FUNCTIONS → lógica

---

# Agora o refinamento final:

#### Vamos pegar seu k6 e deixar com cara de projeto real de empresa
Com:
✔ modularização
✔ setup / teardown
✔ separação de responsabilidades

#### 🧠 COMO PENSAR (igual Robot)

Você tem no Robot:

resource (reutilizável)
test cases
keywords

👉 vamos fazer isso no k6

#### 🚀 ESTRUTURA FINAL (recomendada)

```bash
performance-tests/
│
├── config/
│   └── config.js
│
├── data/
│   └── searchData.js
│
├── scenarios/
│   └── searchScenarios.js
│
├── utils/
│   └── helpers.js
│
├── performance-test.js
└── README.md
```

| Pasta     | Equivalente Robot |
| --------- | ----------------- |
| config    | settings          |
| data      | variables         |
| scenarios | test cases        |
| utils     | keywords          |
| main file | suite             |

#### 🧠 AGORA VAMOS DESMEMBRAR (PASSO A PASSO)

Vou pegar seu código e mostrar pra onde cada coisa vai

##### 🔥 1. IMPORTS
Antes:
```js
import http from 'k6/http';
import { check, sleep } from 'k6';
```
Depois:

👉 ficam espalhados onde precisam

* http → scenarios
* check → utils
* sleep → scenarios

##### 🔥 2. CONST (dados)
Antes:
```js
const BASE_URL = '...';

const TERMOS = [...];
```

Depois:

👉 vão pra pasta data:
```js
// data/searchData.js
export const BASE_URL = '...';

export const TERMOS = [...]
```
🧠 Por quê?

👉 isso é igual:
```bash
</> robot
*** Variables ***
```
##### 🔥 3. OPTIONS
Antes:
```js
export const options = { ... }
```
Depois:

👉 vai pra config
```js
// config/config.js
export const options = { ... }
```
🧠 Por quê?

👉 isso é “configuração global”

##### 🔥 4. FUNÇÕES (cenários)
Antes:
```js
export function buscaValida() { ... }
```
Depois:

👉 vão pra scenarios
```js
// scenarios/searchScenarios.js
export function buscaValida() { ... }
```
🧠 Por quê?

👉 isso é:
```bash
</> robot
*** Keywords ***
```
##### 🔥 5. CHECK (validação)
Antes:
```js
check(res, {...})
```
Depois:

👉 pode virar função reutilizável
```js
// utils/helpers.js
export function validarStatus(res, tipo) {
  return check(res, {
    [`status 200 (${tipo})`]: (r) => r.status === 200,
  });
}
```
👉 evita repetir código

##### 🔥 6. ARQUIVO PRINCIPAL
```js
// performance-test.js
import { options } from './config/config.js';
import { buscaValida, buscaInvalida } from './scenarios/searchScenarios.js';

export { options };
export { buscaValida, buscaInvalida };
```
🧠 O QUE ESSE ARQUIVO FAZ

👉 junta tudo

👉 é tipo:
```bash
</> robot
*** Test Suite ***
```
##### Após separar:

config → options
data → variáveis
scenarios → funções
utils → validações
main → junta tudo

---
# Explicando termos

🧠 O que é res

💥 res = response (resposta da API)

```js
const res = http.get('https://...');
```
##### 👉 isso significa:

“faz a requisição e guarda a resposta em res”

##### 🧠 Analogia simples

Imagina:

* você faz um pedido no iFood 🍔
* o restaurante te entrega

👉 o que chega é a response

💥 isso é o `res`

🎯 O que tem dentro do res

Ele é um objeto com várias informações 👇

🔹 1. Status
```js
res.status
```
exemplo:
```js
200 → sucesso  
404 → não encontrado  
500 → erro servidor
```
🔹 2. Body (conteúdo)
```js
res.body
```
exemplo:
```js
[
  { "title": "Post 1" }
]
```
🔹 3. Tempo de resposta
```js
res.timings.duration
```
👉 quanto tempo levou (ms)
🔹 4. Headers (menos usado agora)
```js
res.headers
```
Exemplo real:
```js
const res = http.get('https://api...');

console.log(res.status);      // 200
console.log(res.body);        // dados
console.log(res.timings.duration); // tempo
```
🧠 Onde você usa isso
✔ validação
```js
check(res, {
  'status 200': (r) => r.status === 200,
});
```
✔ validar conteúdo
```js
JSON.parse(res.body)
```
✔ validar performance
```js
r.timings.duration < 2000
```
💥 Tradução final
| Nome    | Significado     |
| ------- | --------------- |
| res     | resposta da API |
| status  | código HTTP     |
| body    | conteúdo        |
| timings | tempo           |


E o `r` dentro do check?

🧠 Vamos separar as duas coisas
🔹 1. res (sua variável)
```js
const res = http.get(...)
```
👉 você que escolheu o nome
👉 poderia ser:
```js
const r = http.get(...) ✔
const response = http.get(...) ✔
const qualquerCoisa = http.get(...) ✔
```
🔹 2. r dentro do check
```js
check(res, {
  'status 200': (r) => r.status === 200,
});
```
👉 aqui o r é:

💥 o parâmetro da função

```js
(r) => r.status === 200
```
significa:

👉 “para cada resposta (res), chame de r aqui dentro”

o (r) apenas cria uma nova variável r nessa função que estamos criando

Ex equivalente que funciona igual:

```js
check(res, {
  'status 200': (response) => response.status === 200,
});
```
| Lugar | O que é                             |
| ----- | ----------------------------------- |
| `res` | variável principal                  |
| `r`   | apelido temporário dentro da função |

🚀 Pode trocar tudo pra r?

Sim:
✔ funciona
✔ mas não é o ideal

⚠️ Melhor prática
👉 use nomes diferentes pra evitar confusão

🧠 Por quê?
👉 fica mais claro:

res = resposta principal
r = usado dentro do check

💥 Insight importante

💥 r no check é tipo variável temporária (escopo local)

E nesse exemplo com 2 (r)? :
```js
check(res, {
    'status 200 (valida)': (r) => r.status === 200,
    'retorna resultados': (r) => JSON.parse(r.body).length > 0,
  });
```

O que temos aqui na verdade são duas funções independentes, logo os valores de (r) são únicos dentro de cada função e valem somente dentro dela.
```
👉 cada linha é uma função independente
👉 cada função tem seu próprio (r), são escopos diferentes
👉 Poderiam ser usados nomes diferentes, mas não é a prática comum
```

Poderia ser reescrito assim de forma mais esmiuçada:
```js
check(res, {
  'status 200 (valida)': function (r) {
    return r.status === 200;
  },

  'retorna resultados': function (r) {
    return JSON.parse(r.body).length > 0;
  },
});
```

---
## Seguindo a interpretação dos resultados 

#### 🧠 1. O QUE É O OUTPUT DO k6

Quando você roda:
```js
k6 run performance-test.js
```
👉 ele mostra um relatório no terminal

Ex:
```js
http_req_duration....: avg=500ms min=100ms max=2000ms p(95)=1200ms
http_req_failed......: 0.00%
vus..................: 10
iterations...........: 300
```
🎯 Agora vamos traduzir IGUAL fizemos com res

##### ⏱ 1. http_req_duration

🔹 No código
```js
r.timings.duration
```
🔹 No k6 output
```js
http_req_duration
```
🧠 Significa

💥 tempo de resposta da API

Interpretação
| Valor   | Significado  |
| ------- | ------------ |
| 100ms   | excelente 🚀 |
| 500ms   | bom 👍       |
| 2000ms  | limite ⚠️    |
| >3000ms | ruim ❌       |

💥 Ligação direta
```js
r.timings.duration  →  http_req_duration
```
📊 p(95)
🔹 No output
```js
p(95)=1200ms
```
🧠 Significa:
- 95% das requisições foram mais rápidas que isso

🎯 Interpretação:
Se:
```js
p(95)=1200ms
```
👉 significa:

95% foram rápidas
5% podem ser lentas

💥 Ligação com seu threshold
```js
p(95) < 2000
```
👉 você está dizendo:

“quero que quase todas sejam rápidas”

---

❌ http_req_failed
🔹 No código
```js
check(...)
```
🔹 No output
```js
http_req_failed: 0.00%
```
🧠 Significa:
- porcentagem de erros

🎯 Interpretação:
| Valor | Significado        |
| ----- | ------------------ |
| 0%    | perfeito ✔         |
| <1%   | aceitável ✔        |
| >5%   | problema ⚠️        |
| alto  | sistema instável ❌ |

💥 Ligação
```js
check() falha → aumenta http_req_failed
```
---

👥 vus (Virtual Users)
🔹 No código
```js
vus: 10
```
🔹 No output
```js
vus: 10
```

🧠 Significa:
- usuários simultâneos

🎯 Interpretação:
- quantas pessoas estavam usando o sistema

---

🔁 iterations
🔹 No código
```js
default function () { ... }
```
🔹 No output
```js
iterations: 300
```
🧠 Significa
- quantas vezes o teste rodou

🎯 Interpretação
- volume total de requisições

---

💥 COMO ANALISAR UM TESTE (passo a passo)

Quando rodar, você olha:

1️⃣ Tempo

👉 está rápido?
```js
p(95) < 2000 ?
```

2️⃣ Erros

👉 falhou?
```js
http_req_failed > 0 ?
```

3️⃣ Estabilidade
👉 manteve comportamento?


🧠 **Frase de QA profissional**
“Avalio tempo de resposta, taxa de erro e consistência sob carga.”

---

# 📊 RESUMÃO


| k6 output         | JS (seu código)    | Significado |
| ----------------- | ------------------ | ----------- |
| http_req_duration | r.timings.duration | tempo       |
| http_req_failed   | check()            | erro        |
| vus               | options.vus        | usuários    |
| iterations        | execução           | volume      |
| p(95)             | threshold          | qualidade   |

## ⏱ Tempo de resposta

Representado por `http_req_duration`, indica quanto tempo a API leva para responder.

* p(95): tempo em que 95% das requisições foram atendidas



## ❌ Taxa de erro

Representado por `http_req_failed`, indica a porcentagem de falhas nas requisições.

* Ideal: próximo de 0%


## 👥 Usuários virtuais (VUs)

Quantidade de usuários simultâneos simulados durante o teste.



## 🔁 Iterações

Quantidade total de execuções realizadas durante o teste.



## 🎯 Interpretação geral

A análise deve considerar:

* Tempo de resposta dentro do esperado
* Baixa taxa de erro
* Comportamento estável sob carga


---

# 🧪 Boas práticas

* Não usar apenas status code
* Validar tempo de resposta
* Simular comportamento real (sleep)
* Testar diferentes cargas

---

# 📂 Estrutura do projeto

```
performance_k6/
  ├── performance-test.js
  └── README.md
```

---

# ▶️ Como executar

Após instalado o K6, basta executar:

```bash
k6 run nome-do-arquivo.js
```

 **NÃO PRECISA:**
- npm install ❌
- pip install ❌
- instalar dependência ❌

 Por quê?

Porque:
```js
import http from 'k6/http';
```

👉 isso já vem dentro do próprio k6

✔ não precisa reinstalar nada
✔ k6 é global
✔ só rodar o arquivo principal
✔ estrutura nova funciona normalmente

🧠 Regra simples:

| Ferramenta | Precisa instalar dependência? |
| ---------- | ----------------------------- |
| Playwright | ✔ sim                         |
| Robot      | ✔ sim                         |
| k6         | ❌ não                       |


🎯 Checklist rápido:

✔ k6 instalado
✔ arquivo principal correto
✔ caminhos de import corretos
✔ comando k6 run

---

### 🚀 Agora o mais importante

Você NÃO precisa decorar código

👉 você precisa entender isso:

quantos usuários (vus)
o que eles fazem (request)
quanto tempo leva (duration)
se é rápido o suficiente (threshold)

### 🎯 Resumo (guarda isso)

✔ performance = carga + tempo + estabilidade
✔ vus = usuários
✔ duration = tempo
✔ check = validação
✔ thresholds = regra de performance



---

# 🧪 JMeter (em breve)

## 📌 O que será estudado

* Thread Group
* HTTP Request
* Listeners
* Testes de carga e stress

---


