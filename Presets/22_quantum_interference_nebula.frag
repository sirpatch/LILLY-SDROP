// name: Quantum Interference Nebula
// author: sirpatch
//
// Multi-layered trigonometric wave interference that forms shifting psychedelic gas clouds.

void main() {
	vec2 uv = aspectUv();
	vec2 q = uv * rot2(uTime * 0.1);
	float wave = sin(q.x * 6.0 + uTime) + cos(q.y * 6.0 - uTime) + sin((q.x + q.y) * 4.0 + uBass * 2.0);
	q = domainWarp(q, uTime * 0.3, 0.1 + wave * 0.05);

	vec2 sampleUv = q * 0.4 * (0.94 - uBass * 0.04);
	sampleUv.x /= uResolution.x / uResolution.y;
	sampleUv = sampleUv * 0.5 + 0.5;

	vec3 prev = texture(uPrevFrame, sampleUv).rgb;
	prev.rg *= rot2(0.05 + uBeatIntensity * 0.1);
	prev *= 0.90;

	float nebula = smoothstep(0.2, 0.8, abs(wave));
	float hue = fract(uTime * 0.08 + wave * 0.2 + uMid * 0.4);
	vec3 gasColor = hsv2rgb(vec3(hue, 1.0, 1.0)) * nebula * (0.3 + uTreble * 0.9);

	FragColor = vec4(prev + gasColor, 1.0);
}