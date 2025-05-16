uniform vec3 color1;
uniform vec3 color2;
uniform float mapDepth;
varying vec3 vPosition;

void main() {
  float t = 1. - vPosition.z / mapDepth;
  vec3 mixColor = mix(color1, color2, t); // 使用顶点坐标 z 分量来控制混合
  gl_FragColor = vec4(mixColor, 1.0);
}
