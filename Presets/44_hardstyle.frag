// name: Hardstyle Reverb Kick
// author: ASASHI
void main() {
    vec2 uv = aspectUv();

    float kick = uBeatIntensity;
    float kickCurve = pow(kick, 0.6);
    float zoom = 1.0 - kickCurve * 0.42;
    uv *= zoom;

    float screech = uTreble * uTreble;
    float spin = uTime * 0.35 + screech * 2.0;
    uv = rot2(spin) * uv;

    float radius = length(uv);
    float angle = atan(uv.y, uv.x);

    float segments = 4.0;
    float a2 = mod(angle, 6.28318 / segments);
    a2 = abs(a2 - 3.14159 / segments);
    uv = vec2(cos(a2), sin(a2)) * radius;

    float jag = sin(radius * 40.0 + uTime * 8.0) * screech * 0.06;
    uv.x += jag;
    uv.y -= jag;

    uv = domainWarp(uv, uTime * 0.4, 0.1 + uBass * 0.25);
    radius = length(uv);

    float melodyRings = fract(radius * 4.0 - uTime * 1.2);
    float ringDist = abs(melodyRings - 0.5);
    float melodyLine = smoothstep(0.1, 0.0, ringDist);
    float fade = smoothstep(1.3, 0.0, radius);
    melodyLine *= fade;

    float melodyHue = fract(uTime * 0.06 + uMid * 0.4);
    vec3 melodyColor = hsv2rgb(vec3(melodyHue, 0.55, 1.0)) * melodyLine * 1.3;

    float nBlades = 48.0;
    float bladeAngle = angle * segments / 6.28318 + uTime * 0.03;
    float bladeSlot = floor(fract(bladeAngle) * nBlades) / nBlades;
    float specVal = sampleSpectrum(bladeSlot);
    float bladeTarget = 0.15 + specVal * 0.75;
    float blade = smoothstep(0.015, 0.0, abs(radius - bladeTarget));
    vec3 bladeColor = hsv2rgb(vec3(fract(melodyHue + 0.5), 0.9, 1.0)) * blade * 1.7;

    float wf = sampleWaveform(fract(angle / 6.28318 + 0.5));
    float coreRadius = 0.1 + abs(wf) * (0.08 + screech * 0.15);
    float core = smoothstep(0.02, 0.0, abs(radius - coreRadius));
    vec3 coreColor = vec3(1.0, 0.95, 0.85) * core * 1.5;

    vec3 color = melodyColor + bladeColor + coreColor;

    float punch = smoothstep(0.4, 0.0, radius) * kickCurve;
    vec3 punchColor = mix(vec3(1.0, 0.5, 0.15), vec3(1.0), kickCurve);
    color += punchColor * punch * 1.8;

    color += vec3(1.0, 0.7, 0.4) * uBeat * 0.35;

    float screechFlash = smoothstep(0.75, 1.0, uTreble) * 0.4;
    color += vec3(0.6, 0.9, 1.0) * screechFlash;

    float vig = smoothstep(0.6, 1.4, radius);
    color *= mix(1.0, 0.5, vig);

    float decay = mix(0.82, 0.5, kickCurve);
    vec2 trailUv = vUv + (vUv - 0.5) * kickCurve * 0.025;
    vec3 prev = texture(uPrevFrame, trailUv).rgb * decay;

    FragColor = vec4(prev + color * 0.7, 1.0);
}