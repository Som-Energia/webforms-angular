+ turn isPayerPageComplete into a function filling error message
+ blocking fields de personalData
+ personaldata dni invalid no bloquea
+ personaldata cp mentres valida no bloquea
+ que ha pasado con los glyphicons
+ remove asterisk from 'Cognoms', 'Persona Representant'
+ Refactoritzar showErrorDialog
+ Loading dialog as a service
+ Success dialog as a service
- "La persona pagadora acepta"
- remove consum/estimation field (as soon as api don't need it)
- check dni api call with empty (deleting written digits) fails
- En checkbox de confirmar cuenta, sale el asterisco encima del texto
- Repassar crides showErrorDialog missatges traduibles
- Repassar crides showErrorDialog partir detalls
- selfcontained globalMessage (like apierror, loading and welldone)
- Rethink modals usage and need
- production and testing configs
- newmember: manage dni duplicated
	- already a member
	- not a newmember, just owner or payer
	- former member/owner/payer
- contract owner: manage dni duplicated
	- what to do with new personal data
- contract payer: manage dni duplicated
- generation: manage dni duplicated
- invest: manage dni duplicated
- Manage case CUPS existing in API
	- Already active contract
	- Exists but not an active contract
- Modals should scroll top to be visible when form was scrolled down

