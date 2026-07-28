// name: Plasma Storm
// author: sirpatch
//
// Classic sine-sum plasma, pushed through a domain warp and cycled through
// hue rather than a fixed palette. Try: change the sin() frequencies (5.0s)
// for a busier or calmer field.

void main() {
    vec2 uv = aspectUv();
    vec2 warp = domainWarp(uv, uTime * 0.4, 0.05 + uBass * 0.04);
    warp *= 1.0 - 0.015 * uBass;

    vec2 sampleUv = warp * 0.5 + 0.5;
    vec3 prev = texture(uPrevFrame, sampleUv).rgb;
    prev *= 0.92 - uBeatIntensity * 0.04;

    float plasma = sin(uv.x * 5.0 + uTime)
                 + sin(uv.y * 5.0 - uTime * 1.3)
                 + sin((uv.x + uv.y) * 5.0 + uTime * 0.7)
                 + sin(length(uv) * 8.0 - uTime * 2.0 - uBass * 6.0);
    plasma *= 0.25;

    float hue = fract(plasma * 0.3 + uTime * 0.06 + uTreble * 0.3);
    vec3 col = hsv2rgb(vec3(hue, 0.85, 0.4 + uTreble * 0.3));

    FragColor = vec4(prev + col * 0.22, 1.0);
}
