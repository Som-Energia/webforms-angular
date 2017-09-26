#!/bin/bash

fail() {
	echo -e '\033[31;1m'"$@"'\033[0m'
	exit -1
}

currentBranch=$(git branch | grep \\* | while read a b; do echo "$b"; done)

[ "$currentBranch" = 'master' ] && fail "Estas en la rama master publicando en testing"

grunt build  &&  scp -r dist/* somenergia@sw3.somenergia.coop:/home/somenergia/webforms


