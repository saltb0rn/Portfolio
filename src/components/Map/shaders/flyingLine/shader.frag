varying vec2 vUV;
uniform float time;
uniform sampler2D image;

float toTint(float val) {
  return val + (1. - val) * 0.5;
}

void main () {
  vec2 st = vUV;
  // vec4 texColor = texture2D(image, vec2(fract(st.s + time * 0.1), st.t));
  vec4 texColor = texture2D(image, vec2(fract(st.x - time * 0.1), st.y));
  gl_FragColor = vec4(texColor.r, texColor.g, texColor.b, texColor.a);
}
