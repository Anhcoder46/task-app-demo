import { useState, useEffect } from 'react';
import { apiFetch } from '../lib/api';

export function QuizSystem() {
  const [questions, setQuestions] = useState<any[]>([]);
  const [results, setResults] = useState<any[]>([]);
  const [selectedAnswers, setSelectedAnswers] = useState<Record<string, string>>({});
  const [userName, setUserName] = useState('');

  useEffect(() => {
    fetchQuestions();
    fetchResults();
  }, []);

  const fetchQuestions = async () => {
    const res = await apiFetch('/api/quiz/questions');
    if (res.ok) setQuestions(await res.json());
  };

  const fetchResults = async () => {
    const res = await apiFetch('/api/quiz/results');
    if (res.ok) setResults(await res.json());
  };

  const handleSubmit = async () => {
    if (!userName) return alert('Vui lòng nhập tên');
    let score = 0;
    questions.forEach(q => {
      const selected = selectedAnswers[q.id];
      const correctAns = q.answers?.find((a: any) => a.is_correct);
      if (correctAns && selected === correctAns.id) score++;
    });

    await apiFetch('/api/quiz/submit', {
      method: 'POST',
      body: JSON.stringify({ user_name: userName, score, total_questions: questions.length })
    });
    alert(`Bạn đã đúng ${score}/${questions.length} câu!`);
    setSelectedAnswers({});
    fetchResults();
  };

  return (
    <div style={{ padding: '20px', maxWidth: '800px', margin: '0 auto', background: 'rgba(255,255,255,0.05)', borderRadius: '12px' }}>
      <h2>Hệ Thống Trắc Nghiệm</h2>
      
      {questions.length === 0 ? (
        <p>Hiện chưa có câu hỏi nào trong hệ thống. Bạn cần thêm câu hỏi vào database.</p>
      ) : (
        <div style={{ marginTop: '20px' }}>
          <input 
            className="form-input" 
            placeholder="Nhập tên của bạn..." 
            value={userName} 
            onChange={e => setUserName(e.target.value)} 
            style={{ marginBottom: '20px' }}
          />
          {questions.map((q, i) => (
            <div key={q.id} style={{ marginBottom: '20px', padding: '15px', background: 'rgba(0,0,0,0.2)', borderRadius: '8px' }}>
              <h4>Câu {i+1}: {q.content}</h4>
              <div style={{ marginTop: '10px' }}>
                {q.answers?.map((a: any) => (
                  <label key={a.id} style={{ display: 'block', margin: '5px 0', cursor: 'pointer' }}>
                    <input 
                      type="radio" 
                      name={`q_${q.id}`} 
                      value={a.id}
                      checked={selectedAnswers[q.id] === a.id}
                      onChange={() => setSelectedAnswers(prev => ({...prev, [q.id]: a.id}))}
                    />
                    {' '}{a.content}
                  </label>
                ))}
              </div>
            </div>
          ))}
          <button className="submit-btn" onClick={handleSubmit}>Nộp Bài</button>
        </div>
      )}

      <h3 style={{ marginTop: '40px' }}>Bảng Điểm (Lịch Sử)</h3>
      <div style={{ marginTop: '15px' }}>
        {results.map(r => (
          <div key={r.id} style={{ padding: '10px', borderBottom: '1px solid rgba(255,255,255,0.1)' }}>
            <strong>{r.user_name}</strong> - Điểm: {r.score}/{r.total_questions}
          </div>
        ))}
      </div>
    </div>
  );
}
