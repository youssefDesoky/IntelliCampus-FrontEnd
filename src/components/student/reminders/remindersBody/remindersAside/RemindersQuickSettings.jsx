import {useState} from "react";


export default function RemindersQuickSettings({ styles }) {
    function toggleSetting(id) {
        setSettingsState((prevSettings) =>
            prevSettings.map((setting) =>
                setting.id === id ? { ...setting, enabled: !setting.enabled } : setting
            )
        );
    }

    const settings = [
        { id: 1, name: "Email Notifications", description: "Receive reminders for upcoming tasks and events.", enabled: true },
        { id: 2, name: "Push Notifications", description: "Get a daily push notification summary of your reminders.", enabled: true },
        // { id: 3, name: "SMS Reminders", description: "Receive reminders via SMS messages.", enabled: false },
    ];

    const [settingsState, setSettingsState] = useState(settings);

    return (
        <div id="reminders-quick-settings" className={styles}>
            <h2 className="text-lg font-medium mb-3">Quick Settings</h2>
            <div>
                {settingsState.map((setting) => (
                    <div key={setting.id} className="flex items-center justify-between mb-4">
                        <div>
                            <label htmlFor={`setting-${setting.id}`} className="cursor-pointer text-md font-semibold" title={setting.description}>{setting.name}</label>
                        </div>
                        <div>
                            <button id={`setting-${setting.id}`} className="cursor-pointer focus:outline-none" aria-pressed={setting.enabled} onClick={() => toggleSetting(setting.id)} title={setting.enabled ? `Disable ${setting.name}` : `Enable ${setting.name}`}>
                                <span className={`relative inline-block w-12 h-6 rounded-full transition-colors duration-300 ${setting.enabled ? 'bg-blue-600' : 'bg-gray-300'}`}>
                                    <span className={`absolute left-1 top-1 w-4 h-4 bg-white rounded-full shadow-md transform transition-transform duration-300 ${setting.enabled ? 'translate-x-6' : ''}`}></span>
                                </span>
                            </button>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
}