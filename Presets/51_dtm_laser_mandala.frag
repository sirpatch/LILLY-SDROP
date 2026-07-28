// name: DTM Laser Mandala
// author: sirpatch
void main() {
    // Pitch black background base
    vec3 color = vec3(0.0);
    vec2 st = aspectUv();
    
    float r = length(st);
    float a = atan(st.y, st.x);

    // Audio reactive dynamics
    float bass   = uBass * 1.5;
    float mid    = uMid * 1.3;
    float treble = uTreble * 1.6;
    float beat   = uBeatIntensity;

    // Dynamic Kaleidoscope slice multiplication on bass
    float folds = 4.0 + floor(bass * 8.0);
    float slice = 3.14159265 / folds;
    a = mod(a, slice * 2.0);
    a = abs(a - slice);

    // Folded space coordinates
    vec2 p = vec2(cos(a), sin(a)) * r;

    // Fluid domain warping on the fold lines only
    p = domainWarp(p, uTime * 0.4, 0.08 + mid * 0.15);
    p = rot2(uTime * 0.2 + bass * 0.3) * p;

    // Laser Spectrum Bars
    vec3 rays = vec3(0.0);
    const int BARS = 32;
    for (int i = 0; i < BARS; i++) {
        float t = float(i) / float(BARS - 1);
        float spec = sampleSpectrum(t);

        float ang = t * 3.14159265;
        vec2 dir = vec2(cos(ang), sin(ang));

        // Distance to spectrum beam
        float d = abs(dot(p, dir) - (0.2 + spec * 0.65));
        
        // Fast exponential drop-off to guarantee black background between rays
        float glow = exp(-d * (45.0 - spec * 15.0)) * spec;
        float core = smoothstep(0.012, 0.0, d) * spec;

        vec3 col = hsv2rgb(vec3(fract(t * 0.9 + uTime * 0.15 + treble * 0.3), 0.95, 1.0));
        rays += col * (core * 3.5 + glow * 1.8) * (0.8 + beat * 0.8);
    }

    // Central Waveform Core Ring
    float wave = sampleWaveform(fract(atan(st.y, st.x) / 6.283185 + uTime * 0.1));
    float ringD = abs(r - (0.12 + wave * 0.08 + bass * 0.1));
    float ringGlow = exp(-ringD * 50.0) * (1.0 + beat * 1.5);
    vec3 ringCol = hsv2rgb(vec3(fract(uTime * 0.2 + bass * 0.4), 0.9, 1.0)) * ringGlow;

    // Feedback Trails (Fades to 0.0 quickly to maintain deep black void)
    vec2 fbUv = vUv - 0.5;
    fbUv = rot2(0.01 + beat * 0.015) * fbUv;
    fbUv *= 0.97 - beat * 0.015;
    fbUv += 0.5;

    float shift = 0.004 + treble * 0.006;
    vec3 prev;
    prev.r = texture(uPrevFrame, fbUv + vec2(shift, 0.0)).r;
    prev.g = texture(uPrevFrame, fbUv).g;
    prev.b = texture(uPrevFrame, fbUv - vec2(shift, 0.0)).b;
    prev *= 0.82; // Steep decay so background stays black

    color = prev + rays * 0.9 + ringCol * 1.2;

    FragColor = vec4(color, 1.0);
}