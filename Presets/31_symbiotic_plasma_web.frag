// name: Symbiotic Plasma Web
// author: sirpatch
//
// An organic, bioluminescent cellular network.
// Uses outward-bleeding zoom (pushes out instead of pulling in) combined with 
// heavy multi-axis domain warping for a toxic, breathing fluid effect.

void main() {
    vec2 uv = aspectUv();
    float r = length(uv);
    float a = atan(uv.y, uv.x);
    
    // Stage 1: Cellular Warping
    vec2 warp = domainWarp(uv, uTime * 0.25, 0.12 + uBass * 0.25);
    
    // Stage 2: Outward Expansive Zoom (Bleeds outwards instead of inwards)
    float zoom = 1.01 + (pow(uBass, 2.0) * 0.05);
    vec2 sampleUv = warp * zoom;
    
    // Subtly breathing rotation
    sampleUv *= rot2(sin(uTime * 0.8) * 0.05);
    
    sampleUv.x /= uResolution.x / uResolution.y;
    sampleUv = sampleUv * 0.5 + 0.5;
    
    // Stage 3: Outward Directional Chromatic Bleed
    float split = 0.005 + uBass * 0.025;
    vec2 dir = normalize(warp + 0.001); // Splitting follows the fluid direction
    
    float red = texture(uPrevFrame, sampleUv + dir * split).r;
    float green = texture(uPrevFrame, sampleUv).g;
    float blue = texture(uPrevFrame, sampleUv - dir * split).b;
    
    vec3 prev = vec3(red, green, blue);
    
    // Overexpose the fluid trails slightly to make them glow, then decay
    prev = pow(prev, vec3(0.96)); 
    prev *= 0.92 - uBeatIntensity * 0.03;
    
    // Stage 4: Toxic Cellular Structure
    float web = smoothstep(0.85, 1.0, sin(r * 25.0 - uTime * 6.0) * cos(a * 12.0 + uTime * 3.0));
    
    // Acidic palette (Greens, Teals, and Magentas)
    float hue = fract(0.4 + uTime * 0.05 + r * 0.3 + uMid * 0.4); 
    vec3 glow = hsv2rgb(vec3(hue, 0.9, 1.0)) * web * (0.2 + uBass * 1.5);
    
    FragColor = vec4(prev + glow, 1.0);
}