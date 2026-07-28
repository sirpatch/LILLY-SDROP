// name: Spaceglide
// author: ASASHI
void main() {
    vec2 uv = aspectUv();
    float radius = length(uv);
    float angle = atan(uv.y, uv.x);

    // The "glide": smooth continuous orbital drift, never stopping,
    // this represents the constant fluid movement of spacegliding
    float glideSpeed = uTime * 0.5 + uMid * 0.3;
    vec2 glideUv = rot2(glideSpeed) * uv;
    glideUv = domainWarp(glideUv, uTime * 0.3, 0.12 + uBass * 0.15);
    float glideRadius = length(glideUv);
    float glideAngle = atan(glideUv.y, glideUv.x);

    // Orbit trail rings: multiple thin rings gliding outward at slightly
    // different speeds, like layered kite paths
    float trail1 = fract(glideRadius * 3.0 - uTime * 0.9);
    float trail2 = fract(glideRadius * 3.0 - uTime * 0.9 - 0.33);
    float trail3 = fract(glideRadius * 3.0 - uTime * 0.9 - 0.66);
    float ring1 = smoothstep(0.03, 0.0, abs(trail1 - 0.5));
    float ring2 = smoothstep(0.03, 0.0, abs(trail2 - 0.5));
    float ring3 = smoothstep(0.03, 0.0, abs(trail3 - 0.5));
    float fade = smoothstep(1.2, 0.0, glideRadius);

    // Void/marksman palette: deep purple base, cyan-white accents
    vec3 voidColor = hsv2rgb(vec3(0.75, 0.65, 0.5));
    vec3 accentColor = hsv2rgb(vec3(0.55, 0.4, 1.0));

    vec3 color = vec3(0.0);
    color += voidColor * ring1 * fade * 0.9;
    color += accentColor * ring2 * fade * 0.7;
    color += voidColor * ring3 * fade * 0.5;

    // Auto-attack pulse: sharp precise ring that snaps out on beat,
    // representing the timed auto-attack landing mid-glide
    float atkPulse = uBeatIntensity;
    float atkRadius = 0.15 + (1.0 - atkPulse) * 0.5;
    float atkRing = smoothstep(0.02, 0.0, abs(radius - atkRadius)) * atkPulse;
    vec3 atkColor = vec3(0.9, 0.95, 1.0) * atkRing * 2.0;
    color += atkColor;

    // Kite path dots: small bright points tracing the orbit,
    // count driven by spectrum so busier music = more motion
    float nDots = 24.0;
    float dotSlot = floor(fract(glideAngle / 6.28318 + uTime * 0.15) * nDots) / nDots;
    float specVal = sampleSpectrum(dotSlot);
    float dotRadius = 0.2 + specVal * 0.55;
    float dotAngleWidth = 0.015;
    float slotAngle = fract(glideAngle / 6.28318 * nDots);
    float dotMask = smoothstep(dotAngleWidth, 0.0, min(slotAngle, 1.0 - slotAngle));
    float dot = smoothstep(0.02, 0.0, abs(glideRadius - dotRadius)) * dotMask;
    color += accentColor * dot * 1.5;

    // Waveform as a thin projectile arc firing outward from center
    float wf = sampleWaveform(fract(angle / 6.28318 + 0.5));
    float projRadius = 0.05 + abs(wf) * 0.9;
    float proj = smoothstep(0.008, 0.0, abs(radius - projRadius)) * step(radius, 0.9);
    color += vec3(0.7, 1.0, 0.9) * proj * 0.8;

    // Center core: steady glow, brightens on beat like a champion's aura
    float core = smoothstep(0.12, 0.0, radius);
    color += mix(voidColor, vec3(1.0), atkPulse * 0.6) * core * 1.2;

    // Subtle beat flash, kept soft to preserve the "smooth glide" feel
    color += vec3(0.6, 0.7, 1.0) * uBeat * 0.15;

    // Smooth long trails, since spaceglide is defined by fluidity not snap-cuts
    float decay = mix(0.94, 0.88, atkPulse * 0.5);
    vec3 prev = texture(uPrevFrame, vUv).rgb * decay;

    FragColor = vec4(prev + color * 0.55, 1.0);
}