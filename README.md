# VectorPlay - 3D Vector Simulation Library

A powerful 3D vector simulation and visualization library built with Three.js for educational purposes. VectorPlay makes it easy to visualize vectors, coordinate systems, and mathematical operations in 3D space.

## Features

- 🎯 **3D Vector Visualization**: Render vectors as arrows in 3D space
- 📐 **Mathematical Operations**: Visualize vector addition, subtraction, cross products, and scaling
- 🏷️ **Point and Label System**: Add labeled points and coordinate displays
- 🎮 **Interactive Controls**: Built-in orbit controls for exploring 3D scenes
- 📏 **Grid and Axis Helpers**: Visual reference system with customizable grid and axes
- 🎨 **Customizable Appearance**: Configure colors, sizes, and styling

## Installation

```bash
npm install vectorplay
```

**Peer Dependencies:**
Make sure you have Three.js installed:

```bash
npm install three
```

## Quick Start

```javascript
import { MainFrame, Vector } from "vectorplay";

// Create a 3D scene
const scene = new MainFrame("black", 50, 5);

// Create vectors
const vec1 = new Vector(3, 2, 1);
const vec2 = new Vector(1, 4, 2);

// Add vectors to the scene
scene.addVector(vec1);
scene.addVector(vec2);

// Visualize vector addition
scene.plotSum(vec1, vec2);

// Start the animation loop
scene.runInloop();
```

## API Reference

### MainFrame Class

The main class for creating and managing 3D scenes.

#### Constructor

```javascript
new MainFrame((bg_color = "black"), (grid_length = 100), (axis_length = 7));
```

**Parameters:**

- `bg_color` (string): Background color of the scene
- `grid_length` (number): Size of the reference grid
- `axis_length` (number): Length of the coordinate axes

#### Methods

##### `addPoint(x, y, z, name, color, size)`

Add a labeled point to the scene.

**Parameters:**

- `x, y, z` (number): Coordinates of the point
- `name` (string): Label for the point (default: "P")
- `color` (string): Color of the point (default: "red")
- `size` (number): Size of the point (default: 0.05)

##### `addVector(vec, fromOrigin, custom_origin, color)`

Add a vector to the scene.

**Parameters:**

- `vec` (Vector): Vector object to render
- `fromOrigin` (boolean): Whether to draw from origin (default: true)
- `custom_origin` (object): Custom starting point `{x, y, z}`
- `color` (hex): Color of the vector (default: 0xffff00)

##### `plotSum(vector1, vector2)`

Visualize vector addition by showing both vectors and their sum.

##### `plotDifference(vector1, vector2)`

Visualize vector subtraction.

##### `plotCross(vector1, vector2)`

Visualize cross product of two vectors.

##### `plotScaled(vec, k)`

Visualize a scaled vector.

##### `runInloop()`

Start the animation loop (call this last).

### Vector Class

Represents a 3D vector with mathematical operations.

#### Constructor

```javascript
new Vector(x, y, z);
```

#### Methods

##### `add(vector)`

Add another vector to this vector (modifies the current vector).

##### `substract(vector)`

Subtract another vector from this vector (modifies the current vector).

##### `opposite()`

Negate the vector (multiply by -1).

##### `multiply(vector2)`

Calculate cross product with another vector (returns new Vector).

## Examples

### Basic Vector Visualization

```javascript
import { MainFrame, Vector } from "vectorplay";

const scene = new MainFrame();
const vector = new Vector(3, 4, 2);

scene.addVector(vector);
scene.runInloop();
```

### Vector Operations

```javascript
import { MainFrame, Vector } from "vectorplay";

const scene = new MainFrame("darkblue", 30, 8);

const vec1 = new Vector(2, 3, 1);
const vec2 = new Vector(1, -1, 2);

// Show vector addition
scene.plotSum(vec1, vec2);

scene.runInloop();
```

### Cross Product Visualization

```javascript
import { MainFrame, Vector } from "vectorplay";

const scene = new MainFrame();

const vec1 = new Vector(1, 0, 0);
const vec2 = new Vector(0, 1, 0);

// This will show both input vectors and their cross product
scene.plotCross(vec1, vec2);

scene.runInloop();
```

## Browser Usage

For direct browser usage without a bundler:

```html
<!DOCTYPE html>
<html>
  <head>
    <script type="importmap">
      {
        "imports": {
          "three": "https://unpkg.com/three@0.180.0/build/three.module.js",
          "three/examples/jsm/": "https://unpkg.com/three@0.180.0/examples/jsm/"
        }
      }
    </script>
  </head>
  <body>
    <script type="module">
      import { MainFrame, Vector } from "./path/to/vectorplay.js";

      const scene = new MainFrame();
      const vector = new Vector(1, 2, 3);
      scene.addVector(vector);
      scene.runInloop();
    </script>
  </body>
</html>
```

## Requirements

- Three.js ^0.180.0
- Modern browser with ES6 module support
- WebGL support

## License

MIT License

## Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

## Issues

If you encounter any issues or have feature requests, please file them in the [GitHub Issues](https://github.com/idcnys/VectorPlay/issues).
