// name: Shapes and Beats
void main() {
    vec2 uv = aspectUv();
    float radius = length(uv);
    float angle = atan(uv.y, uv.x);

    float pulse = uBeatIntensity;

    vec2 sqUv = rot2(uTime * 0.3) * uv;
    float sqSize = 0.35 + pulse * 0.15;
    float sqDist = max(abs(sqUv.x), abs(sqUv.y));
    float sqOuter = smoothstep(sqSize + 0.015, sqSize, sqDist);
    float sqInner = smoothstep(sqSize - 0.02, sqSize - 0.005, sqDist);
    float sqRing = sqOuter * sqInner;
    vec3 pink = vec3(1.0, 0.1, 0.55);

    float triCount = 3.0;
    float triAngle = mod(angle - uTime * 0.4, 6.28318 / triCount);
    triAngle = abs(triAngle - 3.14159 / triCount);
    float triEdge = triAngle * radius * 2.2;
    float triEdgeMask = step(triEdge, 0.9);
    float triRing = fract(radius * 2.0 - uTime * 1.0 - pulse * 1.5);
    float triRingDist = abs(triRing - 0.5);
    float triRingMask = smoothstep(0.1, 0.0, triRingDist);
    float triShape = triEdgeMask * triRingMask;
    vec3 cyan = vec3(0.15, 0.95, 1.0);

    float hexSizeSmall = 0.11;
    float hexSizeBig = 0.16;
    float hexSnap = step(0.5, pulse);
    float hexSize = mix(hexSizeSmall, hexSizeBig, hexSnap);
    float hexAngle = mod(angle, 1.0471975) - 0.5235987;
    float hexDist = radius * cos(hexAngle);
    float hexCore = step(hexDist, hexSize);
    vec3 white = vec3(1.0, 1.0, 1.0);

    float nBars = 24.0;
    float barAngleRaw = angle / 6.28318 * nBars;
    float barWidthAngle = fract(barAngleRaw);
    float barSlot = floor(barAngleRaw) / nBars;
    float specVal = sampleSpectrum(barSlot);
    float barLen = 0.25 + specVal * 0.5;
    float barGapA = step(0.15, barWidthAngle);
    float barGapB = step(barWidthAngle, 0.85);
    float barGap = barGapA * barGapB;
    float barLenMask = step(radius, barLen);
    float barMinMask = step(0.2, radius);
    float barShape = barLenMask * barMinMask * barGap;
    vec3 yellow = vec3(1.0, 0.85, 0.1);

    float wf = sampleWaveform(fract(uv.x * 0.5 + 0.5));
    float waveDist = abs(uv.y - wf * 0.15);
    float waveBar = step(waveDist, 0.008);
    vec3 waveColor = white * waveBar;

    vec3 color = vec3(0.0);
    color = mix(color, pink, sqRing);
    color = mix(color, cyan, triShape);
    float barOnly = barShape * (1.0 - triShape);
    color = mix(color, yellow, barOnly);
    color = mix(color, white, hexCore);
    color = mix(color, white, waveBar);

    float wipeThreshold = 1.0 - pulse * 1.3;
    float wipeMask = step(wipeThreshold, uv.x + 0.65);
    float strongPulse = step(0.92, pulse);
    float flashWipe = wipeMask * strongPulse * 0.85;
    color = mix(color, white, flashWipe);

    color = mix(color, white, uBeat * 0.6);

    float decay = 0.55;
    vec3 prev = texture(uPrevFrame, vUv).rgb * decay;
    float prevFlat = step(0.5, prev.r + prev.g + prev.b);
    prev = vec3(prevFlat, prevFlat, prevFlat) * prev;

    vec3 finalColor = max(prev * 0.3, color);
    FragColor = vec4(finalColor, 1.0);
}