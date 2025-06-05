import { createClient } from '@supabase/supabase-js'

// Supabase Configuration
const supabaseUrl = import.meta.env.VITE_SUPABASE_URL
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY

// Error checking
if (!supabaseUrl || !supabaseAnonKey) {
  console.error('Supabase environment variables are missing!')
  console.error('Please add VITE_SUPABASE_URL and VITE_SUPABASE_ANON_KEY to your .env files')
}

// Create Supabase Client
export const supabase = createClient(supabaseUrl, supabaseAnonKey, {
  auth: {
    autoRefreshToken: true,
    persistSession: true,
    detectSessionInUrl: false
  },
  db: {
    schema: 'public'
  },
  global: {
    headers: {
      'X-Client-Info': 'yourtrainer-app'
    }
  }
})

// Database helper functions
export const db = {
  // PT Users
  ptUsers: {
    getAll: () => supabase.from('pt_users').select('*'),
    getById: (id) => supabase.from('pt_users').select('*').eq('id', id).single(),
    getByUsername: (username) => supabase.from('pt_users').select('*').eq('kullanici_adi', username).single(),
    getByEmail: (email) => supabase.from('pt_users').select('*').eq('email', email).single(),
    create: (data) => supabase.from('pt_users').insert(data).select().single(),
    update: (id, data) => supabase.from('pt_users').update(data).eq('id', id).select().single(),
    delete: (id) => supabase.from('pt_users').delete().eq('id', id)
  },

  // Clients
  clients: {
    getAll: (ptId) => supabase.from('clients').select(`
      *,
      body_measurements:body_measurements(*)
    `).eq('pt_id', ptId).order('created_at', { ascending: false }),
    
    getById: (id) => supabase.from('clients').select(`
      *,
      body_measurements:body_measurements(*),
      lessons:lessons(*)
    `).eq('id', id).single(),
    
    create: (data) => supabase.from('clients').insert(data).select().single(),
    update: (id, data) => supabase.from('clients').update(data).eq('id', id).select().single(),
    delete: (id) => supabase.from('clients').delete().eq('id', id),
    
    // Statistics
    getStats: (ptId) => supabase.rpc('get_pt_stats', { pt_id: ptId })
  },

  // Body Measurements
  bodyMeasurements: {
    getByClientId: (clientId) => supabase.from('body_measurements').select('*').eq('client_id', clientId).order('olcum_tarihi', { ascending: false }),
    create: (data) => supabase.from('body_measurements').insert(data).select().single(),
    update: (id, data) => supabase.from('body_measurements').update(data).eq('id', id).select().single(),
    delete: (id) => supabase.from('body_measurements').delete().eq('id', id)
  },

  // Lessons
  lessons: {
    getByClientId: (clientId) => supabase.from('lessons').select('*').eq('client_id', clientId).order('ders_tarihi', { ascending: false }),
    getByPTId: (ptId) => supabase.from('lessons').select(`
      *,
      clients:client_id(ad, soyad)
    `).eq('pt_id', ptId).order('ders_tarihi', { ascending: false }),
    
    getUpcoming: (ptId, days = 7) => {
      const today = new Date().toISOString().split('T')[0]
      const futureDate = new Date(Date.now() + days * 24 * 60 * 60 * 1000).toISOString().split('T')[0]
      
      return supabase.from('lessons').select(`
        *,
        clients:client_id(ad, soyad)
      `).eq('pt_id', ptId)
        .gte('ders_tarihi', today)
        .lte('ders_tarihi', futureDate)
        .order('ders_tarihi', { ascending: true })
    },
    
    create: (data) => supabase.from('lessons').insert(data).select().single(),
    update: (id, data) => supabase.from('lessons').update(data).eq('id', id).select().single(),
    delete: (id) => supabase.from('lessons').delete().eq('id', id)
  },

  // PT Settings
  settings: {
    getByPTId: (ptId) => supabase.from('pt_settings').select('*').eq('pt_id', ptId).single(),
    create: (data) => supabase.from('pt_settings').insert(data).select().single(),
    update: (ptId, data) => supabase.from('pt_settings').update(data).eq('pt_id', ptId).select().single(),
    upsert: (data) => supabase.from('pt_settings').upsert(data).select().single()
  }
}

// Authentication helpers
export const auth = {
  signUp: (email, password, metadata = {}) => 
    supabase.auth.signUp({ 
      email, 
      password, 
      options: { 
        data: metadata 
      } 
    }),
  
  signIn: (email, password) => 
    supabase.auth.signInWithPassword({ email, password }),
  
  signOut: () => 
    supabase.auth.signOut(),
  
  getCurrentUser: () => 
    supabase.auth.getUser(),
  
  getCurrentSession: () => 
    supabase.auth.getSession(),
  
  onAuthStateChange: (callback) => 
    supabase.auth.onAuthStateChange(callback),
  
  updateProfile: (updates) => 
    supabase.auth.updateUser({ data: updates }),
  
  resetPassword: (email) => 
    supabase.auth.resetPasswordForEmail(email)
}

// Storage helpers (for profile images)
export const storage = {
  uploadProfileImage: async (file, userId) => {
    const fileExt = file.name.split('.').pop()
    const fileName = `${userId}/profile.${fileExt}`
    
    const { data, error } = await supabase.storage
      .from('profile-images')
      .upload(fileName, file, {
        cacheControl: '3600',
        upsert: true
      })
    
    if (error) throw error
    
    const { data: { publicUrl } } = supabase.storage
      .from('profile-images')
      .getPublicUrl(fileName)
    
    return publicUrl
  },
  
  deleteProfileImage: (userId) => {
    return supabase.storage
      .from('profile-images')
      .remove([`${userId}/profile.jpg`, `${userId}/profile.png`, `${userId}/profile.jpeg`])
  }
}

// Real-time subscriptions
export const realtime = {
  subscribeToUserClients: (ptId, callback) => {
    return supabase
      .channel('user-clients')
      .on('postgres_changes', {
        event: '*',
        schema: 'public',
        table: 'clients',
        filter: `pt_id=eq.${ptId}`
      }, callback)
      .subscribe()
  },
  
  subscribeToUserLessons: (ptId, callback) => {
    return supabase
      .channel('user-lessons')
      .on('postgres_changes', {
        event: '*',
        schema: 'public',
        table: 'lessons',
        filter: `pt_id=eq.${ptId}`
      }, callback)
      .subscribe()
  }
}

export default supabase
