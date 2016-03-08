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
		"password" : "**************",
		"path": "/target/path"
	}

#### app/scripts/debug.js

This should be sample parameters to check the website while developing

	'use strict';

	angular.module('newSomEnergiaWebformsApp')
		.constant('debugCfg', {
			SOCI: '0000',
			CIF: 'B12345678',
			COMPANY: 'ACME',
			DNI: '12345678Z',
			NAME: 'Bugs',
			SURNAME: 'Bunny',
			EMAIL: 'bunny@acme.info',
			PHONE: '555112233',
			ADDRESS: 'Rue del Percebe 13',
			POSTALCODE: '08080',
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

### Deploy on testing

To deploy the on the testing environment,
ensure:

- You are in the devel branch
- Your secret.json is pointing to `/home/somenergia/webforms2-devel`
- Execute

    $ grunt sftp

It will be available at 

### Deploy on production

To publish on the sftp server specifiet at secret.json 

- You are in the master branch
- Changes have been merged from devel
- Your secret.json is pointing to `/home/somenergia/webforms2`  (without `-devel`)
- Execute:

    $ grunt sftp

It will be available at:

### Wordpress

Wordpress integrates the forms in two ways:

- As an iframe (most forms)
- Embeding the index.html code (becoming-a-partner form)


The later, is based rawgit following a version tag.

    git tag v1.4.0
    git push --tags

Such version tag is referenced and must be updated on:

`~somenergia/www2/wp-content/themes/superior/footer-forms.php`

And because this is a change at the file system level,
WP does not realize it happened and
you should invalidate the wp cache.

WP Dashboard -> Page Cache -> Empty all caches










