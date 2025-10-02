// CohortAbsenceCard.jsx
import { useEffect, useState } from 'react';
import { getAbsenceByCohortToday } from '../../../attend/attendService';
import '../../../styles/Attend.css'; // ← 새 CSS

export default function CohortAbsenceCard() {
  const [rows, setRows] = useState([]);

  useEffect(() => {
    getAbsenceByCohortToday()
      .then(setRows)
      .catch(() => setRows([]));
  }, []);

  if (!rows.length) return null;

  return (
    <>
      <div className="coh-card__head">
        <h className="coh-card__title">교육 과정별 결석 현황</h>
        <span className="coh-card__period">
          {new Date().toLocaleDateString()}
        </span>
      </div>

      <div className="coh-card__divider" />

      <div
        className="coh-grid"
        style={{ gridTemplateColumns: `repeat(${rows.length}, 1fr)` }}
      >
        {rows.map((r) => (
          <div className="coh-item" key={r.cohortSn}>
            <div className="coh-item__label">{r.label}</div>
            <div className="coh-item__value">{r.absent}</div>
          </div>
        ))}
      </div>
    </>
  );
}
