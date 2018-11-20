#!/bin/bash
CHANNEL="stable"
# branch="0.3.0"
shopt -s extglob
# branch="refs/pull/14/release/0.3.0"
# branch="refs/heads/release/0.3.0"
# branch="refs/heads/master"


branch=${branch/refs\/?(heads|pull)\//}
echo ${branch}
branch=${branch/+([0-9])\//}
echo ${branch}
shopt -u extglob
