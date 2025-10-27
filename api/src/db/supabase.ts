import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.SUPABASE_URL as string;
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY as string;

// Fail-fast: prevent creating a client with empty/invalid config
if (!supabaseUrl || !supabaseServiceKey) {
  throw new Error(
    'Supabase configuration missing. Ensure SUPABASE_URL and SUPABASE_SERVICE_ROLE_KEY are set in api/.env'
  );
}
if (!supabaseUrl.startsWith('https://')) {
  throw new Error('SUPABASE_URL must start with https://');
}

export const supabase = createClient(supabaseUrl, supabaseServiceKey, {
  db: { schema: 'public' },
});