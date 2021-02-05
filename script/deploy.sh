#!/bin/sh

cd /var/myapps/oddfelow-sso
sudo pm2 stop oddfellow-sso-api
sudo git pull origin main
sudo npm install
sudo pm2 restart oddfellow-sso-api
exit
EOF