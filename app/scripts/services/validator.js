'use strict';

angular.module('newSomEnergiaWebformsApp')
    .service('ValidateHandler', function() {

        var re = /^(([^<>()[\]\\.,;:\s@\"]+(\.[^<>()[\]\\.,;:\s@\"]+)*)|(\".+\"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;

        // EMAIL VALIDATOR
        this.isEmailValid = function (email) {
            return re.test(email);
        };

    });
