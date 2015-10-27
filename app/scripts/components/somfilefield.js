'use strict';

angular.module('newSomEnergiaWebformsApp')
.directive('somFileField', function () {
    console.log('directive');
    return {
        restrict: 'E',
        scope: {
            model: '=',
            description: '@?',
            placeholder: '@?',
            inputid: '@',
            formats: '@?',
            maxsize: '@?',
            required: '@?',
            helpText: '@?',
            onchanged: '&?',
        },
        templateUrl: 'scripts/components/somfilefield.html',
        controller: 'somFileFieldCtrl',
        link: function(scope, element, attrs, somFileFieldCtrl) {
            somFileFieldCtrl.init(element, attrs);
        },
    };
})
.controller('somFileFieldCtrl', function (
        cfg,
        $scope,
        $timeout,
        $log,
        AjaxHandler
        ) {
    var self = this;
    self.init = function(/*element, attrs*/) {
        $scope.invalidAttachFileExtension = false;
        $scope.overflowAttachFile = false;
        $scope.model.file = function() {
            return angular.element('#'+$scope.inputid)[0];
        };

        $scope.check = function(input) {
            console.log('input:', input);
            $scope.$apply(function() {
                var file = input.files[0];
                $scope.model.filename = file.name;
                $scope.model.size = file.size;
                $scope.overflowAttachFile = (file.size / 1024 / 1024) > $scope.maxsize;
                $scope.formListener();
            });
        };

        $scope.formListener = function() {
            if ($scope.onchanged !== undefined) {
                $scope.onchanged();
            }
        };
    };
});

