import { SetMetadata } from '@nestjs/common';

export const ROLES_KEY = 'roles';
export const AdminOnly = () => SetMetadata(ROLES_KEY, ['admin']);
export const SuperAdminOnly = () => SetMetadata(ROLES_KEY, ['super_admin']);
export const Roles = (...roles: string[]) => SetMetadata(ROLES_KEY, roles); 