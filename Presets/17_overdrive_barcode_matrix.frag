// name: Overdrive Barcode Matrix
// author: sirpatch
//
// 12-segment kaleidoscope transforming straight equalizer bars into sharp, psychedelic radial spokes.

vec2 kaleidoSpokes(vec2 uv, float segments) {
	float angle = atan(uv.y, uv.x);
	float radius = length(uv);
	float seg = 6.28318530718 / segments;
	angle = mod(angle, seg);
	angle = abs(angle - seg * 0.5);
	return vec2(cos(angle), sin(angle)) * radius;
}

void main() {
	vec2 uv = aspectUv();
	// 1. Kaleidoscope 
	vec2 k = kaleidoSpokes(uv, 12.0);

	// 2. Heavy Audio Domain Warping
	k = domainWarp(k, uTime * 0.7, 0.12 + uBass * 0.2);
	k *= rot2(uTime * 0.4 + uMid * 0.6);

	// 3. Audio Barcode Equalizer Lines
	float barFreq = 25.0 + floor(uTreble * 20.0);
	float linePattern = sin(k.x * barFreq + uTime * 10.0);
	float bars = smoothstep(0.1, 0.9, linePattern + uBass * 0.5);
	bars *= smoothstep(0.8, 0.0, length(k)); // Core fade

	// 4. Recursive Feedback Zoom & RGB Shearing
	vec2 sampleUv = k * (0.91 - uBeatIntensity * 0.08);
	sampleUv.x /= uResolution.x / uResolution.y;

	float split = 0.02 + uBass * 0.03;
	vec2 uvR = (sampleUv + vec2(split, -split)) * 0.5 + 0.5;
	vec2 uvG = sampleUv * 0.5 + 0.5;
	vec2 uvB = (sampleUv - vec2(split, -split)) * 0.5 + 0.5;

	float r = texture(uPrevFrame, uvR).r;
	float g = texture(uPrevFrame, uvG).g;
	float b = texture(uPrevFrame, uvB).b;
	vec3 prev = vec3(r, g, b) * 0.90;

	// 5. Strobe Color
	float hue = fract(uTime * 0.2 + length(k) * 1.2 + uMid * 0.4);
	vec3 neonBars = hsv2rgb(vec3(hue, 1.0, 1.0)) * bars * (0.4 + uBeatIntensity * 1.0);

	FragColor = vec4(prev + neonBars, 1.0);
}