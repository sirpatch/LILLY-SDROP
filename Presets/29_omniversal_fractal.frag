// name: Omniversal Fractal
// author: sirpatch
//
// An intricate, multi-stage recursive fold combining hyperbolic geometry
// with violent audio-reactive fluid warping and heavy chromatic feedback.

vec2 foldSpace(vec2 uv) {
    uv = abs(uv) - 0.15;
    if (uv.x < uv.y) uv = uv.yx;
    return uv;
}

vec2 kaleidoMax(vec2 uv, float segments) {
    float angle = atan(uv.y, uv.x);
    float radius = length(uv);
    float seg = 6.28318530718 / segments;
    angle = mod(angle, seg);
    angle = abs(angle - seg * 0.5);
    return vec2(cos(angle), sin(angle)) * radius;
}

void main() {
    vec2 uv = aspectUv();

    // Stage 1: Viscous Domain Warp
    vec2 warp = domainWarp(uv, uTime * 0.4, 0.1 + uBass * 0.2);

    // Stage 2: Recursive Fractal Folding
    vec2 p = foldSpace(warp);
    p = foldSpace(p - uMid * 0.15);
    
    // Stage 3: Dynamic Kaleidoscope (Geometry shifts on Treble)
    float segs = 6.0 + floor(uTreble * 8.0);
    p = kaleidoMax(p, segs);
    
    // Stage 4: Logarithmic Space Tunneling
    float r = length(p);
    float a = atan(p.y, p.x);
    vec2 logUv = vec2(log(r + 0.001) - uTime * (0.6 + uBass * 0.6), a);
    
    // Beat-driven Rotation
    p *= rot2(uTime * 0.3 + uBass * 0.6);

    // Stage 5: Frame Buffer Zoom & Aspect Ratio Handling
    vec2 sampleUv = p * (0.92 - uBeatIntensity * 0.08);
    sampleUv.x /= uResolution.x / uResolution.y;
    sampleUv = sampleUv * 0.5 + 0.5;

    // Stage 6: Aggressive Multi-Axis Chromatic Aberration
    float split = 0.015 + uBass * 0.03 + uBeatIntensity * 0.025;
    float red = texture(uPrevFrame, sampleUv + vec2(split, split)).r;
    float green = texture(uPrevFrame, sampleUv).g;
    float blue = texture(uPrevFrame, sampleUv - vec2(split, split)).b;
    
    // Feedback neural scramble (Hard color invert/swap on major beats)
    vec3 prev = vec3(red, green, blue);
    if (uBeatIntensity > 0.75) prev = prev.gbr; 
    prev *= 0.90 - uBeatIntensity * 0.05;

    // Stage 7: Neon Hyper-Grid Geometry Output
    float grid = smoothstep(0.7, 1.0, sin(logUv.x * 24.0) * sin(logUv.y * 12.0));
    float laser = smoothstep(0.02, 0.0, abs(p.x - p.y));
    
    float hue = fract(uTime * 0.15 + r * 1.5 + uMid * 0.4);
    vec3 coreGlow = hsv2rgb(vec3(hue, 1.0, 1.0)) * max(grid, laser) * (0.4 + uBeatIntensity * 1.5);

    FragColor = vec4(prev + coreGlow, 1.0);
}