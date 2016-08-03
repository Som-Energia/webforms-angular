'use strict';

angular.module('SomEnergiaWebForms')
    .service('prepaymentService', ['$log', function($log) {

        var data;

        // SETTER
        var setData = function(pData) {
            data = pData;
            $log.log('prepaymentService set data', data);
        };

        // GETTER
        var getData = function() {
            return data;
        };

        return {
            setData: setData,
            getData: getData
        };

    }]);
