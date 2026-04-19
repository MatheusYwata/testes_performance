# 🧪 Teste de Performance — Template Reutilizável

---

# 📌 1. Objetivo

Descrever o objetivo do teste de forma clara.

**Exemplo:**

Avaliar o desempenho da API de busca sob carga moderada, verificando tempo de resposta, estabilidade e comportamento em diferentes cenários de uso.

---

# 🌐 2. Sistema sob teste

* URL:
* Endpoint(s):
* Método(s):

**Exemplo:**

* https://api.exemplo.com
* GET /posts

---

# 🎯 3. Cenários de teste

Descrever os fluxos simulados.

---

## 🟢 Cenário 1 — [Nome]

* Descrição:
* Entrada:
* Resultado esperado:

---

## 🔴 Cenário 2 — [Nome]

* Descrição:
* Entrada:
* Resultado esperado:

---

## 🟡 Cenário 3 — [Nome]

* Descrição:
* Entrada:
* Resultado esperado:

---

# 🔄 4. Dados dinâmicos

## 📁 Arquivos utilizados

* dados_validos.csv
* dados_invalidos.csv

---

## 🧠 Estratégia

Separação de dados por cenário para evitar falsos positivos/negativos.

---

## 🔁 Uso

```text
${variavel}
```

---

# ⚙️ 5. Configuração de carga

* Usuários (threads/VUs):
* Ramp-up:
* Iterações/loops:

---

## 🧠 Interpretação

* Usuários simultâneos
* Tempo de subida
* Repetições por usuário

---

# ⏱️ 6. Think Time

* Tipo de Timer:
* Configuração:

---

## 🧠 Objetivo

Simular comportamento humano e evitar requisições contínuas irreais.

---

# ✔ 7. Validações (Assertions)

---

## 🔹 Status

* Esperado: 200

---

## 🔹 Estrutura (JSON)

* Exemplo:

```text
$[0]
```

---

## 🔹 Tempo

* Máximo aceitável:

---

## ⚠️ Observação

Evitar validações baseadas em texto fixo devido à variabilidade dos dados.

---

# 🧩 8. Estrutura do teste (JMeter)

```text
Thread Group
 ├── Controller (cenário 1)
 │     ├── CSV
 │     ├── HTTP Request
 │     ├── Assertions
 │
 ├── Controller (cenário 2)
 │     ├── CSV
 │     ├── HTTP Request
 │     ├── Assertions
```

---

# 📊 9. Resultados

| Cenário | Avg | Min | Max | Error % |
| ------- | --- | --- | --- | ------- |
|         |     |     |     |         |

---

# 🧠 10. Análise

Descrever o comportamento observado:

* estabilidade
* variação de tempo
* presença de erros
* diferenças entre cenários

---

# 🎯 11. Conclusão

Responder:

* sistema suporta a carga?
* há gargalos?
* comportamento esperado?

---

# 🚀 12. Próximos passos

* aumentar carga
* testar outros endpoints
* incluir autenticação
* rodar em ambiente controlado

---

# 🔄 13. Paralelo com k6 (opcional)

```js
// exemplo equivalente
```

---

## 🧠 Observação

Comparar abordagem declarativa (JMeter) vs programática (k6)

---
