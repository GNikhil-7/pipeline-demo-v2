#!/bin/bash
cd /home/ubuntu/pipeline-demo-v2/pipeline-demo-v2

npm install --production

pm2 restart myapp || pm2 start app.js --name myapp
