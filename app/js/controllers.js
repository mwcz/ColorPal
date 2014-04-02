/*globals angular*/
/*jshint browser: true*/

(function () {
    'use strict';

    /* Controllers */

    var ColorPalControllers = angular.module('ColorPal.controllers', []);

    ColorPalControllers.controller(
        'ColorPalCtrl',
        function ($scope) {
            $scope.$on("fileProgress", function(e, progress) {
                $scope.progress = progress.loaded / progress.total;
            });
            $scope.$watch('file', function(new_val, old_val) {
            });
        }
    );

}());
