'use strict';

angular.module('SomEnergiaWebForms')
.controller('ApiErrorCtrl', function ($scope, $uibModalInstance, errorMsg, errorDetails) {
    $scope.errorMsg = errorMsg;
    $scope.errorDetails = errorDetails;
    $scope.ok = function () {
        $uibModalInstance.close();
    };

})
.service('uiHandler', function(
    $uibModal
) {

    this.showErrorDialog = function(msg, details) {
        console.log('API Error:', msg, details);
        $uibModal.open({
            animation: true,
            templateUrl: 'scripts/fragments/api-error-modal.html',
            controller: 'ApiErrorCtrl',
            resolve: {
                errorMsg: function() {
                    return msg;
                },
                errorDetails: function() {
                    return details;
                }
            }
        });
    };

    // SHOW WELL DONE MODAL DIALOG
    this.showWellDoneDialog = function() {
        jQuery('#well-done-modal').modal({
            backdrop: 'static',
            keyboard: false,
            show: true
        });
    };

    // LOADING DIALOG
    this.showLoadingDialog = function() {
        jQuery('#loading-modal').modal({
            backdrop: 'static',
            keyboard: false,
            show: true
        });
    };

    // HIDE LOADING DIALOG
    this.hideLoadingDialog = function() {
        jQuery('#loading-modal').modal('hide');
    };

})
;
