import type {
  PropertyInputState,
  ValuationResponse,
  RenovationRequest,
  RenovationResponse,
  PriceBreakdownItem,
  ComparableProperty,
  AmenityInfo,
  CalculationStep,
} from '../types/valuation';

export const convertAreaToSqFt = (area: number, unit: string): number => {
  switch (unit) {
    case 'gaj':
      return Math.round(area * 9);
    case 'guntha':
      return Math.round(area * 1089);
    case 'bigha':
      return Math.round(area * 14400);
    case 'sqft':
    default:
      return Math.round(area);
  }
};

export const generateMockValuationResponse = (input: PropertyInputState): ValuationResponse => {
  const areaSqFt = convertAreaToSqFt(input.area, input.areaUnit);
  const town = input.location || 'Alwar';

  // Base rate per sq.ft
  let baseRatePerSqFt = 3200;
  if (input.propertyType === 'shop') {
    baseRatePerSqFt = 6800;
  } else if (input.propertyType === 'apartment') {
    baseRatePerSqFt = 3600;
  } else if (input.propertyType === 'plot') {
    baseRatePerSqFt = 2800;
  }

  const baseValue = Math.round(areaSqFt * baseRatePerSqFt);
  const breakdown: PriceBreakdownItem[] = [];

  breakdown.push({
    id: 'base_locality',
    labelKey: 'why_price.base_label',
    labelFallback: `Base Circle Rate Guidance (${town} Sector Benchmark)`,
    amount: baseValue,
    type: 'base',
    explanation: `Derived from sub-registrar circle rates and 12-month median registration values in ${town}.`,
    tag: 'Base Circle Rate',
  });

  // Road width factor
  let roadBonus = 0;
  if (input.roadWidth === '30ft') {
    roadBonus = Math.round(baseValue * 0.05);
    breakdown.push({
      id: 'road_30ft',
      labelKey: 'why_price.wide_road',
      labelFallback: 'Wide Road Advantage (30 ft Road)',
      amount: roadBonus,
      type: 'positive',
      explanation: '30 ft wide approach allows two-way vehicular movement and easy emergency access (+5% premium).',
      tag: '+5% Road Premium',
    });
  } else if (input.roadWidth === '40ft' || input.roadWidth === '60ft') {
    roadBonus = Math.round(baseValue * 0.09);
    breakdown.push({
      id: 'road_wide',
      labelKey: 'why_price.wide_road',
      labelFallback: 'Main Sector Road Advantage (40ft+ Road)',
      amount: roadBonus,
      type: 'positive',
      explanation: 'Direct front access on a 40ft+ main artery commands a major small-town premium (+9%).',
      tag: '+9% Artery Premium',
    });
  }

  // Corner plot factor
  let cornerBonus = 0;
  if (input.isCornerPlot) {
    cornerBonus = Math.round(baseValue * 0.08);
    breakdown.push({
      id: 'corner_plot',
      labelKey: 'why_price.corner_plot',
      labelFallback: 'Corner Plot Premium (2 Sides Open)',
      amount: cornerBonus,
      type: 'positive',
      explanation: 'Corner plots enjoy double ventilation, dual road access, and higher commercial re-sale demand.',
      tag: '+8% Dual Access',
    });
  }

  // School / Amenity factor
  const amenityBonus = Math.round(baseValue * 0.035);
  breakdown.push({
    id: 'school_proximity',
    labelKey: 'why_price.near_school',
    labelFallback: 'Reputed School & Market Proximity (< 800m)',
    amount: amenityBonus,
    type: 'positive',
    explanation: 'Walkable distance to top CBSE school and daily mandi adds sustained rental and family appeal.',
    tag: '+3.5% Civic Proximity',
  });

  // Age depreciation factor
  let ageDepreciation = 0;
  if (input.propertyType !== 'plot') {
    if (input.age === '5_10') {
      ageDepreciation = -Math.round(baseValue * 0.05);
      breakdown.push({
        id: 'age_deprec_5_10',
        labelKey: 'why_price.old_construction',
        labelFallback: 'Construction Age Adjustment (5–10 Yrs)',
        amount: ageDepreciation,
        type: 'negative',
        explanation: 'Standard CPWD structural depreciation curve applied for a 5-10 year old masonry structure.',
        tag: '-5% Depreciation',
      });
    } else if (input.age === '10_20' || input.age === '20_plus') {
      ageDepreciation = -Math.round(baseValue * 0.12);
      breakdown.push({
        id: 'age_deprec_old',
        labelKey: 'why_price.old_construction',
        labelFallback: 'Structural Age Depreciation (10+ Yrs)',
        amount: ageDepreciation,
        type: 'negative',
        explanation: 'Older electrical, plumbing and plaster fixtures require modern refurbishment allowance.',
        tag: '-12% Age Allowance',
      });
    }
  }

  // Total Estimated Mid Value
  const estimatedMid = baseValue + roadBonus + cornerBonus + amenityBonus + ageDepreciation;
  const spread = Math.round(estimatedMid * 0.04);
  const estimatedMin = estimatedMid - spread;
  const estimatedMax = estimatedMid + spread;
  const effectiveRateSqFt = Math.round(estimatedMid / areaSqFt);

  // Comparables
  const comparables: ComparableProperty[] = [
    {
      id: 'comp-1',
      title: `3 BHK Residential House, Sector 4`,
      locality: `${town} Central`,
      distanceKm: 0.35,
      areaSqFt: Math.round(areaSqFt * 1.05),
      propertyType: input.propertyType,
      salePrice: Math.round(estimatedMid * 1.02),
      ratePerSqFt: Math.round(effectiveRateSqFt * 0.98),
      registrationDate: '18 Jan 2026',
      source: 'Sub-Registrar Registry (Book 1, Vol 412)',
      similarityScore: 94,
      keyFeatures: ['30ft Road', 'Corner Unit', 'Bank Verified Sale'],
    },
    {
      id: 'comp-2',
      title: `Independent House / Plot, Near Bypass`,
      locality: `${town} Bypass Road`,
      distanceKm: 0.8,
      areaSqFt: Math.round(areaSqFt * 0.95),
      propertyType: input.propertyType,
      salePrice: Math.round(estimatedMid * 0.96),
      ratePerSqFt: Math.round(effectiveRateSqFt * 1.01),
      registrationDate: '04 Dec 2025',
      source: 'Municipal Property Tax Assessment',
      similarityScore: 90,
      keyFeatures: ['25ft Road', 'Regular Plot', 'Self-Occupied'],
    },
    {
      id: 'comp-3',
      title: `Residential Asset, Colony Block B`,
      locality: `${town} Station Road`,
      distanceKm: 1.2,
      areaSqFt: areaSqFt,
      propertyType: input.propertyType,
      salePrice: Math.round(estimatedMid * 1.05),
      ratePerSqFt: Math.round(effectiveRateSqFt * 1.05),
      registrationDate: '22 Oct 2025',
      source: 'On-Ground Verified Broker Deal',
      similarityScore: 86,
      keyFeatures: ['40ft Road', 'Near Market', 'Cash+Loan Cleared'],
    },
  ];

  const amenities: AmenityInfo[] = [
    { name: 'DPS / Model Senior Secondary School', category: 'Education', distance: '650 m (4 mins)', impactScore: 'High Proximity Boost' },
    { name: 'Civil Hospital & Trauma Center', category: 'Healthcare', distance: '1.4 km (6 mins)', impactScore: 'Essential Service Node' },
    { name: 'Main Commercial Market / Mandi', category: 'Retail', distance: '850 m (5 mins)', impactScore: 'Commercial Footfall Anchor' },
    { name: 'National Highway / Bypass Access', category: 'Transport', distance: '1.1 km (4 mins)', impactScore: '+4.2% liquidity boost' },
  ];

  const calculations: CalculationStep[] = [
    {
      stepNumber: 1,
      title: 'Sub-Registrar Circle Rate Base Valuation',
      explanation: 'Computed by multiplying declared area with current government guidance circle rate for the micro-zone.',
      formula: `Area (${areaSqFt} sq.ft) × Circle Rate Baseline`,
      value: 'Base Benchmark Rate',
    },
    {
      stepNumber: 2,
      title: 'Approach Road & Road Width Adjustment',
      explanation: 'Applies small-town road width premium (+5% for 30ft, +9% for 40ft+).',
      formula: `Road Width Factor (${input.roadWidth})`,
      value: input.roadWidth === '30ft' ? '+5% Multiplier' : '+9% Artery Multiplier',
    },
    {
      stepNumber: 3,
      title: 'Corner Plot & Open-Sides Premium',
      explanation: input.isCornerPlot ? '2-side open corner plot commands high visibility and parking headroom.' : 'Standard mid-row plot baseline.',
      formula: input.isCornerPlot ? 'Corner Dual-Access (+8%)' : 'Standard Alignment',
      value: input.isCornerPlot ? '+8% Corner Premium' : 'Baseline Standard',
    },
    {
      stepNumber: 4,
      title: 'Civic Infrastructure & School Proximity Multiplier',
      explanation: 'Proximity to high-density amenities and transit corridors within 1 km radius.',
      formula: `Locality Amenity Index (+3.5%)`,
      value: '+3.5% Civic Boost',
    },
    {
      stepNumber: 5,
      title: 'Depreciation / Age Factor',
      explanation: input.propertyType === 'plot' ? 'Plots do not undergo physical structural depreciation.' : 'Standard CPWD structural decay curve.',
      formula: `Structural Allowance based on ${input.age.replace('_', '–')} yrs`,
      value: ageDepreciation !== 0 ? 'Standard Age Depreciation' : 'Zero Depreciation',
    },
  ];

  const limitations: string[] = [
    'Valuation reflects free-hold, clear-title residential properties without encumbrances or litigation.',
    'Interior luxury fittings, custom teak woodwork, or smart home automation are evaluated on standard replacement cost.',
    'Actual final negotiated price may vary by ±3-5% based on buyer urgent cash liquidity and distress factors.',
    'Circle rates reflect the latest municipal gazette revision for small towns.',
  ];

  return {
    id: `MS-${Date.now().toString().slice(-6)}`,
    intent: input.intent,
    estimatedValueMin: estimatedMin,
    estimatedValueMax: estimatedMax,
    estimatedValueMid: estimatedMid,
    ratePerSqFt: effectiveRateSqFt,
    circleRatePerSqFt: baseRatePerSqFt,
    evidenceStrength: 'High',
    confidenceScore: 92,
    comparableCount: 14,
    locationSignals: [
      `30ft+ approach road connectivity`,
      `Circle rate revised +6.4% in current financial year`,
      `400m from National Highway / Ring Road Bypass`,
      `14 verified sub-registrar transactions within 1.5km radius`,
    ],
    price_breakdown: breakdown,
    comparables,
    amenities,
    calculations,
    limitations,
    generatedAt: new Date().toLocaleDateString('en-IN', {
      day: 'numeric',
      month: 'short',
      year: 'numeric',
    }),
    propertySummary: {
      location: town,
      propertyType: input.propertyType,
      areaSqFt,
      areaOriginal: `${input.area} ${input.areaUnit.toUpperCase()}`,
      age: input.age,
      roadWidth: input.roadWidth,
      isCornerPlot: input.isCornerPlot,
      bedrooms: input.bedrooms,
      intent: input.intent,
    },
  };
};

