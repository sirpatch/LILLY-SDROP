// name: Hypercube Mandala
// author: sirpatch
//
// 12-segment geometry with severe chromatic aberration and beat-driven pops.
// Try: change segment count multiplier 12.0 to 16.0 or 24.0 for intricate lace.

vec2 kaleido12(vec2 uv, float segments) {
	float angle = atan(uv.y, uv.x);
	float radius = length(uv);
	float seg = 6.28318530718 / segments;
	angle = mod(angle, seg);
	angle = abs(angle - seg * 0.5);
	return vec2(cos(angle), sin(angle)) * radius;
}

void main() {
	vec2 uv = aspectUv();
	float segments = 12.0;
	vec2 k = kaleido12(uv, segments);

	// Recursive fold effect
	k = abs(k) - 0.1 - uBass * 0.08;
	k *= rot2(uTime * 0.1 + uMid * 0.3);

	vec2 sampleUv = k;
	sampleUv.x /= uResolution.x / uResolution.y;

	// Aggressive RGB splitting
	float split = 0.008 + uBass * 0.015 + uBeatIntensity * 0.01;
	vec2 uvR = (sampleUv * (0.96 - uBass * 0.03) + vec2(split, split)) * 0.5 + 0.5;
	vec2 uvG = (sampleUv * (0.96 - uBass * 0.03)) * 0.5 + 0.5;
	vec2 uvB = (sampleUv * (0.96 - uBass * 0.03) - vec2(split, split)) * 0.5 + 0.5;

	float r = texture(uPrevFrame, uvR).r;
	float g = texture(uPrevFrame, uvG).g;
	float b = texture(uPrevFrame, uvB).b;
	vec3 prev = vec3(r, g, b) * 0.93;

	// Geometric laser overlay
	float geom = smoothstep(0.02, 0.0, abs(sin(k.x * 20.0 + uTime * 3.0)));
	float hue = fract(uTime * 0.06 + length(k) * 0.8);
	vec3 geomColor = hsv2rgb(vec3(hue, 1.0, 0.8)) * geom * (0.2 + uTreble * 0.6);

	FragColor = vec4(prev + geomColor, 1.0);
}