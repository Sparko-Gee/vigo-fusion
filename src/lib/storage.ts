import { supabase } from './supabase';

export const uploadVoiceMessage = async (blob: Blob): Promise<string> => {
  const fileName = `voice-${Date.now()}.webm`;
  
  const { data, error } = await supabase.storage
    .from('voice-messages')
    .upload(fileName, blob);

  if (error) {
    throw error;
  }

  return data.path;
};

export const getVoiceMessageUrl = async (path: string): Promise<string> => {
  const { data } = await supabase.storage
    .from('voice-messages')
    .getPublicUrl(path);

  return data.publicUrl;
};