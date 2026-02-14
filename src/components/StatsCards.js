"use client";

export default function StatsCards({ stats }) {
  const { totalLeads, averageScore, tierDistribution } = stats;

  // Find the hottest tier with leads
  const tierOrder = ["Ready to Transform", "Making Progress", "Building Foundation", "Just Getting Started"];
  const hottestTier = tierOrder.find((t) => (tierDistribution[t] || 0) > 0) || "—";

  return (
    <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mb-6">
      <div className="bg-surface rounded-xl p-4">
        <p className="text-xs text-muted uppercase tracking-wide mb-1">Total Leads</p>
        <p className="text-3xl font-heading">{totalLeads}</p>
      </div>
      <div className="bg-surface rounded-xl p-4">
        <p className="text-xs text-muted uppercase tracking-wide mb-1">Avg Score</p>
        <p className="text-3xl font-heading">{averageScore}%</p>
      </div>
      <div className="bg-surface rounded-xl p-4">
        <p className="text-xs text-muted uppercase tracking-wide mb-1">Hottest Tier</p>
        <p className="text-lg font-heading leading-tight mt-1">{hottestTier}</p>
      </div>
      <div className="bg-surface rounded-xl p-4">
        <p className="text-xs text-muted uppercase tracking-wide mb-1">Fire Leads</p>
        <p className="text-3xl font-heading">
          {tierDistribution["Ready to Transform"] || 0}
        </p>
      </div>
    </div>
  );
}
