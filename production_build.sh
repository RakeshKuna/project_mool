    export ROOT_URL=https://app.moolya.global
    export TOOL_NODE_FLAGS=--max_old_space_size=2042
    meteor build ../build-Prod-$(date "+%Y-%m-%d:%H:%M")  --server $ROOT_URL --mobile-settings settings-prod.json
