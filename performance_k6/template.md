# 🧪 Teste de Performance com k6 (Template)

---

# 📌 1. Objetivo

Avaliar o desempenho do sistema sob carga, validando tempo de resposta, taxa de erro e comportamento em diferentes cenários.

---

# 🌐 2. Configuração base

```javascript
import http from 'k6/http';
import { check, sleep } from 'k6';

const BASE_URL = 'https://api.exemplo.com';
```

---

# ⚙️ 3. Configuração de carga

```javascript
export const options = {
  vus: 10,
  duration: '30s',
};
```

---

## 🧠 Interpretação

* vus → usuários simultâneos
* duration → tempo total do teste

---

# 🔄 4. Dados dinâmicos

```javascript
const termosValidos = ['mercado', 'credito', 'investimento'];
const termosInvalidos = ['teste123', 'abcxyz'];

function getRandom(arr) {
  return arr[Math.floor(Math.random() * arr.length)];
}
```

---

## 🧠 Interpretação

Simula entradas diferentes de usuários de forma aleatória.

---

# 🚀 5. Cenários

---

## 🟢 Busca válida

```javascript
function buscaValida() {
  const termo = getRandom(termosValidos);

  const res = http.get(`${BASE_URL}/posts?search=${termo}`);

  check(res, {
    'status 200': (r) => r.status === 200,
    'tem resultados': (r) => JSON.parse(r.body).length > 0,
    'tempo < 2000ms': (r) => r.timings.duration < 2000,
  });
}
```

---

## 🔴 Busca inválida

```javascript
function buscaInvalida() {
  const termo = getRandom(termosInvalidos);

  const res = http.get(`${BASE_URL}/posts?search=${termo}`);

  check(res, {
    'status 200': (r) => r.status === 200,
    'lista vazia': (r) => JSON.parse(r.body).length === 0,
    'tempo < 2000ms': (r) => r.timings.duration < 2000,
  });
}
```

---

## 🟡 Busca vazia

```javascript
function buscaVazia() {
  const res = http.get(`${BASE_URL}/posts`);

  check(res, {
    'status 200': (r) => r.status === 200,
    'tem dados': (r) => JSON.parse(r.body).length > 0,
    'tempo < 2000ms': (r) => r.timings.duration < 2000,
  });
}
```

---

# 🔁 6. Execução principal

```javascript
export default function () {
  buscaValida();
  sleep(Math.random() * 2 + 1);

  buscaInvalida();
  sleep(Math.random() * 2 + 1);

  buscaVazia();
  sleep(Math.random() * 2 + 1);
}
```

---

## 🧠 Think Time

```javascript
sleep(Math.random() * 2 + 1);
```

Simula espera entre **1s e 3s**

---

# 📊 7. Métricas observadas

* http_req_duration
* http_req_failed
* checks

---

# 🧠 Interpretação

* duração → tempo de resposta
* failed → erros
* checks → validações

---

# 🎯 8. Análise

Avaliar:

* estabilidade
* variação de tempo
* diferenças entre cenários
* presença de picos

---

# 🎯 9. Conclusão

Descrever:

* sistema suportou a carga?
* existem gargalos?
* comportamento esperado?

---

# 🔄 10. Paralelo com JMeter

| k6     | JMeter    |
| ------ | --------- |
| vus    | threads   |
| sleep  | timer     |
| check  | assertion |
| código | interface |

---

# 🚀 11. Próximos passos

* aumentar carga
* adicionar autenticação
* testar novos endpoints

---
