/**
 * CursorEffects - Interactive cursor trail and glow effects
 * Inspired by Because Recollection's immersive mouse interactions
 */

import { useEffect, useRef } from 'react'

const CursorEffects = () => {
  const cursorRef = useRef(null)
  const cursorDotRef = useRef(null)
  const trailsRef = useRef([])
  const mouseRef = useRef({ x: 0, y: 0 })

  useEffect(() => {
    const cursor = cursorRef.current
    const cursorDot = cursorDotRef.current
    if (!cursor || !cursorDot) return

    // Trail elements
    const trailCount = 8
    const trails = []
    const trailContainer = document.createElement('div')
    trailContainer.className = 'cursor-trail-container'
    trailContainer.style.cssText = `
      position: fixed;
      top: 0;
      left: 0;
      width: 100%;
      height: 100%;
      pointer-events: none;
      z-index: 9997;
    `
    document.body.appendChild(trailContainer)

    for (let i = 0; i < trailCount; i++) {
      const trail = document.createElement('div')
      trail.style.cssText = `
        position: fixed;
        width: ${20 - i * 2}px;
        height: ${20 - i * 2}px;
        border-radius: 50%;
        background: radial-gradient(circle, 
          hsla(${200 + i * 10}, 100%, 60%, ${0.3 - i * 0.03}) 0%, 
          transparent 70%);
        pointer-events: none;
        transform: translate(-50%, -50%);
        transition: transform ${0.05 + i * 0.02}s ease-out;
      `
      trailContainer.appendChild(trail)
      trails.push({ el: trail, x: 0, y: 0 })
    }
    trailsRef.current = trails

    let isHoveringInteractive = false

    const handleMouseMove = (e) => {
      mouseRef.current = { x: e.clientX, y: e.clientY }
      
      // Update main cursor
      cursor.style.transform = `translate(${e.clientX}px, ${e.clientY}px)`
      cursorDot.style.transform = `translate(${e.clientX}px, ${e.clientY}px)`
      
      // Update trails with delay
      trails.forEach((trail, i) => {
        setTimeout(() => {
          trail.el.style.transform = `translate(${e.clientX}px, ${e.clientY}px)`
        }, i * 30)
      })
    }

    const handleMouseDown = () => {
      cursor.style.transform = `translate(${mouseRef.current.x}px, ${mouseRef.current.y}px) scale(0.8)`
      cursorDot.classList.add('cursor-dot-active')
    }

    const handleMouseUp = () => {
      cursor.style.transform = `translate(${mouseRef.current.x}px, ${mouseRef.current.y}px) scale(1)`
      cursorDot.classList.remove('cursor-dot-active')
    }

    const handleMouseEnterInteractive = () => {
      isHoveringInteractive = true
      cursor.classList.add('cursor-hover')
      cursorDot.classList.add('cursor-dot-hover')
    }

    const handleMouseLeaveInteractive = () => {
      isHoveringInteractive = false
      cursor.classList.remove('cursor-hover')
      cursorDot.classList.remove('cursor-dot-hover')
    }

    // Add listeners for interactive elements
    const addInteractiveListeners = () => {
      const interactiveElements = document.querySelectorAll('button, a, input, [role="button"], .interactive')
      interactiveElements.forEach(el => {
        el.addEventListener('mouseenter', handleMouseEnterInteractive)
        el.addEventListener('mouseleave', handleMouseLeaveInteractive)
      })
    }

    window.addEventListener('mousemove', handleMouseMove)
    window.addEventListener('mousedown', handleMouseDown)
    window.addEventListener('mouseup', handleMouseUp)
    
    // Initial setup and mutation observer for dynamic elements
    addInteractiveListeners()
    const observer = new MutationObserver(addInteractiveListeners)
    observer.observe(document.body, { childList: true, subtree: true })

    return () => {
      window.removeEventListener('mousemove', handleMouseMove)
      window.removeEventListener('mousedown', handleMouseDown)
      window.removeEventListener('mouseup', handleMouseUp)
      observer.disconnect()
      trailContainer.remove()
    }
  }, [])

  return (
    <>
      <style>{`
        .cursor-glow {
          position: fixed;
          width: 40px;
          height: 40px;
          border-radius: 50%;
          pointer-events: none;
          z-index: 9999;
          transform: translate(-50%, -50%);
          transition: transform 0.1s ease-out, width 0.3s, height 0.3s, opacity 0.3s;
          background: radial-gradient(circle, 
            rgba(14, 165, 233, 0.2) 0%, 
            rgba(124, 58, 237, 0.1) 50%, 
            transparent 70%);
          mix-blend-mode: screen;
        }
        
        .cursor-glow.cursor-hover {
          width: 60px;
          height: 60px;
          background: radial-gradient(circle, 
            rgba(14, 165, 233, 0.3) 0%, 
            rgba(124, 58, 237, 0.2) 50%, 
            transparent 70%);
        }
        
        .cursor-dot {
          position: fixed;
          width: 8px;
          height: 8px;
          border-radius: 50%;
          pointer-events: none;
          z-index: 10000;
          transform: translate(-50%, -50%);
          background: linear-gradient(135deg, #0ea5e9 0%, #7c3aed 100%);
          box-shadow: 0 0 10px rgba(14, 165, 233, 0.5), 0 0 20px rgba(124, 58, 237, 0.3);
          transition: transform 0.05s ease-out, width 0.2s, height 0.2s;
        }
        
        .cursor-dot.cursor-dot-hover {
          width: 12px;
          height: 12px;
        }
        
        .cursor-dot.cursor-dot-active {
          width: 6px;
          height: 6px;
          box-shadow: 0 0 20px rgba(14, 165, 233, 0.8), 0 0 40px rgba(124, 58, 237, 0.5);
        }
        
        @media (max-width: 768px) {
          .cursor-glow, .cursor-dot, .cursor-trail-container {
            display: none !important;
          }
        }
      `}</style>
      <div ref={cursorRef} className="cursor-glow" />
      <div ref={cursorDotRef} className="cursor-dot" />
    </>
  )
}

export default CursorEffects
