export interface User {
    id?: number;
    username: string;
    first_name: string;
    last_name: string;
    email: string;
    password?: string;
    password2?: string;
    is_staff?: boolean;
    is_superuser?: boolean;
  }