// name: Sub-Zero Shatter Matrix
// author: sirpatch
//
// A frozen geometric kaleidoscope that violently fractures into glass shards
// exclusively on massive sub-bass impacts. No treble, no mids. Pure low-end destruction.

vec2 bassKaleido(vec2 uv, float segments) {
    float angle = atan(uv.y, uv.x);
    float radius = length(uv);
    float seg = 6.28318530718 / segments;
    angle = mod(angle, seg);
    angle = abs(angle - seg * 0.5);
    return vec2(cos(angle), sin(angle)) * radius;
}

void main() {
    vec2 uv = aspectUv();
    
    // Stage 1: Bass-Triggered Glass Fracturing
    vec2 shardUv = uv;
    if (uBass > 0.4) {
        // Grid density explodes based on bass power
        float shardSize = 4.0 + pow(uBass, 2.0) * 30.0; 
        vec2 snapped = floor(uv * shardSize) / shardSize;
        
        // Snaps into glass shards ONLY when bass peaks
        shardUv = mix(uv, snapped, uBass); 
    }
    
    // Stage 2: Bass-Multiplied Mirroring
    // Starts at 4 mirrors, multiplies up to 16 purely on bass peaks
    float segs = 4.0 + floor(pow(uBass, 2.0) * 12.0); 
    vec2 k = bassKaleido(shardUv, segs);
    
    // Stage 3: Bass-Driven Folding & Spinning
    k = abs(k) - (uBass * 0.25); // Space only folds when bass hits
    k *= rot2(uTime * 0.15 + uBass * 2.0); // Violent spin on kicks
    
    vec2 sampleUv = k * (0.95 - uBass * 0.12);
    sampleUv.x /= uResolution.x / uResolution.y;
    sampleUv = sampleUv * 0.5 + 0.5;
    
    // Stage 4: Cross-Diagonal Bass Sheer
    float split = uBass * 0.08;
    float red   = texture(uPrevFrame, sampleUv + vec2(split, -split)).r;
    float green = texture(uPrevFrame, sampleUv).g;
    float blue  = texture(uPrevFrame, sampleUv - vec2(split, -split)).b;
    
    vec3 prev = vec3(red, green, blue);
    
    // Extreme sub peaks cause negative flash inversions
    if (uBass > 0.85) prev = 1.0 - prev;
    prev *= 0.89;
    
    // Stage 5: Electric Sub-Bass Lines
    float edge = smoothstep(0.04, 0.0, abs(k.x - k.y));
    
    // Cyan and Blue pure sub energy
    vec3 subEnergy = vec3(0.0, 0.7, 1.0) * edge * (uBass * 3.0); 
    
    FragColor = vec4(prev + subEnergy, 1.0);
}