#!/bin/bash

###########################################################
# THIS SCRIPT WILL AUTOMATICALLY CONFIGURE YOUR ORANGE PI #
###########################################################

git clone https://github.com/zhaolei/WiringOP.git -b h3

cd WiringOP
chmod +x ./build
sudo ./build

cd ../Server

npm i orange-pi-gpio
