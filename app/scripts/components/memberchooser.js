'use strict';

angular.module('SomEnergiaWebForms')
.directive('memberChooser', function () {
    return {
        restrict: 'E',
        scope: {
            buttonText: '@',
            formvalues: '=',
            model: '=',
            onproceed: '&',
        },
        templateUrl: 'scripts/components/memberchooser.html',
        controller: 'memberChooserCtrl',
        link: function(scope, element, attrs, memberChooserCtrl) {
            memberChooserCtrl.init(element, attrs);
        },
    };
})
.controller('memberChooserCtrl', function (
        cfg,
        $scope,
        $timeout,
        $log,
        ApiSomEnergia,
        ValidateHandler
        ) {
    var self = this;
    self.init = function(element, attrs) {
        $scope.model.soci = {};
        $scope.mostraNomSociTrobat = attrs.showMemberName !== undefined;
        $scope.developing = false;
        $scope.dniIsInvalid = true;

        $scope._states = {
            IDLE: 1,
            VALIDATINGID: 2,
            VALIDATINGMEMBER: 3,
            INVALIDID: 4,
            INVALIDMEMBER: 5,
            READY: 6,
            APIERROR: 7
        };
        $scope.model._state = $scope._states.IDLE;

        $scope.isIdle = function () {
            return $scope.model._state === $scope._states.IDLE;
        };
        $scope.isValidatingId = function () {
            return $scope.model._state === $scope._states.VALIDATINGID;
        };
        $scope.isValidatingMember = function () {
            return $scope.model._state === $scope._states.VALIDATINGMEMBER;
        };
        $scope.isInvalidId = function () {
            return $scope.model._state === $scope._states.INVALIDID;
        };
        $scope.isInvalidMember = function () {
            return $scope.model._state === $scope._states.INVALIDMEMBER;
        };
        $scope.isReady = function () {
            return $scope.model._state === $scope._states.READY;
        };
        $scope.isApiError = function () {
            return $scope.model._state === $scope._states.APIERROR;
        };
        $scope.currentInitState = function() {
            return Object.keys($scope._states)
                .filter(function(key) {
                    return $scope._states[key] === $scope.model._state;
                })[0];
        };
        $scope.model.isIdle = $scope.isIdle;
        $scope.model.isValidatingId = $scope.isValidatingId;
        $scope.model.isValidatingMember = $scope.isValidatingMember;
        $scope.model.isInvalidId = $scope.isInvalidId;
        $scope.model.isInvalidMember = $scope.isInvalidMember;
        $scope.model.isReady = $scope.isReady;
        $scope.model.isApiError = $scope.isApiError;
        $scope.model.currentInitState = $scope.currentInitState;


        var timeoutCheckSoci = false;
        $scope.$watch('formvalues.socinumber', function(newValue) {
            if ($scope.isIdle()) {return;}
            if ($scope.isValidatingId()) {return;}
            if ($scope.isInvalidId()) {return;}

            if (newValue === undefined) {
                $scope.model._state = $scope._states.INVALIDMEMBER;
                return;
            }

            $scope.model._state = $scope._states.VALIDATINGMEMBER;

            if (timeoutCheckSoci) {
                $timeout.cancel(timeoutCheckSoci);
            }
            timeoutCheckSoci = $timeout(function() {
                // TODO: Remove redundant conditions
                if (newValue !== undefined && !$scope.dniIsInvalid && $scope.formvalues.dni !== undefined) {
                    $scope.executeGetSociValues();
                }
            }, cfg.DEFAULT_MILLISECONDS_DELAY);
        });

        var timeoutCheckDni = false;
        $scope.$watch('formvalues.dni', function(newValue) {
            if (newValue === undefined) {
                $scope.model._state = $scope._states.IDLE;
                return;
            }
            $scope.model._state = $scope._states.VALIDATINGID;
            if (timeoutCheckDni) {
                $timeout.cancel(timeoutCheckDni);
            }
            timeoutCheckDni = $timeout(function() {
                var dniPromise = ApiSomEnergia.getStateRequest($scope, cfg.API_BASE_URL + 'check/vat/' + newValue, '005');
                dniPromise.dni = newValue;
                dniPromise.then(
                    function (response) {
                        if (dniPromise.dni !== $scope.formvalues.dni) {
                            //console.log('Ignorant validació del DNI '+dniPromise.dni+' perque ja val '+$scope.formvalues.dni);
                            return;
                        }
                        console.log(response);
                        $scope.dniIsInvalid  = response.state === cfg.STATE_FALSE;
                        if ($scope.dniIsInvalid) {
                            $scope.model._state = $scope._states.INVALIDID;
                            return;
                        }
                        if ($scope.formvalues.socinumber === undefined) {
                            // TODO: Review this transition
                            $scope.model._state = $scope._states.INVALIDMEMBER;
                            return;
                        }
                        $scope.model._state = $scope._states.VALIDATINGMEMBER;
                        $scope.executeGetSociValues();
                    },
                    // TODO: Server error state and display reason
                    function (reason) {
                        $log.error('Check DNI failed', reason);
                        $scope.model._state = $scope._states.APIERROR;
                    }
                );
            }, cfg.DEFAULT_MILLISECONDS_DELAY);
        });
        // Backward with order.js  
        $scope.formListener = function() {
        };

        // PARTNER NUMBER VALIDATION
        ValidateHandler.validateInteger($scope, 'formvalues.socinumber');

        // GET PARTNER DATA
        $scope.executeGetSociValues = function() {
            var sociPromise = ApiSomEnergia.dataRequest('data/soci/' + $scope.formvalues.socinumber + '/' + $scope.formvalues.dni, '001');
            sociPromise.soci = $scope.formvalues.socinumber;
            sociPromise.dni = $scope.formvalues.dni;
            sociPromise.then(
                function(response) {
                    if ($scope.formvalues.socinumber !== sociPromise.soci) {return;}
                    if ($scope.formvalues.dni !== sociPromise.dni) {return;}

                    if (response.state === cfg.STATE_TRUE) {
                        $log.log('Get partner info response received', response);
                        $scope.model.soci = response.data.soci;
                        $scope.model._state = $scope._states.READY;
                    } else {
                        $scope.model._state = $scope._states.INVALIDMEMBER;
                    }
                },
                function(reason) {
                    $scope.model._state = $scope._states.APIERROR;
                    $scope.apiError = reason;
                    $log.error('Get partner info failed', reason);
                }
            );
        };
        $scope.proceed = function() {
            $scope.onproceed();
        };
    };
});



