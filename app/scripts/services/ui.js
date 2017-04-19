'use strict';

angular.module('SomEnergiaWebForms')
.controller('ApiErrorCtrl', function ($scope, $uibModalInstance, $log, data) {
    $log.log('controller', data);
    $scope.data = data;
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
                data: {
                    errorMsg: msg,
                    errorDetails: details,
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
                data: {
                    'title': title,
                    'description': description,
                    'details': details,
                },
            }
        });
    };
    this.showWellDoneDialog = function(title, message, params) {
        $uibModal.open({
            size: 'lg',
            keyboard: false,
            backdrop: 'static',
            templateUrl: 'scripts/fragments/well-done-modal.html',
            controller: 'ApiErrorCtrl',
            resolve: {
                data: {
                    'title': title || 'REGISTRE_OK',
                    'message': message || 'REGISTRE_OK_MSG',
                    'params': params || {},
                },
            },
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
