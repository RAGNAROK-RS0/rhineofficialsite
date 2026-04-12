import { supabase } from '../supabase';
import type { User, Session } from '@supabase/supabase-js';

export interface UserProfile {
  id: string;
  email: string;
  full_name?: string;
  avatar_url?: string;
  created_at: string;
  updated_at: string;
}

export interface Project {
  id: string;
  name: string;
  description?: string;
  status: 'active' | 'completed' | 'archived';
  user_id: string;
  created_at: string;
  updated_at: string;
}

export interface ApiResponse<T> {
  data: T | null;
  error: Error | null;
}

class DataService {
  async getUser(userId: string): Promise<ApiResponse<UserProfile>> {
    try {
      const { data, error } = await supabase
        .from('users')
        .select('*')
        .eq('id', userId)
        .single();
      
      return { data, error };
    } catch (error) {
      return { data: null, error: error as Error };
    }
  }

  async updateUser(userId: string, updates: Partial<UserProfile>): Promise<ApiResponse<UserProfile>> {
    try {
      const { data, error } = await supabase
        .from('users')
        .update({ ...updates, updated_at: new Date().toISOString() })
        .eq('id', userId)
        .select()
        .single();
      
      return { data, error };
    } catch (error) {
      return { data: null, error: error as Error };
    }
  }

  async getProjects(userId: string): Promise<ApiResponse<Project[]>> {
    try {
      const { data, error } = await supabase
        .from('projects')
        .select('*')
        .eq('user_id', userId)
        .order('created_at', { ascending: false });
      
      return { data, error };
    } catch (error) {
      return { data: null, error: error as Error };
    }
  }

  async getProject(projectId: string): Promise<ApiResponse<Project>> {
    try {
      const { data, error } = await supabase
        .from('projects')
        .select('*')
        .eq('id', projectId)
        .single();
      
      return { data, error };
    } catch (error) {
      return { data: null, error: error as Error };
    }
  }

  async createProject(project: Omit<Project, 'id' | 'created_at' | 'updated_at'>): Promise<ApiResponse<Project>> {
    try {
      const { data, error } = await supabase
        .from('projects')
        .insert(project)
        .select()
        .single();
      
      return { data, error };
    } catch (error) {
      return { data: null, error: error as Error };
    }
  }

  async updateProject(projectId: string, updates: Partial<Project>): Promise<ApiResponse<Project>> {
    try {
      const { data, error } = await supabase
        .from('projects')
        .update({ ...updates, updated_at: new Date().toISOString() })
        .eq('id', projectId)
        .select()
        .single();
      
      return { data, error };
    } catch (error) {
      return { data: null, error: error as Error };
    }
  }

  async deleteProject(projectId: string): Promise<ApiResponse<void>> {
    try {
      const { error } = await supabase
        .from('projects')
        .delete()
        .eq('id', projectId);
      
      return { data: null, error };
    } catch (error) {
      return { data: null, error: error as Error };
    }
  }
}

export const dataService = new DataService();
export default dataService;
