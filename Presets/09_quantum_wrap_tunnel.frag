// name: Quantum Warp Tunnel
// author: sirpatch
//
// Hyper-speed audio-reactive tunnel with logarithmic zooming and heavy domain warping.
// Try: increase the 12.0 multiplier for a denser grid pattern.

void main() {
	vec2 uv = aspectUv();

	// Logarithmic polar mapping for a seamless tunnel effect
	float radius = length(uv);
	float angle = atan(uv.y, uv.x);
	vec2 logUv = vec2(log(radius + 0.001) - uTime * (0.3 + uBass * 0.4), angle / 6.2831853);

	// Domain warp the tunnel coordinates
	logUv = domainWarp(logUv, uTime * 0.2, 0.05 + uMid * 0.08);

	// Feedback zoom and spin
	vec2 zoomUv = uv * (0.97 - uBass * 0.05);
	zoomUv *= rot2((0.02 + uMid * 0.05) * (sin(uTime * 0.5) > 0.0 ? 1.0 : -1.0));

	vec2 sampleUv = zoomUv;
	sampleUv.x /= uResolution.x / uResolution.y;
	sampleUv = sampleUv * 0.5 + 0.5;

	vec3 prev = texture(uPrevFrame, sampleUv).rgb;
	prev *= 0.92 - uBeatIntensity * 0.04;

	// Glowing tunnel grid overlay
	float tunnelGrid = smoothstep(0.8, 1.0, sin(logUv.x * 12.0) * sin(logUv.y * 12.0 * 3.14159));
	float hue = fract(uTime * 0.08 + logUv.x * 0.2 + uTreble * 0.3);
	vec3 gridColor = hsv2rgb(vec3(hue, 0.9, 0.6 + uTreble * 0.4)) * tunnelGrid;

	FragColor = vec4(prev + gridColor * 0.5, 1.0);
}