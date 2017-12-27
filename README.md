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

- Ensure you are in the `devel` branch
- Execute

    $ ./deploytest.sh

It will be available at: http://testforms.somenergia.coop/

### Deploy on production

We deploy production from `master` branch.

- Test it in local with `grunt serve`.
- Upgrade version in `package.json`
- We should merge devel.

    $ git checkout master
    $ git merge devel
    $ grunt build

- Ensure you are in the `master` branch
- Tag the release

    $ git push
    $ git tag v1.4.0 # change to the next version!!
    $ git push --tags

- Execute

    $ ./deployprod.sh


It will be available at: http://www.somenergia.coop


### Development aids

- **Development mode:**
	- Development branch and main branch have different value in `developmentMode` var at `app.js`.
	- Such value is accessible to the other modules through the `cfg.DEVELOPMENT`. And by convention set into every scope it needs it as `$scope.developing`.
- **Development/Responsive indicator:** all pages include a fixed div only visible on development at top right saying which responsive mode is used (XS,SM,LG).
- **Target API:**
	- While in development mode, the form uses api at _testing_ server instead of production one.
	- If you are developing the api at `localhost`, you need to change manually `API_BASE_URL` at `app.js`.
- **Wizard aids** To be activated in each page if you need to:
	- `$scope.showAll`: forces all pages to be visible
	- `$scope.waitPreviousPages`: removes the constraint for a page to wait the previous one, to easy test local readyness.
- Test page: display `test.html`


### Dependencies management


To upgrade/add a run-time dependency:

- update the bower.json file
- run `bower update`


To upgrade/add a development dependency:

```bash
npm install <dependency>
```











