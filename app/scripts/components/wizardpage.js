'use strict';

angular.module('SomEnergiaWebForms')
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
        link: function(scope, element, attrs, wizardPageCtrl /*, $transclude*/) {
            // Use parent scope for transcluded content, instead using a clone
//            $transclude(scope.$parent, function(/*content*/) {});
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
            window.scrollTo(0,0);
        };
        $scope.next = function() {
            $scope.nextPage();
            window.scrollTo(0,0);
        };
    };
});


