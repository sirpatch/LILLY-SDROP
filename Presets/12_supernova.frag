// name:Supernova
// author: sirpatch
//
// Explosive radial distortion that pushes outwards on heavy beats.
// Try: invert the zoom math (1.0 + ...) to pull inwards instead of blowing outward.

void main() {
	vec2 uv = aspectUv();
	float radius = length(uv);
	float angle = atan(uv.y, uv.x);

	// Violent beat explosion push
	float blast = uBeatIntensity * 0.12 + uBass * 0.06;
	float zoom = 1.0 + blast - 0.03; 

	// Swirling spiral distortion
	angle += (0.05 + uMid * 0.1) * sin(radius * 8.0 - uTime * 2.0);
	vec2 distUv = vec2(cos(angle), sin(angle)) * radius / zoom;

	distUv = domainWarp(distUv, uTime * 0.3, 0.04 + uTreble * 0.04);

	vec2 sampleUv = distUv;
	sampleUv.x /= uResolution.x / uResolution.y;
	sampleUv = sampleUv * 0.5 + 0.5;

	vec3 prev = texture(uPrevFrame, sampleUv).rgb;
	prev *= 0.91 - uBeatIntensity * 0.05;

	// Dynamic wave rings
	float wave = sin(radius * 25.0 - uTime * 4.0 - uBass * 10.0);
	float ring = smoothstep(0.85, 1.0, wave);

	float hue = fract(uTime * 0.12 + radius * 0.4);
	vec3 burstColor = hsv2rgb(vec3(hue, 0.85, 0.7 + uTreble * 0.3)) * ring;

	FragColor = vec4(prev + burstColor, 1.0);
}