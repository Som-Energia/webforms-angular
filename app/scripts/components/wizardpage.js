'use strict';

angular.module('newSomEnergiaWebformsApp')
.directive('wizardPage', function () {
    return {
        restrict: 'E',
        scope: {
            model: '=',
            header: '@?',
            pageName: '@',
            prevPage: '&',
            nextPage: '&',
            showAlways: '=',
            ready: '=',
            prevText: '@?',
            nextText: '@?',
            hideButtons: '@?',
        },
        transclude: true,
        templateUrl: 'scripts/components/wizardpage.html',
        controller: 'wizardPageCtrl',
        link: function(scope, element, attrs, wizardPageCtrl, transclude) {
            console.debug('transclude:', transclude);
            transclude(scope.$parent, function(content) {
                scope.caca;
                element.replaceChild(content);
            });
            wizardPageCtrl.init(element, attrs);
        },
    };
})
.controller('wizardPageCtrl', function (
        cfg,
        $scope
        ) {
    var self = this;
    self.init = function( /* element, attrs */ ) {
        if ($scope.model.pages === undefined) {
            $scope.model.pages = [];
        }
        if ($scope.model.pages.indexOf($scope.pageName) < 0) {
            $scope.model.pages.push($scope.pageName);
        } else {
            console.log('Duplicated page on Wizard', $scope.pageName);
        }
        $scope.prev = function() {
            $scope.prevPage();
        };
        $scope.next = function() {
            $scope.nextPage();
        };
    };
});


