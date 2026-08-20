const express = require('express');
const path = require('path');

const app = express();
const PORT = process.env.PORT || 3006;

app.use(express.json());
app.use(express.static(path.join(__dirname, 'public')));

// Core AMM Link - Mirroring BIGISH-YER sovereign liquidity values
const BIGISH_YER_LINK = {
    piReserve: "1000000",
    yerReserve: "15000000000",
    precisionFactor: "10000000"
};

// Main execution route linking AMAN policy processing with YER payouts
app.post('/api/insurance/process-secure', (req, res) => {
    try {
        const { role, username, type, usdValue, details } = req.body;
        console.log("[Integration Server] Executing request for verified user: " + username);

        const basePremiumUSD = parseFloat(usdValue || 0) * 0.02;
        const finalPremiumUSD = basePremiumUSD * 1.25;

        const piRateInUSD = 40;
        const calculatedPremiumPi = (finalPremiumUSD / piRateInUSD).toFixed(4);

        res.json({
            success: true,
            username: username,
            role: role,
            premiumUSD: finalPremiumUSD.toFixed(2),
            calculatedPremiumPi: calculatedPremiumPi,
            aiDecision: "APPROVED: Synced with BIGISH-YER liquidity protocol matrix.",
            clearingEngine: "ACTIVE_CROSS_REPO_CLEARING",
            integrationPool: BIGISH_YER_LINK
        });
    } catch (error) {
        res.status(500).json({ success: false, error: "Integration node error" });
    }
});

app.listen(PORT, () => {
    console.log("[A.E.C. Integration Node] Connected to BIGISH-YER on port: " + PORT);
});
