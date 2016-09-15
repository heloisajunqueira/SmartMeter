# SmartMeter

Este projeto consiste em uma Demo que envia os dados da corrente medida em 4 tomadas para a nuvem, para este projeto foram utilizados os serviços do Microsoft Azure e para leitura dos sensores foram utilizados os módulos da Toradex.
Para enviar os dados para a nuvem foi utilizado o protocolo HTTP e para receber os dados enviados foi utilizada a plataforma [IoT Hub](https://azure.microsoft.com/pt-br/services/iot-hub/), para processar estes dados na nuvem foi utilizado o [Stream Analytics](https://azure.microsoft.com/pt-pt/services/stream-analytics/).  E para vizualizar estes dados em formas de gráficos que irão auxiliar na análise e na obtenção de alguns insights sobre este cenário foi utilizado o [Power BI](https://powerbi.microsoft.com/pt-br/).

## Materiais

Os sensores de correntes utilizados no projeto foram [ACS712](http://img.filipeflop.com/files/download/Datasheet_ACS712.pdf), o módulo utilizado para leitura destes sensores foram [Toradex Colibri VF50](http://developer.toradex.com/products/colibri-vf50)  module + [Toradex Viola](http://developer.toradex.com/products/viola-carrier-board) carrier board.
 

#Leitura dos Sensores 

O sensor utilizado é ACS712 para 5V, a função que irá armazenar a leitura deste sensor no ADC será a função `getAllSensors()`, que irá fazer uma chamada a função `rdADC()`, esta irá ler o arquivo que contém os dados lidos pelo ADC, o acesso a este arquivo está descrito neste [link](http://developer.toradex.com/knowledge-base/adc-(linux)) de referência da Toradex. Esta mesma função também faz a conversão do valor lido, que foi feita usando a equação abaixo: 

Vp=((Vmax-Vmin)*(nivel de tensão do pino ADC))/(resolução do conversor ADC) 

Vrms= (Vp*√2)/2 

Arms=(Vrms*1000)/(Resolução do conversor) 


A resolução deste conversor é de 185 mV/A, então declaramos a resolução do conversor como sendo 185. 

##Enviar dados para IoT Hub 

Passando agora para a parte de envio dos dados para a nuvem temos duas principais funções : 

sendInterval.handlerGet = setInterval(getAllSensors, sendInterval.timerGet); 
sendInterval.handlerSend = setInterval(sendToIotHub, sendInterval.timerSend); 

A primeira função simplesmente chamar as funções anteriormente descritas para a leitura e armazenamento dos dados lidos. 

A segunda função será responsável por enviar estes dados para a nuvem, mas antes deve ser declarada `connection string` obtida logo após a criação do IoT Hub, que como dito anteriormente servirá para a verificação do dispositivo: 

var connectionString = "HostName=toradex.azure-devices.net;DeviceId=tdx_iot_car;SharedAccessKe=somesharedaccesskeyreturned" 

Voltando a função de envio dos dados para a nuvem, esta irá chamar a função `sendToIotHub()`, que irá encapsular os dados obtidos das leituras dos sensores em uma string no formato JSON, através da variável mensagem, em seguida enviado o dado para a nuvem. Se em alguma parte do processo, encapsulamento ou envio da mensagem resultar em algum erro, o mesmo será impresso na tela. Depois desta explicação podemos executar o programa através do comando nodemon abaixo. Se tudo der certo aparecerá a mensagem de enviando para IoT e o formato da string encapsulada e através do portal do IoT Hub poderá ser monitorada as mensagens enviadas para o IoT Hub: 

Nodemon SendData.js 

##Iniciar automaticamente o envio de dados ao ligar o módulo 

Para configurar o programa para que sempre ao ligar o módulo o programa seja iniciado e executado automaticamente foi utilizado um script de inicialização. Para isso foi criado o script init.sh que é executado através do arquivo Meter.service que deve ser copiado para a pasta `/lib/systemd/system` e habilitado o serviço. Os passos seguintes irão descrever este processo: 

cp Meter.service /lib/systemmd/system 
systemctl enable Meter.service 

Para esta função de iniciação automática do programa seguem alguns comandos importantes: 

systemctl start Meter.service // irá reiniciar a execução automático do programa 
systemctl status Meter.service -l //mostra o status da execução do programa detalhadamente, adicionando-se o -l detalha-se o processo 
systemctl stop Meter.service // irá interromper a execução automático do programa



