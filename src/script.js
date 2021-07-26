import './style.css'
import * as THREE from 'three'
import {OrbitControls} from 'three/examples/jsm/controls/OrbitControls'
import * as dat from 'dat.gui'

//instantiate dat.gui
const gui = new dat.GUI()

let camera, scene, renderer, clock;
let uniforms;

const init = () => {
    const canvas = document.querySelector('.webgl')

    camera = new THREE.Camera();
    camera.position.z = 1;

    scene = new THREE.Scene();
    clock = new THREE.Clock();

    const geometry = new THREE.PlaneBufferGeometry( 2, 2 );

    uniforms = {
        u_time: { type: "f", value: 1.0 },
        u_resolution: { type: "v2", value: new THREE.Vector2() },
        u_mouse: { type: "v2", value: new THREE.Vector2() }
    };

    const material = new THREE.ShaderMaterial( {
        uniforms: uniforms,
        vertexShader: `
            void main() {
            gl_Position = vec4( position, 1.0 );
        }  
        `,
        fragmentShader: `
            uniform vec2 u_resolution;
            uniform float u_time;

            void main() {
                vec2 st = gl_FragCoord.xy/u_resolution.xy;
                gl_FragColor=vec4(st.x,st.y,0.0,1.0);
            } 
        `
    } );

    const mesh = new THREE.Mesh( geometry, material );
    scene.add( mesh );

    renderer = new THREE.WebGLRenderer({canvas});
    renderer.setPixelRatio( window.devicePixelRatio );

    onWindowResize();
    window.addEventListener( 'resize', onWindowResize, false );

    document.onmousemove = function(e){
        uniforms.u_mouse.value.x = e.pageX
        uniforms.u_mouse.value.y = e.pageY
    }
}

function onWindowResize( event ) {
    renderer.setSize( window.innerWidth, window.innerHeight );
    uniforms.u_resolution.value.x = renderer.domElement.width;
    uniforms.u_resolution.value.y = renderer.domElement.height;
}

const animate = () => {
    requestAnimationFrame( animate );
    render();
}

const render = () => {
    uniforms.u_time.value += clock.getDelta();
    renderer.render( scene, camera );
}

init();
animate();