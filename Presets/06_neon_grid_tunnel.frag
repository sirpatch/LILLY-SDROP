// name: Neon Grid Tunnel
// author: sirpatch
//
// A polar grid rushing toward the camera like flying down a neon corridor.
// Try: change the `0.6 + uBass * 0.6` speed term to fly faster/slower.

void main() {
    vec2 uv = aspectUv();
    float radius = length(uv) + 0.0001;
    float angle = atan(uv.y, uv.x);
    float depth = 1.0 / radius;

    float zoom = 1.0 - (0.02 + uBass * 0.05);
    vec2 sampleUv = domainWarp(uv * zoom, uTime * 0.15, 0.015);
    sampleUv = sampleUv * 0.5 + 0.5;

    vec3 prev = texture(uPrevFrame, sampleUv).rgb;
    prev *= 0.93 - uBeatIntensity * 0.04;

    float u = angle / 3.14159 * 8.0;
    float v = depth * 0.15 - uTime * (0.6 + uBass * 0.6);
    float gridLines = max(
        smoothstep(0.04, 0.0, abs(fract(u) - 0.5)),
        smoothstep(0.04, 0.0, abs(fract(v * 4.0) - 0.5))
    );

    float hue = fract(uTime * 0.1 + depth * 0.05 + uMid * 0.3);
    vec3 neon = hsv2rgb(vec3(hue, 0.9, 0.5 + uTreble * 0.3)) * gridLines;

    FragColor = vec4(prev + neon * 0.5, 1.0);
}
