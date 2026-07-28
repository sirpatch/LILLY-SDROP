// name: Torus Warp Field
// author: sirpatch
//
// 3D toroidal coordinate mapping that folds the visualizer into an endless donut-shaped wormhole.

void main() {
	vec2 uv = aspectUv();
	float r = length(uv);
	float a = atan(uv.y, uv.x);
	vec2 torus = vec2(sin(a * 3.0 + uTime * 0.4), cos(r * 5.0 - uTime * 0.8));
	torus = domainWarp(torus, uTime * 0.2, 0.1 + uBass * 0.15);

	vec2 sampleUv = (uv + torus * 0.1) * (0.96 - uBass * 0.06);
	sampleUv.x /= uResolution.x / uResolution.y;
	sampleUv = sampleUv * 0.5 + 0.5;

	vec3 prev = texture(uPrevFrame, sampleUv).rgb * (0.93 - uBeatIntensity * 0.04);

	float ring = smoothstep(0.85, 1.0, sin(r * 15.0 - uTime * 4.0));
	float hue = fract(uTime * 0.15 + uTreble * 0.5);
	vec3 torusColor = hsv2rgb(vec3(hue, 1.0, 1.0)) * ring * (0.5 + uBeatIntensity * 1.0);

	FragColor = vec4(prev + torusColor, 1.0);
}