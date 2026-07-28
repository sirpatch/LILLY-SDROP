// name: Zandatsu
// author: ASASHI
void main() {
    vec2 uv = aspectUv();
    float radius = length(uv);
    float angle = atan(uv.y, uv.x);

    // Blade Mode: time feels sliced into precise moments, snap intensifies with bass
    float blade = uBeatIntensity;
    float bladeCurve = blade * blade;

    // Digital HUD grid, cyber-ninja style, subtle scanline base layer
    vec2 gridUv = uv * 14.0;
    float gridX = abs(fract(gridUv.x) - 0.5);
    float gridY = abs(fract(gridUv.y) - 0.5);
    float gridLineX = smoothstep(0.48, 0.5, gridX);
    float gridLineY = smoothstep(0.48, 0.5, gridY);
    float grid = max(gridLineX, gridLineY) * 0.08;
    vec3 gridColor = vec3(0.1, 0.6, 0.7) * grid;

    // Zandatsu cut plane: a single glowing line slices the screen,
    // with a bright cross-section edge, like cutting a target open
    float cutSeed = floor(uTime * 1.0);
    float seedVal = fract(sin(cutSeed * 21.17) * 39812.55);
    float cutAngle = seedVal * 3.14159;
    float dirX = cos(cutAngle);
    float dirY = sin(cutAngle);
    float cutDist = abs(uv.x * dirY - uv.y * dirX);
    float cutLine = smoothstep(0.004, 0.0, cutDist) * blade;
    float cutGlowWide = smoothstep(0.05, 0.0, cutDist) * blade * 0.3;
    vec3 cutColor = vec3(1.0, 0.15, 0.1) * cutLine * 2.5;
    cutColor += vec3(0.9, 0.95, 1.0) * cutGlowWide;

    // Cross-section rings pulsing from the cut point, like the glowing
    // internal cut reveal in a Zandatsu kill
    float rings = fract(radius * 5.0 - uTime * 2.0 - bladeCurve * 3.0);
    float ringLine = smoothstep(0.06, 0.0, abs(rings - 0.5));
    float ringFade = smoothstep(0.9, 0.0, radius);
    vec3 ringColor = vec3(0.9, 0.1, 0.15) * ringLine * ringFade * (0.6 + bladeCurve * 1.5);

    // Ninja-run speed streaks: thin horizontal-ish lines racing past,
    // representing high-speed cyborg movement
    float streakY = uv.y * 20.0 + uTime * 0.5;
    float streakSeed = fract(sin(floor(streakY) * 78.23) * 12345.6);
    float streakLine = smoothstep(0.02, 0.0, abs(fract(streakY) - 0.5));
    float streakMask = step(0.85, streakSeed);
    float streak = streakLine * streakMask * (0.3 + uTreble * 0.5);
    vec3 streakColor = vec3(0.2, 0.9, 1.0) * streak;

    // Spectrum as a HUD readout bar arc, cyan digital style
    float nBars = 40.0;
    float barSlot = floor(fract(angle / 6.28318 * nBars) * nBars) / nBars;
    float specVal = sampleSpectrum(barSlot);
    float barTarget = 0.2 + specVal * 0.55;
    float bar = smoothstep(0.008, 0.0, abs(radius - barTarget));
    vec3 barColor = vec3(0.15, 0.85, 0.95) * bar * 1.3;

    // Waveform as a health/blade gauge arc near center
    float wf = sampleWaveform(fract(angle / 6.28318 + 0.5));
    float gaugeRadius = 0.1 + abs(wf) * 0.04;
    float gauge = smoothstep(0.01, 0.0, abs(radius - gaugeRadius));
    vec3 gaugeColor = mix(vec3(0.1, 0.9, 1.0), vec3(1.0, 0.1, 0.1), bladeCurve) * gauge * 1.5;

    // Glitch flicker: random horizontal slice displacement on strong beats
    float sliceId = floor(uv.y * 18.0);
    float sliceSeed = fract(sin(sliceId * 55.12 + floor(uTime * 20.0)) * 91234.5);
    float glitchMask = step(0.8, sliceSeed) * blade;
    vec3 glitchColor = vec3(0.9, 0.95, 1.0) * glitchMask * 0.5;

    vec3 color = vec3(0.0);
    color += gridColor;
    color += cutColor;
    color += ringColor;
    color += streakColor;
    color += barColor;
    color += gaugeColor;
    color += glitchColor;

    // Codec-style red alert flash on hard hits
    color += vec3(1.0, 0.1, 0.1) * uBeat * 0.2;

    // Dark tech vignette, near-black edges with a faint cyan bleed
    float vig = smoothstep(0.45, 1.3, radius);
    color *= mix(1.0, 0.12, vig);
    color += vec3(0.0, 0.05, 0.07) * vig * 0.3;

    float decay = mix(0.93, 0.75, bladeCurve);
    vec3 prev = texture(uPrevFrame, vUv).rgb * decay;
    prev *= vec3(1.0, 1.0, 1.01);

    FragColor = vec4(prev + color * 0.65, 1.0);
}