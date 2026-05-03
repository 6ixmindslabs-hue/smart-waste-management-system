import { supabase } from '../../lib/supabaseClient.js';

export default async function handler(req, res) {
    if (req.method !== 'DELETE') {
        return res.status(405).json({ error: 'Method not allowed' });
    }

    const { id } = req.query;

    if (!id) {
        return res.status(400).json({ error: 'ID is required' });
    }

    let deviceIdToDelete = null;

    if (id.startsWith('temp-')) {
        // Handle discovered but unregistered bin: Delete history so it disappears from the discovered list
        const deviceId = id.replace('temp-', '').trim();
        const { error: binsDeleteError } = await supabase
            .from('bins')
            .delete()
            .ilike('deviceid', deviceId);

        if (binsDeleteError) {
            return res.status(500).json({ error: binsDeleteError.message });
        }
        deviceIdToDelete = deviceId;
    } else {
        // Handle registered bin: UNREGISTER ONLY. Keep history.
        // This ensures data safety. If the user wants to delete history, they can delete the "Discovered" bin that appears after unregistering.
        const { error: regDeleteError } = await supabase
            .from('dustbin_registry')
            .delete()
            .eq('id', id);

        if (regDeleteError) {
            return res.status(500).json({ error: regDeleteError.message });
        }
    }

    // Response
    return res.status(200).json({ success: true, deviceId: deviceIdToDelete, action: id.startsWith('temp-') ? 'deleted_history' : 'unregistered' });
}
