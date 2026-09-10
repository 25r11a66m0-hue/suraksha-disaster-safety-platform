import React, { useState, useEffect } from 'react';
import { AuditLog } from '../../types';
import { ShieldAlert, Clock, RefreshCw, FileText } from 'lucide-react';

interface AuditLogsViewProps {
  authToken: string;
}

export const AuditLogsView: React.FC<AuditLogsViewProps> = ({ authToken }) => {
  const [logs, setLogs] = useState<AuditLog[]>([]);
  const [isLoading, setIsLoading] = useState(false);

  const fetchLogs = async () => {
    setIsLoading(true);
    try {
      const res = await fetch('/api/audit-logs', {
        headers: { Authorization: `Bearer ${authToken}` }
      });
      if (!res.ok) throw new Error('Failed to fetch audit logs.');
      const data = await res.json();
      setLogs(data);
    } catch (err) {
      console.error(err);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchLogs();
  }, [authToken]);

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div>
          <h2 className="text-lg font-bold text-slate-900 flex items-center gap-2">
            <FileText size={20} className="text-amber-800" />
            <span>Immutable Authority Audit & Compliance Log</span>
          </h2>
          <p className="text-xs text-slate-500">
            Cryptographic, time-stamped audit records of all official alert broadcasts, team dispatches, and emergency actions.
          </p>
        </div>

        <button
          onClick={fetchLogs}
          disabled={isLoading}
          className="flex items-center gap-1.5 px-3 py-1.5 border border-slate-300 rounded-lg text-xs font-semibold text-slate-700 hover:bg-slate-50 cursor-pointer"
        >
          <RefreshCw size={13} className={isLoading ? 'animate-spin' : ''} />
          <span>Refresh Logs</span>
        </button>
      </div>

      <div className="bg-white border border-slate-200 rounded-xl overflow-hidden shadow-2xs">
        <div className="p-4 border-b border-slate-100 flex items-center justify-between">
          <span className="text-xs font-bold uppercase tracking-wider text-slate-600">
            Recorded Administrative Transactions ({logs.length})
          </span>
          <span className="text-xs text-slate-400 font-mono">
            Append-only Security Store
          </span>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-slate-50 border-b border-slate-200 text-slate-600 font-bold uppercase tracking-wider">
              <tr>
                <th className="p-3">Log ID</th>
                <th className="p-3">Timestamp</th>
                <th className="p-3">Authority User</th>
                <th className="p-3">Action</th>
                <th className="p-3">Entity Ref</th>
                <th className="p-3">Transaction Details</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 font-medium font-mono text-[11px]">
              {logs.length === 0 ? (
                <tr>
                  <td colSpan={6} className="p-8 text-center text-slate-400 font-sans text-xs">
                    No transactions recorded in this session.
                  </td>
                </tr>
              ) : (
                logs.map((log) => (
                  <tr key={log.id} className="hover:bg-slate-50">
                    <td className="p-3 font-bold text-slate-800">{log.id}</td>
                    <td className="p-3 text-slate-500">
                      {new Date(log.timestamp).toLocaleString()}
                    </td>
                    <td className="p-3 text-slate-900 font-bold">
                      {log.authorityName} ({log.authorityId})
                    </td>
                    <td className="p-3">
                      <span className="px-2 py-0.5 bg-slate-100 text-slate-800 font-bold rounded">
                        {log.action}
                      </span>
                    </td>
                    <td className="p-3 text-amber-900">{log.targetEntityId || '-'}</td>
                    <td className="p-3 text-slate-600 font-sans text-xs">
                      {log.details}
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
