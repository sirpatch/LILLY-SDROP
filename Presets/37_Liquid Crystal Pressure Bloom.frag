// name: Liquid Crystal Pressure Bloom
// author: sirpatch
//
// Simulates pressed/squeezed LCD panel birefringence. 
// Features back-layer depth feedback bleeding upward to the surface, 
// multi-phase wavelength chromatic dispersion, and iridescent pressure halos.

vec3 lcdIridescence(float phase) {
    // Calculates LCD polarization interference spectrum (Magenta -> Blue -> Cyan -> Yellow)
    return 0.5 + 0.5 * cos(phase + vec3(0.0, 2.094, 4.188));
}

void main() {
    vec2 uv = aspectUv();
    
    // Stage 1: Pressure Center & Fluid Wave Propagation
    float r = length(uv);
    float a = atan(uv.y, uv.x);
    
    // Wave ripple moving outward from LCD touch point
    float pressureWave = sin(r * 18.0 - uTime * 3.0 - uBass * 6.0);
    float pressureZone = smoothstep(0.7, 0.0, r) * (0.4 + uBass * 0.6);
    
    // Stage 2: Liquid Crystal Displacement Warping
    // Displaces back layers upward toward the top surface
    vec2 warp = domainWarp(uv, uTime * 0.3, 0.08 + pressureZone * 0.2);
    
    // Stage 3: Multi-Depth Layer Bleed (Sampling deep buffer layers)
    // Pulls inner/back buffer frames outward and upward on audio peaks
    float zoom = 0.94 - (pressureZone * 0.08) - (uBeatIntensity * 0.04);
    vec2 sampleUv = warp * zoom;
    
    sampleUv.x /= uResolution.x / uResolution.y;
    sampleUv = sampleUv * 0.5 + 0.5;
    
    // Stage 4: Chromatic Phase Delay Dispersion
    // Red, Green, and Blue light waves refract at different speeds under liquid crystal squeeze
    float split = 0.01 + pressureZone * 0.04 + uBeatIntensity * 0.02;
    vec2 radialDir = vec2(cos(a), sin(a));
    
    float red   = texture(uPrevFrame, sampleUv + radialDir * split * 1.5).r;
    float green = texture(uPrevFrame, sampleUv + radialDir * split * 0.8).g;
    float blue  = texture(uPrevFrame, sampleUv - radialDir * split * 0.5).b;
    
    vec3 prevLayer = vec3(red, green, blue);
    
    // High-pressure color shift (shifts back-layer contrast up to top surface)
    prevLayer = pow(prevLayer, vec3(0.92 - pressureZone * 0.2)); 
    prevLayer *= 0.91 - uBeatIntensity * 0.03;
    
    // Stage 5: Iridescent Rainbow Polarization (Pressure Halo Bleed)
    float phase = r * 22.0 - uTime * 4.0 + pressureWave * 3.0 + uMid * 5.0;
    vec3 lcdSpectrum = lcdIridescence(phase);
    
    // Inject the polarization colors directly into the pressure zone
    float bloomGlow = smoothstep(0.1, 0.9, pressureZone + pressureWave * 0.2);
    vec3 topLayerRgb = lcdSpectrum * bloomGlow * (0.5 + uBass * 1.8);
    
    // Blend back layers rising to the top with the polarized surface light
    FragColor = vec4(prevLayer + topLayerRgb, 1.0);
}