function imagedata_to_rgb( _image_data ) {

    // Translates an ImageData object's CanvasPixelArray into
    // an RGB array of the form:
    //
    //      [
    //          [ r1, g1, b1 ],
    //          [ r2, g2, b2 ],
    //          ...
    //          [ rN, gN, bN ]
    //      ]

    var rgb_array = [];

    for( var i = ( _image_data.data.length / 4 ) - 1; i >= 0; i -= 4 ) {

        rgb_array.push( [ 
            _image_data.data[ i - 3 ], 
            _image_data.data[ i - 2 ], 
            _image_data.data[ i - 1 ] 
        ] );

    }

    return rgb_array;

}
