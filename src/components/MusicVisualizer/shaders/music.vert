varying float vPattern;

uniform float uTime;
uniform float uAudioFreq;

#define PI 3.14159265358979

vec2 m = vec2(1., 0.);

float hash( in vec2 p )
{
  return fract(sin(p.x*15.32+p.y*5.78) * 43758.236237153);
}


vec2 hash2(vec2 p)
{
  return vec2(hash(p*.754),hash(1.5743*p.yx+4.5891))-.5;
}

vec2 hash2b( vec2 p )
{
  vec2 q = vec2( dot(p,vec2(127.1,311.7)),
                 dot(p,vec2(269.5,183.3)) );
  return fract(sin(q)*43758.5453)-.5;
}

float EaseInQuint(float x) {
  return x * x * x * x * x;
}

// Gabor/Voronoi mix 3x3 kernel (some artifacts for v=1.)
float gavoronoi3(in vec2 p)
{
  float time = uTime;
  float timeAdd = mix(1.0, 3.0, EaseInQuint(uAudioFreq));
  time += timeAdd;
  vec2 ip = floor(p);
  vec2 fp = fract(p);
  float f = 3.0 * PI;//frequency
  float v = 1.;//cell variability <1.
  float dv = .0;//direction variability <1.
  vec2 dir = vec2(1.3) + cos(time);
  float va = .0;
  float wt = 0.0;
  for (int i=-1; i<=1; i++)
    for (int j=-1; j<=1; j++)
      {
        vec2 o = vec2(i, j)-.5;
        vec2 h = hash2(ip - o);
        vec2 pp = fp +o;
        float d = dot(pp, pp);
        float w = exp(-d*4.);
        wt +=w;
        h = dv*h+dir;
        // h=normalize(h+dir);
        va += cos(dot(pp,h)*f/v)*w;
      }
  return va/wt;
}


float noise( vec2 p)
{
  return gavoronoi3(p);
}

float map(vec2 p){

  return 2.*abs( noise(p*2.));
}

// get the normal at point p of function map
vec3 nor(in vec2 p)
{
  const vec2 e = vec2(0.1, 0.0);
  return -normalize(vec3(
                         map(p + e.xy) - map(p - e.xy),
                         map(p + e.yx) - map(p - e.yx),
                         1.));
}

void main() {
  vec3 light = normalize(vec3(3., 2., -1.));
  float r = dot(nor(uv), light);
  float displacement = clamp(1. - r, 0.0, 0.3) + uAudioFreq / 2.0;
  vec3 newPosition = position + normal * displacement;
  gl_Position = projectionMatrix * modelViewMatrix * vec4(newPosition, 1.0);
  vPattern = r;
}
