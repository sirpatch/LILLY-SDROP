// name: H-Vortex Mandala
// author: sirpatch
//
// 16-wedge spiral kaleidoscope with severe rotational shearing and strobing center.

vec2 spiralKaleido(vec2 uv, float segments) {
	float angle = atan(uv.y, uv.x);
	float radius = length(uv);
	// Spiral twist injection
	angle += radius * (3.0 + uMid * 5.0);

	float seg = 6.28318530718 / segments;
	angle = mod(angle, seg);
	angle = abs(angle - seg * 0.5);
	return vec2(cos(angle), sin(angle)) * radius;
}

void main() {
	vec2 uv = aspectUv();
	float segments = 16.0;
	vec2 k = spiralKaleido(uv, segments);

	// Pull-in/push-out zoom pulse
	float zoom = 0.95 - sin(uTime * 3.0) * 0.03 - uBass * 0.07;
	k *= zoom;
	k *= rot2(uTime * 0.3 + uBeatIntensity * 0.2);

	vec2 sampleUv = k;
	sampleUv.x /= uResolution.x / uResolution.y;
	sampleUv = sampleUv * 0.5 + 0.5;

	// High aberration feedback
	float split = 0.015 + uTreble * 0.02;
	float r = texture(uPrevFrame, sampleUv + vec2(split, 0.0)).r;
	float g = texture(uPrevFrame, sampleUv).g;
	float b = texture(uPrevFrame, sampleUv - vec2(0.0, split)).b;

	vec3 prev = vec3(r, g, b) * (0.90 - uBeatIntensity * 0.06);

	// Pumping strobe core
	float core = smoothstep(0.5, 0.0, length(k));
	float hue = fract(uTime * 0.25 + uBass * 0.4);
	vec3 coreColor = hsv2rgb(vec3(hue, 1.0, 1.0)) * core * (0.3 + uBeatIntensity * 1.2);

	FragColor = vec4(prev + coreColor, 1.0);
}