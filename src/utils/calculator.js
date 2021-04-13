/**
 * Returns the amount of xp required to reach a level.
 * 
 * @param {number} level - Target level.
 * @returns {number} The target level's xp.
 */
function xpFor (level) {
  return level * level * 100;
}

/**
 * Parses the level based on the amount of xp given.
 * 
 * @param {number} xp - The given amount of xp.
 * @returns {number} The level. 
 */
function parseLevel (xp) {
  return Math.floor(0.1 * Math.sqrt(xp));
}

module.exports = {
  xpFor,
  parseLevel
};