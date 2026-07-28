// name: Aurora Waves
// author: sirpatch
//
// Flowing horizontal bands like aurora borealis drifting sideways.
// Try: change the two sin() frequencies on warped.y for a calmer/busier flow.

void main() {
    vec2 uv = aspectUv();

    vec2 warped = uv;
    warped.y += sin(uv.x * 2.0 + uTime * 0.5 + uBass * 2.0) * 0.15;
    warped.y += sin(uv.x * 5.0 - uTime * 0.8 + uMid * 2.0) * 0.06;
    warped = domainWarp(warped, uTime * 0.2, 0.02);
    warped *= 1.0 - 0.01 * uBass;

    vec2 sampleUv = warped * 0.5 + 0.5;
    vec3 prev = texture(uPrevFrame, sampleUv).rgb;
    prev *= 0.945 - uBeatIntensity * 0.03;

    float band = smoothstep(0.5, 0.0, abs(uv.y - sin(uv.x * 2.0 + uTime * 0.5) * 0.3));
    float hue = fract(uv.x * 0.15 + uTime * 0.05 + uTreble * 0.3);
    vec3 aurora = hsv2rgb(vec3(hue, 0.75, 0.45 + uTreble * 0.3)) * band * (0.3 + uMid * 0.4);

    FragColor = vec4(prev + aurora, 1.0);
}
