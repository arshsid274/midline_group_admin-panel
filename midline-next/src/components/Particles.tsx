'use client'

import { useEffect, useRef } from 'react'

export default function Particles() {
  const canvasRef = useRef<HTMLCanvasElement>(null)

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return
    const ctx = canvas.getContext('2d')
    if (!ctx) return

    let width = 0
    let height = 0
    const colors = ['rgba(47,184,238,', 'rgba(80,207,254,', 'rgba(10,99,168,', 'rgba(168,228,249,']

    const resize = () => {
      width = canvas.width = window.innerWidth
      height = canvas.height = window.innerHeight
    }

    class Particle {
      x = 0; y = 0; vx = 0; vy = 0; r = 0
      color = ''; alpha = 0; life = 0; maxLife = 0; currentAlpha = 0

      constructor() { this.reset(); this.life = Math.random() * this.maxLife }

      reset() {
        this.x = Math.random() * width
        this.y = Math.random() * height
        this.vx = (Math.random() - 0.5) * 0.4
        this.vy = (Math.random() - 0.5) * 0.4
        this.r = Math.random() * 2 + 0.5
        this.color = colors[Math.floor(Math.random() * colors.length)]
        this.alpha = Math.random() * 0.28 + 0.04
        this.life = 0
        this.maxLife = Math.random() * 300 + 200
      }

      update() {
        this.x += this.vx
        this.y += this.vy
        this.life += 1
        if (this.life > this.maxLife) this.reset()
        if (this.x < 0 || this.x > width) this.vx *= -1
        if (this.y < 0 || this.y > height) this.vy *= -1
        this.currentAlpha = this.alpha * Math.sin((this.life / this.maxLife) * Math.PI)
      }

      draw() {
        ctx!.beginPath()
        ctx!.arc(this.x, this.y, this.r, 0, Math.PI * 2)
        ctx!.fillStyle = `${this.color}${this.currentAlpha})`
        ctx!.fill()
      }
    }

    resize()
    window.addEventListener('resize', resize)
    const particles = Array.from({ length: 60 }, () => new Particle())

    let rafId: number
    const animate = () => {
      ctx.clearRect(0, 0, width, height)
      particles.forEach((p) => { p.update(); p.draw() })
      rafId = requestAnimationFrame(animate)
    }
    animate()

    return () => {
      window.removeEventListener('resize', resize)
      cancelAnimationFrame(rafId)
    }
  }, [])

  return <canvas ref={canvasRef} id="particles" />
}
