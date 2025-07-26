import express from 'express';
import { PrismaClient } from '@prisma/client';

const router = express.Router();
const prisma = new PrismaClient();

// GET /api/coins - List all coins with pagination and filtering
router.get('/', async (req, res) => {
  try {
    const { 
      page = 1, 
      limit = 20, 
      year, 
      typeId, 
      mintId, 
      condition 
    } = req.query;

    const skip = (parseInt(page) - 1) * parseInt(limit);
    const take = parseInt(limit);

    const where = {};
    if (year) where.year = parseInt(year);
    if (typeId) where.typeId = parseInt(typeId);
    if (mintId) where.mintId = parseInt(mintId);
    if (condition) where.condition = condition;

    const [coins, total] = await Promise.all([
      prisma.coin.findMany({
        where,
        include: {
          type: true,
          mint: true,
        },
        skip,
        take,
        orderBy: [
          { year: 'desc' },
          { type: { name: 'asc' } },
          { mint: { mintMark: 'asc' } },
        ],
      }),
      prisma.coin.count({ where }),
    ]);

    res.json({
      coins,
      pagination: {
        page: parseInt(page),
        limit: parseInt(limit),
        total,
        pages: Math.ceil(total / parseInt(limit)),
      },
    });
  } catch (error) {
    console.error('Error fetching coins:', error);
    res.status(500).json({ message: 'Failed to fetch coins' });
  }
});

// GET /api/coins/:id - Get a specific coin by ID
router.get('/:id', async (req, res) => {
  try {
    const { id } = req.params;
    
    const coin = await prisma.coin.findUnique({
      where: { id: parseInt(id) },
      include: {
        type: true,
        mint: true,
        collections: {
          include: {
            user: {
              select: { id: true, name: true, email: true },
            },
          },
        },
      },
    });

    if (!coin) {
      return res.status(404).json({ message: 'Coin not found' });
    }

    res.json(coin);
  } catch (error) {
    console.error('Error fetching coin:', error);
    res.status(500).json({ message: 'Failed to fetch coin' });
  }
});

// POST /api/coins - Create a new coin
router.post('/', async (req, res) => {
  try {
    const { year, mintId, typeId, condition, value, notes, imageUrl } = req.body;

    // Validate required fields
    if (!year || !mintId || !typeId) {
      return res.status(400).json({ 
        message: 'Missing required fields: year, mintId, typeId' 
      });
    }

    // Check if coin already exists
    const existingCoin = await prisma.coin.findUnique({
      where: {
        unique_coin: {
          year: parseInt(year),
          mintId: parseInt(mintId),
          typeId: parseInt(typeId),
        },
      },
    });

    if (existingCoin) {
      return res.status(409).json({ 
        message: 'Coin with this year, mint, and type already exists' 
      });
    }

    const coin = await prisma.coin.create({
      data: {
        year: parseInt(year),
        mintId: parseInt(mintId),
        typeId: parseInt(typeId),
        condition: condition || 'Good',
        value: value ? parseFloat(value) : null,
        notes,
        imageUrl,
      },
      include: {
        type: true,
        mint: true,
      },
    });

    res.status(201).json(coin);
  } catch (error) {
    console.error('Error creating coin:', error);
    res.status(500).json({ message: 'Failed to create coin' });
  }
});

// PUT /api/coins/:id - Update a coin
router.put('/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const { condition, value, notes, imageUrl } = req.body;

    const coin = await prisma.coin.update({
      where: { id: parseInt(id) },
      data: {
        condition,
        value: value ? parseFloat(value) : null,
        notes,
        imageUrl,
      },
      include: {
        type: true,
        mint: true,
      },
    });

    res.json(coin);
  } catch (error) {
    if (error.code === 'P2025') {
      return res.status(404).json({ message: 'Coin not found' });
    }
    console.error('Error updating coin:', error);
    res.status(500).json({ message: 'Failed to update coin' });
  }
});

// DELETE /api/coins/:id - Delete a coin
router.delete('/:id', async (req, res) => {
  try {
    const { id } = req.params;

    await prisma.coin.delete({
      where: { id: parseInt(id) },
    });

    res.status(204).end();
  } catch (error) {
    if (error.code === 'P2025') {
      return res.status(404).json({ message: 'Coin not found' });
    }
    console.error('Error deleting coin:', error);
    res.status(500).json({ message: 'Failed to delete coin' });
  }
});

export default router;