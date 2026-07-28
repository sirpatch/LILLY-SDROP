// name: Chrono-Tesseract Glitch
// author: sirpatch
//
// 4D geometric folding with time-stuttering logic. 
// When the beat drops, time physically glitches, UVs pixelate into blocks, 
// and the color channels violently swap.

void main() {
    vec2 uv = aspectUv();
    
    // Stage 1: Time Stuttering (Time speeds up and jumps on beats)
    float t = uTime + uBeatIntensity * 0.15 * sin(uTime * 50.0);
    
    vec2 p = uv;
    
    // Stage 2: Recursive 4D Fold
    for(int i = 0; i < 3; i++) {
        p = abs(p) - (0.12 + uBass * 0.08);
        p *= rot2(t * 0.2 + uMid * 0.15);
    }
    
    // Stage 3: Blocky Digital Glitch Displacement (Driven by Treble)
    vec2 grid = floor(p * (25.0 - uTreble * 10.0)) / 25.0;
    vec2 displace = vec2(sin(grid.y * 15.0 + t), cos(grid.x * 15.0 - t)) * uBeatIntensity * 0.06;
    
    // Stage 4: Zoom Feedback Loop
    vec2 sampleUv = (uv + displace) * (0.95 - uBass * 0.06);
    sampleUv.x /= uResolution.x / uResolution.y;
    sampleUv = sampleUv * 0.5 + 0.5;
    
    // Stage 5: Glitchy RGB Shearing
    float split = 0.012 + uBeatIntensity * 0.035;
    float r = texture(uPrevFrame, sampleUv + vec2(split, 0.0)).r;
    float g = texture(uPrevFrame, sampleUv).g;
    float b = texture(uPrevFrame, sampleUv - vec2(split, 0.0)).b;
    
    vec3 prev = vec3(r, g, b);
    
    // Hard channel swap on heavy drops
    if (uBeatIntensity > 0.8) {
        prev = prev.brg;
    }
    prev *= 0.90 - uBeatIntensity * 0.05;
    
    // Stage 6: Geometric Laser Wireframe
    float geo = smoothstep(0.02, 0.0, abs(p.x * p.y));
    float hue = fract(t * 0.1 + length(uv) * 0.5);
    vec3 geoColor = hsv2rgb(vec3(hue, 1.0, 1.0)) * geo * (0.5 + uTreble * 1.5);
    
    FragColor = vec4(prev + geoColor, 1.0);
}