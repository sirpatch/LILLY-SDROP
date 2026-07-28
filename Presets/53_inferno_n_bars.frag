// name: Cyber Plasma Mandala & Laser Bars
// author: sirpatch
void main() {
    // 0. Pitch black void base
    vec3 color = vec3(0.0);
    vec2 st = aspectUv();
    
    float r = length(st);
    float a = atan(st.y, st.x);

    // Audio reactivity controls
    float bass   = uBass * 1.6;
    float mid    = uMid * 1.4;
    float treble = uTreble * 1.7;
    float beat   = uBeatIntensity;

    // 1. Precision Kaleidoscope Folding
    // Slices double dynamically on heavy bass hits
    float folds = 6.0 + floor(bass * 6.0); 
    float slice = 3.14159265 / folds;
    float foldedAngle = mod(a, slice * 2.0);
    foldedAngle = abs(foldedAngle - slice);

    // Coordinates in folded kaleidoscope space
    vec2 kp = vec2(cos(foldedAngle), sin(foldedAngle)) * r;

    // 2. Razor-Sharp Equalizer Bars (32 Needle Rays)
    vec3 barsColor = vec3(0.0);
    const int BARS = 32;
    float angleStep = 6.2831853 / float(BARS);

    for (int i = 0; i < BARS; i++) {
        float t = float(i) / float(BARS - 1);
        float spec = sampleSpectrum(t);

        // Angle of current bar ray
        float barAngle = float(i) * angleStep - 3.14159265;
        float dAng = abs(mod(a - barAngle + 3.14159265, 6.2831853) - 3.14159265);

        // Extreme exponential falloff = ultra-crisp laser line (no muddy bleed)
        float laserLine = exp(-dAng * 140.0);

        // Bar start/end heights
        float innerR = 0.16 + sampleWaveform(t) * 0.02;
        float outerR = innerR + 0.08 + spec * 0.70;

        // Mask for bar length
        float barMask = step(innerR, r) * step(r, outerR);

        // Segmented tick marks along the bar
        float ticks = step(0.20, fract(r * 45.0));

        // Electric Plasma Flame Wisps licking off top of bars
        float flameWisp = sin(r * 50.0 - uTime * 10.0 + float(i) * 2.0) * 0.08 * spec;
        float flameTail = exp(-max(0.0, r - outerR + flameWisp) * 40.0) * step(innerR, r);

        // Color Gradient: Electric Violet -> Hot Neon Orange -> White-Hot Tip
        float hPos = clamp((r - innerR) / (outerR - innerR + 0.001), 0.0, 1.0);
        vec3 barHue = mix(vec3(0.6, 0.0, 1.0), vec3(1.0, 0.25, 0.0), hPos);
        barHue = mix(barHue, vec3(1.0, 0.95, 0.85), smoothstep(0.75, 1.0, hPos));

        // Combine core needle, segmented ticks, and flame wisps
        barsColor += barHue * (laserLine * barMask * ticks * 4.0 + laserLine * flameTail * 2.0) * (0.8 + beat * 0.8);
    }

    // 3. Cyber Electric Flame Petals
    // Thin, sharp plasma rings in kaleidoscope space
    vec2 fireP = domainWarp(kp, uTime * 0.6, 0.06 + bass * 0.12);
    float petalPattern = abs(sin(fireP.x * 16.0 + uTime * 3.0) * cos(fireP.y * 16.0));
    float fireRingDist = abs(r - (0.22 + bass * 0.18 + petalPattern * 0.06));
    
    // High exponent keeps geometry crisp against black space
    float fireGlow = exp(-fireRingDist * 70.0) * (1.0 + beat * 1.5);
    vec3 fireColor = hsv2rgb(vec3(fract(0.02 + uTime * 0.08 + r * 0.4), 1.0, 1.0)) * fireGlow * 2.5;

    // 4. Central Waveform Plasma Core
    float wave = sampleWaveform(fract(a / 6.2831853 + uTime * 0.15));
    float coreDist = abs(r - (0.12 + wave * 0.05 + bass * 0.08));
    float coreGlow = exp(-coreDist * 90.0) * (1.2 + beat * 2.0);
    vec3 coreColor = vec3(0.1, 0.8, 1.0) * coreGlow * 3.0; // Electric Cyan Core

    // 5. High-Contrast Laser Feedback (Fast decay to preserve #000000 void)
    vec2 fbUv = vUv - 0.5;
    fbUv = rot2(0.008 + beat * 0.012) * fbUv;
    fbUv *= 0.965 - beat * 0.01;
    fbUv += 0.5;

    // Crisp RGB chromatic separation
    float shift = 0.003 + treble * 0.004;
    vec3 prev;
    prev.r = texture(uPrevFrame, fbUv + vec2(shift, 0.0)).r;
    prev.g = texture(uPrevFrame, fbUv).g;
    prev.b = texture(uPrevFrame, fbUv - vec2(shift, 0.0)).b;
    prev *= 0.78; // Aggressive decay ensures pitch-black background

    // Final Composite
    color = prev + barsColor * 0.9 + fireColor * 1.1 + coreColor;

    FragColor = vec4(color, 1.0);
}