#!/usr/bin/env node

/***********************
 *  Wire up requirejs  *
 ***********************/

var requirejs = require('requirejs');

requirejs.config({
    baseUrl     : __dirname + '/includes',
    nodeRequire : require
});

/*************
 *  Imports  *
 *************/

var im      = require('imagemagick');
var fs      = require('fs');
var PNG     = require('pngjs').PNG;

var rgb     = requirejs('imgdata2rgb');
var mcut    = requirejs('mcut')();
var formats = requirejs('formats');
var format;
var formats_string = Object.keys(formats);
formats_string.splice(-1, 0, 'and');
formats_string = formats_string.join(', ');

/****************************************
 *  command line options with optimism! *
 ****************************************/

var argv = require('optimist')

    .usage('Generate a color palette from a PNG image! :)\nUSAGE: $0')

    // -f or --fixed
    .options('s', {
        alias: 'size',
        describe: 'Generate a fixed size palette; you specify the number of colors you want.'
    })

    // -d or --dynamic
    .options('d', {
        alias: 'dynamic',
        describe: 'Generate a palette, sized dynamically based on the color diversity of the image; you can optionally specify a number from 0.0 to 1.0, where larger numbers increase the number of colors.'
    })

    // -d or --dynamic
    .options('f', {
        default: "json",
        alias: 'format',
        describe: 'Specify the output format.  Options are ' + formats_string
    })

    .check(function (args) {
        var d_num = args.d && typeof args.d === "number",
            s_num = args.s && typeof args.s === "number";
        if (args.f && Object.keys(formats).indexOf(args.f) !== -1) {
            format = formats[args.f];
        }
        return d_num && s_num;
    })

    .argv;

var palette_types = {
    fixed: 'get_fixed_size_palette',
    dynamic: 'get_dynamic_size_palette'
};

var png  = new PNG({ filterType: -1 }),
    src  = fs.createReadStream(process.argv[2]),
    num,
    type;

if (argv.s) {
    type = palette_types.fixed;
    num  = argv.s;
} else {
    type = palette_types.dynamic;
    num  = argv.d || 0.4; // default dynamic scale 0.4
}

src
    .pipe(new PNG({
        filterType: 4
    }))
    .on('parsed', function() {
        var data = rgb(this),
            i,
            palette,
            output;
        mcut.init(data);
        palette = mcut[type](num);
        output = format(palette);
        console.log(output);
    });

