// name: Hyperbolic Hyper-Grid
// author: sirpatch
//
// Non-Euclidean hyperbolic projection grid that bends space outward on heavy bass drops.

void main() {
	vec2 uv = aspectUv();
	float r = length(uv);
	float a = atan(uv.y, uv.x);
	// Hyperbolic coordinate inversion
	float hyperR = 1.0 / (r + 0.1) - uTime * 0.5;
	vec2 hypUv = vec2(hyperR, a * 1.5);

	hypUv = domainWarp(hypUv, uTime * 0.3, 0.08 + uBass * 0.12);

	vec2 sampleUv = hypUv * (0.95 - uBass * 0.05);
	sampleUv.x /= uResolution.x / uResolution.y;
	sampleUv = sampleUv * 0.5 + 0.5;

	vec3 prev = texture(uPrevFrame, sampleUv).rgb * (0.92 - uBeatIntensity * 0.05);

	float grid = smoothstep(0.4, 0.5, max(abs(fract(hypUv.x * 5.0) - 0.5), abs(fract(hypUv.y * 5.0) - 0.5)));
	float hue = fract(uTime * 0.1 + r * 0.4 + uTreble * 0.3);
	vec3 color = hsv2rgb(vec3(hue, 1.0, 1.0)) * grid * (0.3 + uBass * 0.8);

	FragColor = vec4(prev + color, 1.0);
}