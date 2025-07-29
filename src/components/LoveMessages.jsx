import { useState, useEffect } from 'react'

export default function LoveMessages() {
  const messages = [
    "Aku mencintaimu lebih dari kata-kata bisa ungkapkan",
    "Kamu adalah alasan aku tersenyum setiap hari",
    "Bersamamu adalah tempat favoritku di dunia ini",
    "Cintaku padamu tumbuh lebih kuat setiap hari",
    "Kamu membuat hidupku lebih indah dengan caramu sendiri",
    "Aku bersyukur memiliki seseorang seperti kamu dalam hidupku",
    "Tidak ada yang lebih aku rindukan selain pelukanmu",
    "Kamu adalah mimpi yang menjadi kenyataan",
    "Setiap momen bersamamu terasa seperti mimpi",
    "Aku jatuh cinta padamu setiap hari sedikit lebih banyak"
  ]

  const [currentMessage, setCurrentMessage] = useState(messages[0])
  const [fade, setFade] = useState(true)

  useEffect(() => {
    const interval = setInterval(() => {
      setFade(false)
      setTimeout(() => {
        const randomIndex = Math.floor(Math.random() * messages.length)
        setCurrentMessage(messages[randomIndex])
        setFade(true)
      }, 500)
    }, 8000) // Ganti pesan setiap 8 detik

    return () => clearInterval(interval)
  }, [])

  return (
    <div className={`transition-opacity duration-500 ${fade ? 'opacity-100' : 'opacity-0'}`}>
      <div className="bg-white p-6 rounded-xl shadow-md text-center mt-6">
        <div className="text-2xl text-pink-600 mb-2">❤️</div>
        <p className="text-lg font-serif italic text-pink-800">{currentMessage}</p>
      </div>
    </div>
  )
}