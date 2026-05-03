import { supabase } from '../../lib/supabaseClient.js';

export default async function handler(req, res) {
    // Add CORS headers for ESP32
    res.setHeader('Access-Control-Allow-Credentials', true)
    res.setHeader('Access-Control-Allow-Origin', '*') // Allow all
    res.setHeader('Access-Control-Allow-Methods', 'POST,OPTIONS')
    res.setHeader(
        'Access-Control-Allow-Headers',
        'X-CSRF-Token, X-Requested-With, Accept, Accept-Version, Content-Length, Content-MD5, Content-Type, Date, X-Api-Version'
    )

    if (req.method === 'OPTIONS') {
        res.status(200).end()
        return
    }

    if (req.method === 'GET') {
        return res.status(200).json({ message: 'Smart Waste API is running. Send POST requests to update bin status.' });
    }

    if (req.method !== 'POST') {
        return res.status(405).json({ error: 'Method not allowed' });
    }

    const { deviceId, fillPercentage } = req.body;

    // Validate input
    if (!deviceId || typeof fillPercentage !== 'number') {
        return res.status(400).json({ error: 'Invalid input. Ensure deviceId (string) and fillPercentage (number) are provided.' });
    }

    // Calculate status logic:
    // 0–30 → EMPTY
    // 31–80 → HALF
    // 81–100 → FULL
    let status = 'EMPTY';
    if (fillPercentage > 80) {
        status = 'FULL';
    } else if (fillPercentage > 30) {
        status = 'HALF';
    }

    try {
        const { error } = await supabase
            .from('bins')
            .insert([{
                deviceid: deviceId,
                fillpercentage: fillPercentage,
                status
            }])
            .select();

        if (error) {
            console.error('Supabase Error:', error);
            return res.status(500).json({ error: error.message });
        }

        return res.status(200).json({
            success: true,
            status: status,
            recorded_at: new Date().toISOString()
        });
    } catch (err) {
        console.error('Server Error:', err);
        return res.status(500).json({ error: 'Internal Server Error' });
    }
}
