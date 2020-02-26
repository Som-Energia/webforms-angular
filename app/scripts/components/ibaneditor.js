'use strict';

angular.module('SomEnergiaWebForms')
.directive('ibanEditor', function () {
    return {
        restrict: 'E',
        scope: {
            model: '=',
            value: '=?',
            help: '@',
            inputid: '@',
            small: '@?',
            placeholder: '@?',
            required: '@?',
            quietlabels: '@?', // hide 'optional' and 'required' texts
            checkurl: '@?',
            helpText: '@?',
            onchanged: '&?',
            oktext: '@?',
            suffix: '@?',
            prefix: '@?',
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
        ApiSomEnergia
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
            $scope.value = $scope.model.value;
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
            if ($scope.checkurl === undefined) {
                $scope._isValid = true;
                $scope.formListener();
                return;
            }
            $scope._isValid = undefined; // checking
            $scope.model.error = undefined;
            if ($scope._lastPromise !== undefined) {
                $scope._lastPromise.abort();
            }
            var promise = ApiSomEnergia.getStateRequest(
                $scope, cfg.APIV2_BASE_URL +
                $scope.checkurl + $scope.model.value,
                '017');
            $scope._lastPromise = promise;
            promise.value = $scope.model.value;
            promise.then(
                function (response) {
                    if (promise.value !== $scope.model.value) {
                        // Changed while waiting a response, ignore
                        return;
                    }
                    $scope._isValid = response.state !== cfg.STATE_FALSE;
                    $scope.model.data = response.data;
                    $scope.formListener();
                },
                function(reason) {
                    // TODO: Translate 'Unknown'
                    $scope._isValid = reason.state !== cfg.STATE_FALSE;
                    if (reason.status === cfg.STATUS_OFFLINE){
                        $log.log('Server error:', reason);
                        $scope.model.serverError = reason || 'Unknown';
                    }
                    $scope.formListener();
                }
            );
            $scope.formListener();
        };
    };
});

