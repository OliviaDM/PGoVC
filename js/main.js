// PASS THE VOXEL BOX COORDINATES TO VERT SHADE to convert the postitions for sampling based on camera
// REFACTOR HARDCODED VALUES: dim (need in frag_shade for checking inside sampling)
// REFACTOR SHADER REFERENCES: would be p cool to be able to switch shaders
// USER INTERFACE??? be able to select shader, number of voxel boxes

function main (fs, vs, bfs, bvs) {




    
    //CAMERA AND RENDERER CREATION
    const camera = new THREE.OrthographicCamera( -4, 4, 4, -4, 0.1, 1000 );
    camera.position.z = 5;
    
    const renderer = new THREE.WebGLRenderer({
        antialias: true
    });
    renderer.setSize( window.innerWidth, window.innerHeight );
    document.body.appendChild( renderer.domElement );
    const canvas = document.querySelector("canvas");






    

    //CREATE THE CUBE
    const dim = 4;
    const volume = new THREE.BoxGeometry( dim, dim, dim );
    
    
    //BACKPOSITION RENDERING
    const back_scene = new THREE.Scene();
    const back_cube = add_back_material(volume, bfs, bvs);
    back_scene.add( back_cube );
    var axesHelper = new THREE.AxesHelper( 3 );
    back_scene.add( axesHelper );

    const back_buffer = new THREE.WebGLRenderTarget( window.innerWidth, window.innerHeight);
    
    
    //REAL SCENE INFO
    const scene = new THREE.Scene();
    const volume_cube = add_material(volume, fs, vs, back_buffer, window.innerWidth, window.innerHeight);
    scene.add( volume_cube );
    var axesHelper2 = new THREE.AxesHelper( 3 );
    scene.add( axesHelper2 );











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
        renderer.setRenderTarget( back_buffer );
        renderer.render( back_scene, camera );
        renderer.setRenderTarget( null );

        // var material = new THREE.SpriteMaterial( { map: back_buffer.texture, color: 0xffffff } );
        // var sprite = new THREE.Sprite( material );
        // scene.add( sprite );

        renderer.render( cur_scene, camera );
    }
    animate();
};