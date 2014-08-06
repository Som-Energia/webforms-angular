'use strict';

if (jQuery) {
    jQuery(document).ready(function() {
        // Partners
        jQuery.getJSON('http://somenergia-api-webforms.gisce.net/stats/socis', function(response) {
//            console.log('JSON response: ' + response);
            if (response.status === 'OFFLINE') {
                console.error('Webforms server offline');
            } else {
                if (response.state === false) {
                    console.error('Webforms server response error');
                } else {
                    if (response.data === undefined) {
                        console.error('Empty data webforms server response');
                    } else {
                        jQuery('#partners').text(response.data.socis);
                    }
                }
            }
        });
        // Contracts
        jQuery.getJSON('http://somenergia-api-webforms.gisce.net/stats/contractes', function(response) {
//            console.log('JSON response: ' + response);
            if (response.status === 'OFFLINE') {
                console.error('Webforms server offline');
            } else {
                if (response.state === false) {
                    console.error('Webforms server response error');
                } else {
                    if (response.data === undefined) {
                        console.error('Empty data webforms server response');
                    } else {
                        jQuery('#contracts').text(response.data.contractes);
                    }
                }
            }
        });
    });
} else {
    console.error('Unable to load jQuery');
}
