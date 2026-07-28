// name: Starfield Pulse
// author: sirpatch
//
// A zooming star grid that flares outward on beats. Try: raise the `* 20.0`
// grid density for more, smaller stars.

float hash(vec2 p) {
    return fract(sin(dot(p, vec2(127.1, 311.7))) * 43758.5453);
}

void main() {
    vec2 uv = aspectUv();

    float zoom = 1.0 + (0.02 + uBass * 0.07 + uBeatIntensity * 0.08);
    vec2 warped = domainWarp(uv / zoom, uTime * 0.2, 0.02);

    vec2 sampleUv = warped * 0.5 + 0.5;
    vec3 prev = texture(uPrevFrame, sampleUv).rgb;
    prev *= 0.945;

    vec2 grid = fract(uv * 20.0) - 0.5;
    vec2 id = floor(uv * 20.0);
    float star = smoothstep(0.05 + uVolume * 0.05, 0.0, length(grid)) * step(0.96, hash(id));

    float hue = fract(hash(id) + uTime * 0.05);
    vec3 starColor = hsv2rgb(vec3(hue, 0.6, 0.55 + uBeatIntensity * 0.3)) * star;

    FragColor = vec4(prev + starColor, 1.0);
}
