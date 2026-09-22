import { jsPDF } from 'jspdf';
import autoTable from 'jspdf-autotable';

/**
 * Client-side forensic export helpers for the Security Audit Logs page.
 * Produces CSV, Excel (.xls), Word (.doc) and PDF artifacts from audit rows.
 */

const esc = (v: any) =>
  String(v ?? '').replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');

const tableRows = (logs: any[]) =>
  logs.map((l: any) => [
    l.created_at || '',
    l.action || '',
    l.actor_name || '',
    l.actor_role || '',
    l.resource || '',
    l.ip_address || ''
  ]);

const HEADERS = ['Timestamp (UTC)', 'Action', 'Actor', 'Role', 'Resource', 'IP Address'];

function download(blob: Blob, filename: string) {
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = filename;
  document.body.appendChild(a);
  a.click();
  a.remove();
  URL.revokeObjectURL(url);
}

const stamp = () => new Date().toISOString().slice(0, 19).replace(/[:T]/g, '-');

export function exportAuditCSV(logs: any[]) {
  const lines = [HEADERS.join(',')];
  for (const r of tableRows(logs)) {
    lines.push(r.map(c => `"${String(c).replace(/"/g, '""')}"`).join(','));
  }
  download(new Blob([lines.join('\n')], { type: 'text/csv' }), `audit_logs_${stamp()}.csv`);
}

export function exportAuditExcel(logs: any[]) {
  const html = `<html xmlns:x="urn:schemas-microsoft-com:office:excel"><head><meta charset="UTF-8" /></head><body><table border="1"><thead><tr>${HEADERS.map(h => `<th style="background:#065f46;color:#fff">${h}</th>`).join('')}</tr></thead><tbody>${tableRows(logs).map(r => `<tr>${r.map(c => `<td>${esc(c)}</td>`).join('')}</tr>`).join('')}</tbody></table></body></html>`;
  download(new Blob([html], { type: 'application/vnd.ms-excel' }), `audit_logs_${stamp()}.xls`);
}

export function exportAuditWord(logs: any[]) {
  const html = `<html xmlns:w="urn:schemas-microsoft-com:office:word"><head><meta charset="UTF-8" /><title>LockPhish Security Audit Logs</title></head><body><h1 style="font-family:Segoe UI;color:#065f46">LockPhish — Security Audit Logs</h1><p style="font-family:Segoe UI">Exported ${new Date().toUTCString()} · ${logs.length} immutable records · Tamper-evident ledger</p><table border="1" cellpadding="4" style="border-collapse:collapse;font-family:Consolas;font-size:10px"><thead><tr>${HEADERS.map(h => `<th style="background:#065f46;color:#fff">${h}</th>`).join('')}</tr></thead><tbody>${tableRows(logs).map(r => `<tr>${r.map(c => `<td>${esc(c)}</td>`).join('')}</tr>`).join('')}</tbody></table></body></html>`;
  download(new Blob([html], { type: 'application/msword' }), `audit_logs_${stamp()}.doc`);
}

export function exportAuditPDF(logs: any[]) {
  const doc = new jsPDF({ orientation: 'landscape' });
  doc.setFontSize(15);
  doc.setTextColor(6, 95, 70);
  doc.text('LockPhish — Security Audit Logs', 14, 16);
  doc.setFontSize(9);
  doc.setTextColor(90);
  doc.text(`Exported ${new Date().toUTCString()} · ${logs.length} immutable records · Tamper-evident ledger`, 14, 23);
  autoTable(doc, {
    head: [HEADERS],
    body: tableRows(logs),
    startY: 28,
    styles: { fontSize: 8, font: 'courier' },
    headStyles: { fillColor: [6, 95, 70] },
    alternateRowStyles: { fillColor: [240, 253, 250] }
  });
  doc.save(`audit_logs_${stamp()}.pdf`);
}
