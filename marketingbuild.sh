    export ROOT_URL=https://app.marketing.moolya.global
    export TOOL_NODE_FLAGS=--max_old_space_size=2042
    meteor build ../build-Marketing-$(date "+%Y-%m-%d:%H:%M")  --server $ROOT_URL --mobile-settings settings-mkt.json
