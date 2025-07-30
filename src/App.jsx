import { useState, useEffect } from "react";
import { db, ref, push, onValue, off, update, remove } from "./firebase";
import { users } from "./data/users";
import LoveTimer from "./components/LoveTimer";
import LoveMessages from "./components/LoveMessages";
import LoveNotification from "./components/LoveNotification";
import BackgroundEffect from "./components/BackgroundEffect";
import NotificationHistory from "./components/NotificationHistory";
import NotificationForm from "./components/NotificationForm";
import UpcomingMessages from "./components/UpcomingMessages";
import MessageList from "./components/MessageList";
import SendMessage from "./components/SendMessage";

export default function App() {
  const [startDate] = useState(new Date("2023-01-01T00:00:00"));
  const [showNotification, setShowNotification] = useState(false);
  const [notificationMessage, setNotificationMessage] = useState("");
  const [notificationMedia, setNotificationMedia] = useState(null);
  const [notificationSender, setNotificationSender] = useState("");
  const [messages, setMessages] = useState([]);
  const [notificationHistory, setNotificationHistory] = useState([]);
  const [hiddenNotifications, setHiddenNotifications] = useState([]);
  const [showHistory, setShowHistory] = useState(false);
  const [showForm, setShowForm] = useState(false);
  const [currentUser, setCurrentUser] = useState("abi");
  const [targetUser, setTargetUser] = useState("tiwi");

  // Load direct messages
  useEffect(() => {
    const messagesRef = ref(db, 'messages');
    const handleData = (snapshot) => {
      const data = snapshot.val();
      setMessages(data ? Object.values(data) : []);
    };
    onValue(messagesRef, handleData);
    return () => off(messagesRef, 'value', handleData);
  }, []);

  // Load secret messages for both sender and receiver
  useEffect(() => {
    const secretRef = ref(db, 'secret_messages');

    const handleSecretData = (snapshot) => {
      const data = snapshot.val() || {};
      const allMessages = Object.entries(data).map(([id, msg]) => ({ ...msg, id }));

      const userMessages = allMessages.filter(msg =>
        msg.receiver === currentUser || msg.sender === currentUser
      );

      const visibleMessages = userMessages.filter(msg =>
        msg.isHidden === false || new Date(msg.scheduledDate) <= new Date()
      );

      const hiddenMessages = userMessages.filter(msg =>
        msg.isHidden === true && new Date(msg.scheduledDate) > new Date()
      );

      setNotificationHistory(visibleMessages);
      setHiddenNotifications(hiddenMessages);
    };

    onValue(secretRef, handleSecretData);
    return () => off(secretRef, 'value', handleSecretData);
  }, [currentUser]);

  // Check for scheduled notifications for currentUser only
  useEffect(() => {
    const checkScheduledMessages = () => {
      const now = new Date().getTime();
      const secretRef = ref(db, 'secret_messages');

      onValue(secretRef, (snapshot) => {
        const messages = snapshot.val() || {};

        Object.entries(messages).forEach(([id, msg]) => {
          const scheduledTime = new Date(msg.scheduledDate).getTime();
          const isForCurrentUser = msg.receiver === currentUser;

          if (scheduledTime <= now && msg.isHidden && isForCurrentUser) {
            setNotificationMessage(msg.message);
            setNotificationSender(users[msg.sender].name);
            setNotificationMedia(msg.media || null);
            setShowNotification(true);

            update(ref(db, `secret_messages/${id}`), {
              isHidden: false,
              deliveredAt: new Date().toISOString()
            });
          }
        });
      });
    };

    const interval = setInterval(checkScheduledMessages, 30000);
    checkScheduledMessages();
    return () => clearInterval(interval);
  }, [currentUser]);

  const handleAddNotification = (newNotification) => {
    const notificationWithId = {
      ...newNotification,
      id: Date.now().toString(),
      sender: currentUser,
      receiver: targetUser,
      isHidden: newNotification.isHidden,
      createdAt: new Date().toISOString()
    };

    push(ref(db, 'secret_messages'), notificationWithId);
    setShowForm(false);
  };

  const handleDeleteNotification = (id) => {
    remove(ref(db, `secret_messages/${id}`))
      .catch(error => console.error("Gagal menghapus:", error));
  };

  return (
    <div className="min-h-screen bg-pink-50 text-pink-900 overflow-x-hidden relative">
      <BackgroundEffect />

      <div className="container mx-auto px-4 py-12 flex flex-col items-center justify-center min-h-screen">
        <h1 className="text-4xl md:text-5xl font-bold mb-8 text-center font-serif">
          Jam Rindu Kita
        </h1>

        {/* User Switch */}
        <div className="flex gap-2 mb-4">
          <button
            onClick={() => setCurrentUser("abi")}
            className={`px-4 py-2 rounded-lg transition-colors ${
              currentUser === "abi"
                ? "bg-pink-600 text-white"
                : "bg-gray-200 hover:bg-gray-300"
            }`}
          >
            Abi
          </button>
          <button
            onClick={() => setCurrentUser("tiwi")}
            className={`px-4 py-2 rounded-lg transition-colors ${
              currentUser === "tiwi"
                ? "bg-teal-500 text-white"
                : "bg-gray-200 hover:bg-gray-300"
            }`}
          >
            Tiwi
          </button>
        </div>

        <LoveTimer startDate={startDate} />

        <div className="w-full max-w-lg">
          <UpcomingMessages hiddenNotifications={hiddenNotifications} />

          {/* Realtime Messages Section */}
          <div className="bg-white p-6 rounded-xl shadow-lg mb-6">
            <h2 className="text-xl font-bold text-pink-600 mb-4">Pesan Langsung</h2>
            <MessageList messages={messages} currentUser={currentUser} />
            <SendMessage senderName={users[currentUser].name} currentUser={currentUser} />
          </div>

          <LoveMessages />
        </div>

        <div className="mt-8 flex gap-4">
          <button
            onClick={() => setShowHistory(!showHistory)}
            className="bg-pink-500 text-white px-4 py-2 rounded-lg hover:bg-pink-600 transition"
          >
            {showHistory ? "Tutup Riwayat" : "Lihat Riwayat"}
          </button>
          <button
            onClick={() => setShowForm(!showForm)}
            className="bg-pink-600 text-white px-4 py-2 rounded-lg hover:bg-pink-700 transition"
          >
            {showForm ? "Tutup Form" : "Buat Pesan Rahasia"}
          </button>
        </div>
      </div>

      {showHistory && (
        <NotificationHistory
          notifications={notificationHistory}
          onClose={() => setShowHistory(false)}
          onDelete={handleDeleteNotification}
          currentUser={currentUser}
        />
      )}

      {showForm && (
        <NotificationForm
          onAddNotification={handleAddNotification}
          onClose={() => setShowForm(false)}
          currentUser={users[currentUser].name}
        />
      )}

      {showNotification && (
        <LoveNotification
          message={notificationMessage}
          sender={notificationSender}
          media={notificationMedia}
          onClose={() => setShowNotification(false)}
        />
      )}
    </div>
  );
}
