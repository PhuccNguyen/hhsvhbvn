'use client'

import { useEffect, useRef } from 'react'
import styles from './BackgroundEffects.module.css'

const BackgroundEffects = () => {
  const canvasRef = useRef<HTMLCanvasElement>(null)

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return

    const ctx = canvas.getContext('2d')
    if (!ctx) return

    let animationFrameId: number
    let particles: Particle[] = []

    // Particle class
    class Particle {
      x: number
      y: number
      size: number
      speedX: number
      speedY: number
      opacity: number
      color: string
      pulsePhase: number

      constructor() {
        this.x = Math.random() * canvas!.width
        this.y = Math.random() * canvas!.height
        this.size = Math.random() * 3 + 1
        this.speedX = (Math.random() - 0.5) * 0.5
        this.speedY = (Math.random() - 0.5) * 0.5
        this.opacity = Math.random() * 0.8 + 0.2
        this.color = Math.random() > 0.5 ? 'rgba(244, 114, 182, ' : 'rgba(139, 92, 246, '
        this.pulsePhase = Math.random() * Math.PI * 2
      }

      update() {
        this.x += this.speedX
        this.y += this.speedY
        this.pulsePhase += 0.02

        // Wrap around edges
        if (this.x > canvas!.width) this.x = 0
        if (this.x < 0) this.x = canvas!.width
        if (this.y > canvas!.height) this.y = 0
        if (this.y < 0) this.y = canvas!.height

        // Pulse effect
        this.opacity = (Math.sin(this.pulsePhase) * 0.3 + 0.7) * 0.6
      }

      draw() {
        ctx!.save()
        ctx!.globalAlpha = this.opacity
        ctx!.fillStyle = this.color + this.opacity + ')'
        ctx!.beginPath()
        ctx!.arc(this.x, this.y, this.size, 0, Math.PI * 2)
        ctx!.fill()

        // Glow effect
        ctx!.shadowBlur = 15
        ctx!.shadowColor = this.color + '0.8)'
        ctx!.fill()
        ctx!.restore()
      }
    }

    const resize = () => {
      canvas.width = window.innerWidth
      canvas.height = window.innerHeight
    }

    const init = () => {
      particles = []
      const particleCount = Math.min(100, Math.floor((canvas.width * canvas.height) / 15000))
      
      for (let i = 0; i < particleCount; i++) {
        particles.push(new Particle())
      }
    }

    const animate = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height)

      // Draw connections between nearby particles
      particles.forEach((particle, i) => {
        particles.slice(i + 1).forEach(otherParticle => {
          const dx = particle.x - otherParticle.x
          const dy = particle.y - otherParticle.y
          const distance = Math.sqrt(dx * dx + dy * dy)

          if (distance < 150) {
            ctx.save()
            ctx.globalAlpha = (1 - distance / 150) * 0.1
            ctx.strokeStyle = 'rgba(244, 114, 182, 0.3)'
            ctx.lineWidth = 1
            ctx.beginPath()
            ctx.moveTo(particle.x, particle.y)
            ctx.lineTo(otherParticle.x, otherParticle.y)
            ctx.stroke()
            ctx.restore()
          }
        })

        particle.update()
        particle.draw()
      })

      animationFrameId = requestAnimationFrame(animate)
    }

    resize()
    init()
    animate()

    const handleResize = () => {
      resize()
      init()
    }

    window.addEventListener('resize', handleResize)

    return () => {
      window.removeEventListener('resize', handleResize)
      cancelAnimationFrame(animationFrameId)
    }
  }, [])

  return (
    <div className={styles.backgroundContainer}>
      <canvas
        ref={canvasRef}
        className={styles.particleCanvas}
      />
      
      {/* Gradient Overlays */}
      <div className={styles.gradientOverlay1} />
      <div className={styles.gradientOverlay2} />
      <div className={styles.gradientOverlay3} />
      
      {/* Floating Elements */}
      <div className={styles.floatingElements}>
        {Array.from({ length: 8 }, (_, i) => (
          <div
            key={i}
            className={`${styles.floatingElement} ${styles[`float${(i % 4) + 1}`]}`}
          />
        ))}
      </div>
    </div>
  )
}

export default BackgroundEffects
