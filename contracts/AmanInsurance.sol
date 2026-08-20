// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

/**
 * @title AmanInsurance
 * @dev بروتوكول أمان للتأمين اللامركزي الذكي - منظومة النسر العربي (A.E.C.)
 * إدارة الأقساط الديناميكية والتسويات الهجينة المشفرة (Pi / YER)
 */
contract AmanInsurance {
    
    enum PolicyType { CARGO, VEHICLE, INFRASTRUCTURE }
    enum ClaimStatus { NONE, SUBMITTED, AI_VERIFIED, HUMAN_VERIFIED, SETTLED, REJECTED }

    struct Policy {
        bytes32 policyId;
        address client;
        PolicyType pType;
        uint256 premiumInUSD;
        uint256 expiration;
        bool isActive;
    }

    struct Claim {
        bytes32 claimId;
        bytes32 policyId;
        uint256 lossInUSD;
        ClaimStatus status;
        bool aiApproved;
        bool humanApproved;
    }

    address public oracleAdmin;
    mapping(bytes32 => Policy) public policies;
    mapping(bytes32 => Claim) public claims;

    event PolicyRegistered(bytes32 indexed policyId, address indexed client, uint256 premiumInUSD);
    event PremiumUpdated(bytes32 indexed policyId, uint256 newPremiumInUSD);
    event ClaimProcessed(bytes32 indexed claimId, ClaimStatus status);

    modifier onlyOracle() {
        require(msg.sender == oracleAdmin, "AMAN Auth: Only authorized AI Oracle can call this");
        _;
    }

    constructor() {
        oracleAdmin = msg.sender;
    }

    // 1. تسجيل وثيقة تأمين جديدة بعد التقييم الأولي
    function registerPolicy(bytes32 _policyId, address _client, PolicyType _type, uint256 _premium) external onlyOracle {
        policies[_policyId] = Policy(_policyId, _client, _type, _premium, block.timestamp + 30 days, true);
        emit PolicyRegistered(_policyId, _client, _premium);
    }

    // 2. تحديث قسط التأمين شهرياً ديناميكياً بناءً على تنبؤات الذكاء الاصطناعي للمخاطر
    function updateDynamicPremium(bytes32 _policyId, uint256 _newPremium) external onlyOracle {
        require(policies[_policyId].isActive, "AMAN: Policy inactive");
        policies[_policyId].premiumInUSD = _newPremium;
        emit PremiumUpdated(_policyId, _newPremium);
    }

    // 3. معالجة الإقرار عن حادث والتحقق الثنائي (التقني والبشري) لمنع الاحتيال
    function processClaim(bytes32 _claimId, bytes32 _policyId, uint256 _loss, bool _aiCheck, bool _humanCheck) external onlyOracle {
        Claim storage policyClaim = claims[_claimId];
        policyClaim.claimId = _claimId;
        policyClaim.policyId = _policyId;
        policyClaim.lossInUSD = _loss;
        policyClaim.aiApproved = _aiCheck;
        policyClaim.humanApproved = _humanCheck;

        if (_aiCheck && _humanCheck) {
            policyClaim.status = ClaimStatus.SETTLED;
            // يتم استدعاء مجمع السيولة Pi/YER عبر الواجهة الخلفية لتنفيذ الدفع الفوري بنظام AMM
        } else if (_aiCheck || _humanCheck) {
            policyClaim.status = ClaimStatus.HUMAN_VERIFIED; // يتطلب تدقيق إضافي للمندوبين والمحامين
        } else {
            policyClaim.status = ClaimStatus.REJECTED;
        }

        emit ClaimProcessed(_claimId, policyClaim.status);
    }
}
