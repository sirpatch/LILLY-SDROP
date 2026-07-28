// name: Phase-Shift Strobe Echo
// author: sirpatch
//
// Concentric phase-shifted interference waves with heavy frame strobing and color inversion.

void main() {
vec2 uv = aspectUv();
float r = length(uv);

float wave = sin(r * 25.0 - uTime * 6.0 + uBass * 10.0) * cos(r * 10.0 + uTime * 2.0);
vec2 warped = domainWarp(uv, uTime * 0.4, 0.06 + uBass * 0.1);

vec2 sampleUv = warped * (0.95 - uBass * 0.06);
sampleUv.x /= uResolution.x / uResolution.y;
sampleUv.x += 0.5;
sampleUv.y += 0.5;

vec3 prev = texture(uPrevFrame, sampleUv).rgb;
if (uBeatIntensity > 0.7) prev = 1.0 - prev; // Strobe color flash inversion
prev *= 0.89;

float ring = smoothstep(0.7, 1.0, abs(wave));
float hue = fract(uTime * 0.3 + r * 0.4);
vec3 strobeColor = hsv2rgb(vec3(hue, 1.0, 1.0)) * ring * (0.5 + uBeatIntensity * 1.2);

FragColor = vec4(prev + strobeColor, 1.0);
}