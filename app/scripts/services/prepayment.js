'use strict';

angular.module('newSomEnergiaWebformsApp')
    .service('prepaymentService', ['$log', function($log) {

        // TODO: remove fake data in production
        var data = {
            endpoint: 'https://www.arquia.es/ArquiaRed/pgateway.aspx',
            payment_data: {
                CONC1: 'QUOTA SOCI',
                CONF: '0100',
                DNI_CLI: '13572468F',
                ID_OPERACION: 'dggokFcmcdq27D6f0A9ssJLzfZzYUH3',
                ID_USU: '37',
                IMPORTE: '100',
                NOMBRE_CLI: 'USUARIO DE PRUEBAS',
                REF: '2014f9d5b0d7'
            },
            payment_type: 'rebut'
        };

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

