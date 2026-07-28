// name: Singularity Event Horizon
// author: sirpatch
//
// Gravitational singularity that swallows space, bends feedback light into an
// accretion disk, and violently detonates outwards on sub-bass drops.

void main() {
    vec2 uv = aspectUv();
    float r = length(uv);
    float a = atan(uv.y, uv.x);

    // 1. Gravitational lensing distortion
    float gravity = (0.18 + uBass * 0.4) / (r + 0.05);
    a += gravity * (sin(uTime * 0.5) > 0.0 ? 1.0 : -1.0);

    vec2 warped = vec2(cos(a), sin(a)) * r;
    warped = domainWarp(warped, uTime * 0.5, 0.1 + uMid * 0.15);

    // 2. Gravitational push/pull pulse
    float explode = pow(uBeatIntensity, 2.5) * 0.25;
    float zoom = 0.94 - (uBass * 0.08) + explode;
    
    vec2 sampleUv = warped * zoom;
    sampleUv.x /= uResolution.x / uResolution.y;
    sampleUv = sampleUv * 0.5 + 0.5;

    // 3. Gravitational RGB shearing
    float split = 0.01 + gravity * 0.003 + uBeatIntensity * 0.025;
    vec2 dir = normalize(uv + 0.001);
    float red   = texture(uPrevFrame, sampleUv + dir * split).r;
    float green = texture(uPrevFrame, sampleUv).g;
    float blue  = texture(uPrevFrame, sampleUv - dir * split).b;

    vec3 prev = vec3(red, green, blue);
    if (uBeatIntensity > 0.8) prev = prev.brg; // Hard channel swap on drops
    prev *= 0.90 - uBeatIntensity * 0.04;

    // 4. Accretion Disk Light Rays
    float rays = smoothstep(0.7, 1.0, sin(a * 16.0 + uTime * 8.0) * sin(r * 25.0 - uTime * 10.0));
    float ring = smoothstep(0.05, 0.0, abs(r - (0.2 + uBass * 0.3)));
    
    float hue = fract(uTime * 0.2 + r * 0.8 + a * 0.1);
    vec3 photonGlow = hsv2rgb(vec3(hue, 1.0, 1.0)) * (rays + ring * 2.5) * (0.4 + uBeatIntensity * 1.6);

    FragColor = vec4(prev + photonGlow, 1.0);
}