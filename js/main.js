// PASS THE VOXEL BOX COORDINATES TO VERT SHADE to convert the postitions for sampling based on camera
// REFACTOR HARDCODED VALUES: dim (need in frag_shade for checking inside sampling)
// REFACTOR SHADER REFERENCES: would be p cool to be able to switch shaders
// USER INTERFACE??? be able to select shader, number of voxel boxes

function main (fs, vs) {
    const vox_num = 10;


    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera( 75, window.innerWidth / window.innerHeight, 0.1, 1000 );
    
    const renderer = new THREE.WebGLRenderer({
        antialias: true
    });
    renderer.setSize( window.innerWidth, window.innerHeight );
    document.body.appendChild( renderer.domElement );
    const canvas = document.querySelector("canvas");
    
    camera.position.z = 5;


    const grid = voxel_grid(vox_num, fs, vs);
    grid.forEach( (voxel) => {
        scene.add( voxel );
    });




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
    }




    function animate() {
        requestAnimationFrame( animate );
        renderer.render( scene, camera );
    }
    animate();
};