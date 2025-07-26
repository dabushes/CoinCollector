import express from 'express';
import { PrismaClient } from '@prisma/client';

const router = express.Router();
const prisma = new PrismaClient();

// GET /api/types - List all coin types
router.get('/', async (req, res) => {
  try {
    const { denomination, series } = req.query;

    const where = {};
    if (denomination) where.denomination = denomination;
    if (series) where.series = series;

    const types = await prisma.coinType.findMany({
      where,
      include: {
        _count: {
          select: { coins: true },
        },
      },
      orderBy: [
        { denomination: 'asc' },
        { name: 'asc' },
      ],
    });

    res.json(types);
  } catch (error) {
    console.error('Error fetching coin types:', error);
    res.status(500).json({ message: 'Failed to fetch coin types' });
  }
});

// GET /api/types/:id - Get a specific coin type by ID
router.get('/:id', async (req, res) => {
  try {
    const { id } = req.params;
    
    const type = await prisma.coinType.findUnique({
      where: { id: parseInt(id) },
      include: {
        coins: {
          include: {
            mint: true,
          },
          orderBy: [
            { year: 'desc' },
            { mint: { mintMark: 'asc' } },
          ],
        },
        _count: {
          select: { coins: true },
        },
      },
    });

    if (!type) {
      return res.status(404).json({ message: 'Coin type not found' });
    }

    res.json(type);
  } catch (error) {
    console.error('Error fetching coin type:', error);
    res.status(500).json({ message: 'Failed to fetch coin type' });
  }
});

// POST /api/types - Create a new coin type
router.post('/', async (req, res) => {
  try {
    const { 
      name, 
      denomination, 
      series, 
      startYear, 
      endYear, 
      description 
    } = req.body;

    // Validate required fields
    if (!name || !denomination) {
      return res.status(400).json({ 
        message: 'Missing required fields: name, denomination' 
      });
    }

    const type = await prisma.coinType.create({
      data: {
        name,
        denomination,
        series,
        startYear: startYear ? parseInt(startYear) : null,
        endYear: endYear ? parseInt(endYear) : null,
        description,
      },
    });

    res.status(201).json(type);
  } catch (error) {
    if (error.code === 'P2002') {
      return res.status(409).json({ 
        message: 'Coin type with this name already exists' 
      });
    }
    console.error('Error creating coin type:', error);
    res.status(500).json({ message: 'Failed to create coin type' });
  }
});

// PUT /api/types/:id - Update a coin type
router.put('/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const { 
      name, 
      denomination, 
      series, 
      startYear, 
      endYear, 
      description 
    } = req.body;

    const type = await prisma.coinType.update({
      where: { id: parseInt(id) },
      data: {
        name,
        denomination,
        series,
        startYear: startYear ? parseInt(startYear) : null,
        endYear: endYear ? parseInt(endYear) : null,
        description,
      },
    });

    res.json(type);
  } catch (error) {
    if (error.code === 'P2025') {
      return res.status(404).json({ message: 'Coin type not found' });
    }
    if (error.code === 'P2002') {
      return res.status(409).json({ 
        message: 'Coin type with this name already exists' 
      });
    }
    console.error('Error updating coin type:', error);
    res.status(500).json({ message: 'Failed to update coin type' });
  }
});

// DELETE /api/types/:id - Delete a coin type
router.delete('/:id', async (req, res) => {
  try {
    const { id } = req.params;

    // Check if type has associated coins
    const coinCount = await prisma.coin.count({
      where: { typeId: parseInt(id) },
    });

    if (coinCount > 0) {
      return res.status(400).json({ 
        message: 'Cannot delete coin type that has associated coins' 
      });
    }

    await prisma.coinType.delete({
      where: { id: parseInt(id) },
    });

    res.status(204).end();
  } catch (error) {
    if (error.code === 'P2025') {
      return res.status(404).json({ message: 'Coin type not found' });
    }
    console.error('Error deleting coin type:', error);
    res.status(500).json({ message: 'Failed to delete coin type' });
  }
});

export default router;