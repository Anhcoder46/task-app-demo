import { useState, useEffect } from 'react';
import { apiFetch } from '../lib/api';

export function ExpenseTracker() {
  const [transactions, setTransactions] = useState<any[]>([]);
  const [desc, setDesc] = useState('');
  const [amount, setAmount] = useState('');
  const [type, setType] = useState('expense');

  useEffect(() => {
    fetchTransactions();
  }, []);

  const fetchTransactions = async () => {
    const res = await apiFetch('/api/expenses');
    if (res.ok) setTransactions(await res.json());
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!desc || !amount) return;
    await apiFetch('/api/expenses', {
      method: 'POST',
      body: JSON.stringify({ description: desc, amount: Number(amount), type })
    });
    setDesc('');
    setAmount('');
    fetchTransactions();
  };

  const totalIncome = transactions.filter(t => t.type === 'income').reduce((acc, curr) => acc + Number(curr.amount), 0);
  const totalExpense = transactions.filter(t => t.type === 'expense').reduce((acc, curr) => acc + Number(curr.amount), 0);

  return (
    <div style={{ padding: '20px', maxWidth: '800px', margin: '0 auto', background: 'rgba(255,255,255,0.05)', borderRadius: '12px' }}>
      <h2>Expense Tracker</h2>
      <div style={{ display: 'flex', gap: '20px', marginBottom: '20px' }}>
        <div style={{ flex: 1, padding: '20px', background: 'rgba(0,255,0,0.1)', borderRadius: '8px' }}>
          <h3>Tổng Thu</h3>
          <p style={{ fontSize: '24px', fontWeight: 'bold', color: '#4ade80' }}>${totalIncome}</p>
        </div>
        <div style={{ flex: 1, padding: '20px', background: 'rgba(255,0,0,0.1)', borderRadius: '8px' }}>
          <h3>Tổng Chi</h3>
          <p style={{ fontSize: '24px', fontWeight: 'bold', color: '#f87171' }}>${totalExpense}</p>
        </div>
        <div style={{ flex: 1, padding: '20px', background: 'rgba(255,255,255,0.1)', borderRadius: '8px' }}>
          <h3>Số Dư</h3>
          <p style={{ fontSize: '24px', fontWeight: 'bold' }}>${totalIncome - totalExpense}</p>
        </div>
      </div>

      <form onSubmit={handleSubmit} style={{ display: 'flex', gap: '10px', marginBottom: '20px' }}>
        <input className="form-input" placeholder="Mô tả..." value={desc} onChange={e => setDesc(e.target.value)} required />
        <input className="form-input" type="number" placeholder="Số tiền..." value={amount} onChange={e => setAmount(e.target.value)} required />
        <select className="form-input" value={type} onChange={e => setType(e.target.value)}>
          <option value="expense">Chi</option>
          <option value="income">Thu</option>
        </select>
        <button className="submit-btn" type="submit">Thêm</button>
      </form>

      <div style={{ background: 'rgba(0,0,0,0.2)', padding: '15px', borderRadius: '8px' }}>
        <h3 style={{ marginBottom: '10px' }}>Lịch sử giao dịch</h3>
        {transactions.map(t => (
          <div key={t.id} style={{ display: 'flex', justifyContent: 'space-between', padding: '10px', borderBottom: '1px solid rgba(255,255,255,0.1)' }}>
            <span>{t.description}</span>
            <span style={{ color: t.type === 'income' ? '#4ade80' : '#f87171', fontWeight: 'bold' }}>
              {t.type === 'income' ? '+' : '-'}${t.amount}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
}
