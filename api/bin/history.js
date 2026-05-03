import { supabase } from '../../lib/supabaseClient.js';

export default async function handler(req, res) {
    // Return last 20 records
    const { deviceId } = req.query;

    let query = supabase
        .from('bins')
        .select('*')
        .order('createdat', { ascending: false })
        .limit(20);

    if (deviceId) {
        query = query.eq('deviceid', deviceId);
    }

    const { data, error } = await query;

    if (error) {
        return res.status(500).json({ error: error.message });
    }

    // Map backend snake_case to frontend camelCase
    const formattedData = data.map(record => ({
        ...record,
        deviceId: record.deviceid,
        fillPercentage: record.fillpercentage,
        createdAt: record.createdat
    }));

    return res.status(200).json(formattedData);
}
