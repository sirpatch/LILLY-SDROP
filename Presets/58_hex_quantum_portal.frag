// name: Hexagonal Quantum Portal
// author: sirpatch
void main() {
    vec3 color = vec3(0.0);
    vec2 st = aspectUv();

    float r = length(st);
    float a = atan(st.y, st.x);

    // Audio reactivity
    float bass   = uBass * 1.8;
    float mid    = uMid * 1.3;
    float treble = uTreble * 1.7;
    float beat   = uBeatIntensity;

    // 1. Log-Polar Infinite Portal Coordinates
    vec2 portal = vec2(a / 3.14159265, log(r + 0.0001) * 0.7 - uTime * 0.6 - bass * 0.25);

    // Hexagonal 6-Slice Kaleidoscope Mirroring
    float slices = 6.0;
    portal.x = mod(portal.x, 2.0 / slices);
    portal.x = abs(portal.x - (1.0 / slices));

    // 2. Nested Vector Grid Geometry
    vec2 gridUV = fract(portal * vec2(slices * 2.0, 10.0)) - 0.5;
    float hexBox = max(abs(gridUV.x), abs(gridUV.y));
    float gridLine = exp(-abs(hexBox - 0.35) * (40.0 + treble * 30.0));

    vec3 gridHue = hsv2rgb(vec3(fract(portal.y * 0.2 + uTime * 0.15), 0.9, 1.0));
    vec3 gridColor = gridHue * gridLine * (1.2 + beat * 1.5);

    // 3. Pulsating Hexagonal Wave Ring
    float wave = sampleWaveform(fract(a / 6.2831853 + uTime * 0.2));
    float hexDist = abs(max(abs(st.x) * 0.866025 + abs(st.y) * 0.5, abs(st.y)) - (0.22 + bass * 0.12 + wave * 0.05));
    float hexGlow = exp(-hexDist * 85.0) * (2.0 + beat * 2.0);
    vec3 hexRing = vec3(0.0, 0.8, 1.0) * hexGlow * 2.5; // Cyan Core

    // 4. Sharp Feedback Decay
    vec2 fbUv = vUv - 0.5;
    fbUv = rot2(0.007 + beat * 0.01) * fbUv;
    fbUv *= 0.96;
    fbUv += 0.5;

    float shift = 0.003 + treble * 0.004;
    vec3 prev;
    prev.r = texture(uPrevFrame, fbUv + vec2(shift, 0.0)).r;
    prev.g = texture(uPrevFrame, fbUv).g;
    prev.b = texture(uPrevFrame, fbUv - vec2(shift, 0.0)).b;
    prev *= 0.76; // Clean background retention

    color = prev + gridColor * 0.9 + hexRing;

    FragColor = vec4(color, 1.0);
}