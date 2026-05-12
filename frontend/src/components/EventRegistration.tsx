import { useState, useEffect } from 'react';
import { apiFetch } from '../lib/api';

export function EventRegistration() {
  const [events, setEvents] = useState<any[]>([]);
  const [registrations, setRegistrations] = useState<any[]>([]);
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [date, setDate] = useState('');

  const [regEventId, setRegEventId] = useState('');
  const [regName, setRegName] = useState('');
  const [regEmail, setRegEmail] = useState('');

  useEffect(() => {
    fetchEvents();
    fetchRegistrations();
  }, []);

  const fetchEvents = async () => {
    const res = await apiFetch('/api/events');
    if (res.ok) setEvents(await res.json());
  };

  const fetchRegistrations = async () => {
    const res = await apiFetch('/api/events/registrations');
    if (res.ok) setRegistrations(await res.json());
  };

  const handleCreateEvent = async (e: React.FormEvent) => {
    e.preventDefault();
    await apiFetch('/api/events', {
      method: 'POST',
      body: JSON.stringify({ title, description, date: new Date(date).toISOString() })
    });
    setTitle('');
    setDescription('');
    setDate('');
    fetchEvents();
  };

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    await apiFetch('/api/events/register', {
      method: 'POST',
      body: JSON.stringify({ event_id: regEventId, user_name: regName, email: regEmail })
    });
    setRegName('');
    setRegEmail('');
    fetchRegistrations();
  };

  return (
    <div style={{ padding: '20px', display: 'flex', gap: '20px' }}>
      <div style={{ flex: 1, background: 'rgba(255,255,255,0.05)', padding: '20px', borderRadius: '12px' }}>
        <h2>Tạo Sự Kiện</h2>
        <form onSubmit={handleCreateEvent} style={{ display: 'flex', flexDirection: 'column', gap: '10px', marginTop: '15px' }}>
          <input className="form-input" placeholder="Tên sự kiện" value={title} onChange={e => setTitle(e.target.value)} required />
          <input className="form-input" placeholder="Mô tả" value={description} onChange={e => setDescription(e.target.value)} />
          <input className="form-input" type="datetime-local" value={date} onChange={e => setDate(e.target.value)} required />
          <button className="submit-btn" type="submit">Tạo Sự Kiện</button>
        </form>

        <h3 style={{ marginTop: '30px' }}>Danh sách sự kiện</h3>
        {events.map(ev => (
          <div key={ev.id} style={{ padding: '10px', borderBottom: '1px solid rgba(255,255,255,0.1)' }}>
            <strong>{ev.title}</strong> - {new Date(ev.date).toLocaleString()}
          </div>
        ))}
      </div>

      <div style={{ flex: 1, background: 'rgba(255,255,255,0.05)', padding: '20px', borderRadius: '12px' }}>
        <h2>Đăng Ký Tham Gia</h2>
        <form onSubmit={handleRegister} style={{ display: 'flex', flexDirection: 'column', gap: '10px', marginTop: '15px' }}>
          <select className="form-input" value={regEventId} onChange={e => setRegEventId(e.target.value)} required>
            <option value="">-- Chọn sự kiện --</option>
            {events.map(ev => <option key={ev.id} value={ev.id}>{ev.title}</option>)}
          </select>
          <input className="form-input" placeholder="Họ Tên" value={regName} onChange={e => setRegName(e.target.value)} required />
          <input className="form-input" type="email" placeholder="Email" value={regEmail} onChange={e => setRegEmail(e.target.value)} required />
          <button className="submit-btn" type="submit">Đăng Ký</button>
        </form>

        <h3 style={{ marginTop: '30px' }}>Danh sách đăng ký</h3>
        {registrations.map(r => (
          <div key={r.id} style={{ padding: '10px', borderBottom: '1px solid rgba(255,255,255,0.1)' }}>
            <strong>{r.user_name}</strong> đăng ký <em>{r.events?.title}</em>
          </div>
        ))}
      </div>
    </div>
  );
}
