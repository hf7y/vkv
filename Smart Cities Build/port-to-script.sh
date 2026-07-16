#!/bin/bash

port=8420
socat -u TCP-LISTEN:$port,keepalive,reuseaddr,fork EXEC:./script-on-port.sh
