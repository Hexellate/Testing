#!/bin/bash
CHANNEL="stable"
# branch="0.3.0"
shopt -s extglob
# branch="refs/pull/14/release/0.3.0"
# branch="refs/heads/release/0.3.0"
# branch="refs/heads/master"
branch="refs/pull/12345/merge"

if [[ ! (${branch} =~ refs/pull/[0-9]*/merge) ]]
then
  echo yay
else
  echo nay
fi
