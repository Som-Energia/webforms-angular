'use strict';

if (jQuery) {
    jQuery(document).ready(function() {
        // Partners
        jQuery.getJSON('http://somenergia-api-webforms.gisce.net/stats/socis', function(response) {
            var node = jQuery('#partners');
            if (response.status === 'OFFLINE') {
                node.text('no disponible (EP1)');
            } else {
                if (response.state === false) {
                    node.text('no disponible (EP2)');
                } else {
                    if (response.data === undefined) {
                        node.text('no disponible (EP3)');
                    } else {
                        node.text(Number(response.data.socis).toLocaleString());
                    }
                }
            }
        });
        // Contracts
        jQuery.getJSON('http://somenergia-api-webforms.gisce.net/stats/contractes', function(response) {
            var node = jQuery('#contracts');
            if (response.status === 'OFFLINE') {
                node.text('no disponible (EC1)');
            } else {
                if (response.state === false) {
                    node.text('no disponible (EC21)');
                } else {
                    if (response.data === undefined) {
                        node.text('no disponible (EC3)');
                    } else {
                        node.text(Number(response.data.contractes).toLocaleString());
                    }
                }
            }
        });
    });
} else {
    console.error('Unable to load jQuery');
}
