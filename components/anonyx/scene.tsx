'use client';
import {Canvas,useFrame,useLoader} from '@react-three/fiber';
import {GLTFLoader} from 'three/addons/loaders/GLTFLoader.js';
import * as THREE from 'three';
import {useEffect,useMemo,useRef,useState} from 'react';
import {ChamberProps,particleAt,sequence} from './chamber-motion';
type SceneProps=ChamberProps&{onReady:()=>void;onError:()=>void};
const COUNT=360;

// Split the existing Meshy filter into two moving shutter leaves.
function shutterGeometry(source:THREE.BufferGeometry,side:number){
 const raw=source.index?source.toNonIndexed():source.clone();raw.computeBoundingBox();
 const box=raw.boundingBox!;const center=box.getCenter(new THREE.Vector3());const height=box.max.y-box.min.y;
 const pos=raw.getAttribute('position');const normal=raw.getAttribute('normal');const vertices:number[]=[],normals:number[]=[];
 for(let i=0;i<pos.count;i+=3){const midpoint=(pos.getX(i)+pos.getX(i+1)+pos.getX(i+2))/3;if((midpoint-center.x)*side<0)continue;
  for(let j=0;j<3;j++){vertices.push((pos.getX(i+j)-center.x)*3.2/height,(pos.getY(i+j)-center.y)*3.2/height,(pos.getZ(i+j)-center.z)*3.2/height);if(normal)normals.push(normal.getX(i+j),normal.getY(i+j),normal.getZ(i+j))}
 }
 raw.dispose();const result=new THREE.BufferGeometry();result.setAttribute('position',new THREE.Float32BufferAttribute(vertices,3));if(normals.length)result.setAttribute('normal',new THREE.Float32BufferAttribute(normals,3));else result.computeVertexNormals();result.rotateY(Math.PI/2);return result;
}
function Chamber(props:SceneProps){
 const gltf=useLoader(GLTFLoader,'/models/privacy-filter.glb');const clock=useRef(0);const gate=useRef<THREE.Group>(null);const leaves=useRef<(THREE.Mesh|null)[]>([]);const scan=useRef<THREE.Mesh>(null);const pulse=useRef<THREE.Mesh>(null);const ready=useRef(false);
 const geometry=useMemo(()=>{let mesh:THREE.Mesh|undefined;gltf.scene.traverse(n=>{if(n instanceof THREE.Mesh&&!mesh)mesh=n});if(!mesh)throw new Error('Filter has no mesh');return [shutterGeometry(mesh.geometry,-1),shutterGeometry(mesh.geometry,1)]},[gltf]);
 const particles=useMemo(()=>{const g=new THREE.BufferGeometry();g.setAttribute('position',new THREE.BufferAttribute(new Float32Array(COUNT*3),3));g.setAttribute('color',new THREE.BufferAttribute(new Float32Array(COUNT*3),3));g.setAttribute('strength',new THREE.BufferAttribute(new Float32Array(COUNT),1));return g},[]);
 const rail=new THREE.Color('#bc9dff');const mint=new THREE.Color('#6cefd5');
 useFrame(({camera,pointer},delta)=>{
  if(!props.paused)clock.current+=Math.min(delta,.05);const t=clock.current;const{p,open,push}=sequence(props,performance.now());
  if(gate.current){gate.current.rotation.y=Math.sin(props.rotation)*.2+(props.paused?0:pointer.x*.08);gate.current.rotation.x=props.paused?0:pointer.y*.04;}
  leaves.current.forEach((m,i)=>{if(m)m.position.z=(i===0?1:-1)*open*.82});
  if(scan.current){scan.current.position.y=Math.sin(t*.85)*1.4;(scan.current.material as THREE.MeshBasicMaterial).opacity=.35+open*.65;}
  if(pulse.current){const hit=props.stage==='scanning'&&p>.43&&p<.87;const wave=(p-.43)/.44;pulse.current.visible=hit;pulse.current.scale.setScalar(.45+wave*.75);(pulse.current.material as THREE.MeshBasicMaterial).opacity=hit?Math.sin(wave*Math.PI)*.45:0;}
  const pos=particles.getAttribute('position'),color=particles.getAttribute('color'),strength=particles.getAttribute('strength');
  for(let i=0;i<COUNT;i++){const a=particleAt(i,t,p,props.stage,props.selected);pos.setXYZ(i,a.x,a.y,a.z);const c=a.teal?mint:rail;color.setXYZ(i,c.r,c.g,c.b);strength.setX(i,a.alpha)}pos.needsUpdate=color.needsUpdate=strength.needsUpdate=true;
  camera.position.set(6.8-push*3.8,2.0-push*1.25,7.1-push*3.8);camera.lookAt(0,0,0);
 });
 return <>
  <ambientLight intensity={1.5}/><directionalLight position={[4,5,4]} color="#e3d4ff" intensity={5}/><pointLight position={[-2,0,1]} color="#9965ed" intensity={22}/><pointLight position={[2,1,-1]} color="#64ebce" intensity={30}/>
  <group ref={gate}>
   {[-.44,0,.44].map((x,i)=><group key={x} position={[x,0,0]}>
    <mesh><boxGeometry args={[.025,3.65,2.35]}/><meshPhysicalMaterial color="#9b8cff" transparent opacity={.035} roughness={.1} side={THREE.DoubleSide} depthWrite={false}/></mesh>
    {[-1,1].map(sign=><group key={sign}>
     <mesh position={[0,sign*1.82,0]}><boxGeometry args={[.035,.025,2.38]}/><meshBasicMaterial color={i===1?'#c9adff':'#796899'} transparent opacity={i===1?.9:.35}/></mesh>
     <mesh position={[0,0,sign*1.18]}><boxGeometry args={[.035,3.67,.025]}/><meshBasicMaterial color={i===1?'#b898ff':'#796899'} transparent opacity={i===1?.9:.35}/></mesh>
    </group>)}
   </group>)}
   {geometry.map((g,i)=><mesh key={i} geometry={g} ref={el=>{leaves.current[i]=el}}><meshPhysicalMaterial color="#ac91dd" metalness={.36} roughness={.24} transparent opacity={.42} emissive="#43275e" emissiveIntensity={.5} side={THREE.DoubleSide} depthWrite={false}/></mesh>)}
   <mesh ref={scan} position={[.06,0,0]}><boxGeometry args={[.035,.025,2.25]}/><meshBasicMaterial color="#a1ffe2" transparent opacity={.7}/></mesh>
  </group>
  <mesh ref={pulse} position={[-.5,0,0]} rotation={[0,Math.PI/2,0]}><ringGeometry args={[1.1,1.115,64]}/><meshBasicMaterial color="#c4a5ff" transparent side={THREE.DoubleSide} depthWrite={false}/></mesh>
  <points geometry={particles} frustumCulled={false} onAfterRender={()=>{if(!ready.current){ready.current=true;requestAnimationFrame(props.onReady)}}}>
   <shaderMaterial transparent depthWrite={false} blending={THREE.AdditiveBlending} vertexShader={`attribute vec3 color;attribute float strength;varying vec3 vColor;varying float vStrength;void main(){vColor=color;vStrength=strength;vec4 mv=modelViewMatrix*vec4(position,1.);gl_Position=projectionMatrix*mv;gl_PointSize=clamp(18./-mv.z,1.5,5.);}`} fragmentShader={`varying vec3 vColor;varying float vStrength;void main(){float d=length(gl_PointCoord-.5);float a=smoothstep(.5,.05,d);gl_FragColor=vec4(vColor,a*vStrength);}`}/>
  </points>
  <gridHelper args={[12,24,'#302c40','#211d30']} position={[0,-1.86,0]}/>
 </>;
}
export default function Scene(props:SceneProps){
 const host=useRef<HTMLDivElement>(null);const[visible,setVisible]=useState(true);
 useEffect(()=>{const io=new IntersectionObserver(e=>setVisible(e[0].isIntersecting&&!document.hidden),{rootMargin:'100px'});if(host.current)io.observe(host.current);const update=()=>{const r=host.current?.getBoundingClientRect();setVisible(!document.hidden&&!!r&&r.bottom>0&&r.top<innerHeight+100)};document.addEventListener('visibilitychange',update);return()=>{io.disconnect();document.removeEventListener('visibilitychange',update)}},[]);
 return <div ref={host} style={{width:'100%',height:'100%'}}><Canvas camera={{position:[6.8,2,7.1],fov:39}} dpr={[1,1.5]} frameloop={!visible?'never':props.paused?'demand':'always'} gl={{alpha:true,antialias:true,powerPreference:'default'}} onCreated={({gl})=>gl.domElement.addEventListener('webglcontextlost',props.onError)}><Chamber {...props}/></Canvas></div>;
}
