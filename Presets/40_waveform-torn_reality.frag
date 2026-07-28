// name: Waveform-Torn Reality
// author: sirpatch
//
// Synthesizes an audio wave and uses it to violently tear the horizontal coordinates 
// of the screen before feeding it into a hyper-kaleidoscope. Pure structural glitch.

vec2 glitchKaleido(vec2 uv, float segments) {
    float angle = atan(uv.y, uv.x);
    float radius = length(uv);
    float seg = 6.28318530718 / segments;
    angle = mod(angle, seg);
    angle = abs(angle - seg * 0.5);
    return vec2(cos(angle), sin(angle)) * radius;
}

void main() {
    vec2 uv = aspectUv();
    
    // Stage 1: Destructive Audio Wave Generation
    float ripWave = sin(uv.y * 15.0 + uTime * 10.0) * uBass * 0.2;
    ripWave += cos(uv.y * 30.0 - uTime * 15.0) * uTreble * 0.1;
    
    // Only tear the screen when the beat hits
    vec2 tornUv = uv;
    if (uBeatIntensity > 0.4) {
        tornUv.x += ripWave; // The waveform physically rips the X coordinates
    }
    
    // Stage 2: Kaleidoscope Folding on the Torn Space
    float segs = 6.0 + floor(uTreble * 24.0);
    vec2 k = glitchKaleido(tornUv, segs);
    
    // Liquid displacement on top of the glitch
    k = domainWarp(k, uTime * 0.5, 0.08 + uBass * 0.1);
    
    // Stage 3: Framebuffer Sample & Scale
    vec2 sampleUv = k * (0.94 - uBeatIntensity * 0.06);
    sampleUv.x /= uResolution.x / uResolution.y;
    sampleUv = sampleUv * 0.5 + 0.5;
    
    // Stage 4: Violent Horizontal Chromatic Aberration
    float split = 0.02 + abs(ripWave) * 0.1 + uBeatIntensity * 0.03;
    float red   = texture(uPrevFrame, sampleUv + vec2(split, 0.0)).r;
    float green = texture(uPrevFrame, sampleUv).g;
    float blue  = texture(uPrevFrame, sampleUv - vec2(split, 0.0)).b;
    
    vec3 prev = vec3(red, green, blue);
    prev = pow(prev, vec3(0.95)); // Saturated glitch trails
    
    // Strobe invert if the wave gets too intense
    if (abs(ripWave) > 0.15 && uBeatIntensity > 0.7) {
        prev = prev.gbr; 
    }
    prev *= 0.88 - uBeatIntensity * 0.04;
    
    // Stage 5: Neon Wave-Rip Overlays
    float mirrorEdge = smoothstep(0.04, 0.0, abs(k.y));
    float waveCore = smoothstep(0.02, 0.0, abs(k.x)); // Center axis heavily torn
    
    float hue = fract(uTime * 0.3 + abs(ripWave) * 2.0 + uMid * 0.5);
    vec3 glitchLight = hsv2rgb(vec3(hue, 1.0, 1.0)) * max(mirrorEdge, waveCore) * (0.5 + uBeatIntensity * 1.5);
    
    FragColor = vec4(prev + glitchLight, 1.0);
}