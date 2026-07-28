// name: Infinite Fractal Chamber
// author: sirpatch
//
// Quad-mirror kaleidoscope with recursive box folding for a hyper-speed fractal look.

vec2 boxFold(vec2 uv) {
	uv = abs(uv);
	if (uv.x < uv.y) uv = uv.yx;
	return uv;
}

void main() {
	vec2 uv = aspectUv();
	// Dual box fold for fractal square mirroring
	vec2 k = boxFold(uv);
	k = boxFold(k - 0.15 * (1.0 + uBass * 0.5));

	// High-speed rotation and feedback zoom
	k *= rot2(sin(uTime * 0.8) * 0.5 + uTime * 0.15);
	k *= 0.94 - uBass * 0.06;

	vec2 sampleUv = k;
	sampleUv.x /= uResolution.x / uResolution.y;
	sampleUv = sampleUv * 0.5 + 0.5;

	vec3 prev = texture(uPrevFrame, sampleUv).rgb;

	// Color swap inversion effect on beat drops
	if (uBeatIntensity > 0.65) {
		prev = vec3(1.0) - prev.gbr;
	}
	prev *= 0.92 - uBeatIntensity * 0.04;

	// Laser grid overlay along fold boundaries
	float grid = smoothstep(0.48, 0.5, max(abs(sin(k.x * 24.0)), abs(sin(k.y * 24.0))));
	float hue = fract(uTime * 0.15 + length(k) * 0.8 + uTreble * 0.4);
	vec3 glow = hsv2rgb(vec3(hue, 1.0, 1.0)) * grid * (0.2 + uTreble * 0.8);

	FragColor = vec4(prev + glow, 1.0);
}