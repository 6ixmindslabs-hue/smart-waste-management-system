import { supabase } from '../../lib/supabaseClient.js';

export default async function handler(req, res) {
    if (req.method !== 'GET') {
        return res.status(405).json({ error: 'Method not allowed' });
    }

    // 1. Get all registered bins
    const { data: registeredBins, error: registryError } = await supabase
        .from('dustbin_registry')
        .select('*')
        .order('createdat', { ascending: false });

    if (registryError) {
        return res.status(500).json({ error: registryError.message });
    }

    // 2. Get distinct device IDs that have sent data
    const { data: dataBins, error: dataError } = await supabase
        .from('bins')
        .select('deviceid')
        .order('deviceid');

    if (dataError) {
        return res.status(500).json({ error: dataError.message });
    }

    // 3. Extract unique device IDs from the data table
    const uniqueDataIds = [...new Set(dataBins.map(b => b.deviceid))];

    // 4. Merge discovered bins into the result if they aren't registered yet
    const registeredIds = new Set(registeredBins.map(b => b.deviceid.toUpperCase()));
    const mergedData = [...registeredBins];

    uniqueDataIds.forEach(deviceId => {
        if (deviceId && !registeredIds.has(deviceId.toUpperCase())) {
            mergedData.push({
                id: `temp-${deviceId}`, // Marker for unregistered bin
                deviceid: deviceId,
                name: deviceId, // Default name to the ID
                details: 'Discovered Device',
                isUnregistered: true
            });
        }
    });

    return res.status(200).json(mergedData);
}
