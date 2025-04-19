import express from 'express';
import { 
  getAllGames, 
  getGameById, 
  createGame, 
  updateGame, 
  deleteGame, 
  getGamesByCategory, 
  incrementPlayCount 
} from '../controllers/gameController.js';
import { authenticate } from '../middleware/auth.js';

const router = express.Router();

// Public routes
router.get('/', getAllGames);
router.get('/category/:category', getGamesByCategory);
router.get('/:id', getGameById);
router.put('/:id/play', incrementPlayCount);

// Protected routes - require authentication
router.post('/', authenticate, createGame);
router.put('/:id', authenticate, updateGame);
router.delete('/:id', authenticate, deleteGame);

export default router; 