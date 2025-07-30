import { useState, useEffect } from 'react';

export default function LoveNotification({ message, sender, media, mediaType, onClose }) {
  const [isVisible, setIsVisible] = useState(true);
  const [isFadingOut, setIsFadingOut] = useState(false);

  useEffect(() => {
    setIsVisible(true);
    setIsFadingOut(false);

    const timer = setTimeout(() => {
      setIsFadingOut(true);
      setTimeout(() => {
        setIsVisible(false);
        onClose();
      }, 500); // Waktu untuk animasi keluar
    }, 10000); // Tampilkan selama 10 detik

    return () => clearTimeout(timer);
  }, [message, sender, media, onClose]);

  if (!isVisible) return null;

  const animationClass = isFadingOut ? 'opacity-0 transition-opacity duration-500' : 'opacity-100';

  return (
    <div className={`fixed bottom-4 right-4 z-50 ${animationClass}`}>
      <div className="bg-pink-500 text-white px-6 py-4 rounded-lg shadow-xl max-w-xs transform transition-transform hover:scale-105">
        <div className="flex justify-between items-start">
          <div className="flex-1">
            <p className="font-bold">{sender || 'Anonim'}</p>
            <p className="mt-1">{message || '💌 Tidak ada pesan'}</p>

            {media && (
              <div className="mt-3">
                {mediaType === 'image' ? (
                  <img
                    src={media}
                    alt="Pesan cinta"
                    className="max-h-40 w-full rounded-lg object-cover"
                    onError={(e) => (e.target.style.display = 'none')}
                  />
                ) : mediaType === 'video' ? (
                  <video
                    src={media}
                    controls
                    className="max-h-40 w-full rounded-lg"
                    onError={(e) => (e.target.style.display = 'none')}
                  />
                ) : null}
              </div>
            )}
          </div>

          <button
            onClick={() => {
              setIsFadingOut(true);
              setTimeout(() => {
                setIsVisible(false);
                onClose();
              }, 500);
            }}
            className="ml-2 text-white hover:text-pink-200 text-xl"
          >
            &times;
          </button>
        </div>

        <div className="flex justify-between items-center mt-2 text-xs opacity-80">
          <span>{new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</span>
          <span>
            {mediaType === 'image' ? '📸' : mediaType === 'video' ? '🎥' : '💌'}
          </span>
        </div>
      </div>
    </div>
  );
}
