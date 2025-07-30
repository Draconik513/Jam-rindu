import { useState } from 'react';
import { ref, push, set } from 'firebase/database';
import { getStorage, ref as storageRef, uploadBytes, getDownloadURL } from 'firebase/storage';
import { db, storage } from '../firebase';

export default function SendMessage({ senderName, currentUser }) {
  const [message, setMessage] = useState('');
  const [media, setMedia] = useState(null);
  const [mediaType, setMediaType] = useState(null);
  const [isSending, setIsSending] = useState(false);
  const [error, setError] = useState('');

  const handleMediaChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      // Validasi tipe file
      if (!file.type.match('image.*|video.*')) {
        setError('Hanya gambar/video yang diperbolehkan');
        return;
      }
      // Validasi ukuran file (max 5MB)
      if (file.size > 5 * 1024 * 1024) {
        setError('Ukuran file maksimal 5MB');
        return;
      }
      setMedia(file);
      setMediaType(file.type.startsWith('image') ? 'image' : 'video');
      setError('');
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    
    if (!message.trim() && !media) {
      setError('Harap isi pesan atau unggah media');
      return;
    }

    try {
      setIsSending(true);
      
      let mediaUrl = '';
      if (media) {
        try {
          const fileRef = storageRef(storage, `messages/${Date.now()}_${media.name}`);
          await uploadBytes(fileRef, media);
          mediaUrl = await getDownloadURL(fileRef);
        } catch (uploadError) {
          console.error("Error uploading media:", uploadError);
          setError('Gagal mengunggah media');
          return;
        }
      }

      // Buat reference baru dengan ID unik
      const newMessageRef = push(ref(db, 'messages'));
      
      // Gunakan set() untuk menulis data
      await set(newMessageRef, {
        id: newMessageRef.key,
        sender: senderName,
        senderId: currentUser,
        text: message,
        media: mediaUrl || null,
        mediaType,
        timestamp: new Date().toISOString()
      });

      // Reset form setelah berhasil
      setMessage('');
      setMedia(null);
      setMediaType(null);
      
    } catch (error) {
      console.error("Error sending message:", error);
      setError('Gagal mengirim pesan: ' + error.message);
    } finally {
      setIsSending(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="mt-4">
      {error && <p className="text-red-500 mb-2">{error}</p>}
      
      <div className="flex flex-col space-y-3">
        <input
          type="text"
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          placeholder="Tulis pesan cinta..."
          className="w-full p-3 border border-pink-300 rounded-lg focus:ring-2 focus:ring-pink-500"
          disabled={isSending}
        />
        
        <div className="flex items-center space-x-3">
          <label className={`cursor-pointer bg-pink-100 text-pink-600 px-3 py-2 rounded-lg hover:bg-pink-200 transition ${isSending ? 'opacity-50' : ''}`}>
            {media ? "Ganti Media" : "Tambahkan Media"}
            <input
              type="file"
              accept="image/*, video/*"
              onChange={handleMediaChange}
              className="hidden"
              disabled={isSending}
            />
          </label>
          
          {media && (
            <button
              type="button"
              onClick={() => {
                setMedia(null);
                setMediaType(null);
              }}
              className="bg-gray-200 text-gray-700 px-3 py-2 rounded-lg hover:bg-gray-300 transition"
              disabled={isSending}
            >
              Hapus Media
            </button>
          )}
        </div>
        
        {media && (
          <div className="mt-2">
            {mediaType === 'image' ? (
              <img 
                src={URL.createObjectURL(media)} 
                alt="Preview" 
                className="max-h-40 rounded-lg"
              />
            ) : (
              <video 
                src={URL.createObjectURL(media)} 
                controls 
                className="max-h-40 rounded-lg"
              />
            )}
          </div>
        )}
        
        <button
          type="submit"
          disabled={isSending || (!message.trim() && !media)}
          className={`bg-pink-600 text-white px-4 py-3 rounded-lg hover:bg-pink-700 transition ${
            (isSending || (!message.trim() && !media)) ? 'opacity-50 cursor-not-allowed' : ''
          }`}
        >
          {isSending ? 'Mengirim...' : 'Kirim Pesan'}
        </button>
      </div>
    </form>
  );
}
