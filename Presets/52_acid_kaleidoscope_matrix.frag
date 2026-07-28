// name: Acid Kaleidoscope Matrix
// author: sirpatch
void main() {
    vec2 p = aspectUv();

    float bass   = uBass * 1.5;
    float mid    = uMid * 1.2;
    float treble = uTreble * 1.6;
    float beat   = uBeatIntensity;

    // Rotate overall scene
    p = rot2(uTime * 0.15 + bass * 0.2) * p;

    // Sharp Fractal Mirror Folding
    vec3 fractalLayers = vec3(0.0);
    vec2 pOrig = p;

    for (int i = 0; i < 4; i++) {
        float fi = float(i);
        float spec = sampleSpectrum(fi * 0.25);

        p = abs(p);
        p = rot2(0.6 + uTime * 0.1) * p;
        p -= vec2(0.2 + bass * 0.12, 0.1 + mid * 0.08);

        // Sharp edge field
        float d = length(p) - (0.08 + spec * 0.25);
        float edge = exp(-abs(d) * (40.0 + treble * 20.0));

        vec3 col = hsv2rgb(vec3(fract(uTime * 0.12 + fi * 0.2 + spec * 0.3), 0.95, 1.0));
        fractalLayers += col * edge * (0.8 + spec * 1.2);
    }

    // Radial Audio Bars
    vec3 laserBars = vec3(0.0);
    const int BARS = 24;
    float a = atan(pOrig.y, pOrig.x);
    float r = length(pOrig);

    for (int i = 0; i < BARS; i++) {
        float t = float(i) / float(BARS - 1);
        float spec = sampleSpectrum(t);

        float rayAngle = float(i) * (6.283185 / float(BARS));
        float dAngle = abs(mod(a - rayAngle + 3.14159265, 6.283185) - 3.14159265);

        float beam = exp(-dAngle * 40.0) * smoothstep(0.1, 0.1 + spec * 0.7, r);
        vec3 col = hsv2rgb(vec3(fract(t + uTime * 0.25), 1.0, 1.0));

        laserBars += col * beam * (0.8 + beat * 1.2);
    }

    // Clean zero-point feedback
    vec2 fbUv = vUv - 0.5;
    fbUv = rot2(0.01) * fbUv;
    fbUv *= 0.96;
    fbUv += 0.5;

    float shift = 0.005 + treble * 0.005;
    vec3 prev;
    prev.r = texture(uPrevFrame, fbUv + vec2(shift, 0.0)).r;
    prev.g = texture(uPrevFrame, fbUv).g;
    prev.b = texture(uPrevFrame, fbUv - vec2(shift, 0.0)).b;
    prev *= 0.80; // Fast decay to preserve pitch black ground

    vec3 finalColor = prev + fractalLayers * 0.85 + laserBars * 0.9;

    FragColor = vec4(finalColor, 1.0);
}