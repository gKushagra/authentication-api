#!/bin/sh

cd /var/myapps/oddfelow-sso
pm2 stop oddfellow-sso-api
git pull origin main
npm install
pm2 restart oddfellow-sso-api
exit
EOF