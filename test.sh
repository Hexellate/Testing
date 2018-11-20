#!/bin/bash
CHANNEL="stable"
# branch="0.3.0"
branch="refs/head/release/0.3.0"
branch=${branch/refs\/head\//}
branch=${branch/refs\/pull\//}
echo ${branch}
