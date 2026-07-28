// name: Bass Fluid Melt
// author: sirpatch
//
// Pure sub-bass liquid destruction.
// Bass drives heavy domain warping, directional tearing, and toxic plasma ignitions.

void main() {
    vec2 uv = aspectUv();

    // 1. Exponential bass curve for sharp kick reaction
    float bassPunch = smoothstep(0.2, 0.9, uBass);
    float subDrop = pow(uBass, 2.0);

    // 2. Heavy fluid warp anchored by bass
    vec2 fluid = domainWarp(uv, uTime * 0.3, 0.08 + bassPunch * 0.15);
    
    // Low-frequency directional pull
    float angle = atan(fluid.y, fluid.x) + uTime * 0.2;
    float dist = length(fluid);
    
    // Zoom in/out pulse on kicks
    float zoom = 0.97 - (subDrop * 0.06);
    vec2 warpedUv = vec2(cos(angle), sin(angle)) * dist * zoom;

    // 3. Exact aspect ratio fix from your working presets
    vec2 sampleUv = warpedUv;
    sampleUv.x /= uResolution.x / uResolution.y;
    sampleUv = sampleUv * 0.5 + 0.5;

    // 4. Bass tearing chromatic aberration
    float split = 0.002 + subDrop * 0.02;
    float r = texture(uPrevFrame, sampleUv + vec2(split, 0.0)).r;
    float g = texture(uPrevFrame, sampleUv).g;
    float b = texture(uPrevFrame, sampleUv - vec2(split, 0.0)).b;

    // Feedback trails with high contrast decay
    vec3 prev = vec3(r, g, b);
    prev *= 0.92 - bassPunch * 0.04;

    // 5. Viscous liquid core glow that explodes on sub-bass
    float core = smoothstep(0.6, 0.0, dist);
    
    // Hue flips between toxic lime green and deep purple on bass hits
    float hue = mix(0.75, 0.35, bassPunch); 
    vec3 fluidGlow = hsv2rgb(vec3(hue, 1.0, 1.0)) * core * subDrop * 1.5;

    FragColor = vec4(prev + fluidGlow, 1.0);
}