// name: Devil Trigger
// author: ASASHI
void main() {
    vec2 uv = aspectUv();
    float radius = length(uv);
    float angle = atan(uv.y, uv.x);

    // Devil Trigger aura: pulses stronger with bass, like the transformation
    float trigger = uBass * 0.6 + uBeatIntensity * 0.4;
    float zoom = 1.0 - trigger * 0.15;
    uv *= zoom;
    radius = length(uv);

    // Sword slash trails: sharp diagonal streaks that flash outward on beat,
    // like Dante's combo slashes crossing the screen
    float nSlashes = 6.0;
    float slashSeed = floor(uTime * 3.0); // new slash pattern every hit
    float slashOffset = fract(sin(slashSeed * 12.9898) * 43758.5453) * 6.28318;
    float slashAngle = mod(angle + slashOffset, 6.28318 / nSlashes);
    slashAngle = abs(slashAngle - 3.14159 / nSlashes);
    float slashDist = slashAngle * radius;
    float slash = smoothstep(0.05, 0.0, slashDist) * smoothstep(0.05, 0.4, radius);
    float slashFlash = uBeat + uBeatIntensity * 0.5;
    vec3 slashColor = vec3(1.0, 0.95, 0.9) * slash * slashFlash * 2.0;

    // Crimson demonic rings expanding outward, core of the DMC palette
    float rings = fract(radius * 3.5 - uTime * 1.5 - trigger * 2.0);
    float ringLine = smoothstep(0.08, 0.0, abs(rings - 0.5));
    float ringFade = smoothstep(1.1, 0.0, radius);
    vec3 crimson = vec3(0.75, 0.02, 0.05);
    vec3 ringColor = crimson * ringLine * ringFade * (0.8 + trigger * 1.2);

    // Spectrum as jagged blade shards radiating from center, black-edged red
    float nBlades = 40.0;
    float bladeSlot = floor(fract(angle / 6.28318 * nBlades + uTime * 0.05) * nBlades) / nBlades;
    float specVal = sampleSpectrum(bladeSlot);
    float bladeTarget = 0.12 + specVal * 0.7;
    float bladeCore = smoothstep(0.012, 0.0, abs(radius - bladeTarget));
    float bladeEdge = smoothstep(0.03, 0.012, abs(radius - bladeTarget));
    vec3 bladeColor = mix(vec3(0.05, 0.0, 0.0), vec3(1.0, 0.15, 0.1), bladeCore) * bladeEdge * 1.6;

    // Waveform as a pulsing heartbeat core, white-hot center like Devil Trigger ignition
    float wf = sampleWaveform(fract(angle / 6.28318 + 0.5));
    float coreRadius = 0.08 + abs(wf) * 0.06 + trigger * 0.08;
    float core = smoothstep(0.015, 0.0, abs(radius - coreRadius));
    vec3 coreColor = mix(vec3(1.0, 0.3, 0.1), vec3(1.0, 1.0, 0.9), trigger) * core * 1.8;

    // Ember particles drifting up, like DMC's demonic ash/embers
    vec2 emberUv = uv * 6.0;
    emberUv.y += uTime * 1.5;
    vec2 emberCell = floor(emberUv);
    vec2 emberLocal = fract(emberUv) - 0.5;
    float emberSeed = fract(sin(dot(emberCell, vec2(41.3, 91.7))) * 43758.5453);
    float ember = smoothstep(0.08, 0.0, length(emberLocal)) * step(0.88, emberSeed);
    vec3 emberColor = vec3(1.0, 0.4, 0.1) * ember * (0.4 + trigger * 0.6);

    vec3 color = slashColor + ringColor + bladeColor + coreColor + emberColor;

    // Style rank flash: hard white flash on strong beats, like a stylish combo hit
    color += vec3(1.0) * uBeat * 0.3;

    // Black vignette, keeps it moody and gothic instead of blown out
    float vig = smoothstep(0.5, 1.4, radius);
    color *= mix(1.0, 0.35, vig);

    // Slight red tint bleeding into the trail for a bloody afterimage feel
    float decay = mix(0.9, 0.75, trigger);
    vec3 prev = texture(uPrevFrame, vUv).rgb * decay;
    prev *= vec3(1.02, 0.97, 0.97); // trails shift subtly toward red over time

    FragColor = vec4(prev + color * 0.65, 1.0);
}