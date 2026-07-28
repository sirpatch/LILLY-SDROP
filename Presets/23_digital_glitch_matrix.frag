// name: Digital Glitch Matrix
// author: sirpatch
//
// Hard-edged digital code scanlines with rhythmic slicing and RGB channel shifting.

void main() {
	vec2 uv = aspectUv();

	float slice = floor(uv.y * 30.0 + uTime * 5.0);
	float glitch = step(0.85, sin(slice + uTime * 10.0)) * (uBeatIntensity * 0.2);

	vec2 warpedUv = uv + vec2(glitch, 0.0);
	warpedUv = domainWarp(warpedUv, uTime * 0.5, 0.05);

	vec2 sampleUv = warpedUv * (0.95 - uBass * 0.05);
	sampleUv.x /= uResolution.x / uResolution.y;
	sampleUv = sampleUv * 0.5 + 0.5;

	float split = 0.01 + uBeatIntensity * 0.02;
	float r = texture(uPrevFrame, sampleUv + vec2(split, 0.0)).r;
	float g = texture(uPrevFrame, sampleUv).g;
	float b = texture(uPrevFrame, sampleUv - vec2(split, 0.0)).b;
	vec3 prev = vec3(r, g, b) * 0.88;

	float scanline = smoothstep(0.4, 0.5, abs(fract(uv.y * 40.0) - 0.5));
	float hue = fract(uTime * 0.3 + slice * 0.05);
	vec3 matrixColor = hsv2rgb(vec3(hue, 1.0, 1.0)) * scanline * (0.2 + uTreble * 0.8);

	FragColor = vec4(prev + matrixColor, 1.0);
}