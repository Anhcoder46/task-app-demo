import { getSupabaseAdmin } from '../lib/supabase.js';

export async function listQuestions(req, res) {
  try {
    const supabase = getSupabaseAdmin();
    const { data, error } = await supabase.from('questions').select('*, answers(*)').order('created_at', { ascending: true });
    if (error) throw error;
    res.json(data);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
}

export async function submitQuiz(req, res) {
  try {
    const supabase = getSupabaseAdmin();
    const { user_name, score, total_questions } = req.body;
    const { data, error } = await supabase.from('quiz_results').insert({ user_name, score, total_questions }).select().single();
    if (error) throw error;
    res.status(201).json(data);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
}

export async function listResults(req, res) {
  try {
    const supabase = getSupabaseAdmin();
    const { data, error } = await supabase.from('quiz_results').select('*').order('created_at', { ascending: false });
    if (error) throw error;
    res.json(data);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
}
