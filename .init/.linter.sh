#!/bin/bash
cd /home/kavia/workspace/code-generation/interactive-tic-tac-toe-74c43f8e/frontend_app
npm run build
EXIT_CODE=$?
if [ $EXIT_CODE -ne 0 ]; then
   exit 1
fi

