import 'react-native-url-polyfill/auto';
import { createClient } from '@supabase/supabase-js';
import { SUPABASE_URL, SUPABASE_ANON_KEY } from './config';

// We intentionally type the exported client as `any` to avoid needing a
// project-wide `Database` interface for Supabase table generics. This keeps
// the code simple for small projects. If you prefer strict typing, define a
// `Database` interface and pass it to `createClient<Database>()`.

const _getSupabaseClient = () => {
  try {
    return createClient(SUPABASE_URL, SUPABASE_ANON_KEY) as any;
  } catch (error) {
    console.error('Error creating Supabase client:', error);
    return null as any;
  }
};

export const supabase = _getSupabaseClient();