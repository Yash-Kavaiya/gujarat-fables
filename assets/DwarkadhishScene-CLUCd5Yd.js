import{u as c,j as e,S as l,e as d,g as h,r as n,b as m,D as p}from"./index-9rm85wiw.js";import{W as f}from"./WaterPlane-C2cfRKSJ.js";import{P as u}from"./Pillars-CLXP_xEE.js";import{H as x}from"./Hotspot-qBWq57U6.js";import"./Instances-C6BA7Ks5.js";const g=h("dwarkadhish-temple"),v=g.palette,j={sky:"#5a4a66",ground:"#2c4654",accent:"#ff9d4d",fog:"#48405e"},i="#d4ad62";function S(){const s=n.useRef(null),a=n.useMemo(()=>({uTime:{value:0}}),[]);return m((t,o)=>{s.current&&(s.current.uniforms.uTime.value+=o)}),e.jsxs("group",{position:[0,24,0],children:[e.jsxs("mesh",{position:[0,-1,0],children:[e.jsx("cylinderGeometry",{args:[.12,.12,6,8]}),e.jsx("meshStandardMaterial",{color:"#caa24e",metalness:.4,roughness:.4})]}),e.jsxs("mesh",{position:[2.1,.6,0],children:[e.jsx("planeGeometry",{args:[4,2.4,24,12]}),e.jsx("shaderMaterial",{ref:s,side:p,uniforms:a,vertexShader:`
            uniform float uTime;
            varying vec2 vUv;
            void main(){
              vUv = uv;
              vec3 p = position;
              float anchor = (p.x + 2.0) / 4.0;
              p.z += sin(p.x * 2.2 + uTime * 5.0) * 0.32 * anchor;
              p.y += sin(p.x * 1.5 + uTime * 3.0) * 0.12 * anchor;
              gl_Position = projectionMatrix * modelViewMatrix * vec4(p, 1.0);
            }
          `,fragmentShader:`
            varying vec2 vUv;
            void main(){
              vec3 saffron = vec3(0.93, 0.55, 0.16);
              vec2 c = vUv - vec2(0.5);
              float disc = smoothstep(0.16, 0.13, length(c));
              vec3 col = mix(saffron, vec3(1.0, 0.92, 0.7), disc);
              gl_FragColor = vec4(col, 1.0);
            }
          `})]})]})}function M(){const s=c(o=>o.evening),a=s?j:v,t=[0,1,2,3,4].map(o=>({y:3+o*3,w:9-o*1.3,d:9-o*1.3}));return e.jsxs(l,{palette:a,cameraPosition:[16,10,22],fov:50,fog:[40,240],controls:{target:[0,9,0],minDistance:12,maxDistance:70},bloomIntensity:s?1.1:.7,children:[e.jsx("directionalLight",{position:s?[-18,16,16]:[20,30,16],intensity:s?.7:1.6,color:s?"#ffb275":"#fff2d8",castShadow:!0,"shadow-mapSize":[1024,1024]}),e.jsx(f,{size:500,color:s?"#1a2c3c":"#2f5e6c",highlight:s?"#ff9d4d":"#d4ebee",amplitude:.26,position:[0,0,14]}),e.jsxs("mesh",{position:[0,.75,-2],receiveShadow:!0,castShadow:!0,children:[e.jsx("boxGeometry",{args:[30,1.5,26]}),e.jsx("meshStandardMaterial",{color:"#c2a061",roughness:.95})]}),e.jsx("group",{position:[0,1.5,0],children:e.jsx(u,{rows:5,cols:6,spacing:1.7,height:3,radius:.24,color:i,hollow:!0})}),e.jsxs("group",{position:[0,1.5,0],children:[t.map((o,r)=>e.jsxs("mesh",{position:[0,o.y,0],castShadow:!0,children:[e.jsx("boxGeometry",{args:[o.w,2.8,o.d]}),e.jsx("meshStandardMaterial",{color:r%2?"#cda85f":i,roughness:.85})]},r)),e.jsx(d,{position:[0,17,0],height:7,baseRadius:1.9,color:i,accent:"#ffcf6b"}),e.jsx(x,{position:[0,25.5,0],label:"The Dhwaja is changed five times a day"})]}),e.jsx(S,{}),s&&e.jsx("pointLight",{position:[0,8,4],intensity:2.4,color:"#ff9d4d",distance:60})]})}export{M as default};
