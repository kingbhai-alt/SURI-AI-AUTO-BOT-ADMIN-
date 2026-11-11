import React, { useState } from 'react';
import { 
  Database, 
  Search, 
  Copy, 
  Check, 
  Trash2, 
  Download, 
  FileText, 
  Ban, 
  CheckCircle,
  Filter,
  Calendar,
  UserCheck
} from 'lucide-react';
import { LicenseRecord } from '../utils/license';
import { playCyberCopy, playCyberClick } from '../utils/audio';
import { copyToClipboard } from '../utils/clipboard';

interface LicensesTableProps {
  records: LicenseRecord[];
  onDeleteRecord: (id: string) => void;
  onClearAll: () => void;
  onToggleStatus: (id: string) => void;
  onCopySuccess: (text: string) => void;
}

export const LicensesTable: React.FC<LicensesTableProps> = ({
  records,
  onDeleteRecord,
  onClearAll,
  onToggleStatus,
  onCopySuccess,
}) => {
  const [searchTerm, setSearchTerm] = useState<string>('');
  const [tierFilter, setTierFilter] = useState<string>('all');
  const [copiedId, setCopiedId] = useState<string | null>(null);

  const filteredRecords = records.filter((r) => {
    const matchesSearch =
      r.key.toLowerCase().includes(searchTerm.toLowerCase()) ||
      r.clientName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (r.notes && r.notes.toLowerCase().includes(searchTerm.toLowerCase()));

    const matchesTier =
      tierFilter === 'all' ||
      (tierFilter === '7' && r.durationDays === 7) ||
      (tierFilter === '30' && r.durationDays === 30);

    return matchesSearch && matchesTier;
  });

  const handleCopyRow = async (r: LicenseRecord) => {
    playCyberCopy();
    await copyToClipboard(r.key);
    setCopiedId(r.id);
    onCopySuccess(`COPIED: ${r.key}`);
    setTimeout(() => setCopiedId(null), 2000);
  };

  const exportCSV = () => {
    playCyberClick();
    if (records.length === 0) return;

    let csv = 'Key,DurationDays,Tier,ClientName,CreatedAt,ExpiresAt,Status,Format\n';
    records.forEach((r) => {
      const created = new Date(r.createdAt).toISOString();
      const expires = new Date(r.expiresAt).toISOString();
      csv += `"${r.key}","${r.durationDays}","${r.tier}","${r.clientName}","${created}","${expires}","${r.status}","${r.format}"\n`;
    });

    const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `suri_bot_licenses_${Date.now()}.csv`;
    link.click();
    URL.revokeObjectURL(url);
  };

  const exportJSON = () => {
    playCyberClick();
    if (records.length === 0) return;

    const data = JSON.stringify(records, null, 2);
    const blob = new Blob([data], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `suri_bot_licenses_${Date.now()}.json`;
    link.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div className="bg-gradient-to-b from-zinc-950/95 to-black/90 border border-zinc-800/90 rounded-2xl p-5 sm:p-6">
      
      {/* Table Title and Actions Bar */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-zinc-800/80 pb-4 mb-5">
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 rounded-xl bg-zinc-900 border border-zinc-800 flex items-center justify-center text-red-500">
            <Database className="w-5 h-5" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="text-[10px] font-mono text-red-400 uppercase font-bold px-1.5 py-0.5 rounded bg-red-950/60 border border-red-800/40">
                ADMIN DATABASE
              </span>
              <span className="text-xs font-mono text-zinc-500">
                {records.length} TOTAL REGISTERED
              </span>
            </div>
            <h3 className="text-lg font-bold font-cyber text-white">
              GENERATED LICENSES LOG
            </h3>
          </div>
        </div>

        {/* Action buttons */}
        <div className="flex flex-wrap items-center gap-2">
          <button
            type="button"
            onClick={exportCSV}
            disabled={records.length === 0}
            className="px-3 py-1.5 rounded-lg bg-zinc-900 hover:bg-zinc-800 border border-zinc-800 text-xs font-mono text-zinc-300 hover:text-white transition-colors flex items-center gap-1.5 disabled:opacity-40"
          >
            <Download className="w-3.5 h-3.5 text-red-400" />
            <span>CSV</span>
          </button>

          <button
            type="button"
            onClick={exportJSON}
            disabled={records.length === 0}
            className="px-3 py-1.5 rounded-lg bg-zinc-900 hover:bg-zinc-800 border border-zinc-800 text-xs font-mono text-zinc-300 hover:text-white transition-colors flex items-center gap-1.5 disabled:opacity-40"
          >
            <FileText className="w-3.5 h-3.5 text-zinc-400" />
            <span>JSON</span>
          </button>

          <button
            type="button"
            onClick={() => {
              if (window.confirm('Clear all stored license keys?')) {
                onClearAll();
              }
            }}
            disabled={records.length === 0}
            className="px-3 py-1.5 rounded-lg bg-red-950/40 hover:bg-red-950 border border-red-900/60 text-xs font-mono text-red-400 hover:text-red-300 transition-colors flex items-center gap-1.5 disabled:opacity-40"
          >
            <Trash2 className="w-3.5 h-3.5" />
            <span>CLEAR ALL</span>
          </button>
        </div>
      </div>

      {/* Filter & Search Toolbar */}
      <div className="grid grid-cols-1 sm:grid-cols-12 gap-3 mb-4">
        <div className="sm:col-span-8 relative">
          <Search className="w-4 h-4 text-zinc-500 absolute left-3.5 top-3" />
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="Search by license key, client name, or tag..."
            className="w-full bg-zinc-900/80 border border-zinc-800 rounded-xl pl-10 pr-4 py-2 text-xs font-mono text-white placeholder-zinc-500 focus:outline-none focus:border-red-500 transition-colors"
          />
        </div>

        <div className="sm:col-span-4 flex items-center gap-2">
          <span className="text-xs font-mono text-zinc-500 shrink-0">TIER:</span>
          <select
            value={tierFilter}
            onChange={(e) => setTierFilter(e.target.value)}
            className="w-full bg-zinc-900/80 border border-zinc-800 rounded-xl px-3 py-2 text-xs font-mono text-white focus:outline-none focus:border-red-500 transition-colors"
          >
            <option value="all">All Tiers ({records.length})</option>
            <option value="7">7 Days Standard</option>
            <option value="30">30 Days Premium</option>
          </select>
        </div>
      </div>

      {/* Data Table */}
      <div className="overflow-x-auto rounded-xl border border-zinc-800/80 bg-black/60">
        <table className="w-full text-left text-xs font-mono">
          <thead className="bg-zinc-900/90 text-zinc-400 uppercase border-b border-zinc-800 tracking-wider">
            <tr>
              <th className="py-3 px-4">LICENSE KEY</th>
              <th className="py-3 px-3">TIER / DURATION</th>
              <th className="py-3 px-3">ASSIGNED CLIENT</th>
              <th className="py-3 px-3">CREATED</th>
              <th className="py-3 px-3">EXPIRES</th>
              <th className="py-3 px-3">STATUS</th>
              <th className="py-3 px-4 text-right">ACTIONS</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-zinc-900 text-zinc-300">
            {filteredRecords.length > 0 ? (
              filteredRecords.map((r) => {
                const isItemCopied = copiedId === r.id;
                const isRevoked = r.status === 'revoked';
                const createdStr = new Date(r.createdAt).toLocaleDateString();
                const expiresStr = new Date(r.expiresAt).toLocaleDateString();

                return (
                  <tr
                    key={r.id}
                    className="hover:bg-zinc-900/40 transition-colors group"
                  >
                    {/* Key */}
                    <td className="py-3 px-4 font-bold text-red-400 select-all">
                      <span className={isRevoked ? 'line-through text-zinc-500' : ''}>
                        {r.key}
                      </span>
                    </td>

                    {/* Tier */}
                    <td className="py-3 px-3">
                      <span
                        className={`px-2 py-0.5 rounded text-[11px] font-bold border ${
                          r.durationDays === 7
                            ? 'bg-amber-500/10 text-amber-300 border-amber-500/30'
                            : 'bg-red-500/10 text-red-300 border-red-500/30'
                        }`}
                      >
                        {r.tier}
                      </span>
                    </td>

                    {/* Client */}
                    <td className="py-3 px-3 text-zinc-300">
                      {r.clientName}
                    </td>

                    {/* Created */}
                    <td className="py-3 px-3 text-zinc-500">
                      {createdStr}
                    </td>

                    {/* Expires */}
                    <td className="py-3 px-3 text-zinc-500">
                      {expiresStr}
                    </td>

                    {/* Status */}
                    <td className="py-3 px-3">
                      {isRevoked ? (
                        <span className="text-zinc-500 font-semibold flex items-center gap-1">
                          <Ban className="w-3 h-3 text-zinc-500" />
                          <span>REVOKED</span>
                        </span>
                      ) : (
                        <span className="text-emerald-400 font-semibold flex items-center gap-1">
                          <span className="w-1.5 h-1.5 rounded-full bg-emerald-500" />
                          <span>ACTIVE</span>
                        </span>
                      )}
                    </td>

                    {/* Actions */}
                    <td className="py-3 px-4 text-right">
                      <div className="flex items-center justify-end gap-1.5">
                        {/* Copy Button */}
                        <button
                          type="button"
                          onClick={() => handleCopyRow(r)}
                          title="Copy Key"
                          className={`px-2.5 py-1 rounded text-xs font-mono font-bold transition-all flex items-center gap-1 ${
                            isItemCopied
                              ? 'bg-emerald-600 text-white'
                              : 'bg-zinc-800 hover:bg-red-600 text-zinc-200 hover:text-white'
                          }`}
                        >
                          {isItemCopied ? (
                            <>
                              <Check className="w-3 h-3" />
                              <span>COPIED</span>
                            </>
                          ) : (
                            <>
                              <Copy className="w-3 h-3" />
                              <span>COPY</span>
                            </>
                          )}
                        </button>

                        {/* Revoke / Unrevoke */}
                        <button
                          type="button"
                          onClick={() => onToggleStatus(r.id)}
                          title={isRevoked ? 'Activate License' : 'Revoke License'}
                          className="p-1 rounded bg-zinc-800 hover:bg-zinc-700 text-zinc-400 hover:text-white transition-colors"
                        >
                          <Ban className="w-3.5 h-3.5" />
                        </button>

                        {/* Delete Button */}
                        <button
                          type="button"
                          onClick={() => onDeleteRecord(r.id)}
                          title="Delete Record"
                          className="p-1 rounded bg-zinc-800 hover:bg-red-950 text-zinc-400 hover:text-red-400 transition-colors"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </td>
                  </tr>
                );
              })
            ) : (
              <tr>
                <td
                  colSpan={7}
                  className="py-10 text-center text-zinc-500 font-mono"
                >
                  {records.length === 0
                    ? 'No license keys generated yet. Use the Key Generator above to issue keys.'
                    : 'No licenses matched your search or tier filter.'}
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

    </div>
  );
};
