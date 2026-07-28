// name: Spiral Fractal
// author: sirpatch
//
// A rotating, zooming spiral that folds into itself frame after frame.
// Try: raise the 2.5/3.5 numbers in `twist` for a tighter, faster spiral.

void main() {
    vec2 uv = aspectUv();

    float radius = length(uv);
    float angle = atan(uv.y, uv.x);

    float zoom = 1.0 - (0.02 + uBass * 0.06 + uBeatIntensity * 0.03);
    float twist = angle + uTime * 0.12 + radius * (2.5 + uMid * 3.5);

    vec2 spiral = vec2(cos(twist), sin(twist)) * radius * zoom;
    spiral = domainWarp(spiral, uTime * 0.3, 0.03 + uTreble * 0.03);

    vec2 sampleUv = spiral;
    sampleUv.x /= uResolution.x / uResolution.y;
    sampleUv = sampleUv * 0.5 + 0.5;

    vec3 prev = texture(uPrevFrame, sampleUv).rgb;
    prev *= 0.93 - uBeatIntensity * 0.04;

    float ring = smoothstep(0.9, 1.0, sin(radius * 14.0 - uTime * 2.2 - uBass * 8.0));
    float hue = fract(uTime * 0.05 + radius * 0.3 + uMid * 0.2);
    vec3 ringColor = hsv2rgb(vec3(hue, 0.85, 0.5 + uTreble * 0.3)) * ring;

    vec3 color = prev + ringColor;
    color += uBeatIntensity * 0.12 * hsv2rgb(vec3(fract(uTime * 0.1), 0.7, 0.45));

    FragColor = vec4(color, 1.0);
}
