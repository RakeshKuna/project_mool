#!/bin/bash
now=$(date  "+%Y-%m-%d:%H:%M:%S")
#echo $now
    export ROOT_URL=https://qaapp.moolya.global
    export TOOL_NODE_FLAGS=--max_old_space_size=2042
    #meteor build ../build-08-12 --server $ROOT_URL --mobile-settings settings-qa.json
    #meteor build ../build$now --server $ROOT_URL --mobile-settings settings-qa.json
    meteor build ../build-QA-$(date "+%Y-%m-%d:%H:%M")  --server $ROOT_URL --mobile-settings settings-qa.json
