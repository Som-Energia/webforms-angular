'use strict';

if (jQuery) {
    setCustomLocaleToStringBehaviour();
    jQuery(document).ready(function() {
        jQuery.getJSON('https://somsolet-demo.somenergia.local/somsolet-api/stats', function(response) {
            var power = jQuery('#totalPower');
            var generation = jQuery('#totalGeneration');
            var installation = jQuery('#totalInstallation');
            if (response.status === 'OFFLINE') {
                power.text('no disponible (EP1)');
                generation.text('no disponible (EP1)');
                installation.text('no disponible (EP1)');
            } else {
                if (response.state === false) {
                    power.text('no disponible (EP2)');
                    generation.text('no disponible (EP1)');
                    installation.text('no disponible (EP1)');
                } else {
                    if (response.data === undefined) {
                        power.text('no disponible (EP3)');
                        generation.text('no disponible (EP1)');
                        installation.text('no disponible (EP1)');
                    } else {
                        power.text(conversionFactor(response.total_power, 'k') + 'W');
                        generation.text(conversionFactor(response.total_generation, 'k') + 'Wh/');
                        installation.text(Number(response.total_installation));
                    }
                }
            }
        });
      }
}

function nextMeasure(measure) {
    switch(measure) {
        case 'k':
            return 'M'
        case 'M':
            return 'G'
        case 'G':
            return 'T'
    }
}

function conversionFactor(value, units) {
    if (value > 999) {
        return conversionFactor(value/1000, nextMagnitude(units))
    }
    else {
        return value + units
    }
}