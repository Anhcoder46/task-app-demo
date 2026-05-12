import { getSupabaseAdmin } from '../lib/supabase.js';

export async function listItems(req, res) {
  try {
    const supabase = getSupabaseAdmin();
    const { data, error } = await supabase.from('items').select('*').order('created_at', { ascending: false });
    if (error) throw error;
    res.json(data);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
}

export async function createItem(req, res) {
  try {
    const supabase = getSupabaseAdmin();
    const { name, sku, description } = req.body;
    const { data, error } = await supabase.from('items').insert({ name, sku, description }).select().single();
    if (error) throw error;
    res.status(201).json(data);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
}

export async function listStockLogs(req, res) {
  try {
    const supabase = getSupabaseAdmin();
    const { data, error } = await supabase.from('stock_logs').select('*, items(name, sku)').order('created_at', { ascending: false });
    if (error) throw error;
    res.json(data);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
}

export async function createStockLog(req, res) {
  try {
    const supabase = getSupabaseAdmin();
    const { item_id, quantity, type } = req.body;
    const { data, error } = await supabase.from('stock_logs').insert({ item_id, quantity, type }).select().single();
    if (error) throw error;
    res.status(201).json(data);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
}
