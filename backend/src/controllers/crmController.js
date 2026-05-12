import { getSupabaseAdmin } from '../lib/supabase.js';

export async function listCustomers(req, res) {
  try {
    const supabase = getSupabaseAdmin();
    const { data, error } = await supabase.from('customers').select('*').order('created_at', { ascending: false });
    if (error) throw error;
    res.json(data);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
}

export async function createCustomer(req, res) {
  try {
    const supabase = getSupabaseAdmin();
    const { name, email, phone, address } = req.body;
    const { data, error } = await supabase.from('customers').insert({ name, email, phone, address }).select().single();
    if (error) throw error;
    res.status(201).json(data);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
}

export async function updateCustomer(req, res) {
  try {
    const supabase = getSupabaseAdmin();
    const { id } = req.params;
    const { name, email, phone, address } = req.body;
    const { data, error } = await supabase.from('customers').update({ name, email, phone, address }).eq('id', id).select().single();
    if (error) throw error;
    res.json(data);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
}
