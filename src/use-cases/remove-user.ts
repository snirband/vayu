import { DbService } from '../db/db.service';

export const removeUserFromGroup = async (userId: number) => {
  try {
    if (!userId) {
      throw new Error('User ID is required');
    }
  } catch (error) {
    throw new Error(`Invalid User ID: ${error}`);
  }
  try {
    const dbService = DbService.getInstance();
    await dbService.removeUserFromGroup(userId);
  } catch (error) {
    throw new Error(`Failed to remove user from group: ${error}`);
  }
  return { message: 'User removed from group successfully' };
};
