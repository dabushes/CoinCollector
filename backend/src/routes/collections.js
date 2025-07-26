import express from 'express';
import { PrismaClient } from '@prisma/client';

const router = express.Router();
const prisma = new PrismaClient();

// GET /api/collections - List user collections (for demo, using userId=1)
router.get('/', async (req, res) => {
  try {
    const { userId = 1, page = 1, limit = 20 } = req.query;

    const skip = (parseInt(page) - 1) * parseInt(limit);
    const take = parseInt(limit);

    const [collections, total] = await Promise.all([
      prisma.userCollection.findMany({
        where: { userId: parseInt(userId) },
        include: {
          coin: {
            include: {
              type: true,
              mint: true,
            },
          },
          user: {
            select: { id: true, name: true, email: true },
          },
        },
        skip,
        take,
        orderBy: [
          { createdAt: 'desc' },
        ],
      }),
      prisma.userCollection.count({ 
        where: { userId: parseInt(userId) } 
      }),
    ]);

    res.json({
      collections,
      pagination: {
        page: parseInt(page),
        limit: parseInt(limit),
        total,
        pages: Math.ceil(total / parseInt(limit)),
      },
    });
  } catch (error) {
    console.error('Error fetching collections:', error);
    res.status(500).json({ message: 'Failed to fetch collections' });
  }
});

// GET /api/collections/:id - Get a specific collection item
router.get('/:id', async (req, res) => {
  try {
    const { id } = req.params;
    
    const collection = await prisma.userCollection.findUnique({
      where: { id: parseInt(id) },
      include: {
        coin: {
          include: {
            type: true,
            mint: true,
          },
        },
        user: {
          select: { id: true, name: true, email: true },
        },
      },
    });

    if (!collection) {
      return res.status(404).json({ message: 'Collection item not found' });
    }

    res.json(collection);
  } catch (error) {
    console.error('Error fetching collection item:', error);
    res.status(500).json({ message: 'Failed to fetch collection item' });
  }
});

// POST /api/collections - Add a coin to user's collection
router.post('/', async (req, res) => {
  try {
    const { 
      userId = 1, 
      coinId, 
      quantity = 1, 
      condition = 'Good', 
      notes, 
      paidPrice 
    } = req.body;

    // Validate required fields
    if (!coinId) {
      return res.status(400).json({ 
        message: 'Missing required field: coinId' 
      });
    }

    // Check if coin exists
    const coin = await prisma.coin.findUnique({
      where: { id: parseInt(coinId) },
    });

    if (!coin) {
      return res.status(404).json({ message: 'Coin not found' });
    }

    // Check if user already has this coin in this condition
    const existingCollection = await prisma.userCollection.findUnique({
      where: {
        unique_user_coin_condition: {
          userId: parseInt(userId),
          coinId: parseInt(coinId),
          condition,
        },
      },
    });

    if (existingCollection) {
      // Update quantity instead of creating new entry
      const updatedCollection = await prisma.userCollection.update({
        where: { id: existingCollection.id },
        data: {
          quantity: existingCollection.quantity + parseInt(quantity),
          notes: notes || existingCollection.notes,
          paidPrice: paidPrice ? parseFloat(paidPrice) : existingCollection.paidPrice,
        },
        include: {
          coin: {
            include: {
              type: true,
              mint: true,
            },
          },
          user: {
            select: { id: true, name: true, email: true },
          },
        },
      });

      return res.json(updatedCollection);
    }

    const collection = await prisma.userCollection.create({
      data: {
        userId: parseInt(userId),
        coinId: parseInt(coinId),
        quantity: parseInt(quantity),
        condition,
        notes,
        paidPrice: paidPrice ? parseFloat(paidPrice) : null,
      },
      include: {
        coin: {
          include: {
            type: true,
            mint: true,
          },
        },
        user: {
          select: { id: true, name: true, email: true },
        },
      },
    });

    res.status(201).json(collection);
  } catch (error) {
    console.error('Error adding to collection:', error);
    res.status(500).json({ message: 'Failed to add to collection' });
  }
});

// PUT /api/collections/:id - Update a collection item
router.put('/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const { quantity, condition, notes, paidPrice } = req.body;

    const collection = await prisma.userCollection.update({
      where: { id: parseInt(id) },
      data: {
        quantity: quantity ? parseInt(quantity) : undefined,
        condition,
        notes,
        paidPrice: paidPrice ? parseFloat(paidPrice) : null,
      },
      include: {
        coin: {
          include: {
            type: true,
            mint: true,
          },
        },
        user: {
          select: { id: true, name: true, email: true },
        },
      },
    });

    res.json(collection);
  } catch (error) {
    if (error.code === 'P2025') {
      return res.status(404).json({ message: 'Collection item not found' });
    }
    console.error('Error updating collection item:', error);
    res.status(500).json({ message: 'Failed to update collection item' });
  }
});

// DELETE /api/collections/:id - Remove a collection item
router.delete('/:id', async (req, res) => {
  try {
    const { id } = req.params;

    await prisma.userCollection.delete({
      where: { id: parseInt(id) },
    });

    res.status(204).end();
  } catch (error) {
    if (error.code === 'P2025') {
      return res.status(404).json({ message: 'Collection item not found' });
    }
    console.error('Error removing collection item:', error);
    res.status(500).json({ message: 'Failed to remove collection item' });
  }
});

// GET /api/collections/stats/:userId - Get collection statistics
router.get('/stats/:userId', async (req, res) => {
  try {
    const { userId } = req.params;

    const [
      totalItems,
      totalCoins,
      totalValue,
      typeBreakdown,
      conditionBreakdown,
    ] = await Promise.all([
      prisma.userCollection.count({ 
        where: { userId: parseInt(userId) } 
      }),
      prisma.userCollection.aggregate({
        where: { userId: parseInt(userId) },
        _sum: { quantity: true },
      }),
      prisma.userCollection.aggregate({
        where: { 
          userId: parseInt(userId),
          paidPrice: { not: null },
        },
        _sum: { paidPrice: true },
      }),
      prisma.userCollection.groupBy({
        by: ['coinId'],
        where: { userId: parseInt(userId) },
        _count: true,
        _sum: { quantity: true },
      }),
      prisma.userCollection.groupBy({
        by: ['condition'],
        where: { userId: parseInt(userId) },
        _count: true,
        _sum: { quantity: true },
      }),
    ]);

    res.json({
      totalItems,
      totalCoins: totalCoins._sum.quantity || 0,
      totalValue: totalValue._sum.paidPrice || 0,
      uniqueCoins: typeBreakdown.length,
      conditionBreakdown,
    });
  } catch (error) {
    console.error('Error fetching collection stats:', error);
    res.status(500).json({ message: 'Failed to fetch collection stats' });
  }
});

export default router;