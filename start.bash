#!/bin/bash

set -e

docker run \
	--name zare \
	--hostname zare \
	--mount type=bind,source=$(pwd),target=/repository \
	--network host \
	--workdir /repository \
	--env USER=root \
	--env CF_API_TOKEN= \
	--interactive \
	--tty \
	--rm \
	node:latest \
	bash -c 'apt-get update && apt-get install -y jq && npm install @cloudflare/wrangler webpack-cli -g && bash'
