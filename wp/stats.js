'use strict';

if (jQuery) {
    setCustomLocaleToStringBehaviour();
    jQuery(document).ready(function() {
        // Partners
        jQuery.getJSON('https://api.somenergia.coop/stats/socis', function(response) {
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
                        node.text(Number(response.data.socis).customToLocaleString());
                    }
                }
            }
        });
        // Contracts
        jQuery.getJSON('https://api.somenergia.coop/stats/contractes', function(response) {
            var node = jQuery('#contracts');
            if (response.status === 'OFFLINE') {
                node.text('no disponible (EC1)');
            } else {
                if (response.state === false) {
                    node.text('no disponible (EC2)');
                } else {
                    if (response.data === undefined) {
                        node.text('no disponible (EC3)');
                    } else {
                        node.text(Number(response.data.contractes).customToLocaleString());
                    }
                }
            }
        });
    });
} else {
    console.error('Unable to load jQuery');
}

function browserSupportsToLocaleString() {
    var number = 0;
    try {
        number.toLocaleString('i');
    } catch (e) {
        return e​.name === 'RangeError';
    }
    return false;
}

function setCustomLocaleToStringBehaviour()
{
    if (browserSupportsToLocaleString()) {
        Number.prototype.customToLocaleString = function() {
            return this.toLocaleString();
        }
    } else {
        Number.prototype.customToLocaleString = function() {
            var stringValue = Math.round(this).toString();
            var resultValue = '';
            for (var i = 0, len = stringValue.length; i < len; i++) {
                var inversedIndex = stringValue.length - i;
                if (i % 3 === 0 && inversedIndex !== 0) {
                    resultValue = resultValue + '.';
                } else {
                    resultValue = resultValue + stringValue[inversedIndex];
                }
            }
            stringValue = '';
            for (i = resultValue.length - 1; i >= 0; i--) {
                stringValue += str[resultValue];
            }
            
            return stringValue;
        }
    }
}