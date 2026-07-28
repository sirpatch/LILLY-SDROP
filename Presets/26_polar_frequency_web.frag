// name: Polar Frequency Web
// author: sirpatch
//
// Spiderweb polar coordinate layout that pulses intensely with treble and mid-range audio frequencies.

void main() {
	vec2 uv = aspectUv();
	float r = length(uv);
	float a = atan(uv.y, uv.x);

	float webAngle = mod(a, 0.785398); // 8-fold polar symmetry without kaleidoscope function
	vec2 webUv = vec2(cos(webAngle), sin(webAngle)) * r;

	webUv = domainWarp(webUv, uTime * 0.3, 0.08 + uMid * 0.1);

	vec2 sampleUv = webUv * (0.94 - uBass * 0.05);
	sampleUv.x /= uResolution.x / uResolution.y;
	sampleUv.x += 0.5;
	sampleUv.y += 0.5;

	vec3 prev = texture(uPrevFrame, sampleUv).rgb * 0.91;

	float strands = smoothstep(0.02, 0.0, abs(sin(r * 30.0 - uTime * 5.0)));
	float hue = fract(uTime * 0.18 + a * 0.2 + uTreble * 0.5);
	vec3 webColor = hsv2rgb(vec3(hue, 1.0, 1.0)) * strands * (0.3 + uTreble * 1.0);

	FragColor = vec4(prev + webColor, 1.0);
}