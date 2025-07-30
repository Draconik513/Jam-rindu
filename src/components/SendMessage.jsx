import { useState } from 'react';
import { ref, push } from 'firebase/database';
import { getStorage, ref as storageRef, uploadBytes, getDownloadURL } from 'firebase/storage';
import { db, storage } from '../firebase';

export default function SendMessage({ senderName, currentUser }) {
  const [message, setMessage] = useState('');
  const [media, setMedia] = useState(null);
  const [mediaType, setMediaType] = useState(null);
  const [isSending, setIsSending] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);

  const handleMediaChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      // Validate file type and size
      if (!file.type.match('image.*|video.*')) {
        alert('Hanya gambar atau video yang diperbolehkan!');
        return;
      }
      if (file.size > 10 * 1024 * 1024) { // 10MB limit
        alert('Ukuran file maksimal 10MB!');
        return;
      }
      setMedia(file);
      setMediaType(file.type.startsWith('image') ? 'image' : 'video');
    }
  };

  const handleRemoveMedia = () => {
    setMedia(null);
    setMediaType(null);
    setUploadProgress(0);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!message.trim() && !media) {
      alert('Harap isi pesan atau unggah media!');
      return;
    }

    try {
      setIsSending(true);
      setUploadProgress(0);
      
      let mediaUrl = '';
      if (media) {
        const storage = getStorage();
        const fileRef = storageRef(storage, `messages/${Date.now()}_${media.name}`);
        
        // Upload file with progress tracking
        const uploadTask = uploadBytes(fileRef, media);
        
        uploadTask.on('state_changed',
          (snapshot) => {
            const progress = (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
            setUploadProgress(progress);
          },
          (error) => {
            console.error("Upload error:", error);
            alert("Gagal mengunggah media");
            throw error;
          }
        );

        await uploadTask;
        mediaUrl = await getDownloadURL(fileRef);
      }

      const newMessage = {
        sender: senderName,
        senderId: currentUser,
        text: message,
        media: media ? mediaUrl : null,
        mediaType,
        timestamp: new Date().toISOString()
      };

      // Push to Firebase
      const messageRef = push(ref(db, 'messages'));
      await update(messageRef, { ...newMessage, id: messageRef.key });

      // Reset form
      setMessage('');
      setMedia(null);
      setMediaType(null);
      setUploadProgress(0);
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
        
        {uploadProgress > 0 && uploadProgress < 100 && (
          <div className="w-full bg-gray-200 rounded-full h-2.5">
            <div 
              className="bg-pink-600 h-2.5 rounded-full" 
              style={{ width: `${uploadProgress}%` }}
            ></div>
          </div>
        )}
        
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
