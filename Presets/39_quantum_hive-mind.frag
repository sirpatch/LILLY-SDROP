// name: Quantum Hive-Mind
// author: sirpatch
//
// An infinite grid of synchronized mini-kaleidoscopes. 
// Sub-bass forces the grid to multiply and shrink, filling the screen with fractal insect eyes.

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
    
    // Stage 1: Audio-Reactive Cartesian Grid Scale
    // Quiet = big kaleidoscopes. Bass drops = massive grid of tiny ones.
    float gridScale = 2.0 + pow(uBass, 2.0) * 15.0; 
    
    // Divide space into repeating cells
    vec2 gridUv = fract(uv * gridScale) - 0.5;
    
    // Stage 2: Apply Kaleidoscope to EACH cell independently
    float segs = 4.0 + floor(uTreble * 8.0);
    vec2 k = sharpKaleido(gridUv, segs);
    
    // Spin the contents of each cell
    k *= rot2(uTime * 0.5 + uMid * 1.5);
    
    // Global warp across the entire grid to link them together
    k = domainWarp(k, uTime * 0.3, 0.1 + uBass * 0.15);
    
    // Stage 3: Framebuffer Scaling
    vec2 sampleUv = k * (0.95 - uBeatIntensity * 0.05);
    sampleUv.x /= uResolution.x / uResolution.y;
    sampleUv = sampleUv * 0.5 + 0.5;
    
    // Stage 4: Cell-Based Chromatic Aberration
    float split = 0.02 + uBeatIntensity * 0.03;
    float red   = texture(uPrevFrame, sampleUv + vec2(split, -split)).r;
    float green = texture(uPrevFrame, sampleUv).g;
    float blue  = texture(uPrevFrame, sampleUv - vec2(split, -split)).b;
    
    vec3 prev = vec3(red, green, blue);
    
    // Flash invert on kicks
    if (uBeatIntensity > 0.85) prev = 1.0 - prev;
    prev *= 0.88 - uBeatIntensity * 0.04;
    
    // Stage 5: Hive Cell Borders & Core Light
    float cellBorders = smoothstep(0.45, 0.5, max(abs(gridUv.x), abs(gridUv.y)));
    float mirrorCuts = smoothstep(0.04, 0.0, abs(k.y));
    
    float hue = fract(uTime * 0.15 + length(uv) * 0.5 + uTreble * 0.4);
    vec3 hiveGlow = hsv2rgb(vec3(hue, 1.0, 1.0)) * max(cellBorders, mirrorCuts) * (0.4 + uBeatIntensity * 1.6);
    
    FragColor = vec4(prev + hiveGlow, 1.0);
}