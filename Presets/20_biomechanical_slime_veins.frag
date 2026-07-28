// name: Biomechanical Slime Veins
// author: sirpatch
//
// Organic, pulsating cellular Voronoi-like vein structures that crawl across the screen on mid frequencies.

void main() {
	vec2 uv = aspectUv() * (2.0 + uBass * 0.5);
	vec2 p = sin(uv * 2.0 + uTime * 0.5) + cos(uv.yx * 1.5 - uTime * 0.3);
	p = domainWarp(p, uTime * 0.4, 0.15 + uMid * 0.2);

	vec2 sampleUv = p * 0.25 * (0.94 - uBass * 0.04);
	sampleUv.x /= uResolution.x / uResolution.y;
	sampleUv = sampleUv * 0.5 + 0.5;

	vec3 prev = texture(uPrevFrame, sampleUv).rgb * 0.91;

	float veins = abs(sin(p.x * p.y * 4.0 + uTime * 2.0));
	float glow = smoothstep(0.8, 0.0, veins);

	float hue = fract(uTime * 0.2 + length(p) * 0.3);
	vec3 slimeColor = hsv2rgb(vec3(hue, 0.9, 1.0)) * glow * (0.4 + uMid * 1.0);

	FragColor = vec4(prev + slimeColor, 1.0);
}