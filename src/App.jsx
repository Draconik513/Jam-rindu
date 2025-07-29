import { useState, useEffect } from "react";
import LoveTimer from "./components/LoveTimer";
import LoveMessages from "./components/LoveMessages";
import LoveNotification from "./components/LoveNotification";
import BackgroundEffect from "./components/BackgroundEffect";
import NotificationHistory from "./components/NotificationHistory";
import NotificationForm from "./components/NotificationForm";
import UpcomingMessages from "./components/UpcomingMessages";

export default function App() {
  const [startDate] = useState(new Date("2023-01-01T00:00:00"));
  const [showNotification, setShowNotification] = useState(false);
  const [notificationMessage, setNotificationMessage] = useState("");
  const [notificationMedia, setNotificationMedia] = useState(null);
  const [notificationSender, setNotificationSender] = useState("");
  const [notificationHistory, setNotificationHistory] = useState([]);
  const [hiddenNotifications, setHiddenNotifications] = useState([]);
  const [showHistory, setShowHistory] = useState(false);
  const [showForm, setShowForm] = useState(false);

  // Load saved notifications
  useEffect(() => {
    const savedNotifications = localStorage.getItem("loveNotifications");
    if (savedNotifications) {
      const parsed = JSON.parse(savedNotifications);
      setNotificationHistory(parsed);
      setHiddenNotifications(parsed.filter(notif => notif.isHidden));
    }
  }, []);

  
  // Scheduled notifications check
  useEffect(() => {
    const checkScheduledNotifications = () => {
      const now = new Date();
      const currentTime = now.getTime();

      notificationHistory.forEach((notification) => {
        if (notification.scheduledDate && notification.isHidden) {
          const scheduledTime = new Date(notification.scheduledDate).getTime();
          
          if (scheduledTime <= currentTime) {
            // Show notification
            setNotificationMessage(notification.message);
            setNotificationSender(notification.senderName);
            setNotificationMedia(notification.media ? {
              url: notification.media,
              type: notification.mediaType
            } : null);
            setShowNotification(true);

            // Update status
            const updatedHistory = notificationHistory.map(item => 
              item.id === notification.id ? {
                ...item,
                isHidden: false,
                shownToday: notification.isOneTime ? true : false
              } : item
            );
            
            setNotificationHistory(updatedHistory);
            localStorage.setItem('loveNotifications', JSON.stringify(updatedHistory));
            setHiddenNotifications(updatedHistory.filter(notif => notif.isHidden));

            setTimeout(() => setShowNotification(false), 10000);
          }
        }
      });
    };

    const interval = setInterval(checkScheduledNotifications, 60000);
    checkScheduledNotifications();
    return () => clearInterval(interval);
  }, [notificationHistory]);

  const handleAddNotification = (newNotification) => {
    const notificationWithId = {
      ...newNotification,
      id: Date.now(),
      shownToday: false,
      isHidden: newNotification.isHidden,
      createdAt: new Date().toISOString(),
      senderName: newNotification.senderName || "Someone Special"
    };

    const updatedHistory = [...notificationHistory, notificationWithId];
    setNotificationHistory(updatedHistory);
    setHiddenNotifications([...hiddenNotifications, ...(newNotification.isHidden ? [notificationWithId] : [])]);
    localStorage.setItem("loveNotifications", JSON.stringify(updatedHistory));
    setShowForm(false);
  };

  const handleDeleteNotification = (id) => {
    const updatedHistory = notificationHistory.filter(item => item.id !== id);
    setNotificationHistory(updatedHistory);
    setHiddenNotifications(updatedHistory.filter(notif => notif.isHidden));
    localStorage.setItem("loveNotifications", JSON.stringify(updatedHistory));
  };

  return (
    <div className="min-h-screen bg-pink-50 text-pink-900 overflow-x-hidden relative">
      <BackgroundEffect />
      
      <div className="container mx-auto px-4 py-12 flex flex-col items-center justify-center min-h-screen">
        <h1 className="text-4xl md:text-5xl font-bold mb-8 text-center font-serif">
          Jam Rindu Kita
        </h1>

        <LoveTimer startDate={startDate} />

        <div className="w-full max-w-lg">
          <UpcomingMessages hiddenNotifications={hiddenNotifications} />
          <LoveMessages />
        </div>

        <div className="mt-8 flex gap-4">
          <button
            onClick={() => setShowHistory(!showHistory)}
            className="bg-pink-500 text-white px-4 py-2 rounded-lg hover:bg-pink-600 transition"
          >
            {showHistory ? "Tutup Pesan" : "Lihat Pesan"}
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
        />
      )}

      {showForm && (
        <NotificationForm
          onAddNotification={handleAddNotification}
          onClose={() => setShowForm(false)}
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