export const generateMockRenovationResponse = (req: RenovationRequest): RenovationResponse => {
  let roiFactor = 1.6;
  const factors: { factor: string; boost: number }[] = [];

  switch (req.renovationType) {
    case 'kitchen_bath':
      roiFactor = 1.75;
      factors.push({ factor: 'Modern modular fittings appeal to young small-town families', boost: 60 });
      factors.push({ factor: 'Eliminates plumbing leakage concerns for prospective buyers', boost: 40 });
      break;
    case 'paint_flooring':
      roiFactor = 1.55;
      factors.push({ factor: 'Immediate aesthetic curb appeal and fresh lighting reflection', boost: 65 });
      factors.push({ factor: 'Vitrified tiles elevate standard perceived carpet quality', boost: 35 });
      break;
    case 'extra_room':
      roiFactor = 2.1;
      factors.push({ factor: 'Adds direct usable carpet area and extra rental stream', boost: 75 });
      factors.push({ factor: 'Meets demand for joint-family expansion in Tier 2/3 towns', boost: 25 });
      break;
    case 'facade':
      roiFactor = 1.65;
      factors.push({ factor: 'Front exterior styling commands instant road-appeal premium', boost: 70 });
      factors.push({ factor: 'Distinguishes the property from identical older colony houses', boost: 30 });
      break;
    case 'full_makeover':
      roiFactor = 1.85;
      factors.push({ factor: 'Moves property from "requires work" to "ready-to-move"', boost: 60 });
      factors.push({ factor: 'Bank valuation appraisal increases substantially for loans', boost: 40 });
      break;
  }

  const potentialValueChange = Math.round(req.renovationCost * roiFactor);
  const potentialPostRenovationValue = req.currentValue + potentialValueChange;
  const potentialNetDifference = potentialValueChange - req.renovationCost;
  const roiPercentage = Math.round((potentialNetDifference / req.renovationCost) * 100);

  return {
    currentValue: req.currentValue,
    renovationCost: req.renovationCost,
    renovationType: req.renovationType,
    potentialValueChange,
    potentialPostRenovationValue,
    potentialNetDifference,
    roiPercentage,
    disclaimer: 'Scenario estimate — not a guaranteed return.',
    breakdownFactors: factors,
  };
};
