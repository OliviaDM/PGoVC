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
    const dim = 2;
    const volume = new THREE.BoxGeometry( dim, dim, dim );
    
    
    //BACKPOSITION RENDERING
    const back_scene = new THREE.Scene();
    const back_cube = add_back_material(volume, bfs, bvs);
    back_scene.add( back_cube );
    var axesHelper = new THREE.AxesHelper( 2 );
    back_scene.add( axesHelper );
    
    
    
    //REAL SCENE INFO
    const scene = new THREE.Scene();
    const volume_cube = add_material(volume, fs, vs);
    scene.add( volume_cube );
    var axesHelper2 = new THREE.AxesHelper( 2 );
    scene.add( axesHelper2 );



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

    canvas.addEventListener('mousemove', function (e) {
        onMouseMove(e);
    }, false);
    canvas.addEventListener('mousedown', function (e) {
        onMouseDown(e);
    }, false);
    canvas.addEventListener('mouseup', function (e) {
        onMouseUp(e);
    }, false);
    

    function rotateScene(deltaX, deltaY) {
        scene.rotation.y += deltaX / 100;
        scene.rotation.x += deltaY / 100;
        back_scene.rotation.y += deltaX / 100;
        back_scene.rotation.x += deltaY / 100;
    }




    function animate() {
        requestAnimationFrame( animate );
        renderer.render( scene, camera );
    }
    animate();
};