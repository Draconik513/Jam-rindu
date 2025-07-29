import { useState } from 'react';

export default function NotificationHistory({ notifications, onClose, onDelete }) {
const [selectedMessage, setSelectedMessage] = useState(null);
const visibleNotifications = notifications.filter(notif => !notif.isHidden);

const handleDelete = (id, e) => {
e.stopPropagation();
if (window.confirm('Yakin ingin menghapus pesan ini?')) {
onDelete(id);
}
};

const handleViewDetails = (message) => {
setSelectedMessage(message);
};

return (
<div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
<div className="bg-white p-6 rounded-xl shadow-xl max-w-md w-full max-h-[80vh] overflow-y-auto">
{selectedMessage ? (
<div className="space-y-4">
<div className="flex justify-between items-center mb-2">
<h2 className="text-xl font-bold text-pink-600">Detail Pesan</h2>
<button
onClick={() => setSelectedMessage(null)}
className="text-pink-600 hover:text-pink-800 text-2xl"
>
</button>
</div> <div className="bg-pink-50 p-4 rounded-lg">
          <div className="flex items-center mb-3">
            <span className="bg-pink-100 text-pink-600 px-3 py-1 rounded-lg mr-3 text-sm">
              {selectedMessage.scheduledTime}
            </span>
            <span className="text-sm text-gray-500">
              {new Date(selectedMessage.createdAt).toLocaleString()}
            </span>
          </div>

          <p className="font-medium mb-1">Dari: {selectedMessage.senderName}</p>
          
          {selectedMessage.message && (
            <div className="bg-white p-3 rounded-lg mb-3">
              <p className="whitespace-pre-line">{selectedMessage.message}</p>
            </div>
          )}

          {selectedMessage.media && (
            <div className="mt-3">
              {selectedMessage.mediaType === 'image' ? (
                <img 
                  src={selectedMessage.media} 
                  alt="Pesan cinta" 
                  className="w-full rounded-lg max-h-60 object-contain"
                />
              ) : (
                <video 
                  src={selectedMessage.media} 
                  controls 
                  className="w-full rounded-lg max-h-60"
                />
              )}
            </div>
          )}
        </div>

        <div className="flex justify-between pt-2">
          <button
            onClick={() => setSelectedMessage(null)}
            className="bg-pink-100 text-pink-600 px-4 py-2 rounded-lg hover:bg-pink-200 transition"
          >
            Kembali
          </button>
          <button
            onClick={(e) => {
              handleDelete(selectedMessage.id, e);
              setSelectedMessage(null);
            }}
            className="bg-red-100 text-red-600 px-4 py-2 rounded-lg hover:bg-red-200 transition"
          >
            Hapus Pesan
          </button>
        </div>
      </div>
    ) : (
      <>
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-2xl font-bold text-pink-600">Riwayat Pesan</h2>
          <button 
            onClick={onClose}
            className="text-pink-600 hover:text-pink-800 text-2xl"
          >
            &times;
          </button>
        </div>
        
        {visibleNotifications.length === 0 ? (
          <div className="text-center py-6">
            <p className="text-gray-500">Belum ada pesan yang ditampilkan</p>
          </div>
        ) : (
          <ul className="space-y-3">
            {visibleNotifications.map(notification => (
              <li 
                key={notification.id} 
                className="border-b border-pink-100 pb-3 last:border-0 hover:bg-pink-50 rounded-lg p-2 transition-colors cursor-pointer"
                onClick={() => handleViewDetails(notification)}
              >
                <div className="flex items-start">
                  <div className="bg-pink-100 text-pink-600 px-3 py-1 rounded-lg mr-3 text-sm flex-shrink-0">
                    {notification.scheduledTime}
                  </div>
                  <div className="flex-1">
                    <div className="flex justify-between items-start">
                      <div>
                        <p className="font-medium">Dari: {notification.senderName}</p>
                        {notification.message && (
                          <p className="text-sm text-gray-600 truncate">
                            {notification.message}
                          </p>
                        )}
                      </div>
                      {notification.media && (
                        <span className="text-pink-500 ml-2">
                          {notification.mediaType === 'image' ? '📸' : '🎥'}
                        </span>
                      )}
                    </div>
                    <p className="text-xs text-gray-500 mt-1">
                      {new Date(notification.createdAt).toLocaleString()}
                    </p>
                  </div>
                </div>
              </li>
            ))}
          </ul>
        )}

        <div className="mt-4 text-center text-sm text-pink-600">
          <p>Klik pesan untuk melihat detail</p>
        </div>
      </>
    )}
  </div>
</div>
);
}