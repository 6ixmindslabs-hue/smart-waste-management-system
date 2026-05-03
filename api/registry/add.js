import { supabase } from '../../lib/supabaseClient.js';

export default async function handler(req, res) {
    if (req.method !== 'POST') {
        return res.status(405).json({ error: 'Method not allowed' });
    }

    const { deviceId, name, details } = req.body;

    if (!deviceId || !name) {
        return res.status(400).json({ error: 'deviceId and name are required' });
    }

    const { data, error } = await supabase
        .from('dustbin_registry')
        .insert([{ deviceid: deviceId, name, details }])
        .select();

    if (error) {
        return res.status(500).json({ error: error.message });
    }

    return res.status(200).json(data[0]);
}
