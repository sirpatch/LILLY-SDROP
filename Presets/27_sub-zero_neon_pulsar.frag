// name: Sub-Zero Neon Pulsar
// author: sirpatch
//
// Freezing cryogenic blue-to-magenta neon energy lines that expand outward in sync with sub-bass kicks.

void main() {
	vec2 uv = aspectUv();
	vec2 p = uv * rot2(uTime * 0.15);

	p = domainWarp(p, uTime * 0.25, 0.1 + uBass * 0.2);

	vec2 sampleUv = p * (0.96 - uBass * 0.07);
	sampleUv.x /= uResolution.x / uResolution.y;
	sampleUv.x += 0.5;
	sampleUv.y += 0.5;

	vec3 prev = texture(uPrevFrame, sampleUv).rgb;
	prev.g *= 0.9; // Tint feedback towards cold blues/purples
	prev *= 0.92;

	float pulsar = smoothstep(0.03, 0.0, abs(sin(length(p) * 20.0 - uTime * 4.0 - uBass * 8.0)));
	float hue = fract(0.55 + uTime * 0.05 + length(p) * 0.3); // Cyberspace blue/purple palette
	vec3 pulsarColor = hsv2rgb(vec3(hue, 1.0, 1.0)) * pulsar * (0.6 + uBass * 1.4);

	FragColor = vec4(prev + pulsarColor, 1.0);
}