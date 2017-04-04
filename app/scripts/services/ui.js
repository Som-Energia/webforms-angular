'use strict';

angular.module('SomEnergiaWebForms')
.controller('ApiErrorCtrl', function ($scope, $uibModalInstance, title, errorMsg, errorDetails) {
    $scope.title = title;
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

    this.postError = function(title, description, details) {
        console.log('API Error:', title, description, details);
        $uibModal.open({
            templateUrl: 'scripts/fragments/post-error-modal.html',
            controller: 'ApiErrorCtrl',
            resolve: {
                title: function() {
                    return title;
                },
                errorMsg: function() {
                    return description;
                },
                errorDetails: function() {
                    return details;
                }
            }
        });
    };
    this.showWellDoneDialog = function() {
        $uibModal.open({
            size: 'lg',
            keyboard: false,
            backdrop: 'static',
            templateUrl: 'scripts/fragments/well-done-modal.html'
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
