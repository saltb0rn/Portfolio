varying vec2 vTexUV;
uniform sampler2D image;
uniform bool isHover;

void main() {
  // hover效果可以考虑颜色混合: https://www.zxcms.com/content/4hko3pj331l6rd.html
  vec4 color = texture2D(image, vTexUV);
  gl_FragColor = color * (isHover ? 0.4 : 1.0);
}
