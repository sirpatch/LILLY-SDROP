// name: Liquid-Mirror Goa Tunnel
// author: sirpatch
//
// A twisted, organic kaleidoscope where the mirror axes melt into spirals.
// Features heavy fluid displacement, breathing zoom logic, and toxic acid neon feedback.

vec2 fluidKaleido(vec2 uv, float segments, float twistForce) {
    float angle = atan(uv.y, uv.x);
    float radius = length(uv);
    
    // Twist space BEFORE mirroring to create organic, curved glass
    angle += radius * twistForce;
    
    float seg = 6.28318530718 / segments;
    angle = mod(angle, seg);
    angle = abs(angle - seg * 0.5);
    
    return vec2(cos(angle), sin(angle)) * radius;
}

void main() {
    vec2 uv = aspectUv();
    
    // Stage 1: Twisted Organic Mirroring
    float twist = 2.0 + uMid * 4.0 + sin(uTime * 0.5) * 2.0;
    float segs = 8.0 + floor(pow(uBass, 2.0) * 8.0);
    vec2 k = fluidKaleido(uv, segs, twist);
    
    // Stage 2: Heavy Liquid Warp (Melts the mirrors)
    k = domainWarp(k, uTime * 0.35, 0.12 + uBass * 0.2);
    
    // Stage 3: Breathing Zoom (Pushes out on bass, pulls in on quiet)
    float zoom = mix(0.98, 1.03, pow(uBass, 1.5));
    vec2 sampleUv = k * zoom;
    
    // Counter-spin feedback
    sampleUv *= rot2(uTime * -0.1 + uBeatIntensity * 0.1);
    sampleUv.x /= uResolution.x / uResolution.y;
    sampleUv = sampleUv * 0.5 + 0.5;
    
    // Stage 4: Toxic Bleed Chromatic Aberration
    float split = 0.01 + uBass * 0.03;
    vec2 dir = normalize(k + 0.001);
    
    float red   = texture(uPrevFrame, sampleUv + dir * split).r;
    float green = texture(uPrevFrame, sampleUv).g;
    float blue  = texture(uPrevFrame, sampleUv - dir * split).b;
    
    vec3 prev = vec3(red, green, blue);
    
    // Overexpose the liquid feedback trails
    prev = pow(prev, vec3(0.92)); 
    prev *= 0.91 - uBeatIntensity * 0.03;
    
    // Stage 5: Bioluminescent Acid Emission
    float web = smoothstep(0.7, 1.0, sin(length(k) * 25.0 - uTime * 6.0));
    float hue = fract(0.4 + uTime * 0.1 + length(k) * 0.5 + uTreble * 0.3); // Acid green/cyan
    vec3 glow = hsv2rgb(vec3(hue, 1.0, 1.0)) * web * (0.4 + uBass * 1.6);
    
    FragColor = vec4(prev + glow, 1.0);
}