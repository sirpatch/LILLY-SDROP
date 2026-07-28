// name: Datamosh Hemorrhage
// author: sirpatch
//
// Simulates digital video corruption and pixel sorting. 
// Bass drops violently pull specific vertical slices of the frame buffer downwards,
// creating a melting, bleeding datamosh aesthetic.

void main() {
    vec2 uv = aspectUv();
    
    // Stage 1: High-Frequency Vertical Glitch Threshold
    // Creates random vertical bands that trigger on audio
    float noise = fract(sin(dot(vec2(floor(uv.x * 40.0)), vec2(12.9898))) * 43758.5453);
    float activeSlice = step(0.6 - uTreble * 0.2, noise); 
    
    // Stage 2: Downward Melting Force (Datamoshing)
    vec2 moshUv = uv;
    if (uBeatIntensity > 0.4) {
        // Rip the active slices downwards based on bass power
        moshUv.y += activeSlice * pow(uBass, 2.0) * 0.25;
    }
    
    // Horizontal tearing for extra digital destruction
    float hTear = step(0.95, sin(uv.y * 80.0 - uTime * 20.0));
    moshUv.x += hTear * uBeatIntensity * 0.1 * (sin(uTime * 30.0) > 0.0 ? 1.0 : -1.0);
    
    // Stage 3: Frame Buffer Sample (No rotation, just pure gravity scale)
    vec2 sampleUv = moshUv * (0.95 - uBass * 0.03);
    sampleUv.x /= uResolution.x / uResolution.y;
    sampleUv = sampleUv * 0.5 + 0.5;
    
    // Stage 4: Chromatic Vertical Bleeding
    float split = 0.008 + uBass * 0.03;
    float r = texture(uPrevFrame, sampleUv + vec2(0.0, split)).r;
    float g = texture(uPrevFrame, sampleUv).g;
    float b = texture(uPrevFrame, sampleUv - vec2(0.0, split)).b;
    
    // Overexpose the corrupted trails
    vec3 prev = vec3(r, g, b);
    if (activeSlice > 0.5 && uBeatIntensity > 0.7) prev = prev.brg; // Scramble colors in melting slices
    prev = pow(prev, vec3(0.95)); // Thick, sticky trails
    prev *= 0.90 - uBeatIntensity * 0.04;
    
    // Stage 5: Glitch Core Illumination
    float core = smoothstep(0.4, 0.0, length(moshUv));
    float hue = fract(uTime * 0.2 + noise * 0.5);
    vec3 digitalFire = hsv2rgb(vec3(hue, 1.0, 1.0)) * core * (0.3 + uBass * 1.5);
    
    FragColor = vec4(prev + digitalFire, 1.0);
}