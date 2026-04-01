*** Settings ***
Resource    ${CURDIR}/../resources/blog.resource
Resource    ${CURDIR}/../share/gherkin.resource
Resource    ${CURDIR}/../common/main.robot


Test Setup    Abrir o navegador
Test Teardown    Fechar o navegador

*** Test Cases ***

Cenário 01: Buscar artigo com termo válido
    Dado que usuário clica na lupa de busca
    E digita termo de busca INSS
    Quando Pressionar Enter
    Então o sistema deve exibir os resultados

Cenário 02: Buscar artigo inexistente
    Dado que usuário clica na lupa de busca
    E digita termo de busca inválido
    Quando Pressionar Enter
    Então o sistema deve exibir mensagem sem resultados

Cenário 03: Buscar sem digitar nada
    Dado que usuário clica na lupa de busca
    E deixa o campo de busca vazio
    Quando Pressionar Enter
    Então o sistema deve exibir página de resutados vazia
    