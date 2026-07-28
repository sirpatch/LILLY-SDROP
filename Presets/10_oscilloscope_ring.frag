// name: Oscilloscope Ring
// author: sirpatch
//
// The raw waveform drawn as a warping circular scope line instead of a flat
// strip - built entirely from uWaveform[] via sampleWaveform(). This is the
// reference example for drawing a scope/line visual.
//
// Try: change `0.25` (wave amplitude) or `0.45` (base radius).

void main() {
    vec2 uv = aspectUv();
    float radius = length(uv);
    float angle = atan(uv.y, uv.x);

    float zoom = 1.0 - (0.015 + uBass * 0.03);
    vec2 sampleUv = domainWarp(uv * zoom, uTime * 0.15, 0.015);
    sampleUv.x /= uResolution.x / uResolution.y;
    sampleUv = sampleUv * 0.5 + 0.5;

    vec3 prev = texture(uPrevFrame, sampleUv).rgb;
    prev *= 0.93 - uBeatIntensity * 0.03;

    float t = angle / 6.28318530718 + 0.5; // 0..1 around the circle
    float wave = sampleWaveform(t);
    float ringRadius = 0.45 + wave * 0.25 + uBass * 0.05;

    float line = smoothstep(0.01, 0.0, abs(radius - ringRadius));
    float hue = fract(t + uTime * 0.08);
    vec3 color = hsv2rgb(vec3(hue, 0.85, 0.55 + uTreble * 0.3)) * line;

    FragColor = vec4(prev + color, 1.0);
}
