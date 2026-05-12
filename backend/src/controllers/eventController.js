import { getSupabaseAdmin } from '../lib/supabase.js';

export async function listEvents(req, res) {
  try {
    const supabase = getSupabaseAdmin();
    const { data, error } = await supabase.from('events').select('*').order('date', { ascending: true });
    if (error) throw error;
    res.json(data);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
}

export async function createEvent(req, res) {
  try {
    const supabase = getSupabaseAdmin();
    const { title, description, date } = req.body;
    const { data, error } = await supabase.from('events').insert({ title, description, date }).select().single();
    if (error) throw error;
    res.status(201).json(data);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
}

export async function listRegistrations(req, res) {
  try {
    const supabase = getSupabaseAdmin();
    const { data, error } = await supabase.from('registrations').select('*, events(title)').order('created_at', { ascending: false });
    if (error) throw error;
    res.json(data);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
}

export async function registerEvent(req, res) {
  try {
    const supabase = getSupabaseAdmin();
    const { event_id, user_name, email } = req.body;
    const { data, error } = await supabase.from('registrations').insert({ event_id, user_name, email }).select().single();
    if (error) throw error;
    res.status(201).json(data);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
}
