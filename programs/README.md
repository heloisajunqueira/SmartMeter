README for Send Data 

 O sensor utilizado é ACS712 para 5V, a função que irá armazenar a leitura deste sensor no ADC será a função getAllSensors(),que irá fazer uma chamada a função rdADC(). Esta função rdADC() irá ler o arquivo que contém os dados da leitura do ADC, o acesso a este arquivo está descrito neste link de referência da Toradex. Esta mesma função também faz a conversão do valor lido, que foi feita usando a equação abaixo:

    Vp=((Vmax-Vmin)*(nivel de tensão do pino ADC))/((resolução do conversor ADC))
    Vrms= (Vp*√2)/2 
    Arms=(Vrms*1000)/(Resolução do conversor)
    
 A resolução deste conversor é de 185 mV/A, então declaramos a resolução do conversor como sendo 185. Passando agora para a parte de envio dos dados para a nuvem temos duas principais funções :

    sendInterval.handlerGet = setInterval(getAllSensors, sendInterval.timerGet);
    sendInterval.handlerSend = setInterval(sendToIotHub, sendInterval.timerSend);

A primeira função simplesmente chamar as funções anteriormente descritas para a leitura e armazenamento dos dados lidos. A segunda função sim será responsável por enviar estes dados para a nuvem, mas antes deve ser declarada connection string obtida
logo após a criação do IoT Hub, que como dito anteriormente servirá para a verificação do dispositivo:

    var connectionString = "HostName=toradex.azure-devices.net;DeviceId=tdx_iot_car;SharedAccessKe=somesharedaccesskeyreturned" 
Voltando a função de envio dos dados para a nuvem, esta irá chamar a função sendToIotHub(), que irá encapsular os dados obtidos
das leituras dos sensores em uma string no formato JSON, através da variável mensagem, em seguida enviado o dado para a nuvem.
Se em alguma parte do processo, encapsulamento ou envio da mensagem resultar em algum erro, o mesmo será impresso na tela. Depois desta explicação podemos executar o programa através do comando nodemon abaixo. Se tudo der certo aparecerá a mensagem
de enviando para IoT e o formato da string encapsulada e através do portal do IoT Hub poderá ser monitorada as mensagens
enviadas para o IoT Hub:

    Nodemon SendData.js

Para configurar o programa para que sempre ao ligar o módulo o programa seja iniciado e executado automaticamente foi utilizado
um script de inicialização. Para isso foi criado o script init.sh que é executado através do arquivo Meter.service que deve ser
copiado para a pasta /lib/systemd/system e habilitado o serviço. Os passos seguintes irão descrever este processo
cp Meter.service /lib/systemmd/system
systemctl enable Meter.service
Para esta função de iniciação automática do programa seguem alguns comandos importantes e que estão comentadas suas funções:
    
    Systemctl start Meter.service    // irá reiniciar a execução automático do programa  
    Systemctl status Meter.service  -l   //mostra o status da execução do programa detalhadamente, adicionando-se o -l detalha-se o processo
    Systemctl stop Meter.service // irá interromper a execução automático do programa
