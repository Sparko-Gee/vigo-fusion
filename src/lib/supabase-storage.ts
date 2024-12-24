import { supabase } from './supabase';

export const getPublicUrl = async (path: string): Promise<string> => {
  try {
    const { data, error } = await supabase.storage
      .from('voice-messages')
      .createSignedUrl(path, 3600); // 1 hour expiry

    if (error) throw error;
    return data.signedUrl;
  } catch (error) {
    console.error('Error getting signed URL:', error);
    throw error;
  }
};