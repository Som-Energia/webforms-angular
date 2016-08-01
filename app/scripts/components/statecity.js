'use strict';

var sharedStates;
var sharedStatesPromise;
var statesWaitingScopes = [];

angular.module('newSomEnergiaWebformsApp')
.directive('stateCity', function(
) {
    return {
        restrict: 'E',
        templateUrl: 'scripts/components/statecity.html',
        scope: {
            model: '=',
            stateModel: '=',
            cityModel: '=',
            onchanged: '&?',
            small: '@?',
            quietlabels: '@?',
        },
        link: function(scope, element, attrs, stateCityController) {
            stateCityController.init(/*element, attrs*/);
        },
        controller: 'stateCityController',
    };
})
.controller('stateCityController', function(
    cfg,
    $scope,
    AjaxHandler,
    uiHandler
) {
    var self = this;
    self.init = function(/*element,attrs*/) {
        $scope.form = {};
        $scope.provinces = [];
        $scope.cities = [];
        self.getStates($scope);

        $scope.updateSelectedCity = function() {
            $scope.cityModel=undefined;
            $scope.cities=[];
            if ($scope.stateModel===undefined) { return; }
            self.getCities($scope, $scope.stateModel.id);
        };

        $scope.formListener = function() {
            if ($scope.onchanged !== undefined) {
                $scope.onchanged();
            }
        };
    };


    self.getStates = function($scope) {
        console.log('getStates', sharedStates, sharedStatesPromise);

        // already called and have the result
        if (sharedStates !== undefined) {
            $scope.provinces  = sharedStates;
            return;
		}
        // already called but no result yet
        if (sharedStatesPromise!==undefined) {
            statesWaitingScopes.push($scope);
            return;
        }

        sharedStatesPromise = AjaxHandler.getDataRequest($scope, cfg.API_BASE_URL + 'data/provincies', '001');
        sharedStatesPromise.then(
            function (response) {
                if (response.state === cfg.STATE_TRUE) {
                    sharedStates = $scope.provinces  = response.data.provincies;
                    jQuery.each(statesWaitingScopes, function(i,s) {
                        console.log(s);
                        s.provinces=$scope.provinces;
                    });
                } else {
                    uiHandler.showErrorDialog('GET response state false recived (ref.003-001)');
                }
            },
            function (reason) { uiHandler.showErrorDialog('Get states failed ' + reason); }
        );
    };

    // Get cities
    self.getCities = function($scope, provinceId) {
        if (provinceId === undefined) { return; }

        var citiesPromise = AjaxHandler.getDataRequest($scope, cfg.API_BASE_URL + 'data/municipis/' +  provinceId, '003');
        citiesPromise.then(
            function (response) {
                if (response.state === cfg.STATE_TRUE) {
                    $scope.cities = response.data.municipis;
                } else {
                    uiHandler.showErrorDialog('GET response state false recived (ref.003-003)');
                }
            },
            function (reason) {
                uiHandler.showErrorDialog('Update city select failed ' + reason);
            }
        );
        $scope.formListener();
    };
})
;
