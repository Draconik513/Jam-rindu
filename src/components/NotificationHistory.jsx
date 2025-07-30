import { useState } from 'react';
import { users } from '../data/users';

export default function NotificationHistory({ notifications, onClose, onDelete, currentUser }) {
  const [selectedMessage, setSelectedMessage] = useState(null);
  
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
                &times;
              </button>
            </div>
            
            <div className={`p-4 rounded-lg ${
              selectedMessage.sender === currentUser 
                ? users[currentUser].bgColor 
                : users[currentUser === 'abi' ? 'tiwi' : 'abi'].bgColor
            }`}>
              <div className="flex items-center mb-3">
                <span className="bg-white bg-opacity-70 text-pink-600 px-3 py-1 rounded-lg mr-3 text-sm">
                  {new Date(selectedMessage.scheduledDate).toLocaleString()}
                </span>
              </div>

              <p className="font-medium mb-1">
                Dari: <span className={users[selectedMessage.sender].textColor}>
                  {users[selectedMessage.sender].name}
                </span>
              </p>
              
              {selectedMessage.message && (
                <div className="bg-white bg-opacity-70 p-3 rounded-lg mb-3">
                  <p className="whitespace-pre-line">{selectedMessage.message}</p>
                </div>
              )}

              {selectedMessage.media && (
                <div className="mt-3">
                  {selectedMessage.mediaType === 'image' ? (
                    <img 
                      src={selectedMessage.media} 
                      alt="Media pesan" 
                      className="max-h-60 w-full rounded-lg object-contain"
                    />
                  ) : (
                    <video 
                      src={selectedMessage.media} 
                      controls 
                      className="max-h-60 w-full rounded-lg"
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
              <h2 className="text-2xl font-bold text-pink-600">Riwayat Pesan Rahasia</h2>
              <button 
                onClick={onClose}
                className="text-pink-600 hover:text-pink-800 text-2xl"
              >
                &times;
              </button>
            </div>
            
            {notifications.length === 0 ? (
              <div className="text-center py-6">
                <p className="text-gray-500">Belum ada pesan rahasia</p>
              </div>
            ) : (
              <ul className="space-y-3">
                {notifications.map(notification => (
                  <li 
                    key={notification.id} 
                    className="border-b border-pink-100 pb-3 last:border-0 hover:bg-pink-50 rounded-lg p-2 transition-colors cursor-pointer"
                    onClick={() => handleViewDetails(notification)}
                  >
                    <div className="flex items-start">
                      <div className="bg-pink-100 text-pink-600 px-3 py-1 rounded-lg mr-3 text-sm flex-shrink-0">
                        {new Date(notification.scheduledDate).toLocaleTimeString([], { 
                          hour: '2-digit', 
                          minute: '2-digit' 
                        })}
                      </div>
                      <div className="flex-1">
                        <div className="flex justify-between items-start">
                          <div>
                            <p className="font-medium">
                              Dari: <span className={users[notification.sender].textColor}>
                                {users[notification.sender].name}
                              </span>
                            </p>
                            {notification.message && (
                              <p className="text-sm text-gray-600 truncate">
                                {notification.message}
                              </p>
                            )}
                            {notification.media && (
                              <span className="text-xs bg-pink-50 text-pink-600 px-2 py-0.5 rounded-full mt-1 inline-block">
                                {notification.mediaType === 'image' ? '📸 Foto' : '🎥 Video'}
                              </span>
                            )}
                          </div>
                        </div>
                        <p className="text-xs text-gray-500 mt-1">
                          {new Date(notification.createdAt).toLocaleDateString()}
                        </p>
                      </div>
                    </div>
                  </li>
                ))}
              </ul>
            )}
          </>
        )}
      </div>
    </div>
  );
}
