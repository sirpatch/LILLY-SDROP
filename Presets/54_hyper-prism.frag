// name: Hyper-Prism Geometric Void
// author: sirpatch
void main() {
    vec3 color = vec3(0.0);
    vec2 st = aspectUv();

    float r = length(st);
    float a = atan(st.y, st.x);

    // Audio dynamics
    float bass   = uBass * 1.7;
    float mid    = uMid * 1.4;
    float treble = uTreble * 1.8;
    float beat   = uBeatIntensity;

    // 1. Recursive Prism Kaleidoscope Mirroring
    float folds = 8.0 + floor(bass * 8.0);
    float slice = 3.14159265 / folds;
    float foldedAngle = mod(a, slice * 2.0);
    foldedAngle = abs(foldedAngle - slice);

    vec2 p = vec2(cos(foldedAngle), sin(foldedAngle)) * r;

    // 2. Multi-Layer Prism Ring Geometry
    vec3 prismLayers = vec3(0.0);
    for (int i = 0; i < 5; i++) {
        float fi = float(i);
        float spec = sampleSpectrum(fi * 0.2);

        // Rotate and mirror each layer independently
        p = abs(p);
        p = rot2(uTime * 0.15 + fi * 0.4 + bass * 0.2) * p;
        p -= vec2(0.12 + spec * 0.1, 0.08 + mid * 0.1);

        // Sharp geometric prism edge
        float edgeDist = abs(p.x + p.y) - (0.08 + spec * 0.3);
        float edgeGlow = exp(-abs(edgeDist) * (60.0 + treble * 40.0));

        // Spectrum chromatic hue mapping
        vec3 col = hsv2rgb(vec3(fract(uTime * 0.1 + fi * 0.18 + spec * 0.4), 0.95, 1.0));
        prismLayers += col * edgeGlow * (1.0 + spec * 1.5);
    }

    // 3. Radial Equalizer Needles (Outer Edge)
    vec3 needles = vec3(0.0);
    const int BARS = 24;
    float barStep = 6.2831853 / float(BARS);

    for (int i = 0; i < BARS; i++) {
        float t = float(i) / float(BARS - 1);
        float spec = sampleSpectrum(t);

        float barAng = float(i) * barStep - 3.14159265;
        float dAng = abs(mod(a - barAng + 3.14159265, 6.2831853) - 3.14159265);

        // Extremely narrow needle width
        float ray = exp(-dAng * 160.0);
        float innerR = 0.2 + sampleWaveform(t) * 0.03;
        float outerR = innerR + 0.1 + spec * 0.65;

        float lenMask = step(innerR, r) * step(r, outerR);
        float segmentTicks = step(0.25, fract(r * 50.0));

        vec3 needleHue = hsv2rgb(vec3(fract(t * 0.8 + uTime * 0.2 + treble * 0.3), 1.0, 1.0));
        needles += needleHue * ray * lenMask * segmentTicks * (2.5 + beat * 2.0);
    }

    // 4. Central Diamond Waveform Core
    float wave = sampleWaveform(fract(a / 6.2831853 + uTime * 0.2));
    float diamondDist = abs(abs(st.x) + abs(st.y) - (0.15 + wave * 0.06 + bass * 0.1));
    float diamondGlow = exp(-diamondDist * 80.0) * (1.5 + beat * 2.0);
    vec3 coreCol = hsv2rgb(vec3(fract(uTime * 0.25 + bass * 0.5), 0.9, 1.0)) * diamondGlow;

    // 5. Zero-Bleed Sharp Feedback
    vec2 fbUv = vUv - 0.5;
    fbUv = rot2(0.01 + beat * 0.015) * fbUv;
    fbUv *= 0.96;
    fbUv += 0.5;

    float shift = 0.004 + treble * 0.005;
    vec3 prev;
    prev.r = texture(uPrevFrame, fbUv + vec2(shift, 0.0)).r;
    prev.g = texture(uPrevFrame, fbUv).g;
    prev.b = texture(uPrevFrame, fbUv - vec2(shift, 0.0)).b;
    prev *= 0.77; // Fast decay maintains deep black void background

    color = prev + prismLayers * 0.85 + needles * 0.95 + coreCol * 1.2;

    FragColor = vec4(color, 1.0);
}