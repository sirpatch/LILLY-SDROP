// name: Sacred Lotus Plasma Mandala
// author: sirpatch
void main() {
    vec3 color = vec3(0.0);
    vec2 st = aspectUv();

    float r = length(st);
    float a = atan(st.y, st.x);

    // Audio reactivity
    float bass   = uBass * 1.6;
    float mid    = uMid * 1.5;
    float treble = uTreble * 1.7;
    float beat   = uBeatIntensity;

    // Logarithmic spiral angle offset
    a += sin(log(r + 0.01) * 4.0 - uTime * 1.2) * (0.3 + mid * 0.4);

    // 1. 12-Fold Sacred Flower Mirroring
    float folds = 6.0 + floor(bass * 6.0);
    float slice = 3.14159265 / folds;
    float foldedAngle = mod(a, slice * 2.0);
    foldedAngle = abs(foldedAngle - slice);

    vec2 kp = vec2(cos(foldedAngle), sin(foldedAngle)) * r;

    // 2. Liquid Petal Domain Warp
    vec2 wp = domainWarp(kp, uTime * 0.5, 0.08 + bass * 0.12);

    // 3. Concentric Petal Ring Layers
    vec3 mandalaColor = vec3(0.0);

    for (int i = 1; i <= 5; i++) {
        float fi = float(i);

        // Rotating petal wave function
        float petalWave = abs(sin(wp.x * (8.0 + fi * 2.0) + uTime) * cos(wp.y * (8.0 + fi * 2.0)));
        float petalRadius = 0.08 + fi * 0.11 + petalWave * 0.05 * (1.0 + mid * 0.6);

        float d = abs(r - petalRadius);
        float lineGlow = exp(-d * (65.0 + treble * 30.0));

        // Rich shifting color palette (Magenta -> Deep Violet -> Gold)
        vec3 hue = hsv2rgb(vec3(fract(0.85 + fi * 0.15 + uTime * 0.1 + r * 0.3), 0.95, 1.0));
        mandalaColor += hue * lineGlow * (1.0 + beat * 1.3);
    }

    // 4. Central Audio-Reactive Core Circle
    float wave = sampleWaveform(fract(a / 6.2831853 + uTime * 0.1));
    float coreR = 0.12 + wave * 0.04 + bass * 0.06;
    float coreDist = abs(r - coreR);
    float coreGlow = exp(-coreDist * 100.0) * (2.0 + beat * 2.0);
    vec3 coreColor = vec3(1.0, 0.2, 0.6) * coreGlow * 2.5;

    // 5. Zero-Bleed Void Feedback
    vec2 fbUv = vUv - 0.5;
    fbUv = rot2(0.006 + beat * 0.01) * fbUv;
    fbUv *= 0.96;
    fbUv += 0.5;

    vec3 prev = texture(uPrevFrame, fbUv).rgb * 0.78;

    color = prev + mandalaColor * 1.0 + coreColor;

    FragColor = vec4(color, 1.0);
}