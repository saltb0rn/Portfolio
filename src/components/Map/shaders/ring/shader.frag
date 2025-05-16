uniform float time;
uniform vec3 color;
uniform float innerRadius;
uniform float outerRadius;
varying vec2 vUV;

float sdRing(vec2 p, float ir, float or, float timing) {
  float d = length(p);
  float circle0 = step(d, ir);
  float circle1 = step(d, ir + timing);
  float circle2 = step(d, or + timing);
  float ring = circle2 - circle1;
  return ring + circle0;
}

float sdRingFadeOut(vec2 p, float ir, float or, float timing) {
  float d = length(p);
  float circle0 = step(d, ir);
  float ring = 0.0;
  float diff = or - ir;
  if (d + timing > ir && d + timing <= or) {
    ring += (1. + diff - d);
  }
  return ring + circle0;
}

void main() {
  vec2 st = vUV * 2.0 - 1.0;  // [-1, 1]
  // float x = pow(fract(time * 0.05), 0.3);
  float x = fract(time * 0.05);

  float f = smoothstep(.0, 1., x);
  // float timing = (1.0 - f * 2.0) * (1.0 - outerRadius); // [0, 1.0 - outerRadius]
  float timing = (1.0 - f * 2.0) * (1.0 - outerRadius); // [0, 1.0 - outerRadius]
  float dist = sdRingFadeOut(st, innerRadius, outerRadius, timing);

  // float f = mix(.0, 1., x);
  // float timing = f * (1.0 - outerRadius);
  // float dist = sdRing(st, innerRadius, outerRadius, timing);

  gl_FragColor = vec4(color, dist);
}
