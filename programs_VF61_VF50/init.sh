#!/bin/sh -
sleep 2
echo "Iniciando while"
while : ; do
	echo "Start node"
        node /home/root/SmartMeter/programs_VF61_VF50/SendData.js
	sleep 2
done
