#!/bin/bash

port=8420
ip=192.168.0.21
while read line
do
	echo "$line" | socat - TCP-CONNECT:$ip:$port
done < "${1:-/dev/stdin}"
