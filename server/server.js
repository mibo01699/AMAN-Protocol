/**
 * AMAN Protocol - Main Core Server
 * منظومة النسر العربي (A.E.C.) - ربط بوابات الدفع والتسوية اللحظية (Pi / YER)
 */

const express = require('express');
const app = express();
const PORT = process.env.PORT || 3006;

app.use(express.json());

// محاكاة تسعير الـ AMM والـ DEX اللحظي لـ Pi مقابل الدولار والـ YER
function calculateAmmConversion(usdAmount) {
    const piPriceInUSD = 40.00; // سعر محاكاة مرجعي لـ Pi على الـ DEX
    const yerPriceInPi = 1500;  // سعر محاكاة مرجعي لرمز YER داخل المجمع Pi/YER

    const requiredPi = usdAmount / piPriceInUSD;
    const compensationInYER = requiredPi * yerPriceInPi;

    return {
        requiredPi: requiredPi.toFixed(4),
        compensationInYER: compensationInYER.toFixed(2)
    };
}

// 1. مسار استلام الأقساط اللحظية بعملة Pi بناءً على تقرير الذكاء الاصطناعي والدولار
app.post('/api/insurance/premium', (req, res) => {
    const { policyId, basePremiumUSD, riskModifier } = req.body;
    
    const finalPremiumUSD = basePremiumUSD * (riskModifier || 1.0);
    const ammRates = calculateAmmConversion(finalPremiumUSD);

    console.log(`[💰 AMAN Payment] الوثيقة: ${policyId} | القسط الفعلي للـشهر الحالي: $${finalPremiumUSD}`);
    res.json({
        success: true,
        policyId,
        finalPremiumUSD,
        paymentDueInPi: ammRates.requiredPi,
        note: "تم حساب عدد عملات Pi الموازية عبر الـ AMM لحظياً وفق الدولار الأمريكي"
    });
});

// 2. مسار دفع تعويضات الأضرار للمستفيدين عبر رمز YER من مجمع السيولة Pi/YER
app.post('/api/insurance/compensate', (req, res) => {
    const { claimId, lossInUSD } = req.body;
    const ammRates = calculateAmmConversion(lossInUSD);

    console.log(`[🚀 AMAN Settlement] صرف تعويض للمطالبة: ${claimId} بقيمة رمز YER: ${ammRates.compensationInYER}`);
    res.json({
        success: true,
        claimId,
        lossInUSD,
        disbursedToken: "YER",
        amountPaidYER: ammRates.compensationInYER,
        gateway: "Pi/YER DEX Liquidity Pool"
    });
});

app.listen(PORT, () => {
    console.log(`🛡️ بروتوكول أمان للتأمين اللامركزي نشط ويعمل على المنفذ ${PORT}`);
});

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

