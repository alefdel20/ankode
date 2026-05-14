export const ANKODE_PLANS = [
  { id: 'basico', name: 'Básico', price: 349, extraBranch: 149, included: 1 },
  { id: 'premium', name: 'Premium', price: 699, extraBranch: 129, included: 3 },
  { id: 'inclusive', name: 'All-Inclusive', price: 999, extraBranch: 99, included: 5 },
  { id: 'pro', name: 'All-Inclusive Pro', price: 999, extraBranch: 99, included: 5, initialFee: 8199 }
];

export const calculateAnkodePrice = (plan, isAnnual, extraBranchesCount) => {
  const monthlyBase = plan.price;
  const monthlyExtra = extraBranchesCount * plan.extraBranch;
  const totalMonthly = monthlyBase + monthlyExtra;

  if (isAnnual) {
    // Lógica de catálogo: 10 meses pagados = 12 meses de servicio
    const annualSoftware = totalMonthly * 10;
    return plan.initialFee ? annualSoftware + plan.initialFee : annualSoftware;
  }
  
  return plan.initialFee ? totalMonthly + plan.initialFee : totalMonthly;
};