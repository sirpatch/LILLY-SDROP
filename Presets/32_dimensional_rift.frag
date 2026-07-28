// name: Dimensional Rift
// author: sirpatch
//
// Dynamic kaleidoscope intersected by violent horizontal screen tearing on beats.
// Chromatic aberration is mapped radially along the kaleidoscope axes.

vec2 ripKaleido(vec2 uv, float segments) {
    float angle = atan(uv.y, uv.x);
    float radius = length(uv);
    float seg = 6.28318530718 / segments;
    angle = mod(angle, seg);
    angle = abs(angle - seg * 0.5);
    return vec2(cos(angle), sin(angle)) * radius;
}

void main() {
    vec2 uv = aspectUv();
    
    // Stage 1: Beat-driven Screen Tearing (High frequency horizontal slices)
    float tearPower = step(0.85, sin(uv.y * 100.0 + uTime * 25.0));
    float shiftDir = sin(uTime * 15.0) > 0.0 ? 1.0 : -1.0;
    
    // Tear space only on high beat intensity
    vec2 tornUv = uv;
    if (uBeatIntensity > 0.6) {
        tornUv.x += tearPower * (0.05 + uBeatIntensity * 0.1) * shiftDir;
    }
    
    // Stage 2: Segment-Snapping Kaleidoscope
    float segs = 4.0 + floor(pow(uBass, 1.5) * 6.0); // Segments jump from 4 to 10 on kicks
    vec2 k = ripKaleido(tornUv, segs);
    
    k *= rot2(uTime * 0.5 - uBass * 0.6);
    k = domainWarp(k, uTime * 0.4, 0.06 + uMid * 0.1);
    
    // Stage 3: Framebuffer Sample
    vec2 sampleUv = k * (0.93 - uBeatIntensity * 0.06);
    sampleUv.x /= uResolution.x / uResolution.y;
    sampleUv = sampleUv * 0.5 + 0.5;
    
    // Stage 4: Radial Chromatic Aberration (Splits along the kaleidoscope vectors)
    float split = 0.015 + uBeatIntensity * 0.045;
    float r = texture(uPrevFrame, sampleUv + k * split).r;
    float g = texture(uPrevFrame, sampleUv).g;
    float b = texture(uPrevFrame, sampleUv - k * split).b;
    
    vec3 prev = vec3(r, g, b) * (0.90 - uBeatIntensity * 0.05);
    
    // Stage 5: Burning Rift Edges
    float rift = smoothstep(0.04, 0.0, abs(k.y));
    float hue = fract(uTime * 0.25 + length(tornUv) * 0.5);
    vec3 light = hsv2rgb(vec3(hue, 1.0, 1.0)) * rift * (0.4 + uTreble * 1.8);
    
    FragColor = vec4(prev + light, 1.0);
}