const express = require('express');
const { PrismaClient } = require('@prisma/client');

const router = express.Router();
const prisma = new PrismaClient();

// GET /api/coins - Get all coins with optional filtering
router.get('/', async (req, res) => {
  try {
    const { userId, country, year, condition, search } = req.query;
    
    const where = {};
    
    if (userId) where.userId = userId;
    if (country) where.country = { contains: country, mode: 'insensitive' };
    if (year) where.year = parseInt(year);
    if (condition) where.condition = condition;
    if (search) {
      where.OR = [
        { name: { contains: search, mode: 'insensitive' } },
        { description: { contains: search, mode: 'insensitive' } },
        { notes: { contains: search, mode: 'insensitive' } }
      ];
    }

    const coins = await prisma.coin.findMany({
      where,
      include: {
        user: {
          select: { id: true, name: true, email: true }
        }
      },
      orderBy: { createdAt: 'desc' }
    });

    res.json({
      success: true,
      count: coins.length,
      data: coins
    });
  } catch (error) {
    console.error('Error fetching coins:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to fetch coins',
      message: error.message
    });
  }
});

// GET /api/coins/:id - Get a specific coin
router.get('/:id', async (req, res) => {
  try {
    const { id } = req.params;
    
    const coin = await prisma.coin.findUnique({
      where: { id },
      include: {
        user: {
          select: { id: true, name: true, email: true }
        }
      }
    });

    if (!coin) {
      return res.status(404).json({
        success: false,
        error: 'Coin not found'
      });
    }

    res.json({
      success: true,
      data: coin
    });
  } catch (error) {
    console.error('Error fetching coin:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to fetch coin',
      message: error.message
    });
  }
});

// POST /api/coins - Create a new coin
router.post('/', async (req, res) => {
  try {
    const coinData = req.body;
    
    // Convert numeric strings to appropriate types
    if (coinData.year) coinData.year = parseInt(coinData.year);
    if (coinData.mintage) coinData.mintage = BigInt(coinData.mintage);
    if (coinData.diameter) coinData.diameter = parseFloat(coinData.diameter);
    if (coinData.weight) coinData.weight = parseFloat(coinData.weight);
    if (coinData.purchasePrice) coinData.purchasePrice = parseFloat(coinData.purchasePrice);
    if (coinData.currentValue) coinData.currentValue = parseFloat(coinData.currentValue);
    if (coinData.acquired) coinData.acquired = new Date(coinData.acquired);

    const coin = await prisma.coin.create({
      data: coinData,
      include: {
        user: {
          select: { id: true, name: true, email: true }
        }
      }
    });

    res.status(201).json({
      success: true,
      message: 'Coin created successfully',
      data: coin
    });
  } catch (error) {
    console.error('Error creating coin:', error);
    res.status(400).json({
      success: false,
      error: 'Failed to create coin',
      message: error.message
    });
  }
});

// PUT /api/coins/:id - Update a coin
router.put('/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const updateData = req.body;
    
    // Convert numeric strings to appropriate types
    if (updateData.year) updateData.year = parseInt(updateData.year);
    if (updateData.mintage) updateData.mintage = BigInt(updateData.mintage);
    if (updateData.diameter) updateData.diameter = parseFloat(updateData.diameter);
    if (updateData.weight) updateData.weight = parseFloat(updateData.weight);
    if (updateData.purchasePrice) updateData.purchasePrice = parseFloat(updateData.purchasePrice);
    if (updateData.currentValue) updateData.currentValue = parseFloat(updateData.currentValue);
    if (updateData.acquired) updateData.acquired = new Date(updateData.acquired);

    const coin = await prisma.coin.update({
      where: { id },
      data: updateData,
      include: {
        user: {
          select: { id: true, name: true, email: true }
        }
      }
    });

    res.json({
      success: true,
      message: 'Coin updated successfully',
      data: coin
    });
  } catch (error) {
    console.error('Error updating coin:', error);
    if (error.code === 'P2025') {
      return res.status(404).json({
        success: false,
        error: 'Coin not found'
      });
    }
    res.status(400).json({
      success: false,
      error: 'Failed to update coin',
      message: error.message
    });
  }
});

// DELETE /api/coins/:id - Delete a coin
router.delete('/:id', async (req, res) => {
  try {
    const { id } = req.params;
    
    await prisma.coin.delete({
      where: { id }
    });

    res.json({
      success: true,
      message: 'Coin deleted successfully'
    });
  } catch (error) {
    console.error('Error deleting coin:', error);
    if (error.code === 'P2025') {
      return res.status(404).json({
        success: false,
        error: 'Coin not found'
      });
    }
    res.status(500).json({
      success: false,
      error: 'Failed to delete coin',
      message: error.message
    });
  }
});

module.exports = router;