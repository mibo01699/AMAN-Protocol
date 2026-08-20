/**
 * AMAN Protocol - Internal Emergency Alerts Engine
 * Arabian Eagle Ecosystem (A.E.C.) - Core Component
 * Main Developer: Mayass Ali (mibo01699)
 */

class AmanNotificationEngine {
    constructor() {
        this.alertLogs = [];
    }

    triggerAlert(level, category, message) {
        const timestamp = new Date().toISOString();
        const alertPayload = {
            alertId: "AMAN-ALERT-" + (Math.floor(Math.random() * 900000) + 100000),
            timestamp: timestamp,
            level: level.toUpperCase(),
            category: category.toUpperCase(),
            message: message
        };

        this.alertLogs.push(alertPayload);
        console.log("[AMAN ALERT] [" + alertPayload.level + "] [" + category + "] -> " + message);
        return alertPayload;
    }

    getSystemAlerts() {
        return this.alertLogs.slice(-15).reverse();
    }
}

module.exports = new AmanNotificationEngine();
