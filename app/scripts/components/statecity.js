'use strict';

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
            onChange: '&',
            small: '@?',
        },
        link: function(scope, element, attrs, stateCityController) {
            stateCityController.init(element, attrs);
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
    self.init = function(element,attrs) {
        $scope.form = {};
        $scope.provinces = [];
        $scope.cities = [];
        AjaxHandler.getStates($scope);

        $scope.updateSelectedCity = function() {
            $scope.cityModel=undefined;
            $scope.cities=[];
            if ($scope.stateModel===undefined) { return; }
            self.getCities($scope, $scope.stateModel.id);
        };

        $scope.formListener = function() {
            console.log('stateCityController.formListener called');
        };
    };
    self.getStates = function($scope) {
        var statesPromise = AjaxHandler.getDataRequest($scope, cfg.API_BASE_URL + 'data/provincies', '001');
        statesPromise.then(
            function (response) {
                if (response.state === cfg.STATE_TRUE) {
                    $scope.provinces  = response.data.provincies;
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
