// name: Cyber Infinite
// author: sirpatch
//
// Neon grid-folding visualizer with sharp feedback trails and high treble reaction.
// Try: adjust the grid scale 15.0 to change detail density.

void main() {
	vec2 uv = aspectUv();
	// Grid warping with audio reaction
	vec2 warped = domainWarp(uv, uTime * 0.15, 0.06 + uBass * 0.06);
	warped *= rot2(sin(uTime * 0.2) * 0.15);

	// Zooming rotational frame-buffer scale
	vec2 fbUv = warped * (0.95 - uBass * 0.04);
	fbUv *= rot2(0.015 + uTreble * 0.03);

	vec2 sampleUv = fbUv;
	sampleUv.x /= uResolution.x / uResolution.y;
	sampleUv = sampleUv * 0.5 + 0.5;

	vec3 prev = texture(uPrevFrame, sampleUv).rgb;

	// Color shift retro trails
	prev.rgb = prev.gbr * 0.94;

	// Sharp glowing neon grid
	vec2 grid = abs(fract(warped * 15.0 - uTime * 0.5) - 0.5);
	float lines = smoothstep(0.45, 0.5, max(grid.x, grid.y));

	float hue = fract(uTime * 0.05 + length(uv) * 0.3 + uMid * 0.4);
	vec3 neonColor = hsv2rgb(vec3(hue, 0.9, 0.8)) * lines * (0.15 + uTreble * 0.5);

	FragColor = vec4(prev + neonColor, 1.0);
}