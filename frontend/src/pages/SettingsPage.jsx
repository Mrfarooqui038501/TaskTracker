import NotificationSettings from "../components/Notification/NotificationSettings";

const SettingsPage = () => {
  return (
    <div className="p-8">
      <h1 className="text-3xl font-bold mb-4">Settings</h1>
      <NotificationSettings />
    </div>
  );
};

export default SettingsPage;