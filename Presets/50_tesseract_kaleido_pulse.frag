// name: Tesseract Kaleido Pulse
// author: sirpatch
void main() {
    // 1. Get aspect-corrected UV [-1..1]
    vec2 st = aspectUv();

    // Audio reactivity controls
    float bass   = uBass * 1.4;
    float mid    = uMid * 1.2;
    float treble = uTreble * 1.5;
    float beat   = uBeatIntensity * 2.0;

    // 2. Polar transformation
    float r = length(st);
    float a = atan(st.y, st.x);

    // 3. Dynamic Kaleidoscope Folding
    // Number of kaleidoscope slices scales automatically on bass hits
    float numFolds = 4.0 + floor(bass * 6.0);
    float sliceAngle = 3.14159265 / numFolds;
    
    a = mod(a, sliceAngle * 2.0);
    a = abs(a - sliceAngle);

    // Reconstruct folded coordinates
    vec2 p = vec2(cos(a), sin(a)) * r;

    // Apply wobbly fluid displacement via built-in domainWarp
    p = domainWarp(p, uTime * 0.4, 0.08 + mid * 0.18);

    // Rotate kaleidoscope space over time
    p = rot2(uTime * 0.25 + bass * 0.4) * p;

    // 4. Audio Spectrum Bars Laser Layer
    vec3 barsColor = vec3(0.0);
    const int BARS = 32;

    for (int i = 0; i < BARS; i++) {
        float t = float(i) / float(BARS - 1);
        float spec = sampleSpectrum(t);

        // Radial ray angle in folded space
        float rayAngle = t * 3.14159265;
        vec2 dir = vec2(cos(rayAngle), sin(rayAngle));

        // Distance field to laser spectrum bar
        float dist = abs(dot(p, dir) - (0.22 + spec * 0.65));

        // Volumetric laser bloom & core
        float glow = exp(-dist * (28.0 - spec * 12.0)) * spec;
        float core = smoothstep(0.015, 0.0, dist) * spec;

        // Color cycling using built-in hsv2rgb
        vec3 hue = hsv2rgb(vec3(t * 0.8 + uTime * 0.12 + treble * 0.25, 0.9, 1.0));
        barsColor += hue * (core * 3.0 + glow * 1.4) * (0.8 + beat * 0.6);
    }

    // 5. Central Pulsating Waveform Ring
    float wave = sampleWaveform(fract(atan(st.y, st.x) / 6.283185 + 0.5));
    float ringDist = abs(r - (0.12 + wave * 0.08 + bass * 0.12));
    float ringGlow = exp(-ringDist * 35.0) * (0.8 + beat * 1.2);
    vec3 ringColor = hsv2rgb(vec3(fract(uTime * 0.08 + bass * 0.3), 0.85, 1.0)) * ringGlow;

    // 6. Liquid Feedback Trails with Chromatic Aberration
    vec2 fbUv = vUv - 0.5;
    fbUv = rot2(0.006 + beat * 0.012) * fbUv; // Spin feedback on beat
    fbUv *= 0.982 - beat * 0.01;            // Zoom pulse on beat
    fbUv += 0.5;

    // Split RGB channels for feedback chromatic aberration
    float shift = 0.003 + treble * 0.005;
    vec3 prev;
    prev.r = texture(uPrevFrame, fbUv + vec2(shift, 0.0)).r;
    prev.g = texture(uPrevFrame, fbUv).g;
    prev.b = texture(uPrevFrame, fbUv - vec2(shift, 0.0)).b;

    // Trail decay rate
    prev *= 0.88 + beat * 0.06;

    // 7. Composite & Vignette
    vec3 finalColor = prev + barsColor * 0.85 + ringColor * 1.2;

    float vig = 1.0 - smoothstep(0.6, 1.5, length(st));
    finalColor *= vig;

    // Tonemapping exposure
    finalColor = finalColor / (1.0 + finalColor * 0.25);

    FragColor = vec4(finalColor, 1.0);
}