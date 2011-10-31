function log() {//{{{
    console.log( arguments );
};//}}}

var Cluster = function() {//{{{
    var mean,
        points;

    init = function() {//{{{
        points = [];
    },//}}}

    get_mean = function() {//{{{
        return mean;
    },//}}}

    set_mean = function( _mean ) {//{{{
        mean = _mean;
    },//}}}

    get_points = function() {//{{{
        return points;
    },//}}}

    remove_points = function( _p ) {//{{{
        points = [];
    },//}}}

    add_point = function( _p ) {//{{{
        points.push( _p );
    },//}}}

    update_mean = function() {//{{{
    
        // Sets the mean to the centroid of the points

        var r_cent = 0;
        var g_cent = 0;
        var b_cent = 0;
        var cent;

        if( points.length == 0 ) {
            console.error( "A cluster has no points :(  One or more colors will look stupid." );
            return;
        }

        for( var ip = points.length - 1; ip >= 0; ip-- ) {
            cent = points[ip].get();
            r_cent += cent[0];
            g_cent += cent[1];
            b_cent += cent[2];
        }

        r_cent /= points.length;
        g_cent /= points.length;
        b_cent /= points.length;

        r_cent = Math.round( r_cent );
        g_cent = Math.round( g_cent );
        b_cent = Math.round( b_cent );

        if( isNaN( r_cent ) ) {
            console.error("BAD!");
        }

        mean.set( r_cent,
                  g_cent,
                  b_cent );
    };//}}}

    return {
        init          : init,
        update_mean   : update_mean,
        get_mean      : get_mean,
        set_mean      : set_mean,
        get_points    : get_points,
        add_point     : add_point,
        remove_points : remove_points
    };
};//}}}

var Point = function() {//{{{
    var r, g, b,

    init = function( _r, _g, _b ) {//{{{
        set( _r, _g, _b );
    },//}}}

    get = function() {//{{{
        return [ r, g, b ];
    },//}}}

    set = function( _r, _g, _b ) {//{{{
        r = _r;
        g = _g;
        b = _b;
    },//}}}

    dist = function( _p ) {//{{{

        // Calculates the distance between this point and another point

        var coords = _p.get();
        var distance = Point();

        /**
        // Euclidean distance
        return Math.floor( 
                 Math.sqrt( ( coords[0] - r ) * ( coords[0] - r ) +
                          ( coords[1] - g ) * ( coords[1] - g ) +
                          ( coords[2] - b ) * ( coords[2] - b ) ) );
        /**/

        /**/
        // Manhattan distance
        return Math.abs( coords[0] - r ) +
               Math.abs( coords[1] - g ) +
               Math.abs( coords[2] - b );
        /**/

    };//}}}

    return {
        init : init,
        set  : set,
        get  : get,
        dist : dist
    };
};//}}}

var KMeans = function() {//{{{

    var K,
        clusters,
        points,
        min_corner,
        max_corner;

    init = function( _k, _data ) {//{{{

        K        = _k;
        clusters = [];
        points   = [];
        min_corner = [255,255,255];
        max_corner = [0,0,0];

        load_canvas_pixel_array( _data );

        find_min_max();

        generate_initial_clusters();

    },//}}}

    find_min_max = function() {//{{{

        var p;
        
        for( var ip = points.length - 1; ip >= 0; ip-- ) {
            p = points[ip].get();
            min_corner[0] = ( min_corner[0] > p[0] ) ? p[0] : min_corner[0];
            min_corner[1] = ( min_corner[1] > p[1] ) ? p[1] : min_corner[1];
            min_corner[2] = ( min_corner[2] > p[2] ) ? p[2] : min_corner[2];

            max_corner[0] = ( max_corner[0] < p[0] ) ? p[0] : max_corner[0];
            max_corner[1] = ( max_corner[1] < p[1] ) ? p[1] : max_corner[1];
            max_corner[2] = ( max_corner[2] < p[2] ) ? p[2] : max_corner[2];
        }

        console.log( "min:" + min_corner );
        console.log( "max:" + max_corner );

    },//}}}

    generate_initial_clusters = function() {//{{{

        // Initialize K clusters at random locations
        Math.seedrandom("this is colorpal!");
        for( i = K - 1; i >= 0; i-- ) {

            // Create an empty cluster
            var c = Cluster();
            c.init();

            // Generate a random location for this cluster
            var mean = Point();
            mean.init(
                Math.floor( min_corner[0] + Math.random() * max_corner[0] ),
                Math.floor( min_corner[1] + Math.random() * max_corner[1] ),
                Math.floor( min_corner[2] + Math.random() * max_corner[2] )
            );

            log( "Initial mean added at [" + mean.get().toString() + "]" );

            c.set_mean( mean );

            clusters.push( c );
        }
    },//}}}

    assign = function() {//{{{

        // Add each point to the nearest cluster

        // add each point to the nearest cluster 
        for( var ip = points.length - 1; ip >= 0; ip-- ) {

            var p = points[ip];
            var c, d;

            // The index of the closest cluster to this point
            var closest_cluster_index;
            // The distance to the closest cluster to this point
            var closest_cluster_dist = 99999999999;

            for( var ic = clusters.length - 1; ic >= 0; ic-- ) {

                c = clusters[ic];
                d = p.dist( c.get_mean() );

                if( d < closest_cluster_dist ) {
                    closest_cluster_index = ic;
                    closest_cluster_dist = d;
                }
            }

            if( typeof p == "undefined" ) {
                console.log("NO BAD!" );
            }
            clusters[ closest_cluster_index ].add_point( p );
        }

    },//}}}

    update = function() {//{{{

        for( var ic = clusters.length - 1; ic >= 0; ic-- ) {
            var c = clusters[ic];
            c.update_mean();
        }

    },//}}}

    get_clusters = function() {//{{{
        for( var ic = clusters.length - 1; ic >= 0; ic-- ) {
            var colors = clusters[ic].get_mean().get();
            document.getElementById( "swatch" + ic ).style.backgroundColor = "rgb(" + colors[0] + "," + colors[1] + "," + colors[2] + ")";
            console.log( colors );
        }
    }//}}}

    load_canvas_pixel_array = function( _pixels ) {//{{{

        for( var i = _pixels.length - 1; i >= 0; i -= 4 ) {

            var p = Point();
            p.init( _pixels[ i - 3 ],
                    _pixels[ i - 2 ],
                    _pixels[ i - 1 ] );

            points.push( p );
        }

    };//}}}

    return {
        init         : init,
        assign       : assign,
        update       : update,
        get_clusters : get_clusters
    };

};//}}}

window.onload = function() {//{{{
    console.time("everything");
    var img = document.createElement("img");
    img.src = "mediumpic.png";
    canvas  = document.getElementById("colorpal_canvas");
    ctx     = canvas.getContext("2d");

    // match canvas height to img height
    canvas.width = img.width / 10;
    canvas.height = img.height / 10;
    canvas.style.width = img.width / 10 + "px";
    canvas.style.height = img.height / 10 + "px";

    // draw image!
    ctx.drawImage(img, 0, 0, img.width / 10, img.height / 10);

    var image_data = ctx.getImageData( 0, 0, canvas.width, canvas.height ).data;

    var km = KMeans();
    km.init( 5, image_data );
    km.assign();
    km.update();
    console.timeEnd("everything");
    km.get_clusters();
    var txt = document.createTextNode("hahahah");
};//}}}

// vim: set foldmethod=marker:
