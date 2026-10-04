/* Supabase adapter for the existing static HTML application.
 * Requires supabase-config.js and the Supabase JS v2 browser bundle.
 * Public anon keys are expected here; service-role keys must stay server-side.
 */
(() => {
  const STORE_KEY = 'typingWorldSave';
  const config = window.TYPING_WORLD_SUPABASE || {};
  const sdk = window.supabase;
  let client = null;
  let currentUser = null;
  let initialized = false;

  const ready = Boolean(config.url && config.anonKey && sdk?.createClient);
  if (ready) {
    client = sdk.createClient(config.url, config.anonKey, {
      auth: {
        persistSession: true,
        autoRefreshToken: true,
        detectSessionInUrl: true
      }
    });
  }

  const unavailableError = () => new Error('Supabase is not configured. Add your project URL and anon key in supabase-config.js, then run supabase-schema.sql in your Supabase project.');
  const announce = (name, detail) => window.dispatchEvent(new CustomEvent(name, {
    detail
  }));
  const parseData = () => {
    try {
      return JSON.parse(localStorage.getItem(STORE_KEY) || '{}');
    } catch {
      return {};
    }
  };
  const cacheRemoteData = async () => {
    if (!client || !currentUser) return;
    const [profileResponse, resultsResponse] = await Promise.all([
      client.from('profiles').select('*').eq('id', currentUser.id).single(),
      client.from('typing_results').select('*').eq('user_id', currentUser.id).order('created_at', {
        ascending: false
      }).limit(100)
    ]);
    if (profileResponse.error) throw profileResponse.error;
    if (resultsResponse.error) throw resultsResponse.error;

    const profile = profileResponse.data;
    const tests = resultsResponse.data.map((row) => ({
      wpm: Number(row.wpm),
      accuracy: Number(row.accuracy),
      errors: row.errors,
      chars: row.total_characters,
      correct: row.correct_characters,
      duration: row.duration,
      date: row.created_at.slice(0, 10),
      mode: row.mode
    }));
    const old = parseData();
    const merged = {
      ...old,
      username: profile.username,
      xp: Number(profile.total_xp),
      bestWpm: Number(profile.best_wpm),
      bestAccuracy: Number(profile.best_accuracy),
      streak: profile.current_streak,
      gamesPlayed: profile.games_played,
      tests,
      remoteProfile: profile,
      backendConnected: true
    };
    localStorage.setItem(STORE_KEY, JSON.stringify(merged));
    announce('typingworld:profile-updated', {
      profile,
      tests
    });
    return merged;
  };

  const handleSession = async (session) => {
    currentUser = session?.user || null;
    announce('typingworld:auth-changed', {
      user: currentUser
    });
    if (currentUser) {
      try {
        await cacheRemoteData();
      } catch (error) {
        announce('typingworld:backend-error', {
          message: error.message
        });
      }
    }
  };

  const service = {
    isConfigured: ready,
    get client() {
      return client;
    },
    get user() {
      return currentUser;
    },
    async initialize() {
      if (!ready) return {
        configured: false
      };
      if (initialized) return {
        configured: true,
        user: currentUser
      };
      initialized = true;
      const {
        data,
        error
      } = await client.auth.getSession();
      if (error) throw error;
      await handleSession(data.session);
      client.auth.onAuthStateChange((_event, session) => {
        // Defer queries until Supabase has completed its auth callback.
        queueMicrotask(() => handleSession(session));
      });
      return {
        configured: true,
        user: currentUser
      };
    },
    async signUp({
      email,
      password,
      username
    }) {
      if (!ready) throw unavailableError();
      const {
        data,
        error
      } = await client.auth.signUp({
        email,
        password,
        options: {
          data: {
            username
          }
        }
      });
      if (error) throw error;
      if (data.session) await handleSession(data.session);
      return data;
    },
    async signIn({
      email,
      password
    }) {
      if (!ready) throw unavailableError();
      const {
        data,
        error
      } = await client.auth.signInWithPassword({
        email,
        password
      });
      if (error) throw error;
      await handleSession(data.session);
      return data;
    },
    async signOut() {
      if (!ready) throw unavailableError();
      const {
        error
      } = await client.auth.signOut();
      if (error) throw error;
      currentUser = null;
      announce('typingworld:auth-changed', {
        user: null
      });
    },
    async sendPasswordReset({
      email
    }) {
      if (!ready) throw unavailableError();
      const {
        error
      } = await client.auth.resetPasswordForEmail(email, {
        redirectTo: `${location.origin}/login`
      });
      if (error) throw error;
    },
    async signInWithGoogle() {
      if (!ready) throw unavailableError();
      const {
        error
      } = await client.auth.signInWithOAuth({
        provider: 'google',
        options: {
          redirectTo: location.origin
        }
      });
      if (error) throw error;
    },
    async getProfile() {
      if (!ready || !currentUser) return null;
      const {
        data,
        error
      } = await client.from('profiles').select('*').eq('id', currentUser.id).single();
      if (error) throw error;
      return data;
    },
    async updateProfile(updates) {
      if (!ready || !currentUser) throw new Error('Please log in to update your profile.');
      const allowed = {
        username: updates.username,
        avatar_url: updates.avatar_url
      };
      Object.keys(allowed).forEach((key) => allowed[key] === undefined && delete allowed[key]);
      const {
        data,
        error
      } = await client.from('profiles').update(allowed).eq('id', currentUser.id).select().single();
      if (error) throw error;
      await cacheRemoteData();
      return data;
    },
        async beginTypingSession({ duration, difficulty }) {
      if (!ready || !currentUser) return null;
      const { data, error } = await client.rpc('begin_typing_session', {
        p_duration: Number(duration),
        p_difficulty: difficulty || 'Easy'
      });
      if (error) throw error;
      return data;
    },
    async submitTypingResult(result) {
      if (!ready || !currentUser) return { saved: false, guest: true };
      const { data, error } = await client.rpc('submit_typing_result', {
        p_session_id: result.sessionId,
        p_correct_characters: Math.max(0, Math.floor(result.correct || 0)),
        p_total_characters: Math.max(0, Math.floor(result.chars || 0)),
        p_mode: result.challenge ? 'Daily Challenge' : 'Practice'
      });
      if (error) throw error;
      await cacheRemoteData();
      return {
        saved: true,
        ...data
      };
    },
    async getLeaderboard(period = 'Weekly') {
      if (!ready) throw unavailableError();
      const {
        data,
        error
      } = await client.rpc('get_typing_leaderboard', {
        p_period: period
      });
      if (error) throw error;
      return data;
    },
    async getWorlds() {
      if (!ready) throw unavailableError();
      const {
        data,
        error
      } = await client.from('worlds').select('*').order('order_index');
      if (error) throw error;
      if (!currentUser) return data.map((world) => ({
        ...world,
        unlocked: world.required_level <= 1
      }));
      const {
        data: profile,
        error: profileError
      } = await client.from('profiles').select('level,total_xp').eq('id', currentUser.id).single();
      if (profileError) throw profileError;
      return data.map((world) => ({
        ...world,
        unlocked: profile.level >= world.required_level && profile.total_xp >= world.required_xp
      }));
    },
    async getDailyChallenge() {
      if (!ready) throw unavailableError();
      const today = new Date().toISOString().slice(0, 10);
      const {
        data,
        error
      } = await client.from('daily_challenges').select('*').eq('challenge_date', today).maybeSingle();
      if (error) throw error;
      return data;
    },
    async getSettings() {
      if (!ready || !currentUser) return null;
      const {
        data,
        error
      } = await client.from('user_settings').select('*').eq('user_id', currentUser.id).single();
      if (error) throw error;
      return data;
    },
    async updateSettings(settings) {
      if (!ready || !currentUser) throw new Error('Please log in to sync settings.');
            const allowedFields = ['theme', 'sound_enabled', 'keyboard_sound', 'preferred_duration', 'preferred_difficulty', 'language', 'reduced_motion', 'cursor_style'];
      const updates = Object.fromEntries(Object.entries(settings).filter(([key]) => allowedFields.includes(key)));
      const { data, error } = await client.from('user_settings').update(updates).eq('user_id', currentUser.id).select().single();
      if (error) throw error;
      return data;
    }
  };

  window.TypingWorldBackend = service;
  window.TypingWorldAuth = {
    isConfigured: ready,
    signUp: service.signUp,
    signIn: service.signIn,
    signOut: service.signOut,
    sendPasswordReset: service.sendPasswordReset,
    signInWithGoogle: service.signInWithGoogle
  };

  if (ready) {
    service.initialize().catch((error) => announce('typingworld:backend-error', {
      message: error.message
    }));
  }
})();
