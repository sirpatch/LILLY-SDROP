// name: Glass Shard Matrix
// author: sirpatch
//
// Smooth kaleidoscopic folding that brutally shatters into quantized 
// glass shards on heavy sub-bass and beat drops. 

vec2 shardFold(vec2 uv) {
    uv = abs(uv) - 0.1;
    if (uv.x < uv.y) uv = uv.yx;
    return uv;
}

void main() {
    vec2 uv = aspectUv();
    
    // Stage 1: Dynamic Coordinate Snapping (Glass Shard Effect)
    vec2 shardUv = uv;
    
    // When beat hits, quantize the UV grid into harsh steps
    if (uBeatIntensity > 0.5) {
        float shardSize = 8.0 + floor(uTreble * 24.0);
        vec2 snapped = floor(uv * shardSize) / shardSize;
        // Interpolate between smooth and shattered space based on bass power
        shardUv = mix(uv, snapped, uBass * 0.9);
    }
    
    // Stage 2: Recursive Geometric Fold
    vec2 p = shardFold(shardUv);
    p = shardFold(p - (0.05 + uBass * 0.15));
    p *= rot2(uTime * 0.4 + uMid * 0.3);
    
    // Heavy domain warp applied to the shards
    p = domainWarp(p, uTime * 0.5, 0.08 + uBass * 0.1);
    
    // Stage 3: Fast Rotation & Zoom Pull
    vec2 sampleUv = p * (0.92 - uBeatIntensity * 0.08);
    sampleUv.x /= uResolution.x / uResolution.y;
    sampleUv = sampleUv * 0.5 + 0.5;
    
    // Stage 4: Multi-Directional RGB Splitting
    float split = 0.015 + uBass * 0.04;
    float red = texture(uPrevFrame, sampleUv + vec2(split, -split)).r;
    float green = texture(uPrevFrame, sampleUv).g;
    float blue = texture(uPrevFrame, sampleUv - vec2(split, -split)).b;
    
    vec3 prev = vec3(red, green, blue);
    
    // Invert glass shards on extreme peaks
    if (uBeatIntensity > 0.85) prev = 1.0 - prev;
    prev *= 0.90 - uBeatIntensity * 0.05;
    
    // Stage 5: Neon Shard Outlines
    float edges = smoothstep(0.05, 0.0, abs(p.x - p.y));
    float hue = fract(uTime * 0.25 + length(shardUv) * 0.8);
    vec3 laserCut = hsv2rgb(vec3(hue, 1.0, 1.0)) * edges * (0.5 + uBeatIntensity * 1.5);
    
    FragColor = vec4(prev + laserCut, 1.0);
}