import { useEffect, useRef } from 'react'

export function Particles({
  className = '',
  quantity = 30,
  staticity = 50,
  ease = 50,
  refresh = false,
}) {
  const canvasRef = useRef(null)
  const canvasContainerRef = useRef(null)
  const context = useRef(null)
  const circles = useRef([])
  const mouse = useRef({ x: 0, y: 0 })
  const canvasSize = useRef({ w: 0, h: 0 })
  const dpr = typeof window !== 'undefined' ? window.devicePixelRatio : 1

  useEffect(() => {
    if (canvasRef.current) {
      context.current = canvasRef.current.getContext('2d')
    }
    initCanvas()
    animate()
    window.addEventListener('resize', initCanvas)

    return () => {
      window.removeEventListener('resize', initCanvas)
    }
  }, [])

  useEffect(() => {
    initCanvas()
  }, [refresh])

  const initCanvas = () => {
    resizeCanvas()
    drawParticles()
  }

  const resizeCanvas = () => {
    if (canvasContainerRef.current && canvasRef.current && context.current) {
      circles.current = []
      canvasSize.current.w = canvasContainerRef.current.offsetWidth
      canvasSize.current.h = canvasContainerRef.current.offsetHeight
      canvasRef.current.width = canvasSize.current.w * dpr
      canvasRef.current.height = canvasSize.current.h * dpr
      canvasRef.current.style.width = `${canvasSize.current.w}px`
      canvasRef.current.style.height = `${canvasSize.current.h}px`
      context.current.scale(dpr, dpr)
    }
  }

  const circleParams = () => {
    const x = Math.floor(Math.random() * canvasSize.current.w)
    const y = Math.floor(Math.random() * canvasSize.current.h)
    const size = Math.floor(Math.random() * 2) + 1
    const alpha = Math.random() * 0.3 + 0.1
    const color = `rgba(80, 250, 123, ${alpha})`

    return {
      x,
      y,
      dx: (Math.random() - 0.5) * 0.2,
      dy: (Math.random() - 0.5) * 0.2,
      size,
      color,
      alpha,
    }
  }

  const drawParticles = () => {
    circles.current = []
    if (context.current) {
      for (let i = 0; i < quantity; i++) {
        circles.current.push(circleParams())
      }
    }
  }

  const remapValue = (value, start1, end1, start2, end2) => {
    const remapped = ((value - start1) * (end2 - start2)) / (end1 - start1) + start2
    return remapped > 0 ? remapped : 0
  }

  const animate = () => {
    if (context.current) {
      context.current.clearRect(0, 0, canvasSize.current.w, canvasSize.current.h)
      circles.current.forEach((circle, i) => {
        // Handle movement
        circle.x += circle.dx
        circle.y += circle.dy

        // Handle edge cases
        if (circle.x < 0 || circle.x > canvasSize.current.w) {
          circle.dx *= -1
        }
        if (circle.y < 0 || circle.y > canvasSize.current.h) {
          circle.dy *= -1
        }

        // Mouse interaction
        const distanceToMouse = Math.sqrt(
          Math.pow(circle.x - mouse.current.x, 2) + Math.pow(circle.y - mouse.current.y, 2),
        )
        if (distanceToMouse < 100) {
          const angle = Math.atan2(circle.y - mouse.current.y, circle.x - mouse.current.x)
          const force = remapValue(distanceToMouse, 0, 100, staticity, 0)
          circle.dx += Math.cos(angle) * force
          circle.dy += Math.sin(angle) * force
        }

        // Draw the circle
        context.current.beginPath()
        context.current.arc(circle.x, circle.y, circle.size, 0, 2 * Math.PI)
        context.current.fillStyle = circle.color
        context.current.fill()
      })
    }

    window.requestAnimationFrame(animate)
  }

  return (
    <div className={className} ref={canvasContainerRef} aria-hidden="true">
      <canvas ref={canvasRef} />
    </div>
  )
} 