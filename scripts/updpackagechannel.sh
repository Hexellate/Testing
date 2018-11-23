#!/bin/bash

echo ${CHANNEL}
pkgchannel="$(node -p 'require("./scripts/getver.js").default("channel")')"

if [[ "${pkgchannel}" != "${CHANNEL}" ]]
then
  echo switch channel to ${CHANNEL}
  node -e "require('./scripts/bumpver.js').default({'channel':'${CHANNEL}','bump':''})"
else
  echo Already on ${CHANNEL} channel
fi
