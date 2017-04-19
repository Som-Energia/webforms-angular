'use strict';

angular.module('SomEnergiaWebForms')
    .controller('NewMemberCtrl', function (cfg, ApiSomEnergia, ValidateHandler, uiHandler, $scope, $http, $routeParams, $translate, $timeout, $location, $log) {

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

        $scope.form = {};
        $scope.form.payment = 'remesa';
        $scope.newPartner = {};
        $scope.ibanEditor = {};
        $scope.stopErrors = undefined;
        $scope.ready = false;

        $scope.formSubmitted = false;
        $scope.messages = null;

        // Form error check
        $scope.checkErrors = function() {
            function error(msg) {
                if ($scope.stopErrors !== msg) {
                    $scope.stopErrors = msg;
                }
                return false;
            }
            if ($scope.newPartner.isReady === undefined) {
                return false; // Just initializing
            }
            if ($scope.newPartner.isReady()!==true) {
                return error($scope.newPartner.error);
            }
            if ($scope.form.payment !== 'creditcard') {
                if ($scope.ibanEditor.isValid === undefined) {
                    return false; // Just initializing
                }
                if ($scope.ibanEditor.isValid() !== true) {
                    return error('INVALID_PAYER_IBAN');
                }
            }
            $scope.stopErrors=undefined;
            return true;
        };

        // CONTROL READY STEPS ON CHANGE FORM
        $scope.formListener = function () {
            $scope.checkErrors();
        };

        // ON SUBMIT FORM
        $scope.submit = function() {
            $scope.formSubmitted = true;
            $scope.messages = null;
            $scope.newPartner.dniDuplicated = false;
            // Prepare request data
            var postData = {
                tipuspersona: $scope.newPartner.usertype === 'person' ? cfg.USER_TYPE_PERSON : cfg.USER_TYPE_COMPANY,
                nom: $scope.newPartner.name,
                dni: $scope.newPartner.dni,
                tel: $scope.newPartner.phone1,
                tel2: $scope.newPartner.phone2 || '',
                email: $scope.newPartner.email1,
                cp: $scope.newPartner.postalcode,
                provincia: $scope.newPartner.province.id,
                adreca: $scope.newPartner.address,
                municipi: $scope.newPartner.city.id,
                idioma: $scope.newPartner.language.code,
                payment_method:
                    $scope.form.payment === 'bankaccount' ? cfg.PAYMENT_METHOD_BANK_ACCOUNT : (
                    $scope.form.payment === 'creditcard' ?  cfg.PAYMENT_METHOD_CREDIT_CARD:
                    cfg.PAYMENT_METHOD_PAYMENT_ORDER
                ),
                payment_iban: $scope.ibanEditor.value,
                urlok: $translate.instant('NEWMEMBER_OK_REDIRECT_URL'),
                urlko: $translate.instant('NEWMEMBER_KO_REDIRECT_URL'),
            };
            if ($scope.newPartner.usertype === 'person') {
                postData.cognom = $scope.newPartner.surname;
            } else if ($scope.newPartner.usertype === 'company') {
                postData.representant_nom = $scope.newPartner.representantname;
                postData.representant_dni = $scope.newPartner.representantdni;
            }
            $log.log('request postData', postData);
            // Send request data POST
            var postPromise = ApiSomEnergia.postRequest($scope, cfg.API_BASE_URL + 'form/soci/alta', postData, '004');
            postPromise.then(
                function (response) {
                    if (response.state === cfg.STATE_FALSE) {
                        // error
                        $scope.modalTitle = $translate.instant('ERROR_POST_NOVASOCIA');
                        $scope.messages = $scope.getHumanizedAPIResponse(response.data);
                        $scope.formSubmitted = false;
                        jQuery('#webformsGlobalMessagesModal').modal('show');
                    } else if (response.state === cfg.STATE_TRUE) {
                        if (response.data.endpoint === undefined) {
                            // Direct debit, no payment platform required
                            window.top.location.href = $translate.instant('NEWMEMBER_OK_REDIRECT_URL');
                        }
                        else if (true) {
                            // Credit card or bank 
                            $log.log('response received', response);
                            $location.path('/'+$routeParams.locale+'/prepagament');
                            window.top.location.href = $location.absUrl();
                        }
                        else {
                        }
                    }
                },
                function (reason) {
                    $log.error('Post data failed', reason);
                    $scope.rawReason = JSON.stringify(reason,null,'  ');
                    $scope.formSubmitted = false;
                    jQuery('#webformsGlobalMessagesModal').modal('show');
                }
            );

            return true;
        };

        // GET HUMANIZED API RESPONSE
        $scope.getHumanizedAPIResponse = function(arrayResponse) {
            if (arrayResponse.required_fields !== undefined) {
                for (var i = 0; i < arrayResponse.required_fields.length; i++) {
                    if (arrayResponse.required_fields[i] === 'provincia') {
                        $scope.partnerForm.province.$setValidity('requiredp', false);
                    } else if (arrayResponse.required_fields[i] === 'municipi') {
                        $scope.partnerForm.city.$setValidity('requiredm', false);
                    }
                }
            }
            if (arrayResponse.invalid_fields !== undefined) {
                for (var j = 0; j < arrayResponse.invalid_fields.length; j++) {
                    if (arrayResponse.invalid_fields[j].field === 'dni' && arrayResponse.invalid_fields[j].error === 'exist') {
                        $scope.newPartner.dniDuplicated = true;
                        $scope.partnerForm.dni.$setValidity('exist', false);
                    }
                }
            }
			return ApiSomEnergia.humanizedResponse(arrayResponse);
        };

    });
