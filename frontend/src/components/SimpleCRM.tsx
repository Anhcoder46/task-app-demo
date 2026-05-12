import { useState, useEffect } from 'react';
import { apiFetch } from '../lib/api';

export function SimpleCRM() {
  const [customers, setCustomers] = useState<any[]>([]);
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [address, setAddress] = useState('');

  useEffect(() => {
    fetchCustomers();
  }, []);

  const fetchCustomers = async () => {
    const res = await apiFetch('/api/crm/customers');
    if (res.ok) setCustomers(await res.json());
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    await apiFetch('/api/crm/customers', {
      method: 'POST',
      body: JSON.stringify({ name, email, phone, address })
    });
    setName('');
    setEmail('');
    setPhone('');
    setAddress('');
    fetchCustomers();
  };

  return (
    <div style={{ padding: '20px', maxWidth: '800px', margin: '0 auto', background: 'rgba(255,255,255,0.05)', borderRadius: '12px' }}>
      <h2>Simple CRM (Quản lý khách hàng)</h2>
      
      <form onSubmit={handleSubmit} style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '15px', marginTop: '20px' }}>
        <input className="form-input" placeholder="Tên khách hàng" value={name} onChange={e => setName(e.target.value)} required />
        <input className="form-input" type="email" placeholder="Email" value={email} onChange={e => setEmail(e.target.value)} required />
        <input className="form-input" placeholder="Số điện thoại" value={phone} onChange={e => setPhone(e.target.value)} />
        <input className="form-input" placeholder="Địa chỉ" value={address} onChange={e => setAddress(e.target.value)} />
        <button className="submit-btn" type="submit" style={{ gridColumn: 'span 2' }}>Thêm Khách Hàng</button>
      </form>

      <h3 style={{ marginTop: '40px' }}>Danh sách khách hàng</h3>
      <div style={{ marginTop: '15px' }}>
        {customers.map(c => (
          <div key={c.id} style={{ padding: '15px', background: 'rgba(0,0,0,0.2)', marginBottom: '10px', borderRadius: '8px' }}>
            <h4 style={{ margin: '0 0 5px 0' }}>{c.name}</h4>
            <div style={{ color: '#aaa', fontSize: '14px' }}>
              <div>Email: {c.email}</div>
              {c.phone && <div>Phone: {c.phone}</div>}
              {c.address && <div>Address: {c.address}</div>}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
