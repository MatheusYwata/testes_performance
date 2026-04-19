# 🧪 Testes de Performance com JMeter

## 📌 Objetivo

Este material tem como objetivo servir como referência de estudo para testes de performance utilizando JMeter, permitindo compreender não apenas o uso da ferramenta, mas também o raciocínio por trás dos testes.

---

# 🧠 Conceito Geral

O JMeter é uma ferramenta baseada em interface gráfica para simulação de carga.

Ele funciona através de uma estrutura de componentes que representam o comportamento de usuários reais:


* **Test Plan** → estrutura principal do teste
* **Thread Group** → simula usuários
* **HTTP Request** → realiza requisições
* **Assertions** → validações
* **Listener** → exibe resultados

---

🔹 Estrutura mental do JMeter

|   Componente	|  Função            |
| --------------| -------------------|
|  Test Plan	|  Projeto do teste  |
|Thread Group	|Usuários virtuais|
|HTTP Request   |	Ação do usuário|
|Assertions	    |Validação|
|Listener	    |Resultado|

---

# 🔄 Paralelo com k6

| JMeter       | k6                |
| ------------ | ----------------- |
| Thread Group | VUs               |
| HTTP Request |  http.get()       |
| Assertions   | check()           |
| Listener     | output            |
| JSON Assertion | JSON.parse() |
| Test Plan    | arquivo principal |

---

# 🚀 Criação do teste (Passo a passo)

Arquivo `C:\JMeter\Estudo\teste-performance-estudo`

## 1️⃣ Criar Thread Group (Usuários)

Caminho:

```
Test Plan → Add → Threads → Thread Group
```

Configuração:

* Number of Threads (users): `3`
* Ramp-up period: `1`
* Loop Count: `10`

---

## 🧠 Interpretação


**🔹 Threads**

Quantidade de usuários simultâneos

👉 no k6:

vus: 3

**🔹 Ramp-up**

Tempo para subir os usuários

👉 1 segundo = todos entram quase juntos

👉 se fosse 10:

1 usuário por segundo

**🔹 Loop Count**

Quantidade de execuções por usuário

👉 total de requisições:

threads × loops

---

## 2️⃣ Criar HTTP Request

Caminho:

```
Thread Group → Add → Sampler → HTTP Request
```

Configuração:

* Method: `GET`
* Protocol: `https`
* Server Name: `blog.agibank.com.br`
* Path: `/wp-json/wp/v2/posts`

### Query Params:

🟢 Busca válida
search = mercado

🔴 Busca inválida
search = teste123

🟡 Busca vazia
👉 remover parâmetro


Você está simulando comportamentos reais:

* usuário buscando algo válido
* usuário digitando algo errado
* usuário não preenchendo


## 🧠 Interpretação

Isso representa uma chamada real da API

Equivalente ao k6:

```js
http.get(`${BASE_URL}?search=mercado`)
```

---

## 3️⃣ Adicionar Assertions

Garantem que a resposta não apenas chegou, mas está correta.

### 🔹 Validação de status

```
Add → Assertions → Response Assertion
```
* Field to Test: `Response Code`
* Pattern Matching: `Equals`
* Pattern: `200`

k6 equivalente:
r.status === 200

### 🔹 Validação de estrutura da resposta

```
Add → Assertions → Response Assertion
```
* Field to Test: `Text Response`
* Pattern Matching: `Contains`
* Pattern: `mercado` (texto que deseja validar existência)

##### 🧠 Problema
* API é dinâmica
* conteúdo pode variar
* teste fica instável (flaky)

Solução: usar JSON Assertion


### 🔹 JSON Assertion (Validação estrutural)
Substitui validações frágeis baseadas em texto.
```
Add → Assertions → JSON Assertion
```
* Assert JSON path exists: `$[0]`
* Marca `Expect null` se esperar não retornar resultados (lista vazia) e no Assert JSON path coloca apenas `$`

🟢 Busca válida
`$[0]`

