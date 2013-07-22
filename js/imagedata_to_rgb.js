function imagedata_to_rgb( _image_data ) {

    "use strict";

    // Translates an ImageData object's CanvasPixelArray into
    // an RGB array of the form:
    //
    //      [
    //          [ r1, g1, b1 ],
    //          [ r2, g2, b2 ],
    //          ...
    //          [ rN, gN, bN ]
    //      ]

    var rgb_array = [],
        rgb_color,
        i;

    for( i = _image_data.data.length - 1; i > 1; i -= 4 ) {

		rgb_color = [ 
            _image_data.data[ i - 3 ], 
            _image_data.data[ i - 2 ], 
            _image_data.data[ i - 1 ] 
        ] ;

        rgb_array.push( rgb_color );

    }

    return rgb_array;

}
