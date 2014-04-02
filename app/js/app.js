/*globals angular*/
/*jshint browser: true*/

(function () {
    'use strict';


    // Declare app level module which depends on filters, and services
    window.ColorPal = angular.module('ColorPal', [
        'ngRoute',
        'ColorPal.services',
        'ColorPal.controllers'
    ]).
    config(function($routeProvider, $httpProvider) {

        // Configure routes
        $routeProvider.when('/', {templateUrl: 'partials/dropzone.html', controller: 'ColorPalCtrl'});
        $routeProvider.otherwise({redirectTo: '/'});

    });

}());
