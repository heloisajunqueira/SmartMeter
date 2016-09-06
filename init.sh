#!/bin/sh -
sleep 2
echo "Iniciando while"
while : ; do
	echo "Start node"
    	node /home/root/SmartMeter/SendData.js
	sleep 2
done
