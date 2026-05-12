import { useState, useEffect } from 'react';
import { apiFetch } from '../lib/api';

export function InventoryManagement() {
  const [items, setItems] = useState<any[]>([]);
  const [logs, setLogs] = useState<any[]>([]);
  const [name, setName] = useState('');
  const [sku, setSku] = useState('');
  
  const [logItemId, setLogItemId] = useState('');
  const [logQuantity, setLogQuantity] = useState('');
  const [logType, setLogType] = useState('in');

  useEffect(() => {
    fetchItems();
    fetchLogs();
  }, []);

  const fetchItems = async () => {
    const res = await apiFetch('/api/inventory/items');
    if (res.ok) setItems(await res.json());
  };

  const fetchLogs = async () => {
    const res = await apiFetch('/api/inventory/logs');
    if (res.ok) setLogs(await res.json());
  };

  const handleAddItem = async (e: React.FormEvent) => {
    e.preventDefault();
    await apiFetch('/api/inventory/items', {
      method: 'POST',
      body: JSON.stringify({ name, sku })
    });
    setName('');
    setSku('');
    fetchItems();
  };

  const handleAddLog = async (e: React.FormEvent) => {
    e.preventDefault();
    await apiFetch('/api/inventory/logs', {
      method: 'POST',
      body: JSON.stringify({ item_id: logItemId, quantity: Number(logQuantity), type: logType })
    });
    setLogQuantity('');
    fetchLogs();
  };

  return (
    <div style={{ padding: '20px', display: 'flex', gap: '20px' }}>
      <div style={{ flex: 1, background: 'rgba(255,255,255,0.05)', padding: '20px', borderRadius: '12px' }}>
        <h2>Thêm Sản Phẩm Mới</h2>
        <form onSubmit={handleAddItem} style={{ display: 'flex', flexDirection: 'column', gap: '10px', marginTop: '15px' }}>
          <input className="form-input" placeholder="Tên sản phẩm" value={name} onChange={e => setName(e.target.value)} required />
          <input className="form-input" placeholder="Mã SKU (duy nhất)" value={sku} onChange={e => setSku(e.target.value)} required />
          <button className="submit-btn" type="submit">Thêm Sản Phẩm</button>
        </form>

        <h3 style={{ marginTop: '30px' }}>Danh sách sản phẩm</h3>
        {items.map(item => (
          <div key={item.id} style={{ padding: '10px', borderBottom: '1px solid rgba(255,255,255,0.1)' }}>
            <strong>{item.name}</strong> (SKU: {item.sku})
          </div>
        ))}
      </div>

      <div style={{ flex: 1, background: 'rgba(255,255,255,0.05)', padding: '20px', borderRadius: '12px' }}>
        <h2>Nhập / Xuất Kho</h2>
        <form onSubmit={handleAddLog} style={{ display: 'flex', flexDirection: 'column', gap: '10px', marginTop: '15px' }}>
          <select className="form-input" value={logItemId} onChange={e => setLogItemId(e.target.value)} required>
            <option value="">-- Chọn sản phẩm --</option>
            {items.map(i => <option key={i.id} value={i.id}>{i.name}</option>)}
          </select>
          <input className="form-input" type="number" placeholder="Số lượng" value={logQuantity} onChange={e => setLogQuantity(e.target.value)} required />
          <select className="form-input" value={logType} onChange={e => setLogType(e.target.value)}>
            <option value="in">Nhập kho (In)</option>
            <option value="out">Xuất kho (Out)</option>
          </select>
          <button className="submit-btn" type="submit">Lưu Giao Dịch</button>
        </form>

        <h3 style={{ marginTop: '30px' }}>Lịch sử kho</h3>
        {logs.map(log => (
          <div key={log.id} style={{ padding: '10px', borderBottom: '1px solid rgba(255,255,255,0.1)' }}>
            <span style={{ color: log.type === 'in' ? '#4ade80' : '#f87171' }}>[{log.type.toUpperCase()}]</span> 
            {' '}{log.items?.name} - SL: {log.quantity}
          </div>
        ))}
      </div>
    </div>
  );
}
