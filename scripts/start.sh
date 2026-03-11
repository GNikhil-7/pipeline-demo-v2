#!/bin/bash
cd /home/ubuntu/pipeline-demo-v2
pkill node || true
nohup node app.js > output.log 2>&1 &