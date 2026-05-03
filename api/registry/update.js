import { supabase } from '../../lib/supabaseClient.js';

export default async function handler(req, res) {
    if (req.method !== 'PUT') {
        return res.status(405).json({ error: 'Method not allowed' });
    }

    const { id, name, details } = req.body;

    if (!id) {
        return res.status(400).json({ error: 'ID is required' });
    }

    const { data, error } = await supabase
        .from('dustbin_registry')
        .update({ name, details })
        .eq('id', id)
        .select();

    if (error) {
        return res.status(500).json({ error: error.message });
    }

    return res.status(200).json(data[0]);
}
