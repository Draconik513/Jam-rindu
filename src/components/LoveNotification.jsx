import { useState, useEffect } from 'react';

export default function LoveNotification({ message, sender, media, mediaType, onClose }) {
  const [isVisible, setIsVisible] = useState(true);

  useEffect(() => {
    setIsVisible(true); // Ensure notification shows immediately
    
    const timer = setTimeout(() => {
      setIsVisible(false);
      setTimeout(onClose, 500);
    }, 10000);

    return () => clearTimeout(timer);
  }, [message, sender, media, onClose]); // Add dependencies to reset timer when new notification comes

  if (!isVisible) return null;

  return (
    <div className={`fixed bottom-4 right-4 z-50 animate-float`}>
      <div className="bg-pink-500 text-white px-6 py-4 rounded-lg shadow-xl max-w-xs transform transition-transform hover:scale-105">
        <div className="flex justify-between items-start">
          <div className="flex-1">
            <p className="font-bold">{sender}</p>
            <p className="mt-1">{message}</p>
            {media && (
              <div className="mt-3">
                {mediaType === 'image' ? (
                  <img 
                    src={media} 
                    alt="Pesan cinta" 
                    className="max-h-40 w-full rounded-lg object-cover"
                  />
                ) : (
                  <video 
                    src={media} 
                    controls 
                    className="max-h-40 w-full rounded-lg"
                  />
                )}
              </div>
            )}
          </div>
          <button 
            onClick={() => {
              setIsVisible(false);
              setTimeout(onClose, 500);
            }} 
            className="ml-2 text-white hover:text-pink-200 text-xl"
          >
            &times;
          </button>
        </div>
        
        <div className="flex justify-between items-center mt-2">
          <span className="text-xs opacity-80">
            {new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
          </span>
          <span className="text-xs opacity-80">
            {mediaType === 'image' ? '📸' : mediaType === 'video' ? '🎥' : '💌'}
          </span>
        </div>
      </div>
    </div>
  );
}
