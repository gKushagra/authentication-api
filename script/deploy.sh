#!/bin/sh

cd /var/myapps/oddfelow-sso
sudo git pull origin main
sudo npm install
sudo pm2 start server.js --name oddfellow-sso-api
exit
EOF