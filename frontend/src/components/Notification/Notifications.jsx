import { useContext, useEffect, useState } from "react";
import { SocketContext } from "../../context/SocketContext";

const Notifications = () => {
  const { socket } = useContext(SocketContext); // Destructure socket from the context value
  const [notifications, setNotifications] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!socket) return; // Wait until socket is defined

    socket.on("notification", (data) => {
      setNotifications((prev) => [...prev, data]);
    });

    setLoading(false); // Socket is ready, stop loading

    return () => {
      socket.off("notification");
    };
  }, [socket]);

  if (loading) {
    return <div className="text-center p-4">Loading notifications...</div>;
  }

  return (
    <div className="p-4 bg-white shadow-md rounded">
      <h2 className="text-2xl font-bold mb-4">Notifications</h2>
      {notifications.length > 0 ? (
        notifications.map((notif, index) => (
          <p key={index} className="text-gray-700">{notif.message}</p>
        ))
      ) : (
        <p>No notifications</p>
      )}
    </div>
  );
};

export default Notifications;