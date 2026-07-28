// name: Hardtekk Slammer
// author: ASASHI
void main() {
    vec2 uv = aspectUv();

    float slam = uBeatIntensity * uBeatIntensity;
    float zoom = 1.0 - slam * 0.5;
    uv *= zoom;

    float spin = uTime * 0.6 + uBass * slam * 2.0;
    uv = rot2(spin) * uv;

    float segments = 8.0;
    float angle = atan(uv.y, uv.x);
    float radius = length(uv);
    angle = mod(angle, 6.28318 / segments);
    angle = abs(angle - 3.14159 / segments);
    uv = vec2(cos(angle), sin(angle)) * radius;

    float sliceId = floor(uv.y * 12.0);
    float sliceSeed = fract(sin(sliceId * 91.345 + floor(uTime * 24.0)) * 43758.5453);
    float glitchAmt = step(0.7, sliceSeed) * uBeatIntensity * 0.15;
    uv.x += (sliceSeed - 0.5) * glitchAmt;

    float ringSpeed = uTime * 4.0;
    float rings = fract(radius * 6.0 - ringSpeed);
    float ringLine = smoothstep(0.08, 0.0, abs(rings - 0.5)) * smoothstep(1.2, 0.0, radius);

    float nBlades = 32.0;
    float bladeSlot = floor(fract(angle * segments / 6.28318 + uTime * 0.05) * nBlades) / nBlades;
    float specVal = sampleSpectrum(bladeSlot);
    float blade = smoothstep(0.02, 0.0, abs(radius - (0.2 + specVal * 0.6)));

    float strobeHue = step(0.5, fract(uTime * 0.15)) * 0.5;
    float hue = fract(strobeHue + radius * 0.3 + uMid * 0.2);
    vec3 baseColor = hsv2rgb(vec3(hue, 0.9, 1.0));

    vec3 color = vec3(0.0);
    color += baseColor * ringLine * 1.8;
    color += hsv2rgb(vec3(fract(hue + 0.5), 0.8, 1.0)) * blade * 1.6;

    float core = smoothstep(0.35, 0.0, radius);
    color += vec3(1.0) * core * slam * 1.5;

    color += vec3(1.0) * uBeat * 0.4;

    color += vec3(0.15, 0.0, 0.25) * (1.0 - smoothstep(0.0, 1.0, radius));

    float decay = mix(0.8, 0.55, uBeatIntensity);
    vec2 trailUv = vUv + (vUv - 0.5) * slam * 0.03;
    vec3 prev = texture(uPrevFrame, trailUv).rgb * decay;

    FragColor = vec4(prev + color * 0.75, 1.0);
}