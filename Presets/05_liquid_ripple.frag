// name: Liquid Ripple
// author: sirpatch
//
// Concentric ripples pushing outward from center like drops in water.
// Try: raise the `18.0` in `ripple` for tighter, more frequent rings.

void main() {
    vec2 uv = aspectUv();
    float radius = length(uv);

    float ripple = sin(radius * 18.0 - uTime * 3.0 - uBass * 10.0) * 0.02;
    vec2 dir = uv / max(radius, 0.001);
    vec2 warped = uv + dir * ripple;
    warped = domainWarp(warped, uTime * 0.3, 0.02 + uMid * 0.03);
    warped *= 1.0 - 0.01 * uBass;

    vec2 sampleUv = warped * 0.5 + 0.5;
    vec3 prev = texture(uPrevFrame, sampleUv).rgb;
    prev *= 0.94 - uBeatIntensity * 0.03;

    float hue = fract(radius * 0.5 - uTime * 0.08 + uTreble * 0.3);
    float glow = smoothstep(0.02, 0.0, abs(fract(radius * 6.0 - uTime) - 0.5));
    vec3 color = hsv2rgb(vec3(hue, 0.8, 0.45)) * glow * (0.4 + uTreble);

    FragColor = vec4(prev + color, 1.0);
}
