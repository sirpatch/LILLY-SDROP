// name: Pure Central Circle Mandala (NO BARS)
// author: sirpatch
void main() {
    // Pitch black void
    vec3 color = vec3(0.0);
    vec2 st = aspectUv();

    float r = length(st);
    float a = atan(st.y, st.x);

    // Audio reactivity controls
    float bass   = uBass * 1.7;
    float mid    = uMid * 1.4;
    float treble = uTreble * 1.8;
    float beat   = uBeatIntensity;

    // 1. Audio-Reactive Central Circle
    // Real-time audio waveform deforms the edge of the central pulse ring
    float wave = sampleWaveform(fract(a / 6.2831853 + uTime * 0.1));
    float circleR = 0.20 + bass * 0.12 + wave * 0.05;

    float circleDist = abs(r - circleR);
    float circleGlow = exp(-circleDist * 85.0) * (2.0 + beat * 2.5);
    float circleFill = smoothstep(circleR, 0.0, r) * (0.3 + bass * 0.5);

    vec3 circleHue = hsv2rgb(vec3(fract(uTime * 0.12 + bass * 0.25), 0.9, 1.0));
    vec3 centralCircle = circleHue * (circleGlow * 2.2 + circleFill * 0.8);

    // 2. Pure Kaleidoscope Mirror Folding
    float folds = 6.0 + floor(bass * 6.0);
    float slice = 3.14159265 / folds;
    float foldedAngle = mod(a, slice * 2.0);
    foldedAngle = abs(foldedAngle - slice);

    // Coordinates in folded kaleidoscope space
    vec2 kp = vec2(cos(foldedAngle), sin(foldedAngle)) * r;

    // 3. Smooth Concentric Geometric Rings (Zero Bars)
    vec3 patternColor = vec3(0.0);

    for (int i = 1; i <= 4; i++) {
        float fi = float(i);
        vec2 p = kp * (1.0 + fi * 0.25);
        p = rot2(uTime * 0.15 * (mod(fi, 2.0) == 0.0 ? 1.0 : -1.0) + bass * 0.2) * p;

        // Symmetric wave lattice pattern
        float shape = abs(sin(p.x * 10.0) * cos(p.y * 10.0));
        float ringRadius = circleR + fi * 0.14 + shape * 0.06 * (1.0 + mid * 0.5);
        float d = abs(r - ringRadius);

        // Razor-sharp ring glow
        float lineGlow = exp(-d * (55.0 + treble * 30.0));
        vec3 hue = hsv2rgb(vec3(fract(uTime * 0.1 + fi * 0.18 + r * 0.4), 0.95, 1.0));
        patternColor += hue * lineGlow * (1.0 + beat * 1.2);
    }

    // 4. Clean Void Feedback
    vec2 fbUv = vUv - 0.5;
    fbUv = rot2(0.008 + beat * 0.012) * fbUv;
    fbUv *= 0.96;
    fbUv += 0.5;

    float shift = 0.003 + treble * 0.004;
    vec3 prev;
    prev.r = texture(uPrevFrame, fbUv + vec2(shift, 0.0)).r;
    prev.g = texture(uPrevFrame, fbUv).g;
    prev.b = texture(uPrevFrame, fbUv - vec2(shift, 0.0)).b;
    prev *= 0.78; // Keeps background deep black

    color = prev + centralCircle * 1.2 + patternColor * 0.95;

    FragColor = vec4(color, 1.0);
}