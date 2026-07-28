// name: Acid Fluid Portal
// author: sirpatch
//
// Liquid-like feedback melt that bends with bass and swirls continuously.
// Try: adjust 0.08 in rot2() for wilder dynamic rotation.

void main() {
	vec2 uv = aspectUv();
	// Heavy liquid domain warping
	vec2 fluid = domainWarp(uv, uTime * 0.4, 0.08 + uBass * 0.12);
	fluid *= rot2(sin(uTime * 0.3 + length(uv) * 2.0) * (0.08 + uMid * 0.1));

	// Vortex feedback push
	float r = length(fluid);
	float a = atan(fluid.y, fluid.x) + (0.03 + uTreble * 0.04) / (r + 0.1);
	vec2 sampleUv = vec2(cos(a), sin(a)) * r * (0.98 - uBass * 0.04);

	sampleUv.x /= uResolution.x / uResolution.y;
	sampleUv = sampleUv * 0.5 + 0.5;

	// Multi-chromatic video feedback sample
	float split = 0.005 + uBeatIntensity * 0.012;
	float red = texture(uPrevFrame, sampleUv + vec2(split, 0.0)).r;
	float green = texture(uPrevFrame, sampleUv).g;
	float blue = texture(uPrevFrame, sampleUv - vec2(split, 0.0)).b;

	vec3 prev = vec3(red, green, blue) * (0.94 - uBeatIntensity * 0.03);

	// Pulsing central plasma core
	float core = smoothstep(0.35, 0.0, r);
	float hue = fract(uTime * 0.1 + r * 0.5 + uMid * 0.3);
	vec3 coreColor = hsv2rgb(vec3(hue, 0.95, 0.7)) * core * (0.3 + uBass * 0.7);

	FragColor = vec4(prev + coreColor, 1.0);
}