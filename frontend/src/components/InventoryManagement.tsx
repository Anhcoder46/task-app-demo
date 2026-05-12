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

  // Tính tồn kho hiện tại từ lịch sử giao dịch
  const stockMap = logs.reduce((acc, log) => {
    if (!acc[log.item_id]) acc[log.item_id] = 0;
    if (log.type === 'in') {
      acc[log.item_id] += log.quantity;
    } else if (log.type === 'out') {
      acc[log.item_id] -= log.quantity;
    }
    return acc;
  }, {} as Record<string, number>);

  return (
    <div className="tasks-layout">
      {/* Cột trái: Form Thêm Sản Phẩm & Danh sách */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: '2rem' }}>
        <div className="task-form">
          <h2 className="form-title">📦 Thêm Sản Phẩm Mới</h2>
          <form onSubmit={handleAddItem}>
            <div className="form-group">
              <label>Tên sản phẩm</label>
              <input className="form-input" placeholder="Ví dụ: Bàn phím cơ" value={name} onChange={e => setName(e.target.value)} required />
            </div>
            <div className="form-group">
              <label>Mã SKU (duy nhất)</label>
              <input className="form-input" placeholder="Ví dụ: BP001" value={sku} onChange={e => setSku(e.target.value)} required />
            </div>
            <button className="form-submit" type="submit">Thêm Sản Phẩm</button>
          </form>
        </div>

        <div>
          <h3 className="section-title section-open" style={{ marginBottom: '1rem' }}>Danh sách & Tồn kho hiện tại</h3>
          {items.length === 0 && <div className="task-list-empty">Chưa có sản phẩm nào</div>}
          {items.map(item => (
            <div key={item.id} className="task-item" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <div>
                <div className="task-title" style={{ fontSize: '1.1rem', color: 'var(--accent-cyan)' }}>{item.name}</div>
                <div className="task-date">SKU: {item.sku}</div>
              </div>
              <div style={{ textAlign: 'right' }}>
                <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)', textTransform: 'uppercase' }}>Tồn kho</div>
                <div style={{ fontSize: '1.5rem', fontWeight: 'bold', color: (stockMap[item.id] || 0) > 0 ? 'var(--accent-green)' : 'var(--accent-red)' }}>
                  {stockMap[item.id] || 0}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Cột phải: Form Nhập/Xuất & Lịch sử */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: '2rem' }}>
        <div className="task-form">
          <h2 className="form-title">🔄 Nhập / Xuất Kho</h2>
          <form onSubmit={handleAddLog}>
            <div className="form-group">
              <label>Sản phẩm</label>
              <select className="form-input" value={logItemId} onChange={e => setLogItemId(e.target.value)} required>
                <option value="">-- Chọn sản phẩm --</option>
                {items.map(i => <option key={i.id} value={i.id}>{i.name} (Tồn: {stockMap[i.id] || 0})</option>)}
              </select>
            </div>
            <div className="form-group">
              <label>Số lượng</label>
              <input className="form-input" type="number" min="1" placeholder="Số lượng" value={logQuantity} onChange={e => setLogQuantity(e.target.value)} required />
            </div>
            <div className="form-group">
              <label>Loại giao dịch</label>
              <select className="form-input" value={logType} onChange={e => setLogType(e.target.value)}>
                <option value="in">Nhập kho (In)</option>
                <option value="out">Xuất kho (Out)</option>
              </select>
            </div>
            <button className="form-submit" type="submit" style={{ background: logType === 'in' ? 'linear-gradient(135deg, var(--accent-green), #059669)' : 'linear-gradient(135deg, var(--accent-red), #b91c1c)' }}>
              {logType === 'in' ? 'Nhập Kho' : 'Xuất Kho'}
            </button>
          </form>
        </div>

        <div>
          <h3 className="section-title section-progress" style={{ marginBottom: '1rem' }}>Lịch sử giao dịch</h3>
          {logs.length === 0 && <div className="task-list-empty">Chưa có lịch sử</div>}
          {logs.map(log => (
            <div key={log.id} className="task-item" style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
              <div style={{ 
                padding: '0.5rem', 
                borderRadius: '8px', 
                background: log.type === 'in' ? 'rgba(16, 185, 129, 0.2)' : 'rgba(239, 68, 68, 0.2)',
                color: log.type === 'in' ? 'var(--accent-green)' : 'var(--accent-red)',
                fontWeight: 'bold',
                minWidth: '60px',
                textAlign: 'center'
              }}>
                {log.type === 'in' ? '+ IN' : '- OUT'}
              </div>
              <div style={{ flex: 1 }}>
                <div className="task-title" style={{ fontSize: '1rem' }}>{log.items?.name || 'Sản phẩm đã xóa'}</div>
                <div className="task-date">{new Date(log.created_at).toLocaleString('vi-VN')}</div>
              </div>
              <div style={{ fontSize: '1.25rem', fontWeight: 'bold', color: 'var(--text-primary)' }}>
                {log.quantity}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
