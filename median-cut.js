var Box = function() {

    var data,
        box,
        dim, // number of dimensions in the data

    init = function( _data ) {
        data = _data;
        dim  = 3; // lock this to 3 (RGB pixels) for now.
        box  = calculate_bounding_box();
    },

    get_data = function() {
        return data;
    },

    sort = function() {
        var a = get_longest_axis();
        var sort_method = get_comparison_func( a );
        data.sort( sort_method );
        return data;
    },

    // Return a comparison function based on a given index (for median-cut, sort on the longest axis)
    get_comparison_func = function( _i ) {
        var sort_method = function( a, b ) {
            return a[_i] - b[_i];
        };
        return sort_method;
    },

    split = function() {
        if( data.length <  0 ) console.error( "can't split; box is fucked! (box has less than 0 length)" );
        if( data.length == 0 ) console.error( "can't split; box is empty!" );
        if( data.length == 1 ) console.error( "can't split; box has one element!" );

        // TODO RESUME HERE

        // If even : split first half of data and second half of data into two new Boxes
        // If odd  : center data point goes into the lower-end box (floor the index)


    },

    median = function() {
        return Math.floor( data.length / 2 );
    },

    bounding_box = function() {
        return box;
    },

    calculate_bounding_box = function() {

        // keeps running tally of the min and max values on each dimension
        // initialize the min value to the highest number possible, and the
        // max value to the lowest number possible
        var minmax = [ { min: Number.MAX_VALUE, max: Number.MIN_VALUE },
                       { min: Number.MAX_VALUE, max: Number.MIN_VALUE },
                       { min: Number.MAX_VALUE, max: Number.MIN_VALUE } ];

        for( var i = data.length - 1; i >= 0; --i ) {

            minmax[0].min = ( data[i][0] < minmax[0].min ) ? data[i][0] : minmax[0].min; // r
            minmax[1].min = ( data[i][1] < minmax[1].min ) ? data[i][1] : minmax[1].min; // g
            minmax[2].min = ( data[i][2] < minmax[2].min ) ? data[i][2] : minmax[2].min; // b

            minmax[0].max = ( data[i][0] > minmax[0].max ) ? data[i][0] : minmax[0].max; // r
            minmax[1].max = ( data[i][1] > minmax[1].max ) ? data[i][1] : minmax[1].max; // g
            minmax[2].max = ( data[i][2] > minmax[2].max ) ? data[i][2] : minmax[2].max; // b
        }

        return minmax;

    },

    get_longest_axis = function() {
        var longest_axis = 0,
            longest_axis_size = 0;

        for( var i = dim - 1; i >= 0; --i ) {
            var axis_size = box[i].max - box[i].min;
            if( axis_size > longest_axis_size ) {
                longest_axis      = i;
                longest_axis_size = axis_size;
            }
        }

        return longest_axis;
    };

    return {

        /**/ // this stuff will be private; only public for debugging
        split            : split,
        get_data            : get_data,
        median           : median,
        bounding_box     : bounding_box,
        calculate_bounding_box     : calculate_bounding_box,
        get_longest_axis : get_longest_axis,
        sort             : sort,
        /**/

        init            : init,
        get_comparison_func : get_comparison_func
    };
};
