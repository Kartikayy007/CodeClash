export interface User {
  id: string;
  email: string;
  name: string;
  role: 'user' | 'admin';
  createdAt: string;
  updatedAt: string;
}

export interface AdminUser extends User {
  role: 'admin';
  permissions: AdminPermission[];
}

export type AdminPermission = 
  | 'manage_contests'
  | 'manage_users'
  | 'view_analytics'
  | 'moderate_content'
  | 'system_settings';

export interface AdminRouteProps {
  children: React.ReactNode;
}
