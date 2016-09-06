
# SmartMeter

Este projeto consiste em uma Demo que envia os dados da corrente medida em 4 tomadas para a nuvem, para este projeto foram utilizados os serviços do Microsoft Azure e para leitura dos sensores foram utilizados os módulos da Toradex.
Para enviar os dados para a nuvem foi utilizado o protocolo HTTP e para receber os dados enviados foi utilizada a plataforma [IoT Hub](https://azure.microsoft.com/pt-br/services/iot-hub/), para processar estes dados na nuvem foi utilizado o [Stream Analytics](https://azure.microsoft.com/pt-pt/services/stream-analytics/).  E para vizualizar estes dados em formas de gráficos que irão auxiliar na análise e na obtenção de alguns insights sobre este cenário foi utilizado o [Power BI](https://powerbi.microsoft.com/pt-br/).

## Materiais

Os sensores de correntes utilizados no projeto foram [ACS712](http://img.filipeflop.com/files/download/Datasheet_ACS712.pdf), o módulo utilizado para leitura destes sensores foram [Toradex Colibri VF50](http://developer.toradex.com/products/colibri-vf50)  module + [Toradex Viola](http://developer.toradex.com/products/viola-carrier-board) carrier board.
 
 
## Programas

Os programas utilizados para o envio dos dados para a nuvem e como iniciar automaticamente o envio de dados ao ligar o módulo estão na pasta programs.
A explicação de como foi realizado o cálculo da corrente, a estururação da parte do código responsável pelo envio dos dados para a nuvem e os passos a serem seguidos para iniciar automaticamente este programa estão descritos no README.md dentro da pasta programas

## Query Stream Analytics

O programa utilizado na Query para análise dos dados no Stream Analytics estão na pasta [query_stream_analytics](https://github.com/heloisajunqueira/SmartMeter/tree/master/query_stream_analytics) em Query.txt. A descrição de partes deste código encontra-se no arquivo README.md dentro desta mesma pasta. 
