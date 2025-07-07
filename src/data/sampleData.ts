export const sampleSearchResults = {
  cosine: [
    {
      id: "gst_001",
      title: "GST on Digital Services - Section 2.1 - Cross-border Digital Services",
      type: "GST Act" as const,
      relevance: 0.89,
      preview: "Digital services provided by non-resident service providers to Indian customers are subject to GST under reverse charge mechanism. The recipient of such services is liable to pay GST...",
      section: "Section 2.1"
    },
    {
      id: "it_002", 
      title: "Income Tax Act - Section 9 - Digital Transaction Tax",
      type: "Income Tax Act" as const,
      relevance: 0.82,
      preview: "Income arising from digital transactions conducted through electronic commerce platforms shall be deemed to accrue or arise in India if the transaction involves...",
      section: "Section 9(1)(vi)"
    },
    {
      id: "cj_003",
      title: "Delhi High Court - Digital Service Tax Case (2023)",
      type: "Court Judgment" as const,
      relevance: 0.78,
      preview: "The court held that digital services rendered by foreign entities to Indian customers fall within the ambit of Indian tax jurisdiction when there is significant economic presence...",
      section: "Para 15-18"
    },
    {
      id: "pl_004",
      title: "Intellectual Property in Digital Platforms - Property Rights",
      type: "Property Law" as const,
      relevance: 0.71,
      preview: "Digital assets and intellectual property rights in online platforms constitute intangible property under Indian law. The ownership and transfer of such digital property...",
      section: "Chapter 4"
    },
    {
      id: "gst_005",
      title: "GST Rules - Place of Supply for Digital Services",
      type: "GST Act" as const,
      relevance: 0.69,
      preview: "The place of supply of digital services shall be determined based on the location of the recipient. For B2C transactions, the place of supply is the location where...",
      section: "Rule 10(1)(b)"
    }
  ],
  euclidean: [
    {
      id: "it_006",
      title: "Digital Asset Taxation - Income Tax Implications",
      type: "Income Tax Act" as const,
      relevance: 0.85,
      preview: "Gains from transfer of digital assets including cryptocurrencies and NFTs are taxable under capital gains provisions. The computation of gains shall be based on...",
      section: "Section 115BBH"
    },
    {
      id: "gst_007",
      title: "E-commerce Operator Obligations under GST",
      type: "GST Act" as const,
      relevance: 0.79,
      preview: "Every e-commerce operator facilitating digital services must collect tax at source and furnish monthly returns. The operator is required to maintain detailed records...",
      section: "Section 52"
    },
    {
      id: "cj_008",
      title: "Supreme Court - Digital Payment Gateway Tax (2022)",
      type: "Court Judgment" as const,
      relevance: 0.76,
      preview: "The Supreme Court clarified that digital payment gateways providing services to Indian merchants are liable to pay GST regardless of their physical presence in India...",
      section: "Para 22-25"
    },
    {
      id: "pl_009",
      title: "Digital Copyright Protection and Property Rights",
      type: "Property Law" as const,
      relevance: 0.73,
      preview: "Protection of digital content and software under copyright law extends to online platforms. The exclusive rights of copyright owners in digital medium include...",
      section: "Section 14"
    },
    {
      id: "it_010",
      title: "TDS on Digital Advertising Revenue",
      type: "Income Tax Act" as const,
      relevance: 0.68,
      preview: "Tax deduction at source on payments to digital advertising agencies and online marketing services is mandatory under section 194J. The rate of deduction varies...",
      section: "Section 194J"
    }
  ],
  mmr: [
    {
      id: "cj_011",
      title: "Bombay High Court - Cross-border Digital Services (2023)",
      type: "Court Judgment" as const,
      relevance: 0.87,
      preview: "The court examined the constitutional validity of taxing cross-border digital services and upheld the legislative competence of Parliament to tax such transactions...",
      section: "Para 8-12"
    },
    {
      id: "pl_012",
      title: "Data Localization and Digital Sovereignty Laws",
      type: "Property Law" as const,
      relevance: 0.81,
      preview: "Personal data protection laws mandate local storage of critical personal data within Indian territory. Companies providing digital services must comply with data localization...",
      section: "Section 40"
    },
    {
      id: "it_013",
      title: "Equalization Levy on Digital Services - Finance Act",
      type: "Income Tax Act" as const,
      relevance: 0.77,
      preview: "The equalization levy at 6% is applicable on payments to non-resident service providers for specified digital services. The levy applies when the aggregate payment...",
      section: "Section 165"
    },
    {
      id: "gst_014",
      title: "Input Tax Credit for Digital Infrastructure",
      type: "GST Act" as const,
      relevance: 0.72,
      preview: "Businesses engaged in providing digital services can claim input tax credit on GST paid for digital infrastructure, software licenses, and cloud computing services...",
      section: "Section 16"
    },
    {
      id: "cj_015",
      title: "Karnataka High Court - Digital Platform Liability (2022)",
      type: "Court Judgment" as const,
      relevance: 0.66,
      preview: "The court held that digital platforms facilitating commercial transactions have joint liability for tax compliance along with the actual service providers...",
      section: "Para 28-32"
    }
  ],
  hybrid: [
    {
      id: "combined_001",
      title: "Comprehensive Digital Services Tax Framework - Multi-Act Analysis",
      type: "GST Act" as const,
      relevance: 0.94,
      preview: "The integrated approach to taxing digital services combines provisions from GST Act, Income Tax Act, and recent court precedents to create a comprehensive framework...",
      section: "Combined Analysis"
    },
    {
      id: "it_016",
      title: "Digital Business Income and Permanent Establishment",
      type: "Income Tax Act" as const,
      relevance: 0.88,
      preview: "Determination of permanent establishment for digital businesses involves analyzing significant economic presence criteria including user base, digital transactions...",
      section: "Section 9A"
    },
    {
      id: "cj_017",
      title: "Apex Court Ruling - Digital Economy Taxation Principles",
      type: "Court Judgment" as const,
      relevance: 0.84,
      preview: "The Supreme Court laid down comprehensive principles for taxation of digital economy participants, emphasizing substance over form and economic reality...",
      section: "Para 45-52"
    },
    {
      id: "pl_018",
      title: "Digital Asset Ownership and Transfer Laws",
      type: "Property Law" as const,
      relevance: 0.80,
      preview: "Legal framework governing ownership, transfer, and taxation of digital assets including domain names, digital currencies, and online business assets...",
      section: "Chapter 7"
    },
    {
      id: "gst_019",
      title: "Digital Services and Export Benefits - Zero Rating",
      type: "GST Act" as const,
      relevance: 0.75,
      preview: "Export of digital services qualifies for zero-rating under GST provided specific conditions are met including recipient location verification and payment in convertible foreign exchange...",
      section: "Section 16(1)"
    }
  ]
};

export const sampleMetrics = {
  precision: {
    cosine: 0.8,
    euclidean: 0.6,
    mmr: 0.7,
    hybrid: 0.85
  },
  recall: {
    cosine: 0.75,
    euclidean: 0.65,
    mmr: 0.8,
    hybrid: 0.9
  },
  diversity: {
    cosine: 0.6,
    euclidean: 0.55,
    mmr: 0.95,
    hybrid: 0.75
  },
  response_time: {
    cosine: "120ms",
    euclidean: "95ms", 
    mmr: "150ms",
    hybrid: "180ms"
  }
};