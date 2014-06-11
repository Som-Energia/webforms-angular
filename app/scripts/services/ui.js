'use strict';

angular.module('newSomEnergiaWebformsApp')
    .service('uiHandler', function() {

        // SHOW ERROR MODAL DIALOG
        this.showErrorDialog = function ($scope, msg) {
            $scope.errorMsg = msg;
            jQuery('#api-server-offline-modal').modal({
                backdrop: 'static',
                keyboard: false,
                show: true
            });
        };

        // SHOW WELL DONE MODAL DIALOG
        this.showWellDoneDialog = function () {
            jQuery('#well-done-modal').modal({show: true});
        };

        // EMAIL VALIDATOR
        this.validateEmail = function (email) {

        }

    });
