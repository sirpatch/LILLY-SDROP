// name: Kaleidoscope Bloom
// author: sirpatch
//
// Mirrors the frame into N wedges and blooms color out from the center.
// Try: change `7.0 + floor(uMid * 5.0)` for more/fewer mirror segments.

vec2 kaleido(vec2 uv, float segments) {
    float angle = atan(uv.y, uv.x);
    float radius = length(uv);
    float seg = 6.28318530718 / segments;
    angle = mod(angle, seg);
    angle = abs(angle - seg * 0.5);
    return vec2(cos(angle), sin(angle)) * radius;
}

void main() {
    vec2 uv = aspectUv();

    float segments = 7.0 + floor(uMid * 5.0);
    vec2 k = kaleido(uv, segments);
    k = domainWarp(k, uTime * 0.25, 0.04 + uBass * 0.05);

    float zoom = 1.0 - (0.015 + uBass * 0.05);
    k *= zoom;
    k *= rot2(uTime * 0.04);

    vec2 sampleUv = k;
    sampleUv.x /= uResolution.x / uResolution.y;
    sampleUv = sampleUv * 0.5 + 0.5;

    vec3 prev = texture(uPrevFrame, sampleUv).rgb;
    prev *= 0.94 - uBeatIntensity * 0.03;

    float bloom = smoothstep(0.45, 0.0, length(k));
    float hue = fract(uTime * 0.07 + uMid * 0.4);
    vec3 bloomColor = hsv2rgb(vec3(hue, 0.9, 0.45 + uTreble * 0.35)) * bloom;

    FragColor = vec4(prev + bloomColor, 1.0);
}
