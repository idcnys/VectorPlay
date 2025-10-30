import { MainFrame, Vector } from "vectorplay";

// Create a new 3D scene
const mf = new MainFrame();

// Create some vectors
let v1 = new Vector(2, 1, 0);
let v2 = new Vector(3, -1, 2);

// Visualize different vector operations
// Uncomment the operation you want to see:

// mf.plotSum(v1, v2);           // Vector addition
// mf.plotProjection(v1, v2);    // Vector projection
mf.plotDifference(v1, v2);       // Vector subtraction
// mf.plotCross(v1, v2);         // Cross product

// You can also add individual vectors:
// mf.addVector(v1);
// mf.addVector(v2);

// Add points to the scene:
// mf.addPoint(1, 2, 3, "Point A", "red", 0.1);

// Start the animation loop
mf.runInloop();