export default function UpcomingMessages({ hiddenNotifications }) {
  if (hiddenNotifications.length === 0) return null;

  return (
    <div className="bg-white bg-opacity-90 p-4 rounded-lg shadow-md mb-6 border border-pink-200">
      <h3 className="text-lg font-bold text-pink-600 mb-3 flex items-center">
        <span className="mr-2">💌</span>
        Pesan Akan Datang
      </h3>
      <ul className="space-y-3">
        {hiddenNotifications.map(notif => (
          <li key={notif.id} className="flex items-start">
            <div className="bg-pink-100 text-pink-600 px-3 py-1 rounded-lg mr-3 text-sm min-w-[120px]">
              {new Date(notif.scheduledDate).toLocaleString('id-ID', {
                day: 'numeric',
                month: 'short',
                hour: '2-digit',
                minute: '2-digit'
              })}
            </div>
            <div>
              <p className="font-medium">
                Dari: <span className="text-pink-600">{notif.senderName}</span>
              </p>
              <div className="flex gap-2 mt-1">
                <span className="text-xs bg-pink-50 text-pink-600 px-2 py-0.5 rounded-full">
                  {notif.isOneTime ? 'Sekali dikirim' : 'Akan berulang'}
                </span>
                {notif.mediaType && (
                  <span className="text-xs bg-pink-50 text-pink-600 px-2 py-0.5 rounded-full">
                    {notif.mediaType === 'image' ? '📸 Foto' : '🎥 Video'}
                  </span>
                )}
              </div>
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
}