/*global THREE, requestAnimationFrame*/
/*jslint browser: true*/

(function () {

    var particle_cube;
    var particle_system;
    var particle_material;
    var scene;
    var camera;
    var renderer;
    var sprite;
    var mouseX = 0, mouseY = 0;
    var windowHalfX = window.innerWidth / 2;
    var windowHalfY = window.innerHeight / 2;

    function draw_scene () {
        var light = THREE.AmbientLight( 0xffffff );
        scene.add(light);

        var spotLight = new THREE.SpotLight( 0xffffff );
        spotLight.position.set( 10, 10, 100 );

        spotLight.castShadow = true;

        spotLight.shadowMapWidth = 1024;
        spotLight.shadowMapHeight = 1024;

        spotLight.shadowCameraNear = 500;
        spotLight.shadowCameraFar = 4000;
        spotLight.shadowCameraFov = 30;

        scene.add(spotLight);

        camera.position.z = 400;
    }

    function create_particle_cube (rgbdata) {
        sprite            = THREE.ImageUtils.loadTexture( "textures/sprites/ball.png" );
        cube_geo          = new THREE.CubeGeometry(255, 255, 255);
        cube_mat          = new THREE.MeshBasicMaterial({ color: 0x1f1f1f, wireframe: true });
        cube              = new THREE.Mesh(cube_geo, cube_mat);
        particle_cube     = new THREE.Geometry();
        particle_material = new THREE.ParticleSystemMaterial({
            size         : 3,
            vertexColors : THREE.VertexColors,
            transparent  : true
            //blending     : THREE.AdditiveBlending
        });

        var i;
        var colors = [];
        var color;
        var rgb;
        var vertex;

        for (i = 0; i < rgbdata.length; i += 1) {
            rgb = rgbdata[i];

            vertex = new THREE.Vector3();
            vertex.x = rgb[0];
            vertex.y = rgb[1];
            vertex.z = rgb[2];

            particle_cube.vertices[i] = vertex;

            color = new THREE.Color( rgb[0], rgb[1], rgb[2] );
            color.setRGB( vertex.x/255, vertex.y/255, vertex.z/255 );
            colors[i] = color;
        }

        particle_cube.colors = colors;

        particle_system = new THREE.ParticleSystem(particle_cube, particle_material);
        particle_system.position.x = -127.5;
        particle_system.position.y = -127.5;
        //cube.position.x = -127.5;
        //cube.position.x = -127.5;
        cube.position.z += 127.5;
        scene.add(particle_system);
        scene.add(cube);
    }

    function onDocumentMouseMove( event ) {

        mouseX = event.clientX - windowHalfX;
        mouseY = event.clientY - windowHalfY;

    }

    function onDocumentTouchStart( event ) {

        if ( event.touches.length === 1 ) {

            event.preventDefault();

            mouseX = event.touches[ 0 ].pageX - windowHalfX;
            mouseY = event.touches[ 0 ].pageY - windowHalfY;

        }

    }

    function onDocumentTouchMove( event ) {

        if ( event.touches.length === 1 ) {

            event.preventDefault();

            mouseX = event.touches[ 0 ].pageX - windowHalfX;
            mouseY = event.touches[ 0 ].pageY - windowHalfY;

        }

    }

    function render () {
        camera.position.x += ( mouseX - camera.position.x );
        camera.position.y += ( - mouseY - camera.position.y );

        camera.lookAt( scene.position );

        renderer.render(scene, camera);
        requestAnimationFrame(render);
    }

    function init (canvas, rgbdata) {
        scene = new THREE.Scene();
        camera = new THREE.PerspectiveCamera( 75, canvas.width / canvas.height, 0.1, 1000 );
        renderer = new THREE.WebGLRenderer({
            canvas: canvas,
            precision: "lowp",
            antialias: true
        });
        renderer.setSize( canvas.width, canvas.height );

        draw_scene();
        create_particle_cube(rgbdata);
        render();

        document.addEventListener( 'mousemove', onDocumentMouseMove, false );
        document.addEventListener( 'touchstart', onDocumentTouchStart, false );
        document.addEventListener( 'touchmove', onDocumentTouchMove, false );
    }

    //function mousev () {
        //return {
            //x: mouseloc.cur.x - mouseloc.prev.x,
            //y: mouseloc.cur.y - mouseloc.prev.y
        //};
    //}

    //window.addEventListener('mousemove', function (e) {

        //mouseloc.prev.x = mouseloc.cur.x;
        //mouseloc.prev.y = mouseloc.cur.y;
        //mouseloc.cur.x = e.clientX;
        //mouseloc.cur.y = e.clientY;

        //var mdx = mouseloc.cur.x - mouseloc.prev.x;
        //var mdy = mouseloc.cur.y - mouseloc.prev.y;

        //cube.rotation.x += mdy / 100;
        //cube.rotation.y += mdx / 100;

    //});

    var ColorCube = {
        init: init
    };

    window.scene = scene;
    window.ColorCube = ColorCube;

}());
