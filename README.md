# SomEnergia - WebForms

Forms for Som Energia web page.

## Development set-up (on Ubuntu)

### Install dependent packages

	$ sudo apt-get install npm ruby-compass
	$ sudo ln -s /usr/bin/nodejs /usr/bin/node
	$ npm install
	$ sudo npm install -g  bower grunt-cli
	$ bower install

### Generate untracked files

Edit the following templates:

#### secret.json

This should be the parameters to upload the website:

	{
		"host" : "myhost",
		"username" : "andrewrjones",
		"password" : "**************"
	}

#### app/scripts/debug.js

This should be sample parameters to check the website while developing

	'use strict';

	angular.module('newSomEnergiaWebformsApp')
		.constant('debugCfg', {
			SOCI: 0000,
			CIF: 'B12345678',
			COMPANY: 'ACME',
			DNI: '12345678Z',
			NAME: 'Bugs',
			SURNAME: 'Bunny',
			EMAIL: 'bunny@acme.info',
			PHONE: '555112233',
			ADDRESS: 'Rue del Percebe 13',
			POSTALCODE: 08080,
			CUPS: 'ES001234567891234LE0F',
			CNAE: '0520',
			POWER: '5.5',
			RATE: '2.0A',
			ACCOUNT_BANK: '1491',
			ACCOUNT_OFFICE: '0001',
			ACCOUNT_CHECKSUM: '20',
			ACCOUNT_NUMBER: '2012341234',
			IBAN1: 'ES50',
			IBAN2: '1491',
			IBAN3: '0001',
			IBAN4: '2020',
			IBAN5: '1234',
			IBAN6: '1234'
		})
	;


### Launch the development server

	$ grunt serve
	$ firefox http://localhost:9000



