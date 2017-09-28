#!/bin/bash

fail() {
	echo -e '\033[31;1m'"$@"'\033[0m'
	exit -1
}

currentBranch=$(git branch | grep \\* | while read a b; do echo "$b"; done)

[ "$currentBranch" = 'master' ] || fail "Tienes que hacerlo desde la rama master"

echo -e '\033[31;1m'"Atenció estàs a punt de pujar la pagina a producció"'\033[0m'
echo -e '\033[31;1m'"Prem Control C per abortar"'\033[0m'
read


grunt build  &&  scp -r dist/* somenergia@sw3.somenergia.coop:/home/somenergia/webforms-prod