✔ garante que existe pelo menos um item na resposta

k6 equivalente:
```js
JSON.parse(r.body).length > 0
```


🔴 Busca inválida
`$`
✔ marcar checkbox Expect null

✔ Resposta é JSON válido porém lista vazia


🟡 Busca vazia
`$[0]`
✔ garante retorno com dados (API retorna dados padrão)



### 🔹 Validação de tempo
```
Add → Assertions → Duration Assertion
```
* Duration: `2000 ms`


---

### ⚠️ Observação importante sobre validações

Inicialmente foi utilizada validação por conteúdo específico (mercado), porém foi identificado comportamento instável devido à natureza dinâmica da API.

Para garantir maior confiabilidade, a validação foi ajustada para verificar a estrutura da resposta, tornando o teste mais robusto.

---

# 🔄 Dados Dinâmicos com Múltiplos Cenários (CSV)



## 📌 Objetivo

Simular diferentes comportamentos de usuários separando entradas válidas e inválidas, garantindo que cada cenário seja testado com dados coerentes.

---

## ⚠️ Problema identificado

Inicialmente foi utilizado um único arquivo CSV contendo termos válidos e inválidos.

Exemplo:

```text
mercado
credito
investimento
teste123
```

---

### 🧠 Impacto

Ao utilizar esse CSV na busca válida:

* termos inválidos também eram executados
* a validação falhava (`$[0]`)
* gerava falsos erros

---

## ✅ Solução aplicada

Separação dos dados por cenário

---

## 📁 Arquivos CSV

### 🟢 dados_validos.csv

```text
termo
mercado
credito
investimento
```

---

### 🔴 dados_invalidos.csv

```text
teste123
@#45532
!a!#d$11
```

---

## ⚙️ Configuração no JMeter

Cada cenário utiliza seu próprio CSV através de um **Simple Controller**

Como adicionar (dentro de Thread Group):

```
Add → Logic Controller → Simple Controller
```


---

## 🧩 Estrutura do teste

```text
Thread Group
 ├── Simple Controller (Busca válida)
 │     ├── CSV Data Set Config (dados_validos.csv)
 │     ├── HTTP Request
 │          ├── Assertions
 │
 ├── Simple Controller (Busca inválida)
 │     ├── CSV Data Set Config (dados_invalidos.csv)
 │     ├── HTTP Request
 │          ├── Assertions
 │
 ├── Simple Controller (Busca vazia)
       ├── HTTP Request
            ├── Assertions
```

---

## 🧠 Interpretação

Cada controller representa um cenário isolado.

* Busca válida → recebe apenas dados válidos
* Busca inválida → recebe apenas dados inválidos
* Busca vazia → não utiliza CSV

---

## 🔁 Uso no HTTP Request

Todos os cenários utilizam a mesma variável:

```text
search = ${termo}
```

---

## 🧠 Por que usar a mesma variável?

* simplifica a configuração
* evita complexidade desnecessária
* segue padrão utilizado em projetos reais

---

## 🔍 Validação do funcionamento

No **View Results Tree → Request**, é possível observar:

```text
...posts?search=mercado
...posts?search=teste123
```

Cada cenário utiliza apenas os valores esperados para seu contexto.

---

## 🔄 Paralelo com k6

```js
const termo = TERMOS[Math.random() * TERMOS.length | 0];
```

---

## 🎯 Diferença importante

* k6 → seleção aleatória
* JMeter → leitura sequencial por cenário

---

## 🎯 Benefícios da abordagem

✔ elimina falhas falsas
✔ melhora confiabilidade dos testes
✔ permite análise mais precisa
✔ aproxima o teste de um cenário real

---


---

## ⚠️ Erros comuns

* Caminho do CSV incorreto
* Nome da variável diferente (`termo`)
* CSV não está na mesma pasta do `.jmx`
* Esquecer de usar `${termo}` no request

---


## 3️⃣ Adicionar Listeners (Resultados)

