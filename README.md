#  QA Automation - Blog do Agi

##  Objetivo

Automatizar cenários críticos da funcionalidade de busca do blog do Agi, garantindo a validação dos principais fluxos de uso do usuário.

---

##  Sistema testado

https://blogdoagi.com.br/

---

##  Cenários automatizados

###  Busca com termo válido

Valida que o sistema retorna artigos relacionados ao termo pesquisado.

###  Busca sem resultados

Valida que o sistema exibe mensagem apropriada quando não há resultados para o termo pesquisado.

###  Busca sem digitar nada

Valida o comportamento da aplicação ao realizar uma busca vazia, onde o sistema retorna uma listagem padrão de conteúdos.

---

##  Estratégia de testes

Os cenários foram definidos com base na criticidade da funcionalidade de busca, cobrindo:

* Fluxo positivo (retorno esperado de resultados)
* Fluxo negativo (ausência de resultados)
* Comportamento alternativo (busca sem entrada)

A abordagem prioriza a validação do comportamento real da aplicação, evitando suposições e garantindo maior aderência ao funcionamento do sistema.

---

##  Tecnologias utilizadas

* Robot Framework
* SeleniumLibrary
* Python
* Google Chrome

---

##  Estrutura do projeto

```
Teste Técnico Mirante/
│
├── common/
│   └── main.robot
│
├── resources/
│   └── blog.robot
│
├── share/
│   └── gherkin.resource
│
├── tests/
│   └── blog.robot
│
└── README.md
```

---

##  Pré-requisitos

* Python instalado
* Pip instalado
* Google Chrome instalado

---

##  Como executar o projeto

1. Instalar dependências:

```
pip install robotframework
pip install robotframework-seleniumlibrary
```

2. Executar os testes:

```
robot tests/
```

---

##  Evidências

Após a execução, o Robot Framework irá gerar automaticamente:

* `log.html`
* `report.html`
* `output.xml`

---

##  Observações

Durante a automação, foi identificado que:

* A busca vazia não é bloqueada pelo sistema
* O sistema retorna resultados padrão nesse cenário

Esse comportamento foi considerado na modelagem dos testes, garantindo maior fidelidade à regra de negócio implementada.

---

##  Possíveis melhorias

* Implementação de Page Object Model
* Execução em modo headless
* Integração com CI/CD (GitHub Actions)
* Parametrização de dados de teste
* Execução em outros navegadores

---

##  Autor

Matheus Hiroshi De Oliveira Ywata
