'use strict';

angular.module('newSomEnergiaWebformsApp')
.directive('wizardPage', function () {
    return {
        restrict: 'E',
        scope: {
            model: '=',
            header: '@',
            pageName: '@',
            prevPage: '&',
            nextPage: '&',
            /*current: '=',*/
            showAlways: '=',
            ready: '=',
            nextText: '@?',
        },
        transclude: true,
        templateUrl: 'scripts/components/wizardpage.html',
        controller: 'wizardPageCtrl',
        link: function(scope, element, attrs, wizardPageCtrl) {
            wizardPageCtrl.init(element, attrs);
        },
    };
})
.controller('wizardPageCtrl', function (
        cfg,
        $scope
        ) {
    var self = this;
    self.init = function(/*element, attrs*/) {
        if ($scope.model.pages === undefined) {
            $scope.model.pages = [];
        }
        if ($scope.model.pages.indexOf($scope.pageName) < 0) {
            $scope.model.pages.push($scope.pageName);
        } else {
            console.log("Duplicated page on Wizard", $scope.pageName);
        }
        $scope.prev = function() {
            $scope.prevPage();
        };
        $scope.next = function() {
            $scope.nextPage();
        };
    };
});


