/*globals ColorPal*/
/*jshint browser: true*/

(function () {
    'use strict';

    /* Directives */

    ColorPal.directive("dropzone", function(QFileReader) {
        return {
            restrict : "A",
            link: function (scope, el) {
                el.bind('dragstart', function(ev) {
                    ev.stopPropagation();
                });
                el.bind('dragover', function(ev) {
                    ev.stopPropagation();
                    ev.preventDefault();
                    ev.dataTransfer.dropEffect="copy";
                });
                el.bind('dragleave', function(ev) {
                    ev.stopPropagation();
                    ev.preventDefault();
                    ev.dataTransfer.dropEffect="copy";
                });
                el.bind('drop', function(ev) {

                    ev.stopPropagation();
                    ev.preventDefault();

                    function handleData(data_url) {
                        scope.file = data_url;
                    }

                    QFileReader.readAsDataUrl(ev.dataTransfer.files[0], scope)
                    .then(handleData);

                });
            }
        }
    });

}());
