export type UserStatus = 'active' | 'pending' | 'blocked';

export type updatedUser = {
  id: number;
  status: UserStatus;
};
