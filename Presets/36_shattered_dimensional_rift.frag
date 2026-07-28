// name: Shattered Dimensional Rift
// author: sirpatch
//
// Ultimate fusion: Horizontal screen tearing and glass-quantization snapping 
// fused with dynamic kaleido-folding, hybrid radial-diagonal RGB splitting, 
// and extreme peak flash inversions.

vec2 ripKaleido(vec2 uv, float segments) {
    float angle = atan(uv.y, uv.x);
    float radius = length(uv);
    float seg = 6.28318530718 / segments;
    angle = mod(angle, seg);
    angle = abs(angle - seg * 0.5);
    return vec2(cos(angle), sin(angle)) * radius;
}

vec2 shardFold(vec2 uv) {
    uv = abs(uv) - 0.1;
    if (uv.x < uv.y) uv = uv.yx;
    return uv;
}

void main() {
    vec2 uv = aspectUv();
    
    // Stage 1: Screen Tearing (Dimensional Rift)
    vec2 tornUv = uv;
    if (uBeatIntensity > 0.6) {
        float tearPower = step(0.85, sin(uv.y * 100.0 + uTime * 25.0));
        float shiftDir = sin(uTime * 15.0) > 0.0 ? 1.0 : -1.0;
        tornUv.x += tearPower * (0.05 + uBeatIntensity * 0.1) * shiftDir;
    }
    
    // Stage 2: Quantized Glass Shard Snapping (Glass Shard Matrix)
    vec2 shardUv = tornUv;
    if (uBeatIntensity > 0.5) {
        float shardSize = 8.0 + floor(uTreble * 24.0);
        vec2 snapped = floor(tornUv * shardSize) / shardSize;
        shardUv = mix(tornUv, snapped, uBass * 0.9);
    }
    
    // Stage 3: Segment-Snapping Kaleidoscope (Dimensional Rift)
    float segs = 4.0 + floor(pow(uBass, 1.5) * 6.0);
    vec2 k = ripKaleido(shardUv, segs);
    
    // Stage 4: Recursive Geometric Glass Fold (Glass Shard Matrix)
    vec2 p = shardFold(k);
    p = shardFold(p - (0.05 + uBass * 0.15));
    
    // Joint Rotation & Fluid Domain Warp
    p *= rot2(uTime * 0.45 - uBass * 0.4 + uMid * 0.3);
    p = domainWarp(p, uTime * 0.5, 0.07 + uBass * 0.12);
    
    // Stage 5: Framebuffer Zoom & Aspect Mapping
    vec2 sampleUv = p * (0.92 - uBeatIntensity * 0.08);
    sampleUv.x /= uResolution.x / uResolution.y;
    sampleUv = sampleUv * 0.5 + 0.5;
    
    // Stage 6: Hybrid Radial-Diagonal Chromatic Aberration
    float split = 0.015 + uBass * 0.035 + uBeatIntensity * 0.02;
    vec2 offset = p * split + vec2(split, -split) * 0.5; // Radial + Diagonal split
    
    float red   = texture(uPrevFrame, sampleUv + offset).r;
    float green = texture(uPrevFrame, sampleUv).g;
    float blue  = texture(uPrevFrame, sampleUv - offset).b;
    
    vec3 prev = vec3(red, green, blue);
    
    // Extreme Peak Color Inversion
    if (uBeatIntensity > 0.85) {
        prev = 1.0 - prev;
    }
    prev *= 0.90 - uBeatIntensity * 0.05;
    
    // Stage 7: Combined Rift Light Core + Glass Shard Outlines
    float riftCore = smoothstep(0.04, 0.0, abs(p.y));
    float shardEdges = smoothstep(0.05, 0.0, abs(p.x - p.y));
    float combinedLight = max(riftCore, shardEdges);
    
    float hue = fract(uTime * 0.25 + length(shardUv) * 0.6 + uMid * 0.4);
    vec3 light = hsv2rgb(vec3(hue, 1.0, 1.0)) * combinedLight * (0.5 + uBeatIntensity * 1.8);
    
    FragColor = vec4(prev + light, 1.0);
}