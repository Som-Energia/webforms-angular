'use strict';

angular.module('newSomEnergiaWebformsApp')
  .controller('MainCtrl', ['Restangular', '$scope', '$log', function (Restangular, $scope, $log) {

        var provincesCall = Restangular.all('http://somenergia-api-webforms.gisce.net/data/provincies');
        provincesCall.getList().then(function(result){
            $log.log('result', result);
            $scope.provinces = result;
        });

  }]);
