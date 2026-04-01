*** Settings ***

Resource    ${CURDIR}/../common/main.robot

*** Keywords ***
Dado que ${keyword}
    Run Keyword  ${keyword}

Quando ${keyword}
    Run Keyword  ${keyword}

E ${keyword}
    Run Keyword  ${keyword}

Então ${keyword}
    Run Keyword  ${keyword}