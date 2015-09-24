'use strict';

angular.module('newSomEnergiaWebformsApp')
.directive('wizardPage', function () {
    return {
        restrict: 'E',
        scope: {
            title: '@',
            prevPage: '&',
            nextPage: '&',
            current: '=',
            showAlways: '=',
            ready: '='
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
/*
        $timeout,
        $log,
        AjaxHandler
*/
        ) {
    var self = this;
    self.init = function(/*element, attrs*/) {
        $scope.prev = function() {
            $scope.prevPage();
        };
        $scope.next = function() {
            $scope.nextPage();
        };
    };
});


