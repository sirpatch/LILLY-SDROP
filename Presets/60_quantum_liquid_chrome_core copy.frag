// name: Quantum Liquid Chrome Core
// author: sirpatch
void main() {
    vec3 color = vec3(0.0);
    vec2 st = aspectUv();

    float r = length(st);
    float a = atan(st.y, st.x);

    // Audio reactivity
    float bass   = uBass * 1.7;
    float mid    = uMid * 1.4;
    float treble = uTreble * 1.8;
    float beat   = uBeatIntensity;

    // 1. Asymmetric Fluid Domain Warping
    vec2 fluidUv = st;
    fluidUv = domainWarp(fluidUv, uTime * 0.7, 0.15 + bass * 0.2);
    fluidUv = domainWarp(fluidUv * 1.5, -uTime * 0.5, 0.1 + treble * 0.15);

    float fr = length(fluidUv);
    float fa = atan(fluidUv.y, fluidUv.x);

    // 2. Liquid Core Waveform Surface Tension
    float wave = sampleWaveform(fract(fa / 6.2831853 + uTime * 0.1));
    float coreR = 0.22 + bass * 0.14 + wave * 0.06;

    // Surface metallic edge + inner body fill
    float coreEdge = abs(fr - coreR);
    float metallicGlow = exp(-coreEdge * 70.0) * (2.0 + beat * 2.0);
    float liquidBody = smoothstep(coreR, 0.0, fr);

    // 3. Simulated Liquid Chrome Specular Highlight
    float hL = sampleWaveform(fract((fa - 0.05) / 6.2831853));
    float hR = sampleWaveform(fract((fa + 0.05) / 6.2831853));
    vec3 normal = normalize(vec3(hL - hR, 0.1, 0.8));

    vec3 lightDir = normalize(vec3(sin(uTime * 1.5), cos(uTime * 1.2), 1.0));
    float spec = pow(max(0.0, dot(normal, lightDir)), 16.0) * (1.0 + treble * 2.0);

    // Iridescent chrome color mapping
    vec3 chromeCol = hsv2rgb(vec3(fract(fr * 0.8 - uTime * 0.15 + bass * 0.3), 0.85, 1.0));
    vec3 liquidCore = (chromeCol * metallicGlow * 1.8) + (chromeCol * liquidBody * 0.4) + vec3(spec);

    // 4. Electric Bio-Plasma Arcs
    float arcPattern = sin(fluidUv.x * 25.0 + uTime * 4.0) * cos(fluidUv.y * 25.0 - uTime * 3.0);
    float arcDist = abs(fr - (coreR + 0.15 + arcPattern * 0.1));
    float arcGlow = exp(-arcDist * 90.0) * step(coreR, fr) * (0.8 + beat * 1.5);
    vec3 bioArcs = vec3(0.0, 0.9, 1.0) * arcGlow * 2.5; // Cyan Tendrils

    // 5. Zero-Bleed Void Feedback
    vec2 fbUv = vUv - 0.5;
    fbUv = rot2(0.005 + beat * 0.01) * fbUv;
    fbUv *= 0.965;
    fbUv += 0.5;

    float shift = 0.004 + treble * 0.005;
    vec3 prev;
    prev.r = texture(uPrevFrame, fbUv + vec2(shift, shift * 0.5)).r;
    prev.g = texture(uPrevFrame, fbUv).g;
    prev.b = texture(uPrevFrame, fbUv - vec2(shift, shift * 0.5)).b;
    prev *= 0.78;

    color = prev + liquidCore + bioArcs;

    FragColor = vec4(color, 1.0);
}