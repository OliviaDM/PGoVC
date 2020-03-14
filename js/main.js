// PASS THE VOXEL BOX COORDINATES TO VERT SHADE to convert the postitions for sampling based on camera
// REFACTOR HARDCODED VALUES: dim (need in frag_shade for checking inside sampling)
// REFACTOR SHADER REFERENCES: would be p cool to be able to switch shaders
// USER INTERFACE??? be able to select shader, number of voxel boxes

function main () {

    
    //CAMERA AND RENDERER CREATION
    const camera = new THREE.OrthographicCamera( -4, 4, 4, -4, 0.1, 1000 );
    camera.position.z = 5;
    
    const renderer = new THREE.WebGLRenderer({
        antialias: true
    });
    renderer.setSize( 700, 700 );
    document.body.appendChild( renderer.domElement );
    const canvas = document.querySelector("canvas");






    

    //CREATE THE CUBE
    const dim = 4;
    const volume = new THREE.BoxGeometry( dim, dim, dim );


    //CREATE THE CLOUD INFORMATION
    const num_clouds = 12;
    const clouds = generate_clouds(num_clouds);
    const p_seed = [151,160,137,91,90,15, 131,13,201,95,96,53,194,233,7,225,140,36,103,30,69,142,8,99,37,240,21,10,23,190, 6,148,247,120,234,75,0,26,197,62,94,252,219,203,117,35,11,32,57,177,33, 88,237,149,56,87,174,20,125,136,171,168, 68,175,74,165,71,134,139,48,27,166, 77,146,158,231,83,111,229,122,60,211,133,230,220,105,92,41,55,46,245,40,244, 102,143,54, 65,25,63,161, 1,216,80,73,209,76,132,187,208, 89,18,169,200,196, 135,130,116,188,159,86,164,100,109,198,173,186, 3,64,52,217,226,250,124,123, 5,202,38,147,118,126,255,82,85,212,207,206,59,227,47,16,58,17,182,189,28,42, 223,183,170,213,119,248,152, 2,44,154,163, 70,221,153,101,155,167, 43,172,9, 129,22,39,253, 19,98,108,110,79,113,224,232,178,185, 112,104,218,246,97,228, 251,34,242,193,238,210,144,12,191,179,162,241, 81,51,145,235,249,14,239,107, 49,192,214, 31,181,199,106,157,184, 84,204,176,115,121,50,45,127, 4,150,254, 138,236,205,93,222,114,67,29,24,72,243,141,128,195,78,66,215,61,156,180]
    const p_perm = p_seed + p_seed;


    const perlin_n = new THREE.TextureLoader().load( 'noise/01perlin_contrasted.png' );
    
    
    //BACKPOSITION RENDERING
    const back_scene = new THREE.Scene();
    const back_cube = add_back_material(volume, back_frag_shade, back_vert_shade);
    back_scene.add( back_cube );
    // var axesHelper = new THREE.AxesHelper( 3 );
    // back_scene.add( axesHelper );

    const back_buffer = new THREE.WebGLRenderTarget( 700, 700);
    
    
    //REAL SCENE INFO
    const scene = new THREE.Scene();
    const volume_cube = add_material(volume, frag_shade(num_clouds), vert_shade(num_clouds), back_buffer, 700, 700, clouds, perlin_n, p_perm);
    scene.add( volume_cube );
    // var axesHelper2 = new THREE.AxesHelper( 3 );
    // scene.add( axesHelper2 );












    //USER INTERACTION
    let mouseDown = false,
        mouseX = 0,
        mouseY = 0;

    function onMouseMove(evt) {
        if (!mouseDown) {
            return;
        }

        evt.preventDefault();
        let deltaX = evt.clientX - mouseX,
            deltaY = evt.clientY - mouseY;
        mouseX = evt.clientX;
        mouseY = evt.clientY;
        rotateScene(deltaX, deltaY);
    }

    function onMouseDown(evt) {
        evt.preventDefault();

        mouseDown = true;
        mouseX = evt.clientX;
        mouseY = evt.clientY;
    }

    function onMouseUp(evt) {
        evt.preventDefault();
        mouseDown = false;
    }

    let cur_scene = scene;

    function switchScene(evt) {
        evt.preventDefault();
        if (cur_scene === scene) {
            cur_scene = back_scene;
        } else {
            cur_scene = scene;
        }
    }

    canvas.addEventListener('mousemove', function (e) {
        onMouseMove(e);
    }, false);
    canvas.addEventListener('mousedown', function (e) {
        onMouseDown(e);
    }, false);
    canvas.addEventListener('mouseup', function (e) {
        onMouseUp(e);
    }, false);
    canvas.addEventListener('contextmenu', function (e) {
        switchScene(e);
    }, false);
    

    function rotateScene(deltaX, deltaY) {
        scene.rotation.y += deltaX / 100;
        scene.rotation.x += deltaY / 100;
        back_scene.rotation.y += deltaX / 100;
        back_scene.rotation.x += deltaY / 100;
    }







    //ANIMATE
    function animate() {
        requestAnimationFrame( animate );

        //RENDER TO BACK BUFFER
        renderer.setRenderTarget( back_buffer );
        renderer.setClearColor( 0xf2c4de, 1 );
        renderer.render( back_scene, camera );
        
        //RENDER THE REAL SCENE
        renderer.setRenderTarget( null );
        renderer.setClearColor( 0x000000, 1 );
        // renderer.setClearColor( 0xc4e6f2, 1 );
        renderer.render( cur_scene, camera );

    }
    animate();
};