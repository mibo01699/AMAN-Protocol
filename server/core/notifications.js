/**
 * AMAN Protocol - Internal Emergency Alerts & Notifications Engine
 * منظومة النسر العربي (A.E.C.) - محرك التحذيرات وإدارة المندوبين البشريين لعام 2026
 * المطور الرئيسي: مياس علي (Mayass Ali)
 */

class AmanNotificationEngine {
    constructor() {
        this.alertLogs = [];
    }

    /**
     * بث إشعار أمني أو تحذيري داخل المنظومة
     * @param {string} level - مستوى الخطر (INFO, RISK_ALERT, CRITICAL_CLAIM)
     * @param {string} category - فئة التأمين (CARGO, VEHICLE, INFRASTRUCTURE, LEGAL)
     * @param {string} message - نص التنبيه الموجه للمستفيدين أو المندوبين
     */
    triggerAlert(level, category, message) {
        const timestamp = new Date().toISOString();
        const alertPayload = {
            alertId: `AMAN-ALERT-${Math.floor(Math.random() * 900000) + 100000}`,
            timestamp,
            level: level.toUpperCase(),
            category: category.toUpperCase(),
            message: message
        };

        this.alertLogs.push(alertPayload);
        
        // بث التنبيه في سجلات الخادم الآمنة
        console.log(`[🔔 AMAN ALERT] [${alertPayload.level}] [${category}] -> ${message}`);
        return alertPayload;
    }

    // جلب آخر 15 تحذيراً تم إصداره عبر الذكاء الاصطناعي التنبئي
    getSystemAlerts() {
        return this.alertLogs.slice(-15).reverse();
    }
}

module.exports = new AmanNotificationEngine();
