import * as THREE from 'three';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js';
import { CSS2DRenderer, CSS2DObject } from 'three/examples/jsm/renderers/CSS2DRenderer.js';

export class MainFrame {
  constructor(bg_color = "black", grid_length = 100, axis_length = 7) {
    this.aspect_ratio = window.innerWidth / window.innerHeight;
    this.screen_width = window.innerWidth;
    this.screen_height = window.innerHeight;

    //scene 
    this.scene = new THREE.Scene();
    this.scene.background = new THREE.Color(bg_color);

    //camera
    this.camera = new THREE.PerspectiveCamera(75, this.aspect_ratio, 0.1, 1000);
    this.camera.position.set(5, 5, 5);

    //renderer
    this.renderer = new THREE.WebGLRenderer({ antialias: true });
    this.renderer.setSize(this.screen_width, this.screen_height);
    document.body.appendChild(this.renderer.domElement);

    //label renderer
    this.labelRenderer = new CSS2DRenderer();
    this.labelRenderer.setSize(this.screen_width, this.screen_height);
    this.labelRenderer.domElement.style.position = 'absolute';
    this.labelRenderer.domElement.style.top = '0';
    this.labelRenderer.domElement.style.pointerEvents = 'none';
    document.body.appendChild(this.labelRenderer.domElement);

    //grid,axis
    const grid = new THREE.GridHelper(grid_length, grid_length, 0x00ffff, 0x333333);
    this.scene.add(grid);
    const xyz_axis = new THREE.AxesHelper(axis_length);
    this.scene.add(xyz_axis);

    //camera controls
    this.controls = new OrbitControls(this.camera, this.renderer.domElement);
    this.controls.enableDamping = true;
    this.controls.dampingFactor = 0.05;
    this.controls.enablePan = true;
    this.controls.enableZoom = true;
    this.controls.minDistance = 1;   
    this.controls.maxDistance = grid_length/2; 

    //resize handler
    window.addEventListener('resize', () => {
      this.camera.aspect = window.innerWidth / window.innerHeight;
      this.camera.updateProjectionMatrix();
      this.renderer.setSize(window.innerWidth, window.innerHeight);
      this.labelRenderer.setSize(window.innerWidth, window.innerHeight);
    });

    this.addPoint(0,0,0,"Origin");
  }

  addLabel(text, parent, bg="black", color="white", offset = { x: 0.1, y: 0.1, z: 0 }) {
    const div = document.createElement('div');
    div.className = 'label';
    div.textContent = text;

    //label styling
    div.style.color = color;
    div.style.fontSize = '12px';
    div.style.fontFamily = 'monospace';
    div.style.backgroundColor = bg;
    div.style.opacity="0.5";
    div.style.padding = '2px 4px';
    div.style.borderRadius = '4px';
    div.style.whiteSpace = 'nowrap';

    const label = new CSS2DObject(div);
    label.position.set(offset.x, offset.y, offset.z);
    parent.add(label);
  }

  addPoint(x, y, z, name="P", color = "red", size = 0.05) {
    const geometry = new THREE.SphereGeometry(size, 16, 16);
    const material = new THREE.MeshBasicMaterial({ color });
    const point = new THREE.Mesh(geometry, material);
    point.position.set(x, y, z);
    this.scene.add(point);

    this.addLabel(`${name}(${x}, ${y}, ${z})`, point);
  }

  addVector(vec={x,y,z}, fromOrigin = true, custom_origin = {}, color = 0xffff00) {
    const dir = new THREE.Vector3(vec.x, vec.y, vec.z);
    let origin = new THREE.Vector3(0, 0, 0);

    if (!fromOrigin && custom_origin) {
      origin = new THREE.Vector3(custom_origin.x, custom_origin.y, custom_origin.z);
    }

    const length = dir.length();
    const arrowHelper = new THREE.ArrowHelper(dir.clone().normalize(), origin, length, color);
    arrowHelper.vector = dir.clone();
    this.scene.add(arrowHelper);

    this.addPoint(vec.x+origin.x, vec.y+origin.y, vec.z+origin.z, "V");
  }

  plotSum(vector1, vector2){
    this.addVector(vector1);
    this.addVector(vector2, false, vector1);
    vector1.add(vector2);
    this.addVector(vector1);
  }

  plotDifference(vector1, vector2){
    vector2.opposite();
    this.plotSum(vector1, vector2);
  }

  plotCross(vector1, vector2){
    this.addVector(vector1);
    this.addVector(vector2);
    let vec3 = vector1.multiply(vector2);
    this.addVector(vec3);
  }

  plotScaled(vec, k){
    vec.x *= k;
    vec.y *= k;
    vec.z *= k;
    this.addVector(vec);
  }

  runInloop() {
    const loop = () => {
      requestAnimationFrame(loop);
      this.controls.update();
      this.renderer.render(this.scene, this.camera);
      this.labelRenderer.render(this.scene, this.camera);
    };
    loop();
  }
}

export class Vector {
  constructor(x, y, z) {
    this.x = x;
    this.y = y;
    this.z = z;
  }

  add(vector) {
    this.x += vector.x;
    this.y += vector.y;
    this.z += vector.z;
  }

  substract(vector) {
    this.x -= vector.x;
    this.y -= vector.y;
    this.z -= vector.z;
  }

  opposite() {
    this.x = -this.x;
    this.y = -this.y;
    this.z = -this.z;
  }

  multiply(vector2) {
    /*
     (Ay​Bz​−Az​By​)i^−(Ax​Bz​−Az​Bx​)j^​+(Ax​By​−Ay​Bx​)k^
    */
    var x = (this.y * vector2.z) - (this.z * vector2.y);
    var y = -((this.x * vector2.z) - (this.z * vector2.x));
    var z = (this.x * vector2.y) - (this.y * vector2.x);

    return new Vector(x, y, z);
  }
}

// Default export for convenience
export default { MainFrame, Vector };