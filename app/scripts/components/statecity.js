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
    ApiSomEnergia,
    uiHandler
) {
    var self = this;
    self.init = function(/*element,attrs*/) {
        $scope.form = {};
        $scope.provinces = [];
        $scope.cities = [];
        ApiSomEnergia.loadStates($scope);

        $scope.updateCities = function() {
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

    // Get cities
    self.getCities = function($scope, provinceId) {
        if (provinceId === undefined) { return; }

        var citiesPromise = ApiSomEnergia.dataRequest('data/municipis/' +  provinceId, '003');
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
