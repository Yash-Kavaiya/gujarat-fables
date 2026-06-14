import{r as v,C as l,b as c,j as i,D as p}from"./index-9rm85wiw.js";function h({size:r=200,segments:o=96,color:t="#1c3a4a",highlight:u="#e8b34a",position:m=[0,0,0],amplitude:n=.22,opacity:e=1}){const a=v.useRef(null),s=v.useMemo(()=>({uTime:{value:0},uColor:{value:new l(t)},uHighlight:{value:new l(u)},uAmp:{value:n},uOpacity:{value:e}}),[t,u,n,e]);return c((x,f)=>{a.current&&(a.current.uniforms.uTime.value+=f)}),i.jsxs("mesh",{rotation:[-Math.PI/2,0,0],position:m,receiveShadow:!0,children:[i.jsx("planeGeometry",{args:[r,r,o,o]}),i.jsx("shaderMaterial",{ref:a,transparent:e<1,side:p,uniforms:s,vertexShader:`
          uniform float uTime;
          uniform float uAmp;
          varying float vWave;
          varying vec2 vUv;
          void main() {
            vUv = uv;
            vec3 p = position;
            float w =
              sin(p.x * 0.25 + uTime * 0.9) * 0.6 +
              sin(p.y * 0.32 - uTime * 1.1) * 0.4 +
              sin((p.x + p.y) * 0.15 + uTime * 0.6) * 0.5;
            p.z += w * uAmp;
            vWave = w;
            gl_Position = projectionMatrix * modelViewMatrix * vec4(p, 1.0);
          }
        `,fragmentShader:`
          uniform vec3 uColor;
          uniform vec3 uHighlight;
          uniform float uOpacity;
          uniform float uTime;
          varying float vWave;
          varying vec2 vUv;
          void main() {
            float crest = smoothstep(0.35, 1.0, vWave);
            float glint = pow(max(sin(vUv.x * 40.0 + uTime) * 0.5 + 0.5, 0.0), 8.0) * 0.25;
            vec3 col = mix(uColor, uHighlight, crest * 0.5 + glint);
            gl_FragColor = vec4(col, uOpacity);
          }
        `})]})}export{h as W};
