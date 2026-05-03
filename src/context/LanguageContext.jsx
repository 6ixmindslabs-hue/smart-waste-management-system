import { createContext, useContext, useState } from 'react';

const LanguageContext = createContext();

export const useLanguage = () => useContext(LanguageContext);

const translations = {
    en: {
        // Header
        smart: 'Smart',
        waste: 'Waste',
        subtitle: 'IoT Garbage Overflow Management System',
        lastUpdated: 'Last updated',
        translateBtn: 'தமிழ்',

        // Alert
        criticalAlert: 'Critical Alert',
        alertMessage: 'Garbage bin is overflowing! Fill level has exceeded 80%. Please schedule a pickup immediately.',

        // Status Card
        deviceId: 'Device ID',
        waiting: 'Waiting...',
        capacityUsage: 'Capacity Usage',
        units: 'Units',

        // Status Values
        empty: 'EMPTY',
        half: 'HALF',
        full: 'FULL',

        // History Table
        recentActivity: 'Recent Activity',
        lastRecords: 'Last 20 Records',
        time: 'Time',
        device: 'Device',
        fillLevel: 'Fill Level',
        status: 'Status',
        noHistory: 'No history data available yet.',

        // Settings
        settings: 'Settings',
        addBin: 'Add Dustbin',
        editBin: 'Edit Dustbin',
        binName: 'Dustbin Name',
        deviceIdLabel: 'Device ID (Backend ID)',
        binDetails: 'Dustbin Details',
        save: 'Save',
        cancel: 'Cancel',
        delete: 'Delete',
        actions: 'Actions',
        noBins: 'No registered dustbins.',
        allBins: 'All Dustbins',
    },
    ta: {
        // Header
        smart: 'ஸ்மார்ட்',
        waste: 'வேஸ்ட்',
        subtitle: 'IoT குப்பை நிரம்பல் மேலாண்மை அமைப்பு',
        lastUpdated: 'கடைசியாக புதுப்பிக்கப்பட்டது',
        translateBtn: 'English',

        // Alert
        criticalAlert: 'முக்கியமான எச்சரிக்கை',
        alertMessage: 'குப்பைத் தொட்டி நிரம்பி வழிகிறது! நிரப்பு நிலை 80% ஐ தாண்டிவிட்டது. உடனடியாக எடுப்பதற்கு அட்டவணைப்படுத்தவும்.',

        // Status Card
        deviceId: 'சாதன ஐடி',
        waiting: 'காத்திருக்கிறது...',
        capacityUsage: 'திறன் பயன்பாடு',
        units: 'அலகுகள்',

        // Status Values
        empty: 'காலி',
        half: 'பாதி',
        full: 'முழு',

        // History Table
        recentActivity: 'சமீபத்திய செயல்பாடு',
        lastRecords: 'கடைசி 20 பதிவுகள்',
        time: 'நேரம்',
        device: 'சாதனம்',
        fillLevel: 'நிரப்பு நிலை',
        status: 'நிலை',
        noHistory: 'வரலாற்று தரவு இன்னும் கிடைக்கவில்லை.',

        // Settings
        settings: 'அமைப்புகள்',
        addBin: 'குப்பைத் தொட்டியைச் சேர்',
        editBin: 'குப்பைத் தொட்டியைத் திருத்து',
        binName: 'குப்பைத் தொட்டி பெயர்',
        deviceIdLabel: 'சாதன ஐடி (பின்புல ஐடி)',
        binDetails: 'குப்பைத் தொட்டி விவரங்கள்',
        save: 'சேமி',
        cancel: 'ரத்து செய்',
        delete: 'நீக்கு',
        actions: 'செயல்கள்',
        noBins: 'பதிவு செய்யப்பட்ட குப்பைத் தொட்டிகள் இல்லை.',
        allBins: 'அனைத்து குப்பைத் தொட்டிகள்',
    }
};

export const LanguageProvider = ({ children }) => {
    const [language, setLanguage] = useState('en');

    const toggleLanguage = () => {
        setLanguage(prev => prev === 'en' ? 'ta' : 'en');
    };

    const t = (key) => {
        return translations[language][key] || key;
    };

    return (
        <LanguageContext.Provider value={{ language, toggleLanguage, t }}>
            {children}
        </LanguageContext.Provider>
    );
};
