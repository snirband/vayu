import express from 'express';
import { getDataPaginated } from '../use-cases/pagination';
import { removeUserFromGroup } from '../use-cases/remove-user';
import { updateMultipleUsersStatuses } from '../use-cases/update-multiple-users';

const router = express.Router();

router.get('/users', async (req, res) => {
  const page = parseInt(req.query.page as string) || 1;
  const limit = parseInt(req.query.limit as string) || 10;

  try {
    const result = await getDataPaginated('users', page, limit);
    res.json(result);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

router.get('/groups', async (req, res) => {
  const page = parseInt(req.query.page as string) || 1;
  const limit = parseInt(req.query.limit as string) || 10;

  try {
    const result = await getDataPaginated('groups', page, limit);
    res.json(result);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

router.delete('/users/:userId/group', async (req, res) => {
  const userId = req.params.userId;
  if (!userId) {
    return res.status(400).json({ error: 'User ID is required' });
  }
  try {
    await removeUserFromGroup(Number(userId));
    res.status(200).json({ message: 'User remove from group successfully' });
  } catch (error: any) {
    res
      .status(400)
      .json({ error: error.message || 'Failed to remove user from group' });
  }
});

router.patch('/users/statuses', async (req, res) => {
  const { updates } = req.body;

  if (!Array.isArray(updates)) {
    return res.status(400).json({ error: 'Request body must be an array' });
  }

  if (updates.length > 500) {
    return res
      .status(400)
      .json({ error: 'Cannot update more than 500 users at the same time ' });
  }

  try {
    for (const item of updates) {
      if (
        typeof item.id !== 'number' ||
        !['pending', 'active', 'blocked'].includes(item.status)
      ) {
        return res.status(400).json({ error: 'Invalid payload format' });
      }
    }

    await updateMultipleUsersStatuses(updates);
    res.status(200).json({ message: 'updates executed successfully' });
  } catch (err: any) {
    console.error(err);
    res.status(500).json({ error: err.message });
  }
});

export default router;
