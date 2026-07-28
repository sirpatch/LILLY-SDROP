// name: Chroma Kaleidoscope
// author: sirpatch
//
// Kaleidoscope mirroring plus per-channel RGB offset (chromatic aberration)
// for a heavy trippy fringing look. Try: raise `split` for more separation.

vec2 kaleido8(vec2 uv, float segments) {
    float angle = atan(uv.y, uv.x);
    float radius = length(uv);
    float seg = 6.28318530718 / segments;
    angle = mod(angle, seg);
    angle = abs(angle - seg * 0.5);
    return vec2(cos(angle), sin(angle)) * radius;
}

void main() {
    vec2 uv = aspectUv();
    float segments = 5.0 + floor(uBass * 5.0);
    vec2 k = kaleido8(uv, segments);
    k *= rot2(uTime * 0.06 + uMid * 0.2);
    k *= 1.0 - (0.02 + uBass * 0.05);

    float split = 0.006 + uTreble * 0.01 + uBeatIntensity * 0.01;
    vec2 baseUv = k;
    baseUv.x /= uResolution.x / uResolution.y;

    vec2 uvR = (baseUv + vec2(split, 0.0)) * 0.5 + 0.5;
    vec2 uvG = baseUv * 0.5 + 0.5;
    vec2 uvB = (baseUv - vec2(split, 0.0)) * 0.5 + 0.5;

    float r = texture(uPrevFrame, uvR).r;
    float g = texture(uPrevFrame, uvG).g;
    float b = texture(uPrevFrame, uvB).b;
    vec3 prev = vec3(r, g, b) * (0.93 - uBeatIntensity * 0.04);

    float glow = smoothstep(0.4, 0.0, length(k));
    float hue = fract(uTime * 0.09 + uBass * 0.3);
    vec3 color = hsv2rgb(vec3(hue, 0.9, 0.45 + uTreble * 0.3)) * glow;

    FragColor = vec4(prev + color * 0.35, 1.0);
}
