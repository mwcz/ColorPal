var farb, pick, selected, CP_ViewModel;
$(document).ready(function() {

    CP_ViewModel = {

        colors : ko.observableArray( [
            new CP_Color("#000"), new CP_Color("#000"),
            new CP_Color("#000"), new CP_Color("#000"),
            new CP_Color("#000"), new CP_Color("#000"),
            new CP_Color("#000"), new CP_Color("#000"),
        ]),

    };

    ko.applyBindings( CP_ViewModel );


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

                // make colorpicker look deactivated
                pick.removeClass('cp-picker-active');
                pick.addClass('cp-picker-inactive');

                // make swatch look deselected
                $(this).removeClass('cp-swatch-selected');

                // now nothing is selected
                selected = false;
            } else {

                // get the swatch number from the id "cp-swatch-2", etc.
                // just grab the last character with slice(-1)
                var swatch_num = $(this).attr('id').slice(-1);

                // make color picker look activated
                pick.removeClass('cp-picker-inactive');
                pick.addClass('cp-picker-active');

                // make swatch look selected
                $(selected = this).addClass('cp-swatch-selected');

                // set the colorpicker to this swatch's color. (note that
                // this will cause the colorpicker's callback to fire)
                farb.setColor( CP_ViewModel.colors()[ swatch_num ].hex() );
            }
        });

    function CP_Color( hex ) {
        return {
            hex: ko.observable(hex)
        };
    }
});


