'use strict';

angular.module('SomEnergiaWebForms')
    .controller('ModifyCtrl', function (cfg, ApiSomEnergia, ValidateHandler, uiHandler, $scope, $http, $routeParams, $translate, $timeout, $window, $log) {

        // INIT
        $scope.developing = cfg.DEVELOPMENT;
        // MUST APPLY TO EMBED WITH WORDPRESS (detects inside frame)
        if (window !== window.top) { // Inside a frame
            try {
                document.domain = cfg.BASE_DOMAIN;
            } catch(err) {
                console.log('While setting document domain:', err);
            }
        }

        // Just when developing, show untranslated strings instead of falling back to spanish
        if (!$scope.developing ) {
            $translate.fallbackLanguage('es');
        }
        if ($routeParams.locale !== undefined) {
            $translate.use($routeParams.locale);
        }

        // To false to debug one page completion state independently from the others
        $scope.waitPreviousPages = false;

        $scope.form = {};
        $scope.form.phases = undefined;
        $scope.form.discriminacio = undefined;
        $scope.form.contact_name = undefined;
        $scope.form.contact_surname = undefined;
        $scope.form.contact_phone = undefined;

        $scope.rate20IsInvalid = false;
        $scope.rate21IsInvalid = false;
        $scope.rate3AIsInvalid = false;

        $scope.farePageError = undefined;

        $scope.formSubmitted = false;
        $scope.availablePowers = function() {
            if ($scope.form.phases === undefined) {
                return [];
            }
            if ($scope.form.phases === 'mono') {
                return $scope.availablePowersMonophase;
            }
            return $scope.availablePowersTriphase;
        };
        $scope.rates = [
            cfg.RATE_20A,
            cfg.RATE_20DHA,
            cfg.RATE_20DHS,
            cfg.RATE_21A,
            cfg.RATE_21DHA,
            cfg.RATE_21DHS,
            cfg.RATE_30A,
        ];
        $scope.availablePowersMonophase = [
/*
            0.345,
            0.69,
            0.805,
            1.15,
            1.725,
*/
            2.3,
            3.45,
            4.6,
            5.75,
            6.9,
            8.05,
            9.2,
            10.35,
            11.5,
            14.49,
        ];
        $scope.availablePowersTriphase = [
/*
            1.039,
            2.078,
            2.425,
            3.464,
*/
            5.196,
            6.928,
            10.392,
            13.856,
/*
            17.321,
            20.785,
            24.249,
            27.713,
            31.177,
            34.641,
            43.648,
*/
        ];

        // POWER VALIDATION
        ValidateHandler.validatePower($scope, 'form.power');
        ValidateHandler.validatePower($scope, 'form.power2');
        ValidateHandler.validatePower($scope, 'form.power3');
        ValidateHandler.validateInteger($scope, 'form.estimation');
        ValidateHandler.validateTelephoneNumber($scope, 'form.contact_phone');

        $scope.esAlta = function() {
            return true;
        };

        $scope.$watch('form.phases', function(oldvalue, newvalue) {
            // Reseting newpower if we change phases
            if (oldvalue!==newvalue) {
                $scope.form.newpower = undefined;
            }
            $scope.formListener();
        });
        function recomputeFareFromAlta(/*oldvalue, newvalue*/) {
            var newFare = (
                $scope.form.newpower+0 < 10 ? '2.0' : (
                $scope.form.newpower+0 < 15 ? '2.1' : (
                $scope.form.newpower!==undefined ? '3.0' :
                undefined)));
            if (newFare!=='3.0' && newFare !== undefined) {
                $scope.form.power=$scope.form.newpower;
            }
            if (newFare !== undefined) {
                var discrimination = $scope.form.newpower+0<15 ? $scope.form.discriminacio : 'nodh';
                if (discrimination===undefined) {
                    newFare = undefined;
                } else {
                    newFare += { nodh:'A', dh:'DHA', dhs:'DHS' }[discrimination];
                }
            }
            $scope.form.rate = newFare;
        }
        $scope.$watch('form.newpower', recomputeFareFromAlta);
        $scope.$watch('form.discriminacio', recomputeFareFromAlta);

        $scope.isFarePageComplete = function() {
            //console.log('- isFarePageComplete');
            function error(message) {
                if ($scope.farePageError !== message) {
                    $scope.farePageError = message;
                    //console.log(message);
                }
                return false;
            }

            $scope.farePageError = undefined;

            if ($scope.esAlta()===true) {
                if ($scope.form.phases===undefined) {
                    return error('NO_MONOPHASE_CHOICE');
                }
            }
            if ($scope.esAlta()===false) {
                if ($scope.form.rate === undefined) {
                    return error('NO_FARE_CHOSEN');
                }
            }
            if ($scope.form.power === undefined) {
                return error('NO_POWER_CHOSEN');
            }
            switch ($scope.form.rate) {
                case cfg.RATE_20A:
                case cfg.RATE_20DHA:
                case cfg.RATE_20DHS:
                    if ($scope.rate20IsInvalid) {
                        return error('INVALID_POWER_20');
                    }
                    break;
                case cfg.RATE_21A:
                case cfg.RATE_21DHA:
                case cfg.RATE_21DHS:
                    if ($scope.rate21IsInvalid) {
                        return error('INVALID_POWER_21');
                    }
                    break;
                case cfg.RATE_30A:
                    if ($scope.form.power2 === undefined) {
                        return error('NO_POWER_CHOSEN_P2');
                    }
                    if ($scope.form.power3 === undefined) {
                        return error('NO_POWER_CHOSEN_P3');
                    }
                    if ($scope.rate3AIsInvalid) {
                        return error('INVALID_POWER_30');
                    }
                    break;
            }
            if ($scope.esAlta()===true) {
                if  ($scope.form.rate !== cfg.RATE_30A) {
                    if ($scope.form.discriminacio===undefined) {
                        return error('NO_HOURLY_DISCRIMINATION_CHOSEN');
                    }
                }
            }
            return true;
        };

        $scope.isContactInfoComplete = function() {
            function error(message) {
                if ($scope.farePageError !== message) {
                    $scope.farePageError = message;
                    //console.log(message);
                }
                return false;
            }
            if ($scope.form.contact_name === undefined) {
                return error('NO_NAME');
            }
            if ($scope.form.contact_surname === undefined) {
                return error('NO_SURNAME');
            }
            if ($scope.form.contact_phone === undefined) {
                return error('NO_PHONE');
            }
            return true;
        };




        $scope.formListener = function() {
            //console.log('listener');
//            $scope.isPayerPageComplete();
        };

        // KLUDGE: how to translate params of a translation
        // DOUBLE: how to translate params of a translation and passing it to the child scopes
        $scope.t={};
        $scope.t.HELP_INSTALL_TYPE_URL = $translate.instant('HELP_INSTALL_TYPE_URL');
        $scope.t.HELP_POTENCIA_URL = $translate.instant('HELP_POTENCIA_URL');
        $scope.t.HELP_DISCRIMINACIO_HORARIA_URL = $translate.instant('HELP_DISCRIMINACIO_HORARIA_URL');
        $scope.t.HELP_POWER_30_URL = $translate.instant('HELP_POWER_30_URL');
        $scope.t.HELP_POPOVER_CUPS_ALTA_URL = $translate.instant('HELP_POPOVER_CUPS_ALTA_URL');
        $scope.t.HELP_POPOVER_RATE_URL = $translate.instant('HELP_POPOVER_RATE_URL');
        $scope.t.HELP_CONTACT_INFO_URL = $translate.instant('HELP_CONTACT_INFO_URL');

        // ON SUBMIT FORM
        $scope.submit = function() {
            $scope.messages = null;
            $scope.formSubmitted = true;
            $scope.overflowAttachFile = false;
            uiHandler.showLoadingDialog();
            // Prepare request data
            var formData = new FormData();
            formData.append('proces', 'M1'); // TODO: Needed?
            formData.append('tarifa', $scope.form.rate);
            formData.append('potencia', Math.round($scope.form.power * cfg.THOUSANDS_CONVERSION_FACTOR));
            formData.append('potencia_p2', $scope.form.rate === cfg.RATE_30A ? Math.round($scope.form.power2 * cfg.THOUSANDS_CONVERSION_FACTOR) : '');
            formData.append('potencia_p3', $scope.form.rate === cfg.RATE_30A ? Math.round($scope.form.power3 * cfg.THOUSANDS_CONVERSION_FACTOR) : '');
            formData.append('contact_name', $scope.form.contact_name);
            formData.append('contact_surname', $scope.form.contact_surname);
            formData.append('contact_phone', $scope.form.contact_phone);
            formData.append('token', $routeParams.token);
            // Send request data POST
            $http({
                method: 'POST',
                url: cfg.API_BASE_URL + 'form/modificacio',
                headers: {'Content-Type': undefined},
                data: formData,
                transformRequest: angular.identity
            }).then(
                function(response) {
                    uiHandler.hideLoadingDialog();
                    $log.log('response received', response);
                    if (response.data.status !== cfg.STATUS_ONLINE) {
                        // L'ERP està parat
                        return uiHandler.postError(
                            $translate.instant('ERROR_POST_MODIFY'),
                            $translate.instant('API_SERVER_OFFLINE'),
                            $translate.instant('API_SERVER_OFFLINE_DETAILS'),
                            JSON.stringify(response.data, null,'  ')
                            );
                    }
                    if (response.data.state === cfg.STATE_TRUE) {
                        // Funciona!
                        return uiHandler.showWellDoneDialog(
                            'MODIFY_POTTAR_SUCCESS_TITTLE',
                            'MODIFY_POTTAR_SUCCESS_MESSAGE',
                            {
                                'backlink': 'MODIFY_POTTAR_SUCCESS_REDIRECT',
                                'url': $routeParams.backurl,
                            }
                        );
                    }
                    // error
                    $scope.submitReady = false;
                    if (response.data.data === undefined){
                        // Unexpected response format
                        return uiHandler.postError(
                            $translate.instant('ERROR_POST_MODIFY'),
                            $translate.instant('MODIFY_POTTAR_UNEXPECTED'),
                            $translate.instant('MODIFY_POTTAR_UNEXPECTED_DETAILS'),
                            JSON.stringify(response.data, null,'  ')
                            );
                    }
                    if (response.data.data.invalid_fields!==undefined) {
                        // Camp invalid
                        return uiHandler.postError(
                            $translate.instant('ERROR_POST_MODIFY'),
                            $translate.instant('MODIFY_POTTAR_INVALID_FIELD'),
                            $scope.getHumanizedAPIResponse(response.data.data),
                            JSON.stringify(response.data, null,'  ')
                            );
                    }
                    if (response.data.data.required_fields!==undefined) {
                        // Camp requerit
                        return uiHandler.postError(
                            $translate.instant('ERROR_POST_MODIFY'),
                            $translate.instant('MODIFY_POTTAR_REQUIRED_FIELD'),
                            $scope.getHumanizedAPIResponse(response.data.data),
                            JSON.stringify(response.data, null,'  ')
                            );
                    }
                    var errorMap = {
                        ongoingprocess: 'MODIFY_POTTAR_ONGOING_PROCESS', // Ja hi ha un cas obert a ERP
                        inactivecontract: 'MODIFY_POTTAR_INACTIVE_CONTRACT', // Polissa en estat no actiu
                        notallowed: 'MODIFY_POTTAR_NOT_ALLOWED', // Turbio
                        badtoken: 'MODIFY_POTTAR_BAD_TOKEN', // Sessió expirada
                    };
                    var errorString = errorMap[response.data.data.error] || 'MODIFY_POTTAR_UNEXPECTED'; // Error no esperat
                    uiHandler.postError(
                        $translate.instant('ERROR_POST_MODIFY'),
                        $translate.instant(errorString),
                        $translate.instant(errorString + '_DETAILS'),
                        JSON.stringify(response.data, null,'  ')
                        );
                },
                function(reason) {
                    $log.error('Send POST failed', reason);
                    var rawReason = JSON.stringify(reason,null,'  ');
                    uiHandler.hideLoadingDialog();
                    if (reason.status === -1) {
                        // Problemes amb CORS o API caiguda o xarxa
                        return uiHandler.postError(
                            $translate.instant('ERROR_POST_MODIFY'),
                            $translate.instant('API_SERVER_ERROR'),
                            $translate.instant('API_SERVER_ERROR_DETAILS'),
                            rawReason
                            );
                    }
                    else if (reason.status === 413) {
                        $scope.messages = 'ERROR 413';
                    } else {
                        $scope.messages = 'ERROR';
                    }
                    jQuery('#webformsGlobalMessagesModal').modal('show');
                }
            );

            return true;
        };

        // GET HUMANIZED API RESPONSE
        $scope.getHumanizedAPIResponse = function(arrayResponse) {
            if (arrayResponse.invalid_fields !== undefined) {
                for (var j = 0; j < arrayResponse.invalid_fields.length; j++) {
                    if (arrayResponse.invalid_fields[j].field === 'cups' && arrayResponse.invalid_fields[j].error === 'exist') {
                    } else
                    if (arrayResponse.invalid_fields[j].field === 'fitxer' && arrayResponse.invalid_fields[j].error === 'bad_extension') {
                    }
                }
            }
            return ApiSomEnergia.humanizedResponse(arrayResponse);
        };

    });


