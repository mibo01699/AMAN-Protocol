const fs = require('fs');
const path = require('path');

class LanguageManager {
    constructor() {
        this.translations = {};
        this.defaultLanguage = 'en';
        this.loadTranslations();
    }

    loadTranslations() {
        const filePath = path.join(__dirname, 'translation.json');
        try {
            if (fs.existsSync(filePath)) {
                this.translations = JSON.parse(fs.readFileSync(filePath, 'utf8'));
            }
        } catch (error) {
            console.error("[❌ AMAN i18n] Error loading translations:", error);
        }
    }

    detectAndGetTranslation(headerLang) {
        let targetLang = this.defaultLanguage;
        if (headerLang) {
            const preferredLang = headerLang.split(',')[0].split('-')[0].trim().toLowerCase();
            if (this.translations[preferredLang]) {
                targetLang = preferredLang;
            }
        }
        return { lang: targetLang, strings: this.translations[targetLang] || {} };
    }
}

module.exports = new LanguageManager();
