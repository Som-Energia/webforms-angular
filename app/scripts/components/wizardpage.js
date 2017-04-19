'use strict';

angular.module('SomEnergiaWebForms')
.directive('wizardPage', function () {
    return {
        restrict: 'E',
        transclude: true, // inner html copied to ng-transclude directive
        templateUrl: 'scripts/components/wizardpage.html',
        controller: 'wizardPageCtrl',
        scope: {
            model: '=', // wizard model
            header: '@?', // page header text
            pageName: '@', // page id
            prevPage: '&?', // js returning prev page id
            nextPage: '&?', // js returning next page id
            showAlways: '=', // ignore paging and show all
            ready: '=', // enables next page
            prevText: '@?', // alternative text for the prev button
            nextText: '@?', // alternative text for the next button
            //onPrev: '&?', // js to execute before swiching prev
            //onNext: '&?', // js to execute before swiching prev
            hideButtons: '@?', // whether to hide the next/prev buttons
        },
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
        function goTo(page) {
            $scope.model.setPage(page());
        }
        $scope.model.setPage = function(page) {
            $scope.model.current = page;
            window.scrollTo(0,0);
        };
        $scope.prev = function() {
            goTo($scope.prevPage);
        };
        $scope.next = function() {
            goTo($scope.nextPage);
        };
    };
});


