import { useMemo, useState } from "react";

/**
 * props:
 * - schemaJson: 서버에서 내려온 JSON 문자열 (예: item.crclmCn)
 * - onSubmit(formPayload): 제출 시 호출. 원본 스키마에 answer를 채워 반환.
 */
export default function SurveyForm({ schemaJson, onSubmit }) {
  // 1) 스키마 파싱 (안전)
  const schema = useMemo(() => {
    try {
      if (!schemaJson) return null;
      const obj = JSON.parse(schemaJson);
      if (!obj?.pages?.length) return null;
      return obj;
    } catch (e) {
      console.error("[SurveyForm] invalid schema:", e);
      return null;
    }
  }, [schemaJson]);

  // 2) 답변 상태 초기화: { [qid]: answerValue }
  const [answers, setAnswers] = useState(() => {
    if (!schema) return {};
    const init = {};
    for (const page of schema.pages) {
      for (const q of page.questions || []) {
        // 서버가 answer를 빈 문자열로 줄 수도 있으니 기본값 처리
        init[q.qid] = q.answer ?? "";
      }
    }
    return init;
  });

  if (!schema) {
    return <div>설문 양식이 없거나 잘못되었습니다.</div>;
  }

  // 3) 공용 체인지 핸들러
  const setAnswer = (qid, value) => {
    setAnswers(prev => ({ ...prev, [qid]: value }));
  };

  // 4) 제출: 원본 스키마 구조에 answer를 주입해서 그대로 돌려줌
  const handleSubmit = (e) => {
    e.preventDefault();
    const filled = {
      ...schema,
      pages: schema.pages.map(p => ({
        ...p,
        questions: (p.questions || []).map(q => ({
          ...q,
          answer: answers[q.qid] ?? q.answer ?? ""
        }))
      }))
    };
    onSubmit?.(filled); // 필요 시 JSON.stringify(filled) 해서 서버에 전송
  };

  // 5) 질문 타입별 렌더 (single, multi, text 등을 확장 가능)
  const renderQuestion = (q) => {
    const value = answers[q.qid] ?? "";

    switch (q.type) {
      case "single": {
        // 단일 선택(라디오)
        return (
          <div role="radiogroup" aria-labelledby={`label-${q.qid}`}>
            {(q.options || []).map(opt => {
              const checked = value === opt.id || value === opt.label;
              return (
                <label key={opt.id} style={{ display: "block", margin: "6px 0" }}>
                  <input
                    type="radio"
                    name={q.qid}
                    value={opt.id}
                    checked={checked}
                    onChange={() => setAnswer(q.qid, opt.id)}
                  />
                  <span style={{ marginLeft: 6 }}>{opt.label}</span>
                </label>
              );
            })}
          </div>
        );
      }

      case "text": {
        // 자유 입력(필요 시 확장)
        return (
          <input
            type="text"
            value={value}
            onChange={(e) => setAnswer(q.qid, e.target.value)}
            placeholder={q.placeholder || ""}
            style={{ width: "100%", padding: "8px" }}
          />
        );
      }

      case "multi": {
        // 다중 선택(체크박스) — 스키마가 바뀔 수 있으니 예시로 추가
        const selected = Array.isArray(value) ? value : [];
        const toggle = (id) => {
          if (selected.includes(id)) {
            setAnswer(q.qid, selected.filter(v => v !== id));
          } else {
            setAnswer(q.qid, [...selected, id]);
          }
        };
        return (
          <div role="group" aria-labelledby={`label-${q.qid}`}>
            {(q.options || []).map(opt => (
              <label key={opt.id} style={{ display: "block", margin: "6px 0" }}>
                <input
                  type="checkbox"
                  checked={selected.includes(opt.id)}
                  onChange={() => toggle(opt.id)}
                />
                <span style={{ marginLeft: 6 }}>{opt.label}</span>
              </label>
            ))}
          </div>
        );
      }

      default:
        return <em>지원하지 않는 질문 유형: {q.type}</em>;
    }
  };

  // 6) required 검증 (간단 예시)
  const isInvalid = () => {
    for (const p of schema.pages) {
      for (const q of p.questions || []) {
        if (q.required) {
          const v = answers[q.qid];
          if (q.type === "multi") {
            if (!Array.isArray(v) || v.length === 0) return true;
          } else {
            if (v === "" || v == null) return true;
          }
        }
      }
    }
    return false;
  };

  return (
    <form onSubmit={handleSubmit} style={{ display: "grid", gap: 16 }}>
      {schema.pages.map((page, pi) => (
        <section key={page.id ?? pi} style={{ padding: 12, border: "1px solid #e5e7eb", borderRadius: 8 }}>
          {page.title && <h4 style={{ margin: "0 0 8px" }}>{page.title}</h4>}

          {(page.questions || []).map((q) => (
            <div key={q.qid} style={{ marginBottom: 12 }}>
              <label
                id={`label-${q.qid}`}
                style={{ display: "block", fontWeight: 600, marginBottom: 6 }}
              >
                {q.title} {q.required ? <span style={{ color: "#dc2626" }}>*</span> : null}
              </label>

              {q.explain && (
                <div style={{ color: "#6b7280", fontSize: 12, marginBottom: 6 }}>
                  {q.explain}
                </div>
              )}

              {renderQuestion(q)}
            </div>
          ))}
        </section>
      ))}

      <button type="submit" disabled={isInvalid()} style={{ padding: "8px 12px", borderRadius: 8 }}>
        제출
      </button>
    </form>
  );
}