Caminhos:

```
Thread Group → Add → Listener → View Results Tree
Thread Group → Add → Listener → Summary Report
```

Summary → visão geral
Tree → debug detalhado

---

# 🧪 Simulação de Cenário Real

Arquivo `C:\JMeter\Estudo\teste-cenario-real`

## 📌 Objetivo

Simular o comportamento de usuários reais utilizando:

* múltiplos cenários
* dados dinâmicos
* tempo de espera (think time)

---

## ⚙️ Configuração aplicada

* Threads: 10
* Ramp-up: 5
* Loop: 20

---

## ⏱️ Think Time

Foi adicionado um timer para simular tempo entre ações do usuário:

```text
Uniform Random Timer
Constant Delay Offset: 1000
Random Delay Maximum: 2000
```

Como adicionar (dentro de thread group):
```
Add → Timer → Uniform Random Timer
```

---

## 🧠 Interpretação

O tempo entre requisições varia entre:

```text
1s → 3s
```

Simulando comportamento humano.

---

## 📊 Resultados obtidos

| Cenário        | Avg   | Max     | Error |
| -------------- | ----- | ------- | ----- |
| Busca válida   | 53 ms | 309 ms  | 0%    |
| Busca inválida | 73 ms | 4917 ms | 0.75% |
| Busca vazia    | 45 ms | 256 ms  | 0%    |

---

## 🧠 Análise

O sistema apresentou comportamento estável sob carga moderada, com baixa taxa de erro e tempos médios consistentes.

Foi identificado que buscas inválidas apresentaram maior variabilidade e picos de latência, indicando possível necessidade de otimização para cenários sem retorno de dados.

As buscas válidas e vazias mantiveram tempos de resposta baixos e consistentes.

---

## 🎯 Conclusão

A utilização de dados dinâmicos separados por cenário, aliada ao uso de think time, permitiu simular um comportamento mais próximo do uso real da aplicação, possibilitando uma análise mais precisa do desempenho do sistema.


---

# 📊 Interpretação dos Resultados

### 🔹 Summary Report

Principais métricas:

* Average → tempo médio de resposta
* Min / Max → variação de tempo (menor e maior tempo)
* Error % → falhas (incluindo assertions)
* Throughput → requisições por segundo

### 🔹 View Results Tree

Permite visualizar:

* requisições individuais
* resposta da API
* validações aplicadas
* falhas detalhadas

### 🔹 Average

Tempo médio de resposta

👉 equivalente a:

```js
avg (k6)
```

---

### 🔹 Min / Max

* Min → mais rápido
* Max → mais lento

---

### 🔹 Error %

Porcentagem de erro

👉 equivalente a:

```js
http_req_failed (k6)
```

---

### 🔹 Throughput

Quantidade de requisições por segundo

---

# 🎯 Análise

Ao avaliar o teste, considerar:

* Tempo médio aceitável
* Baixa taxa de erro
* Estabilidade sob carga

---

# 🧠 Interpretação profissional

### Você NÃO olha só números

👉 você compara cenários

* busca válida → mais rápida
* busca vazia → mais lenta (mais dados)

---

# ⚠️ Armadilhas comuns

**❌ Não limpar antes de rodar**
→ mistura resultados

**❌ Assertion errada**
→ erro falso

**❌ Validar texto fixo**
→ teste quebra sozinho

**❌ Parâmetro vazio incorreto**
→ comportamento inconsistente

---

#### 🎯 Insight importante

Em testes de performance, validar estrutura é mais importante que validar conteúdo.

---

# 💡 Observações

* JMeter é baseado em interface gráfica
* Facilita criação inicial de testes
* Pode se tornar complexo em cenários maiores

---

# 🎯 Conclusão

O JMeter permite validar o comportamento do sistema sob carga, sendo amplamente utilizado no mercado para testes de performance.

Este estudo complementa o uso do k6, trazendo conhecimento tanto em ferramentas modernas quanto tradicionais.
