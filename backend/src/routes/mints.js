import express from 'express';
import { PrismaClient } from '@prisma/client';

const router = express.Router();
const prisma = new PrismaClient();

// GET /api/mints - List all mints
router.get('/', async (req, res) => {
  try {
    const { active } = req.query;

    const where = {};
    if (active !== undefined) where.active = active === 'true';

    const mints = await prisma.mint.findMany({
      where,
      include: {
        _count: {
          select: { coins: true },
        },
      },
      orderBy: { name: 'asc' },
    });

    res.json(mints);
  } catch (error) {
    console.error('Error fetching mints:', error);
    res.status(500).json({ message: 'Failed to fetch mints' });
  }
});

// GET /api/mints/:id - Get a specific mint by ID
router.get('/:id', async (req, res) => {
  try {
    const { id } = req.params;
    
    const mint = await prisma.mint.findUnique({
      where: { id: parseInt(id) },
      include: {
        coins: {
          include: {
            type: true,
          },
          orderBy: [
            { year: 'desc' },
            { type: { name: 'asc' } },
          ],
        },
        _count: {
          select: { coins: true },
        },
      },
    });

    if (!mint) {
      return res.status(404).json({ message: 'Mint not found' });
    }

    res.json(mint);
  } catch (error) {
    console.error('Error fetching mint:', error);
    res.status(500).json({ message: 'Failed to fetch mint' });
  }
});

// POST /api/mints - Create a new mint
router.post('/', async (req, res) => {
  try {
    const { name, mintMark, location, active = true } = req.body;

    // Validate required fields
    if (!name || mintMark === undefined) {
      return res.status(400).json({ 
        message: 'Missing required fields: name, mintMark' 
      });
    }

    const mint = await prisma.mint.create({
      data: {
        name,
        mintMark,
        location,
        active,
      },
    });

    res.status(201).json(mint);
  } catch (error) {
    if (error.code === 'P2002') {
      const field = error.meta?.target?.includes('name') ? 'name' : 'mint mark';
      return res.status(409).json({ 
        message: `Mint with this ${field} already exists` 
      });
    }
    console.error('Error creating mint:', error);
    res.status(500).json({ message: 'Failed to create mint' });
  }
});

// PUT /api/mints/:id - Update a mint
router.put('/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const { name, mintMark, location, active } = req.body;

    const mint = await prisma.mint.update({
      where: { id: parseInt(id) },
      data: {
        name,
        mintMark,
        location,
        active,
      },
    });

    res.json(mint);
  } catch (error) {
    if (error.code === 'P2025') {
      return res.status(404).json({ message: 'Mint not found' });
    }
    if (error.code === 'P2002') {
      const field = error.meta?.target?.includes('name') ? 'name' : 'mint mark';
      return res.status(409).json({ 
        message: `Mint with this ${field} already exists` 
      });
    }
    console.error('Error updating mint:', error);
    res.status(500).json({ message: 'Failed to update mint' });
  }
});

// DELETE /api/mints/:id - Delete a mint
router.delete('/:id', async (req, res) => {
  try {
    const { id } = req.params;

    // Check if mint has associated coins
    const coinCount = await prisma.coin.count({
      where: { mintId: parseInt(id) },
    });

    if (coinCount > 0) {
      return res.status(400).json({ 
        message: 'Cannot delete mint that has associated coins' 
      });
    }

    await prisma.mint.delete({
      where: { id: parseInt(id) },
    });

    res.status(204).end();
  } catch (error) {
    if (error.code === 'P2025') {
      return res.status(404).json({ message: 'Mint not found' });
    }
    console.error('Error deleting mint:', error);
    res.status(500).json({ message: 'Failed to delete mint' });
  }
});

export default router;