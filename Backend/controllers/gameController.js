import Game from '../models/game.js';

/**
 * Get all active games
 */
export const getAllGames = async (req, res) => {
  try {
    const games = await Game.find({ isActive: true });
    res.status(200).json(games);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

/**
 * Get a game by ID
 */
export const getGameById = async (req, res) => {
  try {
    const game = await Game.findById(req.params.id);
    if (!game) {
      return res.status(404).json({ message: 'Game not found' });
    }
    res.status(200).json(game);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

/**
 * Create a new game
 */
export const createGame = async (req, res) => {
  try {
    const { name, description, category, imageUrl } = req.body;
    
    if (!name || !description || !category) {
      return res.status(400).json({ message: 'Name, description, and category are required' });
    }
    
    const newGame = new Game({
      name,
      description,
      category,
      imageUrl,
      playCount: 0,
      isActive: true
    });
    
    const savedGame = await newGame.save();
    res.status(201).json(savedGame);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

/**
 * Update a game
 */
export const updateGame = async (req, res) => {
  try {
    const { name, description, category, imageUrl, isActive } = req.body;
    
    const updatedGame = await Game.findByIdAndUpdate(
      req.params.id,
      { name, description, category, imageUrl, isActive },
      { new: true, runValidators: true }
    );
    
    if (!updatedGame) {
      return res.status(404).json({ message: 'Game not found' });
    }
    
    res.status(200).json(updatedGame);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

/**
 * Delete a game
 */
export const deleteGame = async (req, res) => {
  try {
    const game = await Game.findByIdAndDelete(req.params.id);
    
    if (!game) {
      return res.status(404).json({ message: 'Game not found' });
    }
    
    res.status(200).json({ message: 'Game deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

/**
 * Get games by category
 */
export const getGamesByCategory = async (req, res) => {
  try {
    const games = await Game.find({ 
      category: req.params.category,
      isActive: true 
    });
    
    res.status(200).json(games);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

/**
 * Increment play count for a game
 */
export const incrementPlayCount = async (req, res) => {
  try {
    const game = await Game.findById(req.params.id);
    
    if (!game) {
      return res.status(404).json({ message: 'Game not found' });
    }
    
    game.playCount += 1;
    await game.save();
    
    res.status(200).json(game);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
}; 