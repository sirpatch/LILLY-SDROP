// name: Crystal Facet Lattice
// author: sirpatch
//
// Diamond crystal polygon facets that refract light and snap into new angles on high-mids.

void main() {
vec2 uv = aspectUv();
vec2 f = fract(uv * 4.0) - 0.5;

f *= rot2(uTime * 0.2 + uMid * 0.8);
f = abs(f);

vec2 sampleUv = f * (0.93 - uBass * 0.05);
sampleUv.x /= uResolution.x / uResolution.y;
sampleUv = sampleUv * 0.5 + 0.5;

float split = 0.015 + uTreble * 0.02;
vec2 uvR = sampleUv + vec2(split, 0.0);
vec2 uvG = sampleUv;
vec2 uvB = sampleUv - vec2(split, 0.0);

float r = texture(uPrevFrame, uvR).r;
float g = texture(uPrevFrame, uvG).g;
float b = texture(uPrevFrame, uvB).b;
vec3 prev = vec3(r, g, b) * 0.90;

float facets = smoothstep(0.02, 0.0, abs(f.x - f.y));
float hue = fract(uTime * 0.25 + length(f) * 2.0);
vec3 crystal = hsv2rgb(vec3(hue, 1.0, 1.0)) * facets * (0.4 + uTreble * 0.8);

FragColor = vec4(prev + crystal, 1.0);
}