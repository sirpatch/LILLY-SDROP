// name: Neuromancer's Abyss
// author: sirpatch
//
// Pure, destructive cyber-fluid. Features shattered angular coordinates, 
// deep sub-bass shockwaves, and thick, decaying neon oil feedback trails.

void main() {
    vec2 uv = aspectUv();

    // Stage 1: Violent Digital Glitch on heavy beats
    if (uBeatIntensity > 0.7) {
        float glitchLine = step(0.9, sin(uv.y * 50.0 + uTime * 15.0));
        uv.x += glitchLine * 0.08 * (sin(uTime * 20.0) > 0.0 ? 1.0 : -1.0);
    }

    // Stage 2: Exponential Sub-Bass Extraction
    // Creates a dead-zone for quiet parts, exploding ONLY on huge kicks
    float subDrop = pow(max(0.0, uBass - 0.15), 2.0); 

    // Stage 3: Angular Shattering (Glass break effect via Treble/Mid)
    float r = length(uv);
    float a = atan(uv.y, uv.x);
    
    float shatterSectors = 8.0 + floor(uTreble * 32.0);
    float snappedA = floor(a * shatterSectors) / shatterSectors;
    float angleMix = mix(a, snappedA, uMid * 0.9); // Mid frequencies snap the space
    
    vec2 shatteredUv = vec2(cos(angleMix), sin(angleMix)) * r;

    // Stage 4: Toxic Sludge Displacement
    vec2 fluid = domainWarp(shatteredUv, uTime * 0.3, 0.1 + subDrop * 0.35);
    
    // Stage 5: Gravitational Shockwave Pull
    float pull = (0.05 + subDrop * 0.15) / (length(fluid) + 0.1);
    vec2 sampleUv = fluid * (0.97 - subDrop * 0.1 - pull);
    sampleUv *= rot2(uTime * -0.15 + subDrop * 0.3);

    sampleUv.x /= uResolution.x / uResolution.y;
    sampleUv = sampleUv * 0.5 + 0.5;

    // Stage 6: Directional Bleed Chromatic Aberration
    // Splits RGB along the exact velocity lines of the fluid
    vec2 tear = normalize(fluid + 0.001) * (0.006 + subDrop * 0.05);
    float red = texture(uPrevFrame, sampleUv + tear).r;
    float green = texture(uPrevFrame, sampleUv).g;
    float blue = texture(uPrevFrame, sampleUv - tear).b;

    // Stage 7: Decaying Neon Oil Trails (High Contrast Exponent)
    vec3 prev = vec3(red, green, blue);
    prev = pow(prev, vec3(1.03 - subDrop * 0.15)); 
    prev *= 0.92 - uBeatIntensity * 0.04;

    // Stage 8: Corrupted Plasma Ignitions
    float plasma = smoothstep(0.4, 0.0, length(fluid));
    float ring = smoothstep(0.9, 1.0, sin(r * 50.0 - uTime * 12.0 - uBass * 20.0));
    
    // Shifting radioactive palette
    float hue = mix(0.05, 0.75, uBeatIntensity + r * 0.6);
    vec3 energy = hsv2rgb(vec3(hue, 1.0, 1.0)) * (plasma * subDrop * 2.5 + ring * uBass);

    FragColor = vec4(prev + energy, 1.0);
}