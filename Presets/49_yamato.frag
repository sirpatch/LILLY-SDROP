// name: Yamato Multicut
void main() {
    vec2 uv = aspectUv();
    float radius = length(uv);
    float angle = atan(uv.y, uv.x);

    float strike = uBeatIntensity;
    float strikeCurve = strike * strike * strike;
    float zoom = 1.0 - strikeCurve * 0.2;
    uv *= zoom;
    radius = length(uv);

    // Multiple simultaneous slash lines, each at its own angle,
    // like Judgment Cut End firing several cuts at once
    float cutBatch = floor(uTime * 1.2);
    vec3 cutColor = vec3(0.0);

    float seed0 = fract(sin(cutBatch * 17.31) * 43758.5453);
    float angle0 = seed0 * 3.14159;
    float dirX0 = cos(angle0);
    float dirY0 = sin(angle0);
    float dist0 = abs(uv.x * dirY0 - uv.y * dirX0);
    float line0 = smoothstep(0.005, 0.0, dist0) * strike;
    cutColor += vec3(0.85, 0.92, 1.0) * line0 * 2.2;

    float seed1 = fract(sin(cutBatch * 29.13 + 3.7) * 24634.634);
    float angle1 = seed1 * 3.14159;
    float dirX1 = cos(angle1);
    float dirY1 = sin(angle1);
    float dist1 = abs(uv.x * dirY1 - uv.y * dirX1);
    float line1 = smoothstep(0.005, 0.0, dist1) * strike;
    cutColor += vec3(0.75, 0.88, 1.0) * line1 * 2.2;

    float seed2 = fract(sin(cutBatch * 41.77 + 8.1) * 15453.19);
    float angle2 = seed2 * 3.14159;
    float dirX2 = cos(angle2);
    float dirY2 = sin(angle2);
    float dist2 = abs(uv.x * dirY2 - uv.y * dirX2);
    float line2 = smoothstep(0.005, 0.0, dist2) * strike;
    cutColor += vec3(0.65, 0.82, 1.0) * line2 * 2.2;

    float seed3 = fract(sin(cutBatch * 53.29 + 12.4) * 37821.42);
    float angle3 = seed3 * 3.14159;
    float dirX3 = cos(angle3);
    float dirY3 = sin(angle3);
    float dist3 = abs(uv.x * dirY3 - uv.y * dirX3);
    float line3 = smoothstep(0.005, 0.0, dist3) * strike;
    cutColor += vec3(0.55, 0.75, 1.0) * line3 * 2.2;

    float seed4 = fract(sin(cutBatch * 61.11 + 19.9) * 51234.87);
    float angle4 = seed4 * 3.14159;
    float dirX4 = cos(angle4);
    float dirY4 = sin(angle4);
    float dist4 = abs(uv.x * dirY4 - uv.y * dirX4);
    float line4 = smoothstep(0.005, 0.0, dist4) * strike;
    cutColor += vec3(0.45, 0.68, 1.0) * line4 * 2.2;

    // Faint afterimage offsets for extra density on the strongest hits
    float echo0 = smoothstep(0.005, 0.0, abs(dist0 - 0.04)) * strike * 0.4;
    float echo1 = smoothstep(0.005, 0.0, abs(dist1 - 0.04)) * strike * 0.4;
    cutColor += vec3(0.5, 0.7, 1.0) * (echo0 + echo1);

    float rings = fract(radius * 3.0 - uTime * 0.4);
    float ringDist = abs(rings - 0.5);
    float ringLine = smoothstep(0.05, 0.0, ringDist);
    float ringFade = smoothstep(1.0, 0.0, radius);
    vec3 steelBlue = vec3(0.08, 0.12, 0.22);
    vec3 ringColor = steelBlue * ringLine * ringFade * 1.5;

    float nBlades = 32.0;
    float bladeAngle = angle / 6.28318 * nBlades;
    float bladeSlot = floor(fract(bladeAngle)) / nBlades;
    float specVal = sampleSpectrum(bladeSlot);
    float bladeTarget = 0.15 + specVal * 0.55;
    float bladeDist = abs(radius - bladeTarget);
    float blade = smoothstep(0.006, 0.0, bladeDist);
    vec3 bladeColor = vec3(0.6, 0.75, 1.0) * blade * 1.2;

    float wf = sampleWaveform(fract(angle / 6.28318 + 0.5));
    float coreRadius = 0.09 + abs(wf) * 0.03;
    float coreDist = abs(radius - coreRadius);
    float core = smoothstep(0.01, 0.0, coreDist);
    vec3 coreColor = mix(vec3(0.3, 0.5, 0.9), vec3(1.0, 1.0, 1.0), strikeCurve) * core * 1.5;

    float nSwords = 8.0;
    float swordAngle = uTime * 0.25;
    float swordAngleWidth = fract((angle / 6.28318 - swordAngle) * nSwords);
    float swordGap = min(swordAngleWidth, 1.0 - swordAngleWidth);
    float swordMask = smoothstep(0.05, 0.0, swordGap);
    float swordWobble = sin(uTime * 0.8 + swordAngleWidth * 20.0) * 0.05;
    float swordRadius = 0.55 + swordWobble;
    float swordDist = abs(radius - swordRadius);
    float sword = smoothstep(0.02, 0.0, swordDist) * swordMask;
    vec3 swordColor = vec3(0.7, 0.85, 1.0) * sword * (0.6 + strike * 0.8);

    vec3 color = vec3(0.0);
    color += cutColor;
    color += ringColor;
    color += bladeColor;
    color += coreColor;
    color += swordColor;

    color += vec3(0.7, 0.85, 1.0) * uBeat * 0.15;

    float vig = smoothstep(0.4, 1.3, radius);
    color *= mix(1.0, 0.15, vig);

    float decay = mix(0.95, 0.78, strikeCurve);
    vec3 prev = texture(uPrevFrame, vUv).rgb * decay;
    prev *= vec3(0.98, 0.99, 1.02);

    FragColor = vec4(prev + color * 0.6, 1.0);
}