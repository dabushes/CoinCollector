import express from 'express';
import { PrismaClient } from '@prisma/client';

const router = express.Router();
const prisma = new PrismaClient();

// GET /api/users - List all users
router.get('/', async (req, res) => {
  try {
    const users = await prisma.user.findMany({
      select: {
        id: true,
        email: true,
        name: true,
        createdAt: true,
        _count: {
          select: { collections: true },
        },
      },
      orderBy: { createdAt: 'desc' },
    });

    res.json(users);
  } catch (error) {
    console.error('Error fetching users:', error);
    res.status(500).json({ message: 'Failed to fetch users' });
  }
});

// GET /api/users/:id - Get a specific user by ID
router.get('/:id', async (req, res) => {
  try {
    const { id } = req.params;
    
    const user = await prisma.user.findUnique({
      where: { id: parseInt(id) },
      select: {
        id: true,
        email: true,
        name: true,
        createdAt: true,
        updatedAt: true,
        _count: {
          select: { collections: true },
        },
      },
    });

    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    res.json(user);
  } catch (error) {
    console.error('Error fetching user:', error);
    res.status(500).json({ message: 'Failed to fetch user' });
  }
});

// POST /api/users - Create a new user
router.post('/', async (req, res) => {
  try {
    const { email, name } = req.body;

    // Validate required fields
    if (!email) {
      return res.status(400).json({ 
        message: 'Missing required field: email' 
      });
    }

    const user = await prisma.user.create({
      data: {
        email,
        name,
      },
      select: {
        id: true,
        email: true,
        name: true,
        createdAt: true,
        _count: {
          select: { collections: true },
        },
      },
    });

    res.status(201).json(user);
  } catch (error) {
    if (error.code === 'P2002') {
      return res.status(409).json({ 
        message: 'User with this email already exists' 
      });
    }
    console.error('Error creating user:', error);
    res.status(500).json({ message: 'Failed to create user' });
  }
});

// PUT /api/users/:id - Update a user
router.put('/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const { email, name } = req.body;

    const user = await prisma.user.update({
      where: { id: parseInt(id) },
      data: {
        email,
        name,
      },
      select: {
        id: true,
        email: true,
        name: true,
        createdAt: true,
        updatedAt: true,
        _count: {
          select: { collections: true },
        },
      },
    });

    res.json(user);
  } catch (error) {
    if (error.code === 'P2025') {
      return res.status(404).json({ message: 'User not found' });
    }
    if (error.code === 'P2002') {
      return res.status(409).json({ 
        message: 'User with this email already exists' 
      });
    }
    console.error('Error updating user:', error);
    res.status(500).json({ message: 'Failed to update user' });
  }
});

// DELETE /api/users/:id - Delete a user
router.delete('/:id', async (req, res) => {
  try {
    const { id } = req.params;

    // Check if user has collections
    const collectionCount = await prisma.userCollection.count({
      where: { userId: parseInt(id) },
    });

    if (collectionCount > 0) {
      return res.status(400).json({ 
        message: 'Cannot delete user with existing collections' 
      });
    }

    await prisma.user.delete({
      where: { id: parseInt(id) },
    });

    res.status(204).end();
  } catch (error) {
    if (error.code === 'P2025') {
      return res.status(404).json({ message: 'User not found' });
    }
    console.error('Error deleting user:', error);
    res.status(500).json({ message: 'Failed to delete user' });
  }
});

export default router;