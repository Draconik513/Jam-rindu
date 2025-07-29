export default function ScheduledInfo({ notifications }) {
  // Hanya tampilkan pesan yang masih disembunyikan
  const hiddenNotifications = notifications.filter(
    notif => notif.isHidden && notif.scheduledTime
  );

  if (hiddenNotifications.length === 0) return null;

  return (
    <div className="fixed top-4 right-4 bg-white bg-opacity-90 p-3 rounded-lg shadow-md z-10 max-w-xs border border-pink-200">
      <h3 className="font-bold text-pink-600 mb-2 flex items-center">
        <span className="mr-2">⏳</span>
        Pesan dari Abi Akan Datang
      </h3>
      <ul className="text-sm space-y-2">
        {hiddenNotifications.map(notif => (
          <li key={notif.id} className="flex items-start">
            <span className="bg-pink-100 text-pink-600 px-2 py-1 rounded mr-2 text-xs">
              {notif.scheduledTime}
            </span>
            <div className="flex-1">
              <p className="text-pink-800 truncate">
                {notif.message ? `"${notif.message}"` : 'Pesan rahasia'}
              </p>
              <p className="text-xs text-gray-500 mt-0.5">
                {notif.isOneTime ? 'Hari ini saja' : 'Setiap hari'}
              </p>
            </div>
          </li>
        ))}
      </ul>
      <p className="text-xs mt-2 text-gray-500 italic">
        Akan muncul otomatis sesuai jam di atas
      </p>
    </div>
  );
}