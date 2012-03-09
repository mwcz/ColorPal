(function() {


var ctx,
    ctx_small,
    canvas,
    canvas_small,
    mc,
    img_width           = 0,
    img_height          = 0,
    max_canvas_width    = 468,
    canvas_small_height = 128,
    canvas_small_width  = 128;

function handle_file_select( evt ) {

    if( evt.stopPropagation ) evt.stopPropagation();
    if( evt.preventDefault  ) evt.preventDefault();

    var files = evt.dataTransfer.files; // FileList object

    // Loop through the FileList and render image files as thumbnails.
    for ( var i = 0, f; f = files[i]; i++ ) {

        // Only process image files.
        if (!f.type.match('image.*')) {
            continue;
        }

        var reader       = new FileReader();
        var img          = document.createElement("img"); // display-size image
        var img_small    = document.createElement("img"); // smaller image for faster median cut

        img.onload = function() {

            var img_ratio     = img.width / img.height;

            var canvas_width  = ( img.width  > max_canvas_width  ) ? ( img_ratio > 1 ) ? max_canvas_width  : max_canvas_width*img_ratio  : img.width;
            var canvas_height = Math.floor( canvas_width / img_ratio );
            // Resize the canvas to the image size
            canvas.width             = canvas_width;
            canvas.height            = canvas_height;

            // Resize the canvas with CSS to trigger CSS3 transitions
            canvas.style.width       = canvas_width + "px";
            canvas.style.height      = canvas_height + "px";

            // Draw the downsized image inside the canvas
            ctx_small.drawImage( img, 0, 0, canvas_small_width, canvas_small_height );

            var data = ctx_small.getImageData( 0, 0, canvas_small_width, canvas_small_height );
            var rgbdata = imagedata_to_rgb( data );
            mc = MedianCut();
            mc.init( rgbdata );
            var palette = mc.get_fixed_size_palette( 8 );

            // clear any previous swatches

            for( var ic = palette.length - 1; ic >= 0; ic-- ) {
                var color = palette[ic];
                var hex = farb.pack( [ color[0]/255, color[1]/255, color[2]/255 ] );
                CP_ViewModel.colors()[ic].hex(hex);
                //var sp = create_swatch( ic, color );
                //swatches.appendChild( sp );
            }

            // Draw the display image
            ctx.drawImage( img, 0, 0, canvas_width, canvas_height );

        };

        // Read in the image file as a data URL.
        reader.readAsDataURL(f);

        reader.onload = function(e) {

            // Assign the image's src to the filesystem image's data URL
            // [http://en.wikipedia.org/wiki/Data_URI_scheme]
            img.src = e.target.result; 

        };
    }
}


// Drag and drop event handlers
function file_drag_start( e ) {

    if( e.stopPropagation ) {
        e.stopPropagation()
    }

    return false;
}

function file_drag_enter( e ) {
}

function file_drag_over( e ) {
    e.stopPropagation();
    e.preventDefault();
    e.dataTransfer.dropEffect="copy";
    $(canvas).addClass('cp-canvas-drag-over');
}

function file_drag_leave( e ) {
    e.stopPropagation();
    e.preventDefault();
    e.dataTransfer.dropEffect="copy";
    $(canvas).removeClass('cp-canvas-drag-over');
}

function file_drag_end  ( e ) {
}





$(window).load( function() {
    document.getElementById("cp-input-image").onchange = handle_file_select;

    canvas              = document.getElementById("cp-canvas");

    canvas_small        = document.createElement("canvas");
    canvas_small.width  = canvas_small_width;
    canvas_small.height = canvas_small_height;

    ctx                 = canvas.getContext("2d");
    ctx_small           = canvas_small.getContext("2d");

    // Set up drag handles
    var image_drop_zone = document.getElementById("cp-canvas");
    image_drop_zone.addEventListener( "dragstart", file_drag_start   , false );
    image_drop_zone.addEventListener( "dragenter", file_drag_enter   , false );
    image_drop_zone.addEventListener( "dragover" , file_drag_over    , false );
    image_drop_zone.addEventListener( "dragleave", file_drag_leave   , false );
    image_drop_zone.addEventListener( "drop"     , handle_file_select, false );
    image_drop_zone.addEventListener( "dragend"  , file_drag_end     , false );

    /* TODO: enable file input selection of images (esp. for mobile)
    var file_input = document.getElementById("cp-input-image");
    file_input.addEventListener( "change", handle_file_select, false );
    */


} );


}());
