/**
 * ImmersiveBackground - Because Recollection inspired interactive canvas
 * Features: Particle systems, mouse interaction, wave effects, aurora gradients
 */

import { useEffect, useRef, useCallback } from 'react'

const ImmersiveBackground = () => {
  const canvasRef = useRef(null)
  const animationRef = useRef(null)
  const mouseRef = useRef({ x: 0, y: 0, pressed: false })
  const particlesRef = useRef([])
  const waveParticlesRef = useRef([])
  const timeRef = useRef(0)

  // Initialize particles
  const initParticles = useCallback((width, height) => {
    const particles = []
    const count = Math.min(150, Math.floor((width * height) / 15000))
    
    for (let i = 0; i < count; i++) {
      particles.push({
        x: Math.random() * width,
        y: Math.random() * height,
        vx: (Math.random() - 0.5) * 0.5,
        vy: (Math.random() - 0.5) * 0.5,
        radius: Math.random() * 2 + 1,
        opacity: Math.random() * 0.5 + 0.2,
        hue: Math.random() * 60 + 200, // Blue to purple range
        pulseSpeed: Math.random() * 0.02 + 0.01,
        pulseOffset: Math.random() * Math.PI * 2
      })
    }
    
    // Wave particles (horizontal lines)
    const waveParticles = []
    for (let i = 0; i < 5; i++) {
      waveParticles.push({
        y: height * (0.2 + i * 0.15),
        amplitude: 30 + Math.random() * 20,
        frequency: 0.003 + Math.random() * 0.002,
        speed: 0.5 + Math.random() * 0.5,
        opacity: 0.1 + Math.random() * 0.1,
        offset: Math.random() * 100
      })
    }
    
    particlesRef.current = particles
    waveParticlesRef.current = waveParticles
  }, [])

  // Draw aurora gradient
  const drawAurora = useCallback((ctx, width, height, time) => {
    const gradient = ctx.createLinearGradient(0, 0, width, height)
    
    // Animated color stops
    const shift = Math.sin(time * 0.0005) * 0.1
    
    gradient.addColorStop(0, `hsla(${220 + shift * 30}, 80%, 8%, 1)`)
    gradient.addColorStop(0.3, `hsla(${250 + shift * 20}, 70%, 12%, 0.8)`)
    gradient.addColorStop(0.6, `hsla(${280 + shift * 25}, 60%, 10%, 0.6)`)
    gradient.addColorStop(1, `hsla(${200 + shift * 15}, 80%, 6%, 1)`)
    
    ctx.fillStyle = gradient
    ctx.fillRect(0, 0, width, height)
    
    // Aurora glow spots
    const glowCount = 3
    for (let i = 0; i < glowCount; i++) {
      const x = width * (0.2 + i * 0.3) + Math.sin(time * 0.001 + i) * 50
      const y = height * 0.3 + Math.cos(time * 0.0008 + i * 2) * 100
      const radius = 200 + Math.sin(time * 0.002 + i) * 50
      
      const glow = ctx.createRadialGradient(x, y, 0, x, y, radius)
      glow.addColorStop(0, `hsla(${220 + i * 40}, 100%, 60%, 0.15)`)
      glow.addColorStop(0.5, `hsla(${240 + i * 30}, 80%, 40%, 0.05)`)
      glow.addColorStop(1, 'transparent')
      
      ctx.fillStyle = glow
      ctx.fillRect(0, 0, width, height)
    }
  }, [])

  // Draw wave lines
  const drawWaves = useCallback((ctx, width, height, time) => {
    waveParticlesRef.current.forEach(wave => {
      ctx.beginPath()
      ctx.strokeStyle = `rgba(14, 165, 233, ${wave.opacity})`
      ctx.lineWidth = 1
      
      for (let x = 0; x < width; x += 5) {
        const y = wave.y + 
          Math.sin((x + time * wave.speed + wave.offset) * wave.frequency) * wave.amplitude +
          Math.sin((x + time * wave.speed * 0.5) * wave.frequency * 2) * (wave.amplitude * 0.3)
        
        if (x === 0) {
          ctx.moveTo(x, y)
        } else {
          ctx.lineTo(x, y)
        }
      }
      
      ctx.stroke()
    })
  }, [])

  // Draw particles with connections
  const drawParticles = useCallback((ctx, width, height, time) => {
    const mouse = mouseRef.current
    const particles = particlesRef.current
    
    particles.forEach((p, i) => {
      // Update position
      p.x += p.vx
      p.y += p.vy
      
      // Mouse attraction
      const dx = mouse.x - p.x
      const dy = mouse.y - p.y
      const dist = Math.sqrt(dx * dx + dy * dy)
      
      if (dist < 200) {
        const force = (200 - dist) / 200 * 0.02
        p.vx += dx * force * (mouse.pressed ? 3 : 1)
        p.vy += dy * force * (mouse.pressed ? 3 : 1)
      }
      
      // Damping
      p.vx *= 0.99
      p.vy *= 0.99
      
      // Bounds
      if (p.x < 0) p.x = width
      if (p.x > width) p.x = 0
      if (p.y < 0) p.y = height
      if (p.y > height) p.y = 0
      
      // Pulsing opacity
      const pulse = Math.sin(time * p.pulseSpeed + p.pulseOffset) * 0.3 + 0.7
      
      // Draw particle
      ctx.beginPath()
      ctx.arc(p.x, p.y, p.radius * pulse, 0, Math.PI * 2)
      ctx.fillStyle = `hsla(${p.hue}, 80%, 60%, ${p.opacity * pulse})`
      ctx.fill()
      
      // Draw connections to nearby particles
      for (let j = i + 1; j < particles.length; j++) {
        const p2 = particles[j]
        const dx2 = p.x - p2.x
        const dy2 = p.y - p2.y
        const dist2 = Math.sqrt(dx2 * dx2 + dy2 * dy2)
        
        if (dist2 < 100) {
          ctx.beginPath()
          ctx.moveTo(p.x, p.y)
          ctx.lineTo(p2.x, p2.y)
          ctx.strokeStyle = `hsla(${(p.hue + p2.hue) / 2}, 70%, 50%, ${(1 - dist2 / 100) * 0.15})`
          ctx.lineWidth = 0.5
          ctx.stroke()
        }
      }
    })
    
    // Mouse glow effect
    if (mouse.x && mouse.y) {
      const glowRadius = mouse.pressed ? 150 : 100
      const glow = ctx.createRadialGradient(
        mouse.x, mouse.y, 0,
        mouse.x, mouse.y, glowRadius
      )
      glow.addColorStop(0, `rgba(14, 165, 233, ${mouse.pressed ? 0.3 : 0.15})`)
      glow.addColorStop(0.5, `rgba(124, 58, 237, ${mouse.pressed ? 0.15 : 0.08})`)
      glow.addColorStop(1, 'transparent')
      
      ctx.fillStyle = glow
      ctx.fillRect(mouse.x - glowRadius, mouse.y - glowRadius, glowRadius * 2, glowRadius * 2)
    }
  }, [])

  // Draw grid overlay
  const drawGrid = useCallback((ctx, width, height, time) => {
    ctx.strokeStyle = 'rgba(255, 255, 255, 0.02)'
    ctx.lineWidth = 1
    
    const gridSize = 50
    const offset = (time * 0.02) % gridSize
    
    // Vertical lines
    for (let x = -offset; x < width + gridSize; x += gridSize) {
      ctx.beginPath()
      ctx.moveTo(x, 0)
      ctx.lineTo(x, height)
      ctx.stroke()
    }
    
    // Horizontal lines
    for (let y = -offset; y < height + gridSize; y += gridSize) {
      ctx.beginPath()
      ctx.moveTo(0, y)
      ctx.lineTo(width, y)
      ctx.stroke()
    }
  }, [])

  // Main animation loop
  const animate = useCallback(() => {
    const canvas = canvasRef.current
    if (!canvas) return
    
    const ctx = canvas.getContext('2d')
    const width = canvas.width
    const height = canvas.height
    
    timeRef.current += 16 // ~60fps
    const time = timeRef.current
    
    // Clear
    ctx.clearRect(0, 0, width, height)
    
    // Draw layers
    drawAurora(ctx, width, height, time)
    drawGrid(ctx, width, height, time)
    drawWaves(ctx, width, height, time)
    drawParticles(ctx, width, height, time)
    
    animationRef.current = requestAnimationFrame(animate)
  }, [drawAurora, drawGrid, drawWaves, drawParticles])

  // Setup canvas
  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return
    
    const handleResize = () => {
      canvas.width = window.innerWidth
      canvas.height = window.innerHeight
      initParticles(canvas.width, canvas.height)
    }
    
    const handleMouseMove = (e) => {
      mouseRef.current.x = e.clientX
      mouseRef.current.y = e.clientY
    }
    
    const handleMouseDown = () => {
      mouseRef.current.pressed = true
    }
    
    const handleMouseUp = () => {
      mouseRef.current.pressed = false
    }
    
    handleResize()
    
    window.addEventListener('resize', handleResize)
    window.addEventListener('mousemove', handleMouseMove)
    window.addEventListener('mousedown', handleMouseDown)
    window.addEventListener('mouseup', handleMouseUp)
    
    animate()
    
    return () => {
      window.removeEventListener('resize', handleResize)
      window.removeEventListener('mousemove', handleMouseMove)
      window.removeEventListener('mousedown', handleMouseDown)
      window.removeEventListener('mouseup', handleMouseUp)
      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current)
      }
    }
  }, [animate, initParticles])

  return (
    <canvas
      ref={canvasRef}
      style={{
        position: 'fixed',
        top: 0,
        left: 0,
        width: '100%',
        height: '100%',
        zIndex: -1,
        pointerEvents: 'none'
      }}
    />
  )
}

export default ImmersiveBackground
