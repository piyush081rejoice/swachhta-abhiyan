import React from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';

export default function Pagination({ page, totalPages, total, pageSize, onPageChange }) {
  if (totalPages <= 1 && total <= pageSize) return null;

  const start = total === 0 ? 0 : (page - 1) * pageSize + 1;
  const end = Math.min(page * pageSize, total);

  return (
    <div className="pagination-bar">
      <div className="pagination-info">
        કુલ <strong>{total}</strong> રેકોર્ડ્સમાંથી <strong>{start}</strong> થી <strong>{end}</strong> દર્શાવેલ છે
      </div>
      <div className="pagination-controls">
        <button
          type="button"
          disabled={page <= 1}
          onClick={() => onPageChange(page - 1)}
          className="pagination-btn"
          title="પાછલું પેજ"
        >
          <ChevronLeft size={16} /> પાછળ
        </button>

        <span className="pagination-page-indicator">
          પેજ <strong>{page}</strong> / <strong>{totalPages || 1}</strong>
        </span>

        <button
          type="button"
          disabled={page >= totalPages}
          onClick={() => onPageChange(page + 1)}
          className="pagination-btn"
          title="આગળનું પેજ"
        >
          આગળ <ChevronRight size={16} />
        </button>
      </div>
    </div>
  );
}
