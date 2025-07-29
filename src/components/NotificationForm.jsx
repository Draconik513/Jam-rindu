import { useState } from 'react';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';

export default function NotificationForm({ onAddNotification, onClose, currentUser }) {
  const [message, setMessage] = useState('');
  const [scheduledDateTime, setScheduledDateTime] = useState(() => {
    const now = new Date();
    now.setMinutes(now.getMinutes() + 5);
    return now;
  });
  const [media, setMedia] = useState(null);
  const [mediaType, setMediaType] = useState(null);
  const [isHidden, setIsHidden] = useState(true);
  const [isOneTime, setIsOneTime] = useState(true);
  const [error, setError] = useState('');

  const handleMediaChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      if (file.size > 5 * 1024 * 1024) {
        setError('File maksimal 5MB');
        return;
      }
      setMedia(file);
      setMediaType(file.type.startsWith('image') ? 'image' : 'video');
      setError('');
    }
  };

  const handleRemoveMedia = () => {
    setMedia(null);
    setMediaType(null);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    
    if (!message.trim() && !media) {
      setError('Pesan atau media harus diisi');
      return;
    }
    
    if (scheduledDateTime < new Date()) {
      setError('Waktu tidak boleh di masa lalu');
      return;
    }
    
    const notificationData = {
      message: message.trim(),
      scheduledDate: scheduledDateTime.toISOString(),
      media: null,
      mediaType,
      isHidden,
      isOneTime: isHidden ? isOneTime : false,
      createdAt: new Date().toISOString()
    };

    if (media) {
      const reader = new FileReader();
      reader.readAsDataURL(media);
      reader.onloadend = () => {
        onAddNotification({
          ...notificationData,
          media: reader.result
        });
      };
    } else {
      onAddNotification(notificationData);
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white p-6 rounded-xl shadow-xl max-w-md w-full max-h-[90vh] overflow-y-auto">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-2xl font-bold text-pink-600">Pesan Rahasia Baru</h2>
          <button onClick={onClose} className="text-pink-600 hover:text-pink-800 text-2xl">
            &times;
          </button>
        </div>
        
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-pink-700 mb-1">Pesan (opsional)</label>
            <textarea
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              className="w-full p-3 border border-pink-300 rounded-lg focus:ring-2 focus:ring-pink-500"
              rows={3}
              placeholder="Tulis pesan rahasia..."
            />
          </div>
          
          <div>
            <label className="block text-pink-700 mb-1">Unggah Foto/Video</label>
            {media ? (
              <div className="mb-2">
                <div className="flex items-center justify-between bg-pink-50 p-2 rounded-lg">
                  <span className="truncate">
                    {media.name} ({mediaType === 'image' ? 'Gambar' : 'Video'})
                  </span>
                  <button
                    type="button"
                    onClick={handleRemoveMedia}
                    className="text-pink-600 hover:text-pink-800 ml-2"
                  >
                    ×
                  </button>
                </div>
                {mediaType === 'image' ? (
                  <img src={URL.createObjectURL(media)} alt="Preview" className="mt-2 max-h-40 rounded-lg mx-auto" />
                ) : (
                  <video src={URL.createObjectURL(media)} controls className="mt-2 max-h-40 rounded-lg mx-auto" />
                )}
              </div>
            ) : (
              <div className="border-2 border-dashed border-pink-300 rounded-lg p-4 text-center">
                <input
                  type="file"
                  accept="image/*, video/*"
                  onChange={handleMediaChange}
                  className="hidden"
                  id="media-upload"
                />
                <label htmlFor="media-upload" className="cursor-pointer block">
                  <div className="text-4xl mb-2">📎</div>
                  <p className="text-pink-600">Klik untuk upload</p>
                  <p className="text-xs text-gray-500 mt-1">Maksimal 5MB</p>
                </label>
              </div>
            )}
          </div>
          
          <div>
            <label className="block text-pink-700 mb-1">Waktu Tampil*</label>
            <DatePicker
              selected={scheduledDateTime}
              onChange={(date) => setScheduledDateTime(date)}
              showTimeSelect
              timeFormat="HH:mm"
              timeIntervals={15}
              dateFormat="dd MMMM yyyy HH:mm"
              minDate={new Date()}
              className="w-full p-3 border border-pink-300 rounded-lg focus:ring-2 focus:ring-pink-500"
              placeholderText="Pilih tanggal dan waktu"
              required
            />
            <p className="text-xs text-gray-500 mt-1">
              Pesan akan muncul pada tanggal dan waktu yang dipilih
            </p>
          </div>
          
          <div className="space-y-3">
            <div className="flex items-start">
              <input
                type="checkbox"
                id="hiddenUntil"
                checked={isHidden}
                onChange={(e) => setIsHidden(e.target.checked)}
                className="mt-1 mr-2 h-5 w-5 text-pink-600 rounded focus:ring-pink-500"
              />
              <label htmlFor="hiddenUntil" className="block text-pink-700">
                <span className="font-medium">Sembunyikan pesan</span>
                <p className="text-xs text-gray-500 mt-1">
                  Hanya akan terlihat saat waktu yang ditentukan
                </p>
              </label>
            </div>
            
            <div className="flex items-start">
              <input
                type="checkbox"
                id="oneTime"
                checked={isOneTime}
                onChange={(e) => setIsOneTime(e.target.checked)}
                disabled={!isHidden}
                className="mt-1 mr-2 h-5 w-5 text-pink-600 rounded focus:ring-pink-500 disabled:opacity-50"
              />
              <label htmlFor="oneTime" className="block text-pink-700">
                <span className="font-medium">Hanya muncul sekali</span>
                <p className="text-xs text-gray-500 mt-1">
                  Tidak akan berulang di hari berikutnya
                </p>
              </label>
            </div>
          </div>
          
          {error && <p className="text-red-500 text-sm">{error}</p>}
          
          <div className="flex gap-2 pt-2">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 bg-gray-200 text-gray-800 py-2 px-4 rounded-lg hover:bg-gray-300 transition"
            >
              Batal
            </button>
            <button
              type="submit"
              className="flex-1 bg-pink-600 text-white py-2 px-4 rounded-lg hover:bg-pink-700 transition"
            >
              Simpan Pesan Rahasia
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}