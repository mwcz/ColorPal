/*global ko, CP_Color*/
/*jslint browser: true*/
var ColorPal_farb, ColorPal_pick, ColorPal_selected, ColorPal_ViewModel;

(function ($) {

    "use strict";

    $(function () { // Is this a palindrome?

        var OUTPUT_FORMATS,
            DEFAULT_OUTPUT_FORMAT;

        DEFAULT_OUTPUT_FORMAT = "hex";

        OUTPUT_FORMATS = {
            "hex"  : "VALUE",
            "sass" : "$cpal-color-INDEX: VALUE;",
            "less" : "@cpal-color-INDEX: VALUE;",
        };

        function build_output_color_string( index, value, type ) {
            return OUTPUT_FORMATS[ type ].replace( "INDEX", index ).replace( "VALUE", value );
        }

        function ColorPal_ViewModelFn() {
            var self = this;

            self.colors = ko.observableArray( [
                new CP_Color("#000"), new CP_Color("#000"),
                new CP_Color("#000"), new CP_Color("#000"),
                new CP_Color("#000"), new CP_Color("#000"),
                new CP_Color("#000"), new CP_Color("#000"),
            ]);

            self.selected = ko.observable(false);

            self.output_type = ko.observable( DEFAULT_OUTPUT_FORMAT );

            self.palette_created = ko.computed( function() {

                var i,
                is_default_palette = true;

                for( i = self.colors().length - 1; i >= 0; --i ) {
                    if ( self.colors()[i].hex() !== "#000" ) {
                        is_default_palette = false;
                    }
                }

                return !is_default_palette;

                // yes, this means pasting in a pure black image
                // will not cause swatches to appear.  I'm okay with that :)

            });

            self.output = ko.computed({

                read: function() {
                    var colorstring = "",
                        index;
                    for( index = 0; index < self.colors().length; ++index ) {
                        colorstring += build_output_color_string(
                            index,
                            self.colors()[index].hex(),
                            self.output_type() 
                        );

                        // Add a \n if we're not yet at the last value
                        if( self.colors().length - 1 !== index ) {
                            colorstring += "\n";
                        }
                    }
                    return colorstring;
                },

                write: function (value) {
                    var colorarray = value.split("\n"),
                        i;

                    for ( i = self.colors().length - 1; i >= 0; --i ) {
                        self.colors()[i].hex( colorarray[i] );
                    }
                },

                owner: self

            });

        }

        ColorPal_ViewModel = new ColorPal_ViewModelFn();

        ko.applyBindings( ColorPal_ViewModel );

        function CP_Color( hex ) {
            return {
                hex: ko.observable(hex)
            };
        }

        ColorPal_farb = $.farbtastic('#cp-picker');
        ColorPal_farb.linkTo(function( hex ) {
            if( ColorPal_selected ) {
                var swatch_id = $(ColorPal_selected).attr('id').slice(-1);
                ColorPal_ViewModel.colors()[ swatch_id ].hex( hex );
            }
        });
        ColorPal_pick = $('#cp-picker');
        $('.cp-swatch').click(function() {
            if (ColorPal_selected) {
                $(ColorPal_selected).removeClass('cp-swatch-selected');
            }
            if ( ColorPal_selected === this ) {

                // make swatch look deselected
                $(this).removeClass('cp-swatch-selected');

                // now nothing is selected
                ColorPal_selected = false;
                ColorPal_ViewModel.selected(false);
            } else {

                // get the swatch number from the id "cp-swatch-2", etc.
                // just grab the last character with slice(-1)
                var swatch_num = $(this).attr('id').slice(-1);

                // make swatch look selected
                ColorPal_selected = this;
                $(ColorPal_selected).addClass('cp-swatch-selected');
                ColorPal_ViewModel.selected(true);

                // set the colorpicker to this swatch's color. (note that
                // this will cause the colorpicker's callback to fire)
                ColorPal_farb.setColor( ColorPal_ViewModel.colors()[ swatch_num ].hex() );
            }
        });

    });
}(jQuery));
