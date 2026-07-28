// name: Hyper-Prism Crystal Lattice
// author: sirpatch
void main() {
    vec3 color = vec3(0.0);
    vec2 st = aspectUv();

    float r = length(st);
    float a = atan(st.y, st.x);

    // Audio reactivity
    float bass   = uBass * 1.7;
    float mid    = uMid * 1.4;
    float treble = uTreble * 1.8;
    float beat   = uBeatIntensity;

    // 1. Dynamic Kaleidoscope Symmetry Folding (Folds expand on bass)
    float folds = 8.0 + floor(bass * 8.0);
    float slice = 3.14159265 / folds;
    float foldedAngle = mod(a, slice * 2.0);
    foldedAngle = abs(foldedAngle - slice);

    // Folded space vector
    vec2 kp = vec2(cos(foldedAngle), sin(foldedAngle)) * r;

    // 2. Multi-Pass Crystalline Prism Geometry
    vec3 crystalPattern = vec3(0.0);
    vec2 p = kp;

    for (int i = 0; i < 4; i++) {
        float fi = float(i);

        // Mirror fold each pass
        p = abs(p);
        p = rot2(uTime * 0.12 + fi * 0.35 + bass * 0.2) * p;
        p -= vec2(0.10 + bass * 0.08, 0.06 + mid * 0.08);

        // Sharp diamond facet calculation
        float facet = abs(p.x * 1.5 + p.y * 0.8) - (0.05 + fi * 0.04);
        float edgeGlow = exp(-abs(facet) * (60.0 + treble * 40.0));

        // Iridescent spectral hue per layer
        vec3 hue = hsv2rgb(vec3(fract(uTime * 0.1 + fi * 0.22 + r * 0.3), 0.95, 1.0));
        crystalPattern += hue * edgeGlow * (1.0 + beat * 1.2);
    }

    // 3. Central Audio Waveform Geometry Ring
    float wave = sampleWaveform(fract(a / 6.2831853 + uTime * 0.1));
    float centerR = 0.15 + bass * 0.10 + wave * 0.04;
    float centerDist = abs(r - centerR);
    float centerGlow = exp(-centerDist * 90.0) * (2.0 + beat * 2.5);
    vec3 centerRing = hsv2rgb(vec3(fract(uTime * 0.15 + bass * 0.4), 0.9, 1.0)) * centerGlow;

    // 4. Sharp Feedback Void Trails
    vec2 fbUv = vUv - 0.5;
    fbUv = rot2(0.008 + beat * 0.01) * fbUv;
    fbUv *= 0.96;
    fbUv += 0.5;

    float shift = 0.003 + treble * 0.004;
    vec3 prev;
    prev.r = texture(uPrevFrame, fbUv + vec2(shift, 0.0)).r;
    prev.g = texture(uPrevFrame, fbUv).g;
    prev.b = texture(uPrevFrame, fbUv - vec2(shift, 0.0)).b;
    prev *= 0.77; // Fast decay guarantees pitch-black void

    color = prev + crystalPattern * 1.1 + centerRing * 1.3;

    FragColor = vec4(color, 1.0);
}