'use strict';

angular.module('newSomEnergiaWebformsApp')
.directive('ibanEditor', function () {
    return {
        restrict: 'E',
        scope: {
            model: '=',
            help: '@',
            inputid: '@',
            placeholder: '@?',
            required: '@?',
            checkurl: '@?',
            helpText: '@?',
            onchanged: '&?',
        },
        transclude: true,
        templateUrl: 'scripts/components/ibaneditor.html',
        controller: 'ibanEditorCtrl',
        link: function(scope, element, attrs, ibanEditorCtrl) {
            ibanEditorCtrl.init(element, attrs);
        },
    };
})
.controller('ibanEditorCtrl', function (
        cfg,
        $scope,
        $timeout,
        $log,
        AjaxHandler
        ) {
    var self = this;
    self.init = function(/*element, attrs*/) {

        $scope._isValid = $scope.required === undefined;
        $scope._lastPromise = undefined;
        $scope.model.value = undefined;
        $scope.model.serverError = undefined;

        $scope.model.inServerError = function() {
            return $scope.model.serverError !== undefined;
        };
        $scope.model.isRequiredMissing = function() {
            if ($scope.model.inServerError()) { return false; }
            if ($scope.required === undefined) { return false; }
            return $scope.model.value === undefined || $scope.model.value === '';
        };
        $scope.model.isValidating = function() {
            if ($scope.model.inServerError()) { return false; }
            if ($scope.model.isRequiredMissing()) { return false; }
            return $scope._isValid === undefined;
        };
        $scope.model.isValid = function() {
            if ($scope.model.inServerError()) { return false; }
            if ($scope.model.isRequiredMissing()) { return false; }
            return $scope._isValid === true;
        };
        $scope.model.isInvalid = function() {
            if ($scope.model.inServerError()) { return false; }
            if ($scope.model.isRequiredMissing()) { return false; }
            return $scope._isValid === false;
        };
        $scope.model.isOptionallyEmpty = function() {
            if ($scope.model.inServerError()) { return false; }
            if ($scope.model.isRequiredMissing()) { return false; }
            if ($scope._isValid === false) { return false; }
            return $scope.model.value === undefined;
        };

        $scope.formListener = function() {
            if ($scope.onchanged !== undefined) {
                $scope.onchanged();
            }
        };
        $scope.onChange = function () {
            $scope.model.serverError = undefined;
            // Unify value for some browsers when not required
            if ($scope.model.value === '') {
                $scope.model.value = undefined;
            }
            if ($scope.model.value === undefined) {
                $scope._isValid = ($scope.required === undefined);
                $scope.formListener();
                return;
            }
            $scope._isValid = undefined; // checking
            if ($scope._lastPromise !== undefined) {
                $scope._lastPromise.abort();
            }
            var promise = AjaxHandler.getStateRequest(
                $scope, cfg.API_BASE_URL +
                ($scope.checkurl || 'check/iban/') + $scope.model.value,
                '017');
            $scope._lastPromise = promise;
            promise.value = $scope.model.value;
            promise.then(
                function (response) {
                    if (promise.value !== $scope.model.value) {
                        // Changed while waiting a response, ignore
                        return;
                    }
                    $scope._isValid = response !== cfg.STATE_FALSE;
                    $scope.model.data = response.data;
                    $scope.formListener();
                },
                function(reason) {
                    // TODO: Translate 'Unknown'
                    $log.log('Server error:', reason);
                    $scope.model.serverError = reason || 'Unknown';
                    $scope.formListener();
                }
            );
            $scope.formListener();
        };
    };
});

