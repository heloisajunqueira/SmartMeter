
'use strict';

// Required modules and functions
var Protocol = require('azure-iot-device-http').Http;// The transport protocol used
var Client = require('azure-iot-device').Client;
var Message = require('azure-iot-device').Message;

var fs = require('fs');
var   	ADC0 = '0',  
	ADC1 = '0',
	ADC2 = '0',
	ADC3 = '0';
var	VoltsPorUnidade= 185,
	i,
	V_aux = require('vectors/mag')(60),
	V_aux,
	minValue,
	maxValue,
	Vp,
	Vrms,
	Arms,
	Vrmsl,                //Vrms da linha 
	ArmsS0,
	ArmsS1,
	ArmsS2,
	ArmsS3,
	PS0,
	PS1,
	PS2,
	PS3;


// Create client to connect to the IoT Hub using the device connection string and the HTTP protocol
var connectionString = "HostName=SmartMeter.azure-devices.net;DeviceId=SmartMeter;SharedAccessKey=dk/bWwxT5sXi5a5/FijqWu1NTOfT8y/wtntK99+gw9w=";
var client = Client.fromConnectionString(connectionString, Protocol);
var sendInterval = {timerGet: 2000, timerSend: 2000};//loop handler

// Data to be sent
var timenow,Armss0,Armss1,Armss2,Armss3,Ps0,Ps1,Ps2,Ps3 ;


// Loops that call the functions to read sensors and send to the cloud
sendInterval.handlerGet = setInterval(getAllSensors, sendInterval.timerGet);
sendInterval.handlerSend = setInterval(sendToIotHub, sendInterval.timerSend);

//Function that reads all sensors data
function getAllSensors() {
	Vrmsl = 125;
	var d = new Date();
	timenow = d.getTime();// get board time (in Epoch time)
	//console.log("Inicia Leitura...")
	ArmsS0 = rdGPIO(ADC0, '0'); 
	PS0=ArmsS0*Vrmsl;
	ArmsS1 = rdGPIO(ADC1, '1');
	PS1=ArmsS1*Vrmsl;
	ArmsS2 = rdGPIO(ADC2, '2');
	PS2=ArmsS2*Vrmsl;
	ArmsS3 = rdGPIO(ADC3, '3');
	PS3=ArmsS3*Vrmsl;
}

//Function that reads data from sensor
function rdGPIO(pin, number){ 
	/*---------- Leitura AC  -----------*/  
	maxValue=0;
	minValue=4096;
	for(i=0;i<100;i++){
		V_aux[i]= fs.readFileSync('/sys/devices/soc.2/30400000.aips-bus/30610000.adc/iio:device' + pin + '/in_voltage'+number+'_raw');
		if (V_aux[i]<minValue){
			minValue=V_aux[i];
		}
		if(V_aux[i]>maxValue){
			maxValue=V_aux[i];
		}
	}
	Vp=((maxValue-minValue)*3.3)/4096 // substituir o 3.3 por 5 e ver o resultado
	
	Vrms=(Vp/2)*0.707;
	Arms=(Vrms*1000)/VoltsPorUnidade;
	//console.log("Irms: "+ Arms);
	return Arms;
} 

function sendToIotHub() {
	// Add the data to a JSON encoded string
	var data = JSON.stringify({
		ObjectName: 'toradexMeter',
		ObjectType: 'SensorTagEvent',
		Armss0: ArmsS0,
		Ps0: PS0,
		Armss1: ArmsS1,
		Ps1: PS1,
		Armss2: ArmsS2,
		Ps2: PS2,
		Armss3: ArmsS3,
		Ps3: PS3,
		boardTime: timenow
	});

	var message = new Message(data);// Encapsulate the message to be sent
	message.properties.add('myproperty', 'myvalue');
	console.log('sending message to the IoT Hub: ');// Feedback message to the console
	console.log(data);
	client.sendEvent(message, printResultFor('send'));// Send message to the IoT Hub
}

//Helper function to print results in the console
function printResultFor(op) {
  return function printResult(err, body, res) {
    if (err) console.log(op + ' error: ' + err.toString());
    if (res){
      console.log(op + ' response: ' + res);
      console.log(body);
    }
  };
}
