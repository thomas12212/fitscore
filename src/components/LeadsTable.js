"use client";

const warmthColors = {
  "Just Getting Started": { bg: "#6b728020", text: "#6b7280", border: "#6b728040" },
  "Building Foundation": { bg: "#f59e0b20", text: "#f59e0b", border: "#f59e0b40" },
  "Making Progress": { bg: "#ef444420", text: "#ef4444", border: "#ef444440" },
  "Ready to Transform": { bg: "#ff4d4d20", text: "#ff4d4d", border: "#ff4d4d40" },
};

const statusConfig = {
  new: { label: "New", bg: "#3b82f620", text: "#3b82f6", border: "#3b82f640" },
  contacted: { label: "Contacted", bg: "#f59e0b20", text: "#f59e0b", border: "#f59e0b40" },
  booked: { label: "Booked", bg: "#10b98120", text: "#10b981", border: "#10b98140" },
  closed: { label: "Closed", bg: "#8b5cf620", text: "#8b5cf6", border: "#8b5cf640" },
};

const statusOrder = ["new", "contacted", "booked", "closed"];

export default function LeadsTable({ leads, sort, onSortChange, onStatusChange }) {
  function formatDate(dateStr) {
    const d = new Date(dateStr);
    return d.toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
      year: "numeric",
    });
  }

  function getSortIcon(field) {
    if (sort === `${field}_desc`) return " ↓";
    if (sort === `${field}_asc`) return " ↑";
    return "";
  }

  function toggleSort(field) {
    if (sort === `${field}_desc`) {
      onSortChange(`${field}_asc`);
    } else {
      onSortChange(`${field}_desc`);
    }
  }

  function cycleStatus(lead) {
    const currentIndex = statusOrder.indexOf(lead.status || "new");
    const nextStatus = statusOrder[(currentIndex + 1) % statusOrder.length];
    onStatusChange(lead.id, nextStatus);
  }

  if (leads.length === 0) {
    return (
      <div className="bg-surface rounded-xl p-8 text-center">
        <p className="text-muted text-lg">No leads yet. Share your quiz link to get started!</p>
      </div>
    );
  }

  return (
    <div className="bg-surface rounded-xl overflow-hidden">
      {/* Desktop table */}
      <div className="hidden md:block overflow-x-auto">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-border">
              <th className="text-left p-4 text-muted font-medium">Name</th>
              <th className="text-left p-4 text-muted font-medium">Email</th>
              <th
                className="text-left p-4 text-muted font-medium cursor-pointer hover:text-foreground"
                onClick={() => toggleSort("score")}
              >
                Score{getSortIcon("score")}
              </th>
              <th className="text-left p-4 text-muted font-medium">Tier</th>
              <th className="text-left p-4 text-muted font-medium">Status</th>
              <th
                className="text-left p-4 text-muted font-medium cursor-pointer hover:text-foreground"
                onClick={() => toggleSort("date")}
              >
                Date{getSortIcon("date")}
              </th>
            </tr>
          </thead>
          <tbody>
            {leads.map((lead) => {
              const colors = warmthColors[lead.tier] || warmthColors["Just Getting Started"];
              const status = statusConfig[lead.status || "new"];
              return (
                <tr key={lead.id} className="border-b border-border last:border-0 hover:bg-elevated transition-colors">
                  <td className="p-4 font-medium">{lead.name}</td>
                  <td className="p-4 text-muted">{lead.email}</td>
                  <td className="p-4">
                    <span className="font-bold">{lead.percentage}%</span>
                    <span className="text-muted text-xs ml-1">
                      ({lead.score}/{lead.maxScore})
                    </span>
                  </td>
                  <td className="p-4">
                    <span
                      className="inline-block px-2 py-1 rounded-full text-xs font-medium"
                      style={{
                        background: colors.bg,
                        color: colors.text,
                        border: `1px solid ${colors.border}`,
                      }}
                    >
                      {lead.tier}
                    </span>
                  </td>
                  <td className="p-4">
                    <button
                      onClick={() => cycleStatus(lead)}
                      className="inline-block px-2 py-1 rounded-full text-xs font-medium cursor-pointer transition-all hover:scale-105"
                      style={{
                        background: status.bg,
                        color: status.text,
                        border: `1px solid ${status.border}`,
                      }}
                      title="Click to change status"
                    >
                      {status.label}
                    </button>
                  </td>
                  <td className="p-4 text-muted">{formatDate(lead.createdAt)}</td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>

      {/* Mobile cards */}
      <div className="md:hidden divide-y divide-border">
        {leads.map((lead) => {
          const colors = warmthColors[lead.tier] || warmthColors["Just Getting Started"];
          const status = statusConfig[lead.status || "new"];
          return (
            <div key={lead.id} className="p-4">
              <div className="flex justify-between items-start mb-2">
                <div>
                  <p className="font-medium">{lead.name}</p>
                  <p className="text-sm text-muted">{lead.email}</p>
                </div>
                <span className="text-xl font-heading">{lead.percentage}%</span>
              </div>
              <div className="flex justify-between items-center">
                <div className="flex gap-2">
                  <span
                    className="inline-block px-2 py-1 rounded-full text-xs font-medium"
                    style={{
                      background: colors.bg,
                      color: colors.text,
                      border: `1px solid ${colors.border}`,
                    }}
                  >
                    {lead.tier}
                  </span>
                  <button
                    onClick={() => cycleStatus(lead)}
                    className="inline-block px-2 py-1 rounded-full text-xs font-medium cursor-pointer"
                    style={{
                      background: status.bg,
                      color: status.text,
                      border: `1px solid ${status.border}`,
                    }}
                  >
                    {status.label}
                  </button>
                </div>
                <span className="text-xs text-muted">{formatDate(lead.createdAt)}</span>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
