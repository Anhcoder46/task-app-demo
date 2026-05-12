import { getSupabaseAdmin } from '../lib/supabase.js';

export async function listTransactions(req, res) {
  try {
    const supabase = getSupabaseAdmin();
    const { data, error } = await supabase
      .from('transactions')
      .select('*')
      .order('created_at', { ascending: false });
    if (error) throw error;
    res.json(data);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
}

export async function createTransaction(req, res) {
  try {
    const supabase = getSupabaseAdmin();
    const { description, amount, type } = req.body;
    if (!description || amount === undefined || !type) {
      return res.status(400).json({ error: 'Missing fields' });
    }
    const { data, error } = await supabase
      .from('transactions')
      .insert({ description, amount, type })
      .select()
      .single();
    if (error) throw error;
    res.status(201).json(data);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
}
