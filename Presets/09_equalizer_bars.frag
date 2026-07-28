// name: Equalizer Bars
// author: sirpatch
//
// A classic bottom-up spectrum bar graph, built entirely from uSpectrum[] -
// this is the reference example for drawing your own bars/meters. rawUv (raw
// vUv, not aspect-corrected) is used instead of aspectUv() so bars line up
// cleanly edge-to-edge across the window regardless of aspect ratio.
//
// Try: change `0.85` to make bars taller/shorter, or the `0.15` gap width.

void main() {
    vec2 uv = aspectUv();
    vec2 rawUv = vUv; // 0..1 left-to-right, bottom-to-top

    float zoom = 1.0 - (0.008 + uBass * 0.015);
    vec2 sampleUv = domainWarp(uv * zoom, uTime * 0.08, 0.006);
    sampleUv.x /= uResolution.x / uResolution.y;
    sampleUv = sampleUv * 0.5 + 0.5;

    vec3 prev = texture(uPrevFrame, sampleUv).rgb;
    prev *= 0.93 - uBeatIntensity * 0.02;

    int barIndex = clamp(int(rawUv.x * float(BAR_COUNT)), 0, BAR_COUNT - 1);
    float barHeight = uSpectrum[barIndex];

    float filled = step(rawUv.y, barHeight * 0.85);
    float notGap = step(0.15, fract(rawUv.x * float(BAR_COUNT)));

    float hue = float(barIndex) / float(BAR_COUNT) + uTime * 0.05;
    vec3 barColor = hsv2rgb(vec3(fract(hue), 0.9, 0.55 + uTreble * 0.3)) * filled * notGap;

    FragColor = vec4(prev + barColor, 1.0);
}
