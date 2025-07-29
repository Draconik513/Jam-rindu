import { useState } from 'react';
import { ref, push } from 'firebase/database';
import { getStorage, ref as storageRef, uploadBytes, getDownloadURL } from './firebase';
import { db, storage } from '../firebase';

export default function SendMessage({ senderName, currentUser }) {
  const [message, setMessage] = useState('');
  const [media, setMedia] = useState(null);
  const [mediaType, setMediaType] = useState(null);
  const [isSending, setIsSending] = useState(false);

  const handleMediaChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setMedia(file);
      setMediaType(file.type.startsWith('image') ? 'image' : 'video');
    }
  };

  const handleRemoveMedia = () => {
    setMedia(null);
    setMediaType(null);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!message.trim() && !media) {
      alert('Harap isi pesan atau unggah media!');
      return;
    }

    try {
      setIsSending(true);
      
      let mediaUrl = '';
      if (media) {
        const fileRef = storageRef(storage, `messages/${Date.now()}_${media.name}`);
        await uploadBytes(fileRef, media);
        mediaUrl = await getDownloadURL(fileRef);
      }

      await push(ref(db, 'messages'), {
        sender: senderName,
        senderId: currentUser,
        text: message,
        media: media ? mediaUrl : null,
        mediaType,
        timestamp: new Date().toISOString()
      });

      setMessage('');
      setMedia(null);
      setMediaType(null);
    } catch (error) {
      console.error("Gagal mengirim pesan:", error);
      alert("Gagal mengirim pesan. Cek console untuk detail.");
    } finally {
      setIsSending(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="mt-4">
      <div className="flex flex-col space-y-3">
        <input
          type="text"
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          placeholder="Tulis pesan cinta..."
          className="w-full p-3 border border-pink-300 rounded-lg focus:ring-2 focus:ring-pink-500"
        />
        
        <div className="flex items-center space-x-3">
          <label className="cursor-pointer bg-pink-100 text-pink-600 px-3 py-2 rounded-lg hover:bg-pink-200 transition">
            {media ? "Ganti Media" : "Tambahkan Media"}
            <input
              type="file"
              accept="image/*, video/*"
              onChange={handleMediaChange}
              className="hidden"
            />
          </label>
          
          {media && (
            <button
              type="button"
              onClick={handleRemoveMedia}
              className="bg-gray-200 text-gray-700 px-3 py-2 rounded-lg hover:bg-gray-300 transition"
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