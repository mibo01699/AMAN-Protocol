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
