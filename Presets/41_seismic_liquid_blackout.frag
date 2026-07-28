// name: Seismic Liquid Blackout
// author: sirpatch
//
// Pitch black space that only illuminates and melts on sub-bass impacts.
// Creates a heavy, downward gravitational pull (datamoshing) driven purely by low frequencies.

void main() {
    vec2 uv = aspectUv();
    
    // Stage 1: Bass-Driven Liquid Gravity
    // Downward pull is dictated entirely by the bass power
    vec2 melt = vec2(
        sin(uv.y * 12.0 + uTime * 2.0) * uBass * 0.15,
        -pow(uBass, 2.0) * 0.25 // Extreme downward gravity on kicks
    );
    
    vec2 p = uv + melt;
    
    // Fluid domain warping scales directly with bass power
    p = domainWarp(p, uTime * 0.3, uBass * 0.35);
    
    // Stage 2: Framebuffer Zoom
    vec2 sampleUv = p * (0.95 - uBass * 0.08);
    sampleUv.x /= uResolution.x / uResolution.y;
    sampleUv = sampleUv * 0.5 + 0.5;
    
    // Stage 3: Heavy Vertical Chromatic Bleed
    float split = uBass * 0.08; // Splitting ONLY happens on bass
    float r = texture(uPrevFrame, sampleUv + vec2(0.0, split)).r;
    float g = texture(uPrevFrame, sampleUv).g;
    float b = texture(uPrevFrame, sampleUv - vec2(0.0, split)).b;
    
    vec3 prev = vec3(r, g, b);
    
    // Trails become highly sticky/thick when bass is heavy
    prev *= mix(0.80, 0.96, uBass); 
    
    // Stage 4: Magma Fault Lines
    // Glowing cracks that only light up when the bass shakes the screen
    float fault = smoothstep(0.06, 0.0, abs(p.x * p.y));
    vec3 magma = vec3(1.0, 0.2, 0.0) * fault * (uBass * 3.5); // Pure fiery energy
    
    FragColor = vec4(prev + magma, 1.0);
}