import { useEffect, useRef } from 'react'

export default function Cursor() {
  const dot = useRef(null)
  const ring = useRef(null)
  const pos = useRef({ x: 0, y: 0 })
  const ringPos = useRef({ x: 0, y: 0 })
  const raf = useRef(null)

  useEffect(() => {
    const onMove = (e) => {
      pos.current = { x: e.clientX, y: e.clientY }
      if (dot.current) {
        dot.current.style.left = e.clientX + 'px'
        dot.current.style.top = e.clientY + 'px'
      }
    }

    const animate = () => {
      ringPos.current.x += (pos.current.x - ringPos.current.x) * 0.12
      ringPos.current.y += (pos.current.y - ringPos.current.y) * 0.12
      if (ring.current) {
        ring.current.style.left = ringPos.current.x + 'px'
        ring.current.style.top = ringPos.current.y + 'px'
      }
      raf.current = requestAnimationFrame(animate)
    }

    const onEnter = () => {
      dot.current?.classList.add('hovered')
      ring.current?.classList.add('hovered')
    }
    const onLeave = () => {
      dot.current?.classList.remove('hovered')
      ring.current?.classList.remove('hovered')
    }

    window.addEventListener('mousemove', onMove)
    document.querySelectorAll('a, button, [role="button"], input, textarea, select, label').forEach(el => {
      el.addEventListener('mouseenter', onEnter)
      el.addEventListener('mouseleave', onLeave)
    })
    raf.current = requestAnimationFrame(animate)

    return () => {
      window.removeEventListener('mousemove', onMove)
      cancelAnimationFrame(raf.current)
    }
  }, [])

  return (
    <>
      <div ref={dot} className="cursor-dot" />
      <div ref={ring} className="cursor-ring" />
    </>
  )
}
