#!/bin/bash
if [ "$UI_ENVIRONMENT" == "Test" ]; then
npm run start:test
fi
if [ "$UI_ENVIRONMENT" == "Production" ]; then
npm run start
fi
