define(function () {

    function rgb_line(rgb_arg) {
        return 'rgb(' + rgb_arg[0] + ',' + rgb_arg[1] + ',' + rgb_arg[2] + ')';
    }

    function scss(rgb_array) {
        function scss_line(rgb_arg, num) {
            return '$color' + num + ': ' + rgb_line(rgb_arg, num) + ';';
        }
        return rgb_array.map(scss_line).join('\n');
    }

    function sass(rgb_array) {
        function sass_line(rgb_arg, num) {
            return '$color' + num + ': ' + rgb_line(rgb_arg, num) + ';';
        }
        return rgb_array.map(sass_line).join('\n');
    }

    function json(rgb_array) {
        return rgb_array;
    }

    function less(rgb_array) {
        function less_line(rgb_arg, num) {
            return '@color' + num + ': ' + rgb_line(rgb_arg, num) + ';';
        }
        return rgb_array.map(less_line).join('\n');
    }

    function rgb(rgb_array) {
        return rgb_array.map(rgb_line).join('\n');
    }

    function hex(rgb_array) {
        function hex_line(rgb_arg, num) {
            var r = ('0' + rgb_arg[0].toString(16)).slice(-2),
                g = ('0' + rgb_arg[1].toString(16)).slice(-2),
                b = ('0' + rgb_arg[2].toString(16)).slice(-2);
            return "#" + r + g + b;
        }
        return rgb_array.map(hex_line).join('\n');
    }

    function clayto(rgb_array) {
        function clayto_line(rgb_arg, num) {
            return 'Palette' + num + ': ' + rgb_line(rgb_arg, num);
        }
        return rgb_array.map(clayto_line).join('\n');
    }

    return {
        scss   : scss,
        sass   : sass,
        json   : json,
        less   : less,
        rgb    : rgb,
        hex    : hex,
        clayto : clayto
    };
});

