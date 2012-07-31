var farb, pick, selected, CP_ViewModel;
$(document).ready(function() {


    function CP_ViewModelFn() {
        var self = this;

        self.colors = ko.observableArray( [
            new CP_Color("#000"), new CP_Color("#000"),
            new CP_Color("#000"), new CP_Color("#000"),
            new CP_Color("#000"), new CP_Color("#000"),
            new CP_Color("#000"), new CP_Color("#000"),
        ]);

        self.selected = ko.observable(false);

        self.palette_created = ko.computed( function() {

            var i,
                is_default_palette = true;

            for( i = self.colors().length - 1; i >= 0; --i ) {
                if ( self.colors()[i].hex() != "#000" ) {
                    is_default_palette = false;
                }
            }

            return !is_default_palette;

			// yes, this means pasting in a pure black image
			// will not cause swatches to appear.  I'm okay with that :)

        });

        self.output = ko.computed({

            read: function() {
                var colorstring = "";
                for( var color in self.colors() ) {
                    colorstring += self.colors()[color].hex() + "\n";
                }
                return colorstring;
            },

            write: function (value) {
                var colorarray = value.trim().split("\n"),
                    i = self.colors().length - 1;
                for ( ; i >= 0; --i ) {
                    self.colors()[i].hex( colorarray[i] );
                }
                console.log(value);
            },

            owner: self

        });

    };

    CP_ViewModel = new CP_ViewModelFn;

    ko.applyBindings( CP_ViewModel );

    function CP_Color( hex ) {
        return {
            hex: ko.observable(hex)
        };
    }

    farb = $.farbtastic('#cp-picker');
    farb.linkTo(function( hex ) {
        if( selected ) {
            var swatch_id = $(selected).attr('id').slice(-1);
            CP_ViewModel.colors()[ swatch_id ].hex( hex );
        }
    });
    pick = $('#cp-picker');
    selected;
    $('.cp-swatch')
        .click(function() {
            if (selected) {
                $(selected).removeClass('cp-swatch-selected');
            }
            if ( selected == this ) {

                // make swatch look deselected
                $(this).removeClass('cp-swatch-selected');

                // now nothing is selected
                selected = false;
                CP_ViewModel.selected(false);
            } else {

                // get the swatch number from the id "cp-swatch-2", etc.
                // just grab the last character with slice(-1)
                var swatch_num = $(this).attr('id').slice(-1);

                // make swatch look selected
                $(selected = this).addClass('cp-swatch-selected');
                CP_ViewModel.selected(true);

                // set the colorpicker to this swatch's color. (note that
                // this will cause the colorpicker's callback to fire)
                farb.setColor( CP_ViewModel.colors()[ swatch_num ].hex() );
            }
        });

});


