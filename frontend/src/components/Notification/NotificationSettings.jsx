import { useContext, useState } from "react";
import api from "../../services/api";
import { AuthContext } from "../../context/AuthContext";

const NotificationSettings = () => {
  const { user } = useContext(AuthContext);
  const [emailNotifications, setEmailNotifications] = useState(true);
  const [inAppNotifications, setInAppNotifications] = useState(true);
  const [mutedCategories, setMutedCategories] = useState([]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    await api.post("/notification-preferences", { userId: user.id, emailNotifications, inAppNotifications, mutedCategories });
  };

  return (
    <form onSubmit={handleSubmit} className="max-w-md mx-auto p-4 bg-white shadow-md rounded">
      <h2 className="text-2xl font-bold mb-4">Notification Settings</h2>
      <label className="flex items-center mb-4">
        <input
          type="checkbox"
          checked={emailNotifications}
          onChange={(e) => setEmailNotifications(e.target.checked)}
          className="mr-2"
        />
        Email Notifications
      </label>
      <label className="flex items-center mb-4">
        <input
          type="checkbox"
          checked={inAppNotifications}
          onChange={(e) => setInAppNotifications(e.target.checked)}
          className="mr-2"
        />
        In-App Notifications
      </label>
      <button type="submit" className="w-full p-2 bg-blue-500 text-white rounded">Save Settings</button>
    </form>
  );
};

export default NotificationSettings;