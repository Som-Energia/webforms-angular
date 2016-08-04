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

    this.showWellDoneDialog = function() {
        jQuery('#well-done-modal').modal({
            backdrop: 'static',
            keyboard: false,
            show: true
        });
    };

    this.showLoadingDialog = function() {
        this.loading = $uibModal.open({
            size: 'lg',
            keyboard: false,
            backdrop: 'static',
            templateUrl: 'scripts/fragments/loading-api-modal.html'
        });
        return this.loading;
    };

    this.hideLoadingDialog = function() {
        this.loading.close();
        this.loading = undefined;
    };

})
;
