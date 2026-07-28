# LILLY'SDROP // LILLY-SDROP

A Milkdrop-style, audio-reactive visualizer for Windows. It listens to
whatever's playing on your PC and turns it into swirling, trailing,
beat-reactive GPU visuals — the classic Winamp Milkdrop feedback/warp look,
built fresh.

## Requirements

- Windows 10/11
- A GPU with OpenGL 3.3 support (basically anything from the last ~15 years)
- Something playing audio through your default output device

## Getting Started

1. Grab the latest release from the [Releases](../../releases) page.
2. Unzip it anywhere.
3. Run `LILLYSDROP.exe`.

It listens to your system's default audio output automatically — play
something in Spotify, YouTube, a game, whatever — no setup or routing needed.

## Controls

| Key         | Action                          |
|-------------|----------------------------------|
| →           | Next preset (crossfades in)      |
| ←           | Previous preset (crossfades in)  |
| ↑           | Brighter                         |
| ↓           | Dimmer                           |
| `[`         | Lower gamma (more vivid)         |
| `]`         | Raise gamma (moodier)            |
| Space       | Toggle preset auto-cycling       |
| R           | Reload presets from disk         |
| F           | Fullscreen                       |
| Esc         | Quit                             |

## Making Your Own Presets

Every preset is a plain text file (`.frag`) in the `Presets/` folder next to
the exe — no programming environment or rebuilding required, just a text
editor. Copy an existing one as a starting point, edit it, then press **R**
in the running app to reload from disk.

A minimal preset:

```glsl
// name: My Preset

void main() {
    vec3 prev = texture(uPrevFrame, vUv).rgb * 0.95;          // fade the previous frame
    vec3 color = hsv2rgb(vec3(fract(uTime * 0.1), 0.8, 0.5)); // cycling hue
    FragColor = vec4(prev + color * 0.1, 1.0);
}
```

The `// name: ...` comment sets what shows up in the app (falls back to the
file name if you skip it). Every preset automatically has access to:

```glsl
uniform sampler2D uPrevFrame;      // previous frame, for feedback trails
uniform vec2  uResolution;
uniform float uTime;
uniform float uBass, uMid, uTreble, uVolume;   // 0..1
uniform float uBeat;               // 1.0 on the beat frame, else 0.0
uniform float uBeatIntensity;      // decays 1 -> 0 after a beat
uniform float uSpectrum[64];       // spectrum bars (log-spaced), ~0..1
uniform float uWaveform[64];       // raw waveform samples, ~-1..1

vec2  aspectUv();                  // aspect-corrected, centered UV
vec3  hsv2rgb(vec3 hsv);           // hue/sat/value -> color
mat2  rot2(float angle);           // 2D rotation matrix
vec2  domainWarp(vec2 uv, float t, float amount);  // wobbly distortion
float sampleSpectrum(float t);     // smooth uSpectrum lookup, t in [0,1]
float sampleWaveform(float t);     // smooth uWaveform lookup, t in [0,1]
```

There's no built-in overlay for bars, scopes, or anything else — if you want
one, you draw it yourself using `uSpectrum`/`uWaveform`. The built-in
`Equalizer Bars` and `Oscilloscope Ring` presets are working examples to
copy from.

A preset that fails to compile just falls back to a dimmed previous frame
and logs the error to the console instead of crashing the app, so it's safe
to experiment.

## License

*(add your license here)*
