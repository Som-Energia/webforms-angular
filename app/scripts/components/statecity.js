'use strict';

angular.module('SomEnergiaWebForms')
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
    $scope,
    ApiSomEnergia
) {
    var self = this;
    self.init = function(/*element,attrs*/) {
        $scope.form = {};
        $scope.provinces = [];
        $scope.cities = [];
        ApiSomEnergia.loadStates($scope);

        $scope.updateCities = function() {
            $scope.cityModel = undefined;
            $scope.cities=[];
            if ($scope.stateModel===undefined) { return; }
            ApiSomEnergia.loadCities($scope, $scope.stateModel.id);
        };

        $scope.formListener = function() {
            if ($scope.onchanged !== undefined) {
                $scope.onchanged();
            }
        };
    };
})
;
