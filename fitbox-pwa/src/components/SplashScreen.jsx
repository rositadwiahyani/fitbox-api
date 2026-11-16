import { useState, useEffect, useRef } from 'react'

// Splash sederhana: tampil sebentar, memudar, lalu masuk. Ketuk layar untuk lewati.
export default function SplashScreen({ onFinish, duration = 2200 }) {
    const [fading, setFading] = useState(false)
    const finish = useRef(onFinish)

    useEffect(() => {
        const a = setTimeout(() => setFading(true), duration)
        const b = setTimeout(() => finish.current(), duration + 500)
        return () => {
            clearTimeout(a)
            clearTimeout(b)
        }
    }, [duration])

    const skip = () => {
        setFading(true)
        setTimeout(() => finish.current(), 500)
    }

    return (
        <div
            onClick={skip}
            className={`fixed inset-0 z-[100] flex flex-col items-center justify-center bg-leaf text-paper transition-opacity duration-500 ${fading ? 'opacity-0' : 'opacity-100'}`}
        >
            <div className="fade-up text-8xl">🥗</div>
            <h1 className="fade-up mt-4 text-5xl">FitBox</h1>
            <p className="hand fade-up mt-2 text-xl text-sage">catering sehat, tanpa ribet</p>
            <p className="absolute bottom-10 text-sm text-paper/60">ketuk untuk masuk</p>
        </div>
    )
}