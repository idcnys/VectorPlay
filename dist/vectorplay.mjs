import * as _ from "three";
import { Controls as X, Vector3 as f, MOUSE as S, TOUCH as D, Quaternion as L, Spherical as j, Vector2 as E, Ray as q, Plane as G, MathUtils as B, Matrix4 as Z, Object3D as Q } from "three";
const k = { type: "change" }, A = { type: "start" }, K = { type: "end" }, M = new q(), N = new G(), $ = Math.cos(70 * B.DEG2RAD), d = new f(), m = 2 * Math.PI, r = {
  NONE: -1,
  ROTATE: 0,
  DOLLY: 1,
  PAN: 2,
  TOUCH_ROTATE: 3,
  TOUCH_PAN: 4,
  TOUCH_DOLLY_PAN: 5,
  TOUCH_DOLLY_ROTATE: 6
}, R = 1e-6;
class J extends X {
  /**
   * Constructs a new controls instance.
   *
   * @param {Object3D} object - The object that is managed by the controls.
   * @param {?HTMLDOMElement} domElement - The HTML element used for event listeners.
   */
  constructor(t, e = null) {
    super(t, e), this.state = r.NONE, this.target = new f(), this.cursor = new f(), this.minDistance = 0, this.maxDistance = 1 / 0, this.minZoom = 0, this.maxZoom = 1 / 0, this.minTargetRadius = 0, this.maxTargetRadius = 1 / 0, this.minPolarAngle = 0, this.maxPolarAngle = Math.PI, this.minAzimuthAngle = -1 / 0, this.maxAzimuthAngle = 1 / 0, this.enableDamping = !1, this.dampingFactor = 0.05, this.enableZoom = !0, this.zoomSpeed = 1, this.enableRotate = !0, this.rotateSpeed = 1, this.keyRotateSpeed = 1, this.enablePan = !0, this.panSpeed = 1, this.screenSpacePanning = !0, this.keyPanSpeed = 7, this.zoomToCursor = !1, this.autoRotate = !1, this.autoRotateSpeed = 2, this.keys = { LEFT: "ArrowLeft", UP: "ArrowUp", RIGHT: "ArrowRight", BOTTOM: "ArrowDown" }, this.mouseButtons = { LEFT: S.ROTATE, MIDDLE: S.DOLLY, RIGHT: S.PAN }, this.touches = { ONE: D.ROTATE, TWO: D.DOLLY_PAN }, this.target0 = this.target.clone(), this.position0 = this.object.position.clone(), this.zoom0 = this.object.zoom, this._domElementKeyEvents = null, this._lastPosition = new f(), this._lastQuaternion = new L(), this._lastTargetPosition = new f(), this._quat = new L().setFromUnitVectors(t.up, new f(0, 1, 0)), this._quatInverse = this._quat.clone().invert(), this._spherical = new j(), this._sphericalDelta = new j(), this._scale = 1, this._panOffset = new f(), this._rotateStart = new E(), this._rotateEnd = new E(), this._rotateDelta = new E(), this._panStart = new E(), this._panEnd = new E(), this._panDelta = new E(), this._dollyStart = new E(), this._dollyEnd = new E(), this._dollyDelta = new E(), this._dollyDirection = new f(), this._mouse = new E(), this._performCursorZoom = !1, this._pointers = [], this._pointerPositions = {}, this._controlActive = !1, this._onPointerMove = et.bind(this), this._onPointerDown = tt.bind(this), this._onPointerUp = it.bind(this), this._onContextMenu = lt.bind(this), this._onMouseWheel = nt.bind(this), this._onKeyDown = at.bind(this), this._onTouchStart = ht.bind(this), this._onTouchMove = rt.bind(this), this._onMouseDown = st.bind(this), this._onMouseMove = ot.bind(this), this._interceptControlDown = ct.bind(this), this._interceptControlUp = dt.bind(this), this.domElement !== null && this.connect(this.domElement), this.update();
  }
  connect(t) {
    super.connect(t), this.domElement.addEventListener("pointerdown", this._onPointerDown), this.domElement.addEventListener("pointercancel", this._onPointerUp), this.domElement.addEventListener("contextmenu", this._onContextMenu), this.domElement.addEventListener("wheel", this._onMouseWheel, { passive: !1 }), this.domElement.getRootNode().addEventListener("keydown", this._interceptControlDown, { passive: !0, capture: !0 }), this.domElement.style.touchAction = "none";
  }
  disconnect() {
    this.domElement.removeEventListener("pointerdown", this._onPointerDown), this.domElement.removeEventListener("pointermove", this._onPointerMove), this.domElement.removeEventListener("pointerup", this._onPointerUp), this.domElement.removeEventListener("pointercancel", this._onPointerUp), this.domElement.removeEventListener("wheel", this._onMouseWheel), this.domElement.removeEventListener("contextmenu", this._onContextMenu), this.stopListenToKeyEvents(), this.domElement.getRootNode().removeEventListener("keydown", this._interceptControlDown, { capture: !0 }), this.domElement.style.touchAction = "auto";
  }
  dispose() {
    this.disconnect();
  }
  /**
   * Get the current vertical rotation, in radians.
   *
   * @return {number} The current vertical rotation, in radians.
   */
  getPolarAngle() {
    return this._spherical.phi;
  }
  /**
   * Get the current horizontal rotation, in radians.
   *
   * @return {number} The current horizontal rotation, in radians.
   */
  getAzimuthalAngle() {
    return this._spherical.theta;
  }
  /**
   * Returns the distance from the camera to the target.
   *
   * @return {number} The distance from the camera to the target.
   */
  getDistance() {
    return this.object.position.distanceTo(this.target);
  }
  /**
   * Adds key event listeners to the given DOM element.
   * `window` is a recommended argument for using this method.
   *
   * @param {HTMLDOMElement} domElement - The DOM element
   */
  listenToKeyEvents(t) {
    t.addEventListener("keydown", this._onKeyDown), this._domElementKeyEvents = t;
  }
  /**
   * Removes the key event listener previously defined with `listenToKeyEvents()`.
   */
  stopListenToKeyEvents() {
    this._domElementKeyEvents !== null && (this._domElementKeyEvents.removeEventListener("keydown", this._onKeyDown), this._domElementKeyEvents = null);
  }
  /**
   * Save the current state of the controls. This can later be recovered with `reset()`.
   */
  saveState() {
    this.target0.copy(this.target), this.position0.copy(this.object.position), this.zoom0 = this.object.zoom;
  }
  /**
   * Reset the controls to their state from either the last time the `saveState()`
   * was called, or the initial state.
   */
  reset() {
    this.target.copy(this.target0), this.object.position.copy(this.position0), this.object.zoom = this.zoom0, this.object.updateProjectionMatrix(), this.dispatchEvent(k), this.update(), this.state = r.NONE;
  }
  update(t = null) {
    const e = this.object.position;
    d.copy(e).sub(this.target), d.applyQuaternion(this._quat), this._spherical.setFromVector3(d), this.autoRotate && this.state === r.NONE && this._rotateLeft(this._getAutoRotationAngle(t)), this.enableDamping ? (this._spherical.theta += this._sphericalDelta.theta * this.dampingFactor, this._spherical.phi += this._sphericalDelta.phi * this.dampingFactor) : (this._spherical.theta += this._sphericalDelta.theta, this._spherical.phi += this._sphericalDelta.phi);
    let i = this.minAzimuthAngle, o = this.maxAzimuthAngle;
    isFinite(i) && isFinite(o) && (i < -Math.PI ? i += m : i > Math.PI && (i -= m), o < -Math.PI ? o += m : o > Math.PI && (o -= m), i <= o ? this._spherical.theta = Math.max(i, Math.min(o, this._spherical.theta)) : this._spherical.theta = this._spherical.theta > (i + o) / 2 ? Math.max(i, this._spherical.theta) : Math.min(o, this._spherical.theta)), this._spherical.phi = Math.max(this.minPolarAngle, Math.min(this.maxPolarAngle, this._spherical.phi)), this._spherical.makeSafe(), this.enableDamping === !0 ? this.target.addScaledVector(this._panOffset, this.dampingFactor) : this.target.add(this._panOffset), this.target.sub(this.cursor), this.target.clampLength(this.minTargetRadius, this.maxTargetRadius), this.target.add(this.cursor);
    let a = !1;
    if (this.zoomToCursor && this._performCursorZoom || this.object.isOrthographicCamera)
      this._spherical.radius = this._clampDistance(this._spherical.radius);
    else {
      const n = this._spherical.radius;
      this._spherical.radius = this._clampDistance(this._spherical.radius * this._scale), a = n != this._spherical.radius;
    }
    if (d.setFromSpherical(this._spherical), d.applyQuaternion(this._quatInverse), e.copy(this.target).add(d), this.object.lookAt(this.target), this.enableDamping === !0 ? (this._sphericalDelta.theta *= 1 - this.dampingFactor, this._sphericalDelta.phi *= 1 - this.dampingFactor, this._panOffset.multiplyScalar(1 - this.dampingFactor)) : (this._sphericalDelta.set(0, 0, 0), this._panOffset.set(0, 0, 0)), this.zoomToCursor && this._performCursorZoom) {
      let n = null;
      if (this.object.isPerspectiveCamera) {
        const c = d.length();
        n = this._clampDistance(c * this._scale);
        const p = c - n;
        this.object.position.addScaledVector(this._dollyDirection, p), this.object.updateMatrixWorld(), a = !!p;
      } else if (this.object.isOrthographicCamera) {
        const c = new f(this._mouse.x, this._mouse.y, 0);
        c.unproject(this.object);
        const p = this.object.zoom;
        this.object.zoom = Math.max(this.minZoom, Math.min(this.maxZoom, this.object.zoom / this._scale)), this.object.updateProjectionMatrix(), a = p !== this.object.zoom;
        const w = new f(this._mouse.x, this._mouse.y, 0);
        w.unproject(this.object), this.object.position.sub(w).add(c), this.object.updateMatrixWorld(), n = d.length();
      } else
        console.warn("WARNING: OrbitControls.js encountered an unknown camera type - zoom to cursor disabled."), this.zoomToCursor = !1;
      n !== null && (this.screenSpacePanning ? this.target.set(0, 0, -1).transformDirection(this.object.matrix).multiplyScalar(n).add(this.object.position) : (M.origin.copy(this.object.position), M.direction.set(0, 0, -1).transformDirection(this.object.matrix), Math.abs(this.object.up.dot(M.direction)) < $ ? this.object.lookAt(this.target) : (N.setFromNormalAndCoplanarPoint(this.object.up, this.target), M.intersectPlane(N, this.target))));
    } else if (this.object.isOrthographicCamera) {
      const n = this.object.zoom;
      this.object.zoom = Math.max(this.minZoom, Math.min(this.maxZoom, this.object.zoom / this._scale)), n !== this.object.zoom && (this.object.updateProjectionMatrix(), a = !0);
    }
    return this._scale = 1, this._performCursorZoom = !1, a || this._lastPosition.distanceToSquared(this.object.position) > R || 8 * (1 - this._lastQuaternion.dot(this.object.quaternion)) > R || this._lastTargetPosition.distanceToSquared(this.target) > R ? (this.dispatchEvent(k), this._lastPosition.copy(this.object.position), this._lastQuaternion.copy(this.object.quaternion), this._lastTargetPosition.copy(this.target), !0) : !1;
  }
  _getAutoRotationAngle(t) {
    return t !== null ? m / 60 * this.autoRotateSpeed * t : m / 60 / 60 * this.autoRotateSpeed;
  }
  _getZoomScale(t) {
    const e = Math.abs(t * 0.01);
    return Math.pow(0.95, this.zoomSpeed * e);
  }
  _rotateLeft(t) {
    this._sphericalDelta.theta -= t;
  }
  _rotateUp(t) {
    this._sphericalDelta.phi -= t;
  }
  _panLeft(t, e) {
    d.setFromMatrixColumn(e, 0), d.multiplyScalar(-t), this._panOffset.add(d);
  }
  _panUp(t, e) {
    this.screenSpacePanning === !0 ? d.setFromMatrixColumn(e, 1) : (d.setFromMatrixColumn(e, 0), d.crossVectors(this.object.up, d)), d.multiplyScalar(t), this._panOffset.add(d);
  }
  // deltaX and deltaY are in pixels; right and down are positive
  _pan(t, e) {
    const i = this.domElement;
    if (this.object.isPerspectiveCamera) {
      const o = this.object.position;
      d.copy(o).sub(this.target);
      let a = d.length();
      a *= Math.tan(this.object.fov / 2 * Math.PI / 180), this._panLeft(2 * t * a / i.clientHeight, this.object.matrix), this._panUp(2 * e * a / i.clientHeight, this.object.matrix);
    } else this.object.isOrthographicCamera ? (this._panLeft(t * (this.object.right - this.object.left) / this.object.zoom / i.clientWidth, this.object.matrix), this._panUp(e * (this.object.top - this.object.bottom) / this.object.zoom / i.clientHeight, this.object.matrix)) : (console.warn("WARNING: OrbitControls.js encountered an unknown camera type - pan disabled."), this.enablePan = !1);
  }
  _dollyOut(t) {
    this.object.isPerspectiveCamera || this.object.isOrthographicCamera ? this._scale /= t : (console.warn("WARNING: OrbitControls.js encountered an unknown camera type - dolly/zoom disabled."), this.enableZoom = !1);
  }
  _dollyIn(t) {
    this.object.isPerspectiveCamera || this.object.isOrthographicCamera ? this._scale *= t : (console.warn("WARNING: OrbitControls.js encountered an unknown camera type - dolly/zoom disabled."), this.enableZoom = !1);
  }
  _updateZoomParameters(t, e) {
    if (!this.zoomToCursor)
      return;
    this._performCursorZoom = !0;
    const i = this.domElement.getBoundingClientRect(), o = t - i.left, a = e - i.top, n = i.width, c = i.height;
    this._mouse.x = o / n * 2 - 1, this._mouse.y = -(a / c) * 2 + 1, this._dollyDirection.set(this._mouse.x, this._mouse.y, 1).unproject(this.object).sub(this.object.position).normalize();
  }
  _clampDistance(t) {
    return Math.max(this.minDistance, Math.min(this.maxDistance, t));
  }
  //
  // event callbacks - update the object state
  //
  _handleMouseDownRotate(t) {
    this._rotateStart.set(t.clientX, t.clientY);
  }
  _handleMouseDownDolly(t) {
    this._updateZoomParameters(t.clientX, t.clientX), this._dollyStart.set(t.clientX, t.clientY);
  }
  _handleMouseDownPan(t) {
    this._panStart.set(t.clientX, t.clientY);
  }
  _handleMouseMoveRotate(t) {
    this._rotateEnd.set(t.clientX, t.clientY), this._rotateDelta.subVectors(this._rotateEnd, this._rotateStart).multiplyScalar(this.rotateSpeed);
    const e = this.domElement;
    this._rotateLeft(m * this._rotateDelta.x / e.clientHeight), this._rotateUp(m * this._rotateDelta.y / e.clientHeight), this._rotateStart.copy(this._rotateEnd), this.update();
  }
  _handleMouseMoveDolly(t) {
    this._dollyEnd.set(t.clientX, t.clientY), this._dollyDelta.subVectors(this._dollyEnd, this._dollyStart), this._dollyDelta.y > 0 ? this._dollyOut(this._getZoomScale(this._dollyDelta.y)) : this._dollyDelta.y < 0 && this._dollyIn(this._getZoomScale(this._dollyDelta.y)), this._dollyStart.copy(this._dollyEnd), this.update();
  }
  _handleMouseMovePan(t) {
    this._panEnd.set(t.clientX, t.clientY), this._panDelta.subVectors(this._panEnd, this._panStart).multiplyScalar(this.panSpeed), this._pan(this._panDelta.x, this._panDelta.y), this._panStart.copy(this._panEnd), this.update();
  }
  _handleMouseWheel(t) {
    this._updateZoomParameters(t.clientX, t.clientY), t.deltaY < 0 ? this._dollyIn(this._getZoomScale(t.deltaY)) : t.deltaY > 0 && this._dollyOut(this._getZoomScale(t.deltaY)), this.update();
  }
  _handleKeyDown(t) {
    let e = !1;
    switch (t.code) {
      case this.keys.UP:
        t.ctrlKey || t.metaKey || t.shiftKey ? this.enableRotate && this._rotateUp(m * this.keyRotateSpeed / this.domElement.clientHeight) : this.enablePan && this._pan(0, this.keyPanSpeed), e = !0;
        break;
      case this.keys.BOTTOM:
        t.ctrlKey || t.metaKey || t.shiftKey ? this.enableRotate && this._rotateUp(-m * this.keyRotateSpeed / this.domElement.clientHeight) : this.enablePan && this._pan(0, -this.keyPanSpeed), e = !0;
        break;
      case this.keys.LEFT:
        t.ctrlKey || t.metaKey || t.shiftKey ? this.enableRotate && this._rotateLeft(m * this.keyRotateSpeed / this.domElement.clientHeight) : this.enablePan && this._pan(this.keyPanSpeed, 0), e = !0;
        break;
      case this.keys.RIGHT:
        t.ctrlKey || t.metaKey || t.shiftKey ? this.enableRotate && this._rotateLeft(-m * this.keyRotateSpeed / this.domElement.clientHeight) : this.enablePan && this._pan(-this.keyPanSpeed, 0), e = !0;
        break;
    }
    e && (t.preventDefault(), this.update());
  }
  _handleTouchStartRotate(t) {
    if (this._pointers.length === 1)
      this._rotateStart.set(t.pageX, t.pageY);
    else {
      const e = this._getSecondPointerPosition(t), i = 0.5 * (t.pageX + e.x), o = 0.5 * (t.pageY + e.y);
      this._rotateStart.set(i, o);
    }
  }
  _handleTouchStartPan(t) {
    if (this._pointers.length === 1)
      this._panStart.set(t.pageX, t.pageY);
    else {
      const e = this._getSecondPointerPosition(t), i = 0.5 * (t.pageX + e.x), o = 0.5 * (t.pageY + e.y);
      this._panStart.set(i, o);
    }
  }
  _handleTouchStartDolly(t) {
    const e = this._getSecondPointerPosition(t), i = t.pageX - e.x, o = t.pageY - e.y, a = Math.sqrt(i * i + o * o);
    this._dollyStart.set(0, a);
  }
  _handleTouchStartDollyPan(t) {
    this.enableZoom && this._handleTouchStartDolly(t), this.enablePan && this._handleTouchStartPan(t);
  }
  _handleTouchStartDollyRotate(t) {
    this.enableZoom && this._handleTouchStartDolly(t), this.enableRotate && this._handleTouchStartRotate(t);
  }
  _handleTouchMoveRotate(t) {
    if (this._pointers.length == 1)
      this._rotateEnd.set(t.pageX, t.pageY);
    else {
      const i = this._getSecondPointerPosition(t), o = 0.5 * (t.pageX + i.x), a = 0.5 * (t.pageY + i.y);
      this._rotateEnd.set(o, a);
    }
    this._rotateDelta.subVectors(this._rotateEnd, this._rotateStart).multiplyScalar(this.rotateSpeed);
    const e = this.domElement;
    this._rotateLeft(m * this._rotateDelta.x / e.clientHeight), this._rotateUp(m * this._rotateDelta.y / e.clientHeight), this._rotateStart.copy(this._rotateEnd);
  }
  _handleTouchMovePan(t) {
    if (this._pointers.length === 1)
      this._panEnd.set(t.pageX, t.pageY);
    else {
      const e = this._getSecondPointerPosition(t), i = 0.5 * (t.pageX + e.x), o = 0.5 * (t.pageY + e.y);
      this._panEnd.set(i, o);
    }
    this._panDelta.subVectors(this._panEnd, this._panStart).multiplyScalar(this.panSpeed), this._pan(this._panDelta.x, this._panDelta.y), this._panStart.copy(this._panEnd);
  }
  _handleTouchMoveDolly(t) {
    const e = this._getSecondPointerPosition(t), i = t.pageX - e.x, o = t.pageY - e.y, a = Math.sqrt(i * i + o * o);
    this._dollyEnd.set(0, a), this._dollyDelta.set(0, Math.pow(this._dollyEnd.y / this._dollyStart.y, this.zoomSpeed)), this._dollyOut(this._dollyDelta.y), this._dollyStart.copy(this._dollyEnd);
    const n = (t.pageX + e.x) * 0.5, c = (t.pageY + e.y) * 0.5;
    this._updateZoomParameters(n, c);
  }
  _handleTouchMoveDollyPan(t) {
    this.enableZoom && this._handleTouchMoveDolly(t), this.enablePan && this._handleTouchMovePan(t);
  }
  _handleTouchMoveDollyRotate(t) {
    this.enableZoom && this._handleTouchMoveDolly(t), this.enableRotate && this._handleTouchMoveRotate(t);
  }
  // pointers
  _addPointer(t) {
    this._pointers.push(t.pointerId);
  }
  _removePointer(t) {
    delete this._pointerPositions[t.pointerId];
    for (let e = 0; e < this._pointers.length; e++)
      if (this._pointers[e] == t.pointerId) {
        this._pointers.splice(e, 1);
        return;
      }
  }
  _isTrackingPointer(t) {
    for (let e = 0; e < this._pointers.length; e++)
      if (this._pointers[e] == t.pointerId) return !0;
    return !1;
  }
  _trackPointer(t) {
    let e = this._pointerPositions[t.pointerId];
    e === void 0 && (e = new E(), this._pointerPositions[t.pointerId] = e), e.set(t.pageX, t.pageY);
  }
  _getSecondPointerPosition(t) {
    const e = t.pointerId === this._pointers[0] ? this._pointers[1] : this._pointers[0];
    return this._pointerPositions[e];
  }
  //
  _customWheelEvent(t) {
    const e = t.deltaMode, i = {
      clientX: t.clientX,
      clientY: t.clientY,
      deltaY: t.deltaY
    };
    switch (e) {
      case 1:
        i.deltaY *= 16;
        break;
      case 2:
        i.deltaY *= 100;
        break;
    }
    return t.ctrlKey && !this._controlActive && (i.deltaY *= 10), i;
  }
}
function tt(s) {
  this.enabled !== !1 && (this._pointers.length === 0 && (this.domElement.setPointerCapture(s.pointerId), this.domElement.addEventListener("pointermove", this._onPointerMove), this.domElement.addEventListener("pointerup", this._onPointerUp)), !this._isTrackingPointer(s) && (this._addPointer(s), s.pointerType === "touch" ? this._onTouchStart(s) : this._onMouseDown(s)));
}
function et(s) {
  this.enabled !== !1 && (s.pointerType === "touch" ? this._onTouchMove(s) : this._onMouseMove(s));
}
function it(s) {
  switch (this._removePointer(s), this._pointers.length) {
    case 0:
      this.domElement.releasePointerCapture(s.pointerId), this.domElement.removeEventListener("pointermove", this._onPointerMove), this.domElement.removeEventListener("pointerup", this._onPointerUp), this.dispatchEvent(K), this.state = r.NONE;
      break;
    case 1:
      const t = this._pointers[0], e = this._pointerPositions[t];
      this._onTouchStart({ pointerId: t, pageX: e.x, pageY: e.y });
      break;
  }
}
function st(s) {
  let t;
  switch (s.button) {
    case 0:
      t = this.mouseButtons.LEFT;
      break;
    case 1:
      t = this.mouseButtons.MIDDLE;
      break;
    case 2:
      t = this.mouseButtons.RIGHT;
      break;
    default:
      t = -1;
  }
  switch (t) {
    case S.DOLLY:
      if (this.enableZoom === !1) return;
      this._handleMouseDownDolly(s), this.state = r.DOLLY;
      break;
    case S.ROTATE:
      if (s.ctrlKey || s.metaKey || s.shiftKey) {
        if (this.enablePan === !1) return;
        this._handleMouseDownPan(s), this.state = r.PAN;
      } else {
        if (this.enableRotate === !1) return;
        this._handleMouseDownRotate(s), this.state = r.ROTATE;
      }
      break;
    case S.PAN:
      if (s.ctrlKey || s.metaKey || s.shiftKey) {
        if (this.enableRotate === !1) return;
        this._handleMouseDownRotate(s), this.state = r.ROTATE;
      } else {
        if (this.enablePan === !1) return;
        this._handleMouseDownPan(s), this.state = r.PAN;
      }
      break;
    default:
      this.state = r.NONE;
  }
  this.state !== r.NONE && this.dispatchEvent(A);
}
function ot(s) {
  switch (this.state) {
    case r.ROTATE:
      if (this.enableRotate === !1) return;
      this._handleMouseMoveRotate(s);
      break;
    case r.DOLLY:
      if (this.enableZoom === !1) return;
      this._handleMouseMoveDolly(s);
      break;
    case r.PAN:
      if (this.enablePan === !1) return;
      this._handleMouseMovePan(s);
      break;
  }
}
function nt(s) {
  this.enabled === !1 || this.enableZoom === !1 || this.state !== r.NONE || (s.preventDefault(), this.dispatchEvent(A), this._handleMouseWheel(this._customWheelEvent(s)), this.dispatchEvent(K));
}
function at(s) {
  this.enabled !== !1 && this._handleKeyDown(s);
}
function ht(s) {
  switch (this._trackPointer(s), this._pointers.length) {
    case 1:
      switch (this.touches.ONE) {
        case D.ROTATE:
          if (this.enableRotate === !1) return;
          this._handleTouchStartRotate(s), this.state = r.TOUCH_ROTATE;
          break;
        case D.PAN:
          if (this.enablePan === !1) return;
          this._handleTouchStartPan(s), this.state = r.TOUCH_PAN;
          break;
        default:
          this.state = r.NONE;
      }
      break;
    case 2:
      switch (this.touches.TWO) {
        case D.DOLLY_PAN:
          if (this.enableZoom === !1 && this.enablePan === !1) return;
          this._handleTouchStartDollyPan(s), this.state = r.TOUCH_DOLLY_PAN;
          break;
        case D.DOLLY_ROTATE:
          if (this.enableZoom === !1 && this.enableRotate === !1) return;
          this._handleTouchStartDollyRotate(s), this.state = r.TOUCH_DOLLY_ROTATE;
          break;
        default:
          this.state = r.NONE;
      }
      break;
    default:
      this.state = r.NONE;
  }
  this.state !== r.NONE && this.dispatchEvent(A);
}
function rt(s) {
  switch (this._trackPointer(s), this.state) {
    case r.TOUCH_ROTATE:
      if (this.enableRotate === !1) return;
      this._handleTouchMoveRotate(s), this.update();
      break;
    case r.TOUCH_PAN:
      if (this.enablePan === !1) return;
      this._handleTouchMovePan(s), this.update();
      break;
    case r.TOUCH_DOLLY_PAN:
      if (this.enableZoom === !1 && this.enablePan === !1) return;
      this._handleTouchMoveDollyPan(s), this.update();
      break;
    case r.TOUCH_DOLLY_ROTATE:
      if (this.enableZoom === !1 && this.enableRotate === !1) return;
      this._handleTouchMoveDollyRotate(s), this.update();
      break;
    default:
      this.state = r.NONE;
  }
}
function lt(s) {
  this.enabled !== !1 && s.preventDefault();
}
function ct(s) {
  s.key === "Control" && (this._controlActive = !0, this.domElement.getRootNode().addEventListener("keyup", this._interceptControlUp, { passive: !0, capture: !0 }));
}
function dt(s) {
  s.key === "Control" && (this._controlActive = !1, this.domElement.getRootNode().removeEventListener("keyup", this._interceptControlUp, { passive: !0, capture: !0 }));
}
class pt extends Q {
  /**
   * Constructs a new CSS2D object.
   *
   * @param {DOMElement} [element] - The DOM element.
   */
  constructor(t = document.createElement("div")) {
    super(), this.isCSS2DObject = !0, this.element = t, this.element.style.position = "absolute", this.element.style.userSelect = "none", this.element.setAttribute("draggable", !1), this.center = new E(0.5, 0.5), this.addEventListener("removed", function() {
      this.traverse(function(e) {
        e.element instanceof e.element.ownerDocument.defaultView.Element && e.element.parentNode !== null && e.element.remove();
      });
    });
  }
  copy(t, e) {
    return super.copy(t, e), this.element = t.element.cloneNode(!0), this.center = t.center, this;
  }
}
const P = new f(), I = new Z(), Y = new Z(), U = new f(), H = new f();
class ut {
  /**
   * Constructs a new CSS2D renderer.
   *
   * @param {CSS2DRenderer~Parameters} [parameters] - The parameters.
   */
  constructor(t = {}) {
    const e = this;
    let i, o, a, n;
    const c = {
      objects: /* @__PURE__ */ new WeakMap()
    }, p = t.element !== void 0 ? t.element : document.createElement("div");
    p.style.overflow = "hidden", this.domElement = p, this.getSize = function() {
      return {
        width: i,
        height: o
      };
    }, this.render = function(h, l) {
      h.matrixWorldAutoUpdate === !0 && h.updateMatrixWorld(), l.parent === null && l.matrixWorldAutoUpdate === !0 && l.updateMatrixWorld(), I.copy(l.matrixWorldInverse), Y.multiplyMatrices(l.projectionMatrix, I), C(h, h, l), V(h);
    }, this.setSize = function(h, l) {
      i = h, o = l, a = i / 2, n = o / 2, p.style.width = h + "px", p.style.height = l + "px";
    };
    function w(h) {
      h.isCSS2DObject && (h.element.style.display = "none");
      for (let l = 0, b = h.children.length; l < b; l++)
        w(h.children[l]);
    }
    function C(h, l, b) {
      if (h.visible === !1) {
        w(h);
        return;
      }
      if (h.isCSS2DObject) {
        P.setFromMatrixPosition(h.matrixWorld), P.applyMatrix4(Y);
        const u = P.z >= -1 && P.z <= 1 && h.layers.test(b.layers) === !0, g = h.element;
        g.style.display = u === !0 ? "" : "none", u === !0 && (h.onBeforeRender(e, l, b), g.style.transform = "translate(" + -100 * h.center.x + "%," + -100 * h.center.y + "%)translate(" + (P.x * a + a) + "px," + (-P.y * n + n) + "px)", g.parentNode !== p && p.appendChild(g), h.onAfterRender(e, l, b));
        const O = {
          distanceToCameraSquared: W(b, h)
        };
        c.objects.set(h, O);
      }
      for (let u = 0, g = h.children.length; u < g; u++)
        C(h.children[u], l, b);
    }
    function W(h, l) {
      return U.setFromMatrixPosition(h.matrixWorld), H.setFromMatrixPosition(l.matrixWorld), U.distanceToSquared(H);
    }
    function F(h) {
      const l = [];
      return h.traverseVisible(function(b) {
        b.isCSS2DObject && l.push(b);
      }), l;
    }
    function V(h) {
      const l = F(h).sort(function(u, g) {
        if (u.renderOrder !== g.renderOrder)
          return g.renderOrder - u.renderOrder;
        const O = c.objects.get(u).distanceToCameraSquared, v = c.objects.get(g).distanceToCameraSquared;
        return O - v;
      }), b = l.length;
      for (let u = 0, g = l.length; u < g; u++)
        l[u].element.style.zIndex = b - u;
    }
  }
}
class mt {
  constructor(t = "black", e = 100, i = 7) {
    this.aspect_ratio = window.innerWidth / window.innerHeight, this.screen_width = window.innerWidth, this.screen_height = window.innerHeight, this.scene = new _.Scene(), this.scene.background = new _.Color(t), this.camera = new _.PerspectiveCamera(75, this.aspect_ratio, 0.1, 1e3), this.camera.position.set(5, 5, 5), this.renderer = new _.WebGLRenderer({ antialias: !0 }), this.renderer.setSize(this.screen_width, this.screen_height), document.body.appendChild(this.renderer.domElement), this.labelRenderer = new ut(), this.labelRenderer.setSize(this.screen_width, this.screen_height), this.labelRenderer.domElement.style.position = "absolute", this.labelRenderer.domElement.style.top = "0", this.labelRenderer.domElement.style.pointerEvents = "none", document.body.appendChild(this.labelRenderer.domElement);
    const o = new _.GridHelper(e, e, 65535, 3355443);
    this.scene.add(o);
    const a = new _.AxesHelper(i);
    this.scene.add(a), this.controls = new J(this.camera, this.renderer.domElement), this.controls.enableDamping = !0, this.controls.dampingFactor = 0.05, this.controls.enablePan = !0, this.controls.enableZoom = !0, this.controls.minDistance = 1, this.controls.maxDistance = e / 2, window.addEventListener("resize", () => {
      this.camera.aspect = window.innerWidth / window.innerHeight, this.camera.updateProjectionMatrix(), this.renderer.setSize(window.innerWidth, window.innerHeight), this.labelRenderer.setSize(window.innerWidth, window.innerHeight);
    }), this.addPoint(0, 0, 0, "Origin");
  }
  addLabel(t, e, i = "black", o = "white", a = { x: 0.1, y: 0.1, z: 0 }) {
    const n = document.createElement("div");
    n.className = "label", n.textContent = t, n.style.color = o, n.style.fontSize = "12px", n.style.fontFamily = "monospace", n.style.backgroundColor = i, n.style.opacity = "0.5", n.style.padding = "2px 4px", n.style.borderRadius = "4px", n.style.whiteSpace = "nowrap";
    const c = new pt(n);
    c.position.set(a.x, a.y, a.z), e.add(c);
  }
  addPoint(t, e, i, o = "P", a = "red", n = 0.05) {
    const c = new _.SphereGeometry(n, 16, 16), p = new _.MeshBasicMaterial({ color: a }), w = new _.Mesh(c, p);
    w.position.set(t, e, i), this.scene.add(w), this.addLabel(`${o}(${t}, ${e}, ${i})`, w);
  }
  addVector(t = { x, y, z }, e = !0, i = {}, o = 16776960) {
    const a = new _.Vector3(t.x, t.y, t.z);
    let n = new _.Vector3(0, 0, 0);
    !e && i && (n = new _.Vector3(i.x, i.y, i.z));
    const c = a.length(), p = new _.ArrowHelper(a.clone().normalize(), n, c, o);
    p.vector = a.clone(), this.scene.add(p), this.addPoint(t.x + n.x, t.y + n.y, t.z + n.z, "V");
  }
  plotSum(t, e) {
    this.addVector(t), this.addVector(e, !1, t), t.add(e), this.addVector(t);
  }
  plotDifference(t, e) {
    e.opposite(), this.plotSum(t, e);
  }
  plotCross(t, e) {
    this.addVector(t), this.addVector(e);
    let i = t.multiply(e);
    this.addVector(i);
  }
  plotScaled(t, e) {
    t.x *= e, t.y *= e, t.z *= e, this.addVector(t);
  }
  plotProjection(t, e) {
    const i = t.dotProduct(e), o = e.value() ** 2, a = new T(e.x, e.y, e.z);
    a.scale(i / o), this.addVector(a, !0, void 0, 65280);
  }
  runInloop() {
    const t = () => {
      requestAnimationFrame(t), this.controls.update(), this.renderer.render(this.scene, this.camera), this.labelRenderer.render(this.scene, this.camera);
    };
    t();
  }
}
class T {
  constructor(t, e, i) {
    this.x = t, this.y = e, this.z = i;
  }
  add(t) {
    this.x += t.x, this.y += t.y, this.z += t.z;
  }
  substract(t) {
    this.x -= t.x, this.y -= t.y, this.z -= t.z;
  }
  opposite() {
    this.x = -this.x, this.y = -this.y, this.z = -this.z;
  }
  scale(t) {
    this.x *= t, this.y *= t, this.z *= t;
  }
  multiply(t) {
    var e = this.y * t.z - this.z * t.y, i = -(this.x * t.z - this.z * t.x), o = this.x * t.y - this.y * t.x;
    return new T(e, i, o);
  }
  value() {
    let t = this.x * this.x + this.y * this.y + this.z * this.z;
    return Math.sqrt(t);
  }
  unitVector() {
    var t = this.value(), e = this.x / t, i = this.y / t, o = this.z / t;
    return new T(e, i, o);
  }
  dotProduct(t) {
    var e = this.x * t.x + this.y * t.y + this.z * t.z;
    return e;
  }
}
const ft = { MainFrame: mt, Vector: T };
export {
  mt as MainFrame,
  T as Vector,
  ft as default
};
