import { useRef, Suspense } from 'react'
import { Canvas, useFrame } from '@react-three/fiber'
import { OrbitControls, Environment, Float } from '@react-three/drei'

function DumbbellModel() {
  const groupRef = useRef()

  useFrame((state) => {
    if (groupRef.current) {
      groupRef.current.rotation.y = state.clock.elapsedTime * 0.4
      groupRef.current.rotation.x = Math.sin(state.clock.elapsedTime * 0.3) * 0.15
    }
  })

  const neonBlue = '#00d4ff'
  const neonPurple = '#8b5cf6'
  const metalDark = '#1a1a2e'
  const metalMid = '#2a2a4a'

  return (
    <group ref={groupRef}>
      {/* Center bar */}
      <mesh position={[0, 0, 0]}>
        <cylinderGeometry args={[0.08, 0.08, 3.5, 16]} />
        <meshStandardMaterial color={metalMid} metalness={0.9} roughness={0.2} />
      </mesh>

      {/* Left plate group */}
      <group position={[-1.6, 0, 0]}>
        <mesh rotation={[0, 0, Math.PI / 2]}>
          <cylinderGeometry args={[0.7, 0.7, 0.3, 32]} />
          <meshStandardMaterial color={metalDark} metalness={0.95} roughness={0.1} />
        </mesh>
        <mesh rotation={[0, 0, Math.PI / 2]}>
          <cylinderGeometry args={[0.55, 0.55, 0.45, 32]} />
          <meshStandardMaterial color={neonBlue} metalness={0.7} roughness={0.2} emissive={neonBlue} emissiveIntensity={0.3} />
        </mesh>
        <mesh rotation={[0, 0, Math.PI / 2]} position={[-0.3, 0, 0]}>
          <cylinderGeometry args={[0.4, 0.4, 0.25, 32]} />
          <meshStandardMaterial color={metalDark} metalness={0.95} roughness={0.1} />
        </mesh>
      </group>

      {/* Right plate group */}
      <group position={[1.6, 0, 0]}>
        <mesh rotation={[0, 0, Math.PI / 2]}>
          <cylinderGeometry args={[0.7, 0.7, 0.3, 32]} />
          <meshStandardMaterial color={metalDark} metalness={0.95} roughness={0.1} />
        </mesh>
        <mesh rotation={[0, 0, Math.PI / 2]}>
          <cylinderGeometry args={[0.55, 0.55, 0.45, 32]} />
          <meshStandardMaterial color={neonPurple} metalness={0.7} roughness={0.2} emissive={neonPurple} emissiveIntensity={0.3} />
        </mesh>
        <mesh rotation={[0, 0, Math.PI / 2]} position={[0.3, 0, 0]}>
          <cylinderGeometry args={[0.4, 0.4, 0.25, 32]} />
          <meshStandardMaterial color={metalDark} metalness={0.95} roughness={0.1} />
        </mesh>
      </group>

      {/* Handle grips */}
      {[-0.8, -0.3, 0.3, 0.8].map((x, i) => (
        <mesh key={i} position={[x, 0, 0]}>
          <cylinderGeometry args={[0.1, 0.1, 0.35, 12]} />
          <meshStandardMaterial color={i % 2 === 0 ? '#111' : '#222'} metalness={0.5} roughness={0.8} />
        </mesh>
      ))}

      {/* Glow lights */}
      <pointLight position={[-2, 0, 0]} color={neonBlue} intensity={3} distance={4} />
      <pointLight position={[2, 0, 0]} color={neonPurple} intensity={3} distance={4} />
      <pointLight position={[0, 2, 0]} color={neonBlue} intensity={1} distance={5} />
    </group>
  )
}

function Particles() {
  const count = 60
  const positions = Array.from({ length: count }, () => [
    (Math.random() - 0.5) * 10,
    (Math.random() - 0.5) * 10,
    (Math.random() - 0.5) * 5,
  ])

  return positions.map((pos, i) => (
    <mesh key={i} position={pos}>
      <sphereGeometry args={[0.02, 4, 4]} />
      <meshBasicMaterial color={i % 2 === 0 ? '#00d4ff' : '#8b5cf6'} />
    </mesh>
  ))
}

export default function DumbbellCanvas() {
  return (
    <div className="w-full h-full">
      <Canvas
        camera={{ position: [0, 0, 6], fov: 45 }}
        gl={{ antialias: true, alpha: true }}
        style={{ background: 'transparent' }}
      >
        <Suspense fallback={null}>
          <ambientLight intensity={0.3} />
          <directionalLight position={[5, 5, 5]} intensity={1.5} color="#ffffff" />
          <directionalLight position={[-5, -5, -5]} intensity={0.5} color="#00d4ff" />
          
          <Float speed={2} rotationIntensity={0.3} floatIntensity={0.8}>
            <DumbbellModel />
          </Float>
          
          <Particles />
          
          <Environment preset="night" />
        </Suspense>
        <OrbitControls
          enableZoom={false}
          enablePan={false}
          maxPolarAngle={Math.PI / 1.5}
          minPolarAngle={Math.PI / 3}
          autoRotate={false}
        />
      </Canvas>
    </div>
  )
}
