// name: Event Horizon Singularity
// author: sirpatch
void main() {
    vec3 color = vec3(0.0);
    vec2 st = aspectUv();

    float r = length(st);
    float a = atan(st.y, st.x);

    // Audio reactivity
    float bass   = uBass * 1.8;
    float mid    = uMid * 1.4;
    float treble = uTreble * 1.7;
    float beat   = uBeatIntensity;

    // 1. Gravitational Lensing Distortion (Space warps toward singularity)
    float lens = 1.0 / (r * 4.0 + 0.18);
    vec2 warpedSt = st * (1.0 - lens * 0.15);
    float wr = length(warpedSt);

    // 2. Swirling Relativistic Accretion Disk
    float twistA = a + (2.5 / (wr + 0.08)) - uTime * 2.0;

    // Disk density profile
    float diskInner = 0.14 + bass * 0.08;
    float diskOuter = diskInner + 0.45 + mid * 0.2;
    float diskMask = smoothstep(diskInner, diskInner + 0.08, wr) * smoothstep(diskOuter, diskOuter - 0.25, wr);

    // Swirling plasma turbulence inside disk
    float turbulence = sin(twistA * 8.0 + wr * 25.0) * cos(wr * 40.0 - uTime * 3.0);
    float plasma = (0.6 + 0.4 * turbulence) * diskMask;

    // Relativistic Beaming (Doppler shift: left side darker/redder, right side white-hot)
    float doppler = sin(a + 0.5) * 0.45 + 1.0;

    // Thermodynamic heat scale
    vec3 diskCol = mix(vec3(1.0, 0.15, 0.0), vec3(1.0, 0.8, 0.2), plasma);
    diskCol = mix(diskCol, vec3(1.0, 0.98, 0.9), smoothstep(0.7, 1.1, plasma * doppler));
    vec3 accretionDisk = diskCol * plasma * doppler * (1.2 + beat * 1.5);

    // 3. Photon Sphere & Event Horizon Shadow
    float photonGlow = exp(-abs(wr - diskInner) * 90.0) * (2.0 + beat * 2.0);
    vec3 photonSphere = vec3(1.0, 0.95, 0.8) * photonGlow;

    // Absolute black void inside event horizon
    float horizonShadow = smoothstep(diskInner - 0.01, diskInner + 0.02, wr);

    // 4. Gravitational Shockwaves (Triggered by beats)
    float shockR = fract(uTime * 0.8 + beat * 0.2) * 0.9;
    float shockGlow = exp(-abs(r - shockR) * 70.0) * (beat * 2.0);
    vec3 shockwave = vec3(0.8, 0.2, 1.0) * shockGlow;

    // 5. Relativistic Space Feedback
    vec2 fbUv = vUv - 0.5;
    fbUv = rot2(0.003 + beat * 0.008) * fbUv;
    fbUv *= 0.965;
    fbUv += 0.5;

    float shift = 0.003 + treble * 0.004;
    vec3 prev;
    prev.r = texture(uPrevFrame, fbUv + vec2(shift, 0.0)).r;
    prev.g = texture(uPrevFrame, fbUv).g;
    prev.b = texture(uPrevFrame, fbUv - vec2(shift, 0.0)).b;
    prev *= 0.79; // Pure black background preservation

    color = prev + (accretionDisk + photonSphere) * horizonShadow + shockwave;

    FragColor = vec4(color, 1.0);
}