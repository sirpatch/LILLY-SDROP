// name: DMT Prism Matrix
// author: sirpatch
//
// Fuses a high-frequency dynamic kaleidoscope with 3-stage recursive tesseract folding.
// Creates a shattering, razor-sharp crystal matrix that violently rotates and shears.

vec2 sharpKaleido(vec2 uv, float segments) {
    float angle = atan(uv.y, uv.x);
    float radius = length(uv);
    float seg = 6.28318530718 / segments;
    angle = mod(angle, seg);
    angle = abs(angle - seg * 0.5);
    return vec2(cos(angle), sin(angle)) * radius;
}

void main() {
    vec2 uv = aspectUv();
    
    // Stage 1: Dynamic Kaleidoscope Base
    float segs = 4.0 + floor(uTreble * 12.0); // Snares/Hi-hats multiply the cuts
    vec2 p = sharpKaleido(uv, segs);
    
    // Stage 2: Recursive Crystalline Folding (The Matrix)
    for(int i = 0; i < 3; i++) {
        p = abs(p) - (0.05 + uBass * 0.1);
        p *= rot2(uTime * 0.2 + uMid * 0.15 + float(i) * 0.2);
        if (p.x < p.y) p = p.yx;
    }
    
    // Domain warp the shattered shards
    p = domainWarp(p, uTime * 0.5, 0.06 + uBass * 0.12);
    
    // Stage 3: High-Speed Rotational Zoom
    vec2 sampleUv = p * (0.94 - uBeatIntensity * 0.06);
    sampleUv *= rot2(uBeatIntensity * 0.15); // Twists the buffer on beats
    sampleUv.x /= uResolution.x / uResolution.y;
    sampleUv = sampleUv * 0.5 + 0.5;
    
    // Stage 4: Cross-Diagonal RGB Separation
    float split = 0.012 + uBass * 0.035;
    float red   = texture(uPrevFrame, sampleUv + vec2(split, -split)).r;
    float green = texture(uPrevFrame, sampleUv).g;
    float blue  = texture(uPrevFrame, sampleUv - vec2(split, -split)).b;
    
    vec3 prev = vec3(red, green, blue);
    if (uBeatIntensity > 0.75) prev = prev.brg; // Hard toxic color swap
    prev = pow(prev, vec3(0.95)); // Saturated, sticky trails
    prev *= 0.89 - uBeatIntensity * 0.04;
    
    // Stage 5: Neon Diamond Cut Lines
    float cuts = smoothstep(0.02, 0.0, abs(p.x - p.y));
    float hue = fract(uTime * 0.25 + length(uv) * 1.5);
    vec3 laserCut = hsv2rgb(vec3(hue, 1.0, 1.0)) * cuts * (0.6 + uBeatIntensity * 1.8);
    
    FragColor = vec4(prev + laserCut, 1.0);
}