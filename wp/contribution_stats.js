'use strict';
if (jQuery) {
    setCustomLocaleToStringBehaviour();
    jQuery(document).ready(function() {
        const investmentCode = jQuery('#contribution').data('contribution');
        jQuery.getJSON(`https://api.somenergia.coop/stats/contributions/${investmentCode}`, function(response) {
            jQuery('#num-socis').text(Number(response.data.members).customToLocaleString());
            jQuery('#total-aportat').text(Number(response.data.current_investment).customToLocaleString());
            jQuery('#contribution progress').attr('max', Number(response.data.max_investment));
            jQuery('#contribution progress').attr('value', Number(response.data.current_investment));
        });
    });
}

function browserSupportsToLocaleString() {
    var number = 0;
    try {
        number.toLocaleString('i');
    } catch (e) {
        return e.name === 'RangeError';
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
                var inversedIndex = stringValue.length - i - 1;
                if ((i + 1) % 3 === 0 && inversedIndex !== 0) {
                    resultValue = resultValue + stringValue[inversedIndex] + '.';
                } else {
                    resultValue = resultValue + stringValue[inversedIndex];
                }
            }
            stringValue = '';
            for (i = resultValue.length - 1; i >= 0; i--) {
                stringValue += resultValue[i];
            }
            
            return stringValue;
        }
    }
}
