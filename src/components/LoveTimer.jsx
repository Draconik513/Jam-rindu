import { useState, useEffect } from 'react'

export default function LoveTimer({ startDate }) {
  const [time, setTime] = useState({
    years: 0,
    days: 0,
    hours: 0,
    minutes: 0,
    seconds: 0
  })

  useEffect(() => {
    const timer = setInterval(() => {
      const now = new Date()
      const difference = now - startDate
      
      const years = Math.floor(difference / (1000 * 60 * 60 * 24 * 365))
      const days = Math.floor((difference % (1000 * 60 * 60 * 24 * 365)) / (1000 * 60 * 60 * 24))
      const hours = Math.floor((difference % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60))
      const minutes = Math.floor((difference % (1000 * 60 * 60)) / (1000 * 60))
      const seconds = Math.floor((difference % (1000 * 60)) / 1000)
      
      setTime({ years, days, hours, minutes, seconds })
    }, 1000)

    return () => clearInterval(timer)
  }, [startDate])

  return (
    <div className="bg-white p-8 rounded-xl shadow-lg w-full max-w-2xl">
      <div className="grid grid-cols-2 md:grid-cols-5 gap-4 text-center">
        <div className="p-4 bg-pink-100 rounded-lg">
          <div className="text-4xl font-bold text-pink-600">{time.years}</div>
          <div className="text-pink-500">Tahun</div>
        </div>
        <div className="p-4 bg-pink-100 rounded-lg">
          <div className="text-4xl font-bold text-pink-600">{time.days}</div>
          <div className="text-pink-500">Hari</div>
        </div>
        <div className="p-4 bg-pink-100 rounded-lg">
          <div className="text-4xl font-bold text-pink-600">{time.hours}</div>
          <div className="text-pink-500">Jam</div>
        </div>
        <div className="p-4 bg-pink-100 rounded-lg">
          <div className="text-4xl font-bold text-pink-600">{time.minutes}</div>
          <div className="text-pink-500">Menit</div>
        </div>
        <div className="p-4 bg-pink-100 rounded-lg">
          <div className="text-4xl font-bold text-pink-600">{time.seconds}</div>
          <div className="text-pink-500">Detik</div>
        </div>
      </div>
      
      <div className="mt-6 text-center italic text-pink-700">
        "Setiap detik bersamamu adalah anugerah"
      </div>
    </div>
  )
}