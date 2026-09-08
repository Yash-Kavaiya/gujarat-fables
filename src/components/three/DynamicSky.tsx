import { useMemo } from 'react';
import { BackSide, Color, ShaderMaterial } from 'three';

interface DynamicSkyProps {
  /** 0 = sunrise (east), 0.5 = noon, 1 = sunset (west) */
  sunAngle: number;
  radius?: number;
}

/**
 * A time-of-day sky dome: smoothly transitions through dawn → morning →
 * noon → afternoon → dusk → twilight colours driven by sunAngle.
 * Replaces the static GradientSky for weather-aware scenes.
 */
export default function DynamicSky({ sunAngle, radius = 400 }: DynamicSkyProps) {
  const material = useMemo(() => {
    const theta = sunAngle * Math.PI;
    const sunH = Math.sin(theta); // 0 at horizon, 1 at noon
    const sunEast = Math.cos(theta); // positive = east (sunrise), negative = west (sunset)

    // ── Horizon warmth: high when sun is low ──
    const horizonWarm = Math.pow(1 - sunH, 1.8);

    // ── Dawn/dusk blush ──
    const isDawnSide = sunEast > 0;
    const blushIntensity = horizonWarm * 0.9;

    // ── Sky top colour ──
    // Noon: bright blue. Dawn/dusk: deeper purple-blue. Night-ish: dark navy.
    const topR = 0.12 + sunH * 0.18 + horizonWarm * 0.08;
    const topG = 0.18 + sunH * 0.42 + horizonWarm * 0.05;
    const topB = 0.42 + sunH * 0.38 - horizonWarm * 0.05;

    // ── Horizon colour ──
    // Noon: pale warm white. Dawn/dusk: orange-pink-gold.
    const horR = 0.65 + horizonWarm * 0.35;
    const horG = 0.60 + sunH * 0.15 - horizonWarm * 0.15;
    const horB = 0.50 + sunH * 0.20 - horizonWarm * 0.30;

    // ── Dawn/dusk accent colour (for the blush near horizon) ──
    // Pink-orange at dawn, deeper orange-red at sunset
    const blushR = isDawnSide ? 1.0 : 0.95;
    const blushG = isDawnSide ? 0.55 : 0.40;
    const blushB = isDawnSide ? 0.35 : 0.25;

    // ── Sun glow colour (warm halo near the sun) ──
    const glowR = 1.0;
    const glowG = 0.75 + sunH * 0.15;
    const glowB = 0.35 + sunH * 0.25;

    const uniforms = {
      uTopColor: { value: new Color(topR, topG, topB) },
      uBottomColor: { value: new Color(horR, horG, horB) },
      uBlushColor: { value: new Color(blushR, blushG, blushB) },
      uGlowColor: { value: new Color(glowR, glowG, glowB) },
      uSunDir: { value: new Color(Math.cos(theta), Math.sin(theta), 0) },
      uHorizonWarm: { value: horizonWarm },
      uBlushIntensity: { value: blushIntensity },
      uSunH: { value: sunH },
    };

    return new ShaderMaterial({
      side: BackSide,
      depthWrite: false,
      uniforms,
      vertexShader: /* glsl */ `
        varying vec3 vWorldPosition;
        varying vec3 vNormal;
        void main() {
          vec4 wp = modelMatrix * vec4(position, 1.0);
          vWorldPosition = wp.xyz;
          vNormal = normalize(position);
          gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
        }
      `,
      fragmentShader: /* glsl */ `
        uniform vec3 uTopColor;
        uniform vec3 uBottomColor;
        uniform vec3 uBlushColor;
        uniform vec3 uGlowColor;
        uniform vec3 uSunDir;
        uniform float uHorizonWarm;
        uniform float uBlushIntensity;
        uniform float uSunH;

        varying vec3 vWorldPosition;
        varying vec3 vNormal;

        void main() {
          vec3 dir = normalize(vWorldPosition);
          float h = dir.y;

          // ── Base gradient: top → horizon ──
          float t = pow(max(h, 0.0), 0.65);
          vec3 sky = mix(uBottomColor, uTopColor, t);

          // ── Dawn/dusk blush: a band of warm color near the horizon ──
          float blushBand = exp(-pow((h - 0.05) * 6.0, 2.0)) * uBlushIntensity;
          sky = mix(sky, uBlushColor, blushBand * 0.6);

          // ── Sun glow: bright warm halo around the sun direction ──
          float sunDot = max(dot(dir, normalize(uSunDir)), 0.0);
          float sunGlow = pow(sunDot, 8.0 + uSunH * 16.0) * (0.3 + uSunH * 0.5);
          float sunHalo = pow(sunDot, 2.0) * uHorizonWarm * 0.4;
          sky += uGlowColor * (sunGlow + sunHalo);

          // ── Slight desaturation near horizon for haze effect ──
          float haze = smoothstep(0.0, 0.15, h) * (1.0 - smoothstep(0.15, 0.35, h));
          float lum = dot(sky, vec3(0.299, 0.587, 0.114));
          sky = mix(sky, vec3(lum) * vec3(1.05, 1.0, 0.95), haze * uHorizonWarm * 0.3);

          // ── Clamp ──
          sky = clamp(sky, 0.0, 1.0);

          gl_FragColor = vec4(sky, 1.0);
        }
      `,
    });
  }, [sunAngle]);

  return (
    <mesh material={material} frustumCulled={false}>
      <sphereGeometry args={[radius, 48, 24]} />
    </mesh>
  );
}
