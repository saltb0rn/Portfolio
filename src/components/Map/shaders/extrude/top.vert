attribute vec2 texUV;
varying vec2 vTexUV;

void main () {
  gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
  vTexUV = texUV;
}
