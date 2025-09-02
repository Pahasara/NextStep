// Level System for NextStep Platform

export interface LevelInfo {
  level: number;
  currentXP: number;
  xpForCurrentLevel: number;
  xpForNextLevel: number;
  progressToNextLevel: number;
  levelName: string;
  badgeName: string;
}

// XP thresholds for each level (exponential growth)
export const getLevelThresholds = (): number[] => {
  const thresholds = [0]; // Level 1 starts at 0 XP
  
  for (let level = 2; level <= 100; level++) {
    // Exponential growth: each level requires more XP
    const baseXP = 100;
    const multiplier = Math.pow(1.5, level - 2);
    const xpRequired = Math.floor(baseXP * multiplier);
    thresholds.push(thresholds[level - 2] + xpRequired);
  }
  
  return thresholds;
};

export const calculateLevel = (totalXP: number): LevelInfo => {
  const thresholds = getLevelThresholds();
  
  // Find current level
  let level = 1;
  for (let i = thresholds.length - 1; i >= 0; i--) {
    if (totalXP >= thresholds[i]) {
      level = i + 1;
      break;
    }
  }
  
  const currentLevelThreshold = thresholds[level - 1] || 0;
  const nextLevelThreshold = thresholds[level] || (currentLevelThreshold + 1000);
  
  const xpInCurrentLevel = totalXP - currentLevelThreshold;
  const xpNeededForNextLevel = nextLevelThreshold - currentLevelThreshold;
  const progressToNextLevel = Math.min(100, (xpInCurrentLevel / xpNeededForNextLevel) * 100);
  
  return {
    level,
    currentXP: totalXP,
    xpForCurrentLevel: currentLevelThreshold,
    xpForNextLevel: nextLevelThreshold,
    progressToNextLevel,
    levelName: getLevelName(level),
    badgeName: getBadgeName(level)
  };
};

export const getLevelName = (level: number): string => {
  if (level >= 50) return "Grand Master";
  if (level >= 40) return "Expert";
  if (level >= 30) return "Advanced";
  if (level >= 20) return "Proficient";
  if (level >= 15) return "Skilled";
  if (level >= 10) return "Intermediate";
  if (level >= 5) return "Beginner";
  return "Newcomer";
};

export const getBadgeName = (level: number): string => {
  if (level >= 50) return "Legendary Graduate";
  if (level >= 40) return "Master Developer";
  if (level >= 30) return "Senior Expert";
  if (level >= 20) return "Advanced Learner";
  if (level >= 15) return "Skilled Developer";
  if (level >= 10) return "Rising Star";
  if (level >= 5) return "Dedicated Student";
  return "New Student";
};

export const getLevelColor = (level: number): string => {
  if (level >= 50) return "from-purple-400 to-pink-400";
  if (level >= 40) return "from-yellow-400 to-orange-400";
  if (level >= 30) return "from-blue-400 to-purple-400";
  if (level >= 20) return "from-green-400 to-blue-400";
  if (level >= 15) return "from-indigo-400 to-purple-400";
  if (level >= 10) return "from-green-400 to-teal-400";
  if (level >= 5) return "from-blue-400 to-indigo-400";
  return "from-gray-400 to-gray-500";
};

export const getRankIcon = (rank: number): string => {
  if (rank === 1) return "👑";
  if (rank === 2) return "🥈";
  if (rank === 3) return "🥉";
  if (rank <= 10) return "🏅";
  if (rank <= 50) return "⭐";
  return "📊";
};

// Achievement rarity colors
export const getRarityColor = (rarity: string): string => {
  switch (rarity?.toLowerCase()) {
    case "common": return "bg-gray-100 text-gray-700 border-gray-300";
    case "uncommon": return "bg-green-100 text-green-700 border-green-300";
    case "rare": return "bg-blue-100 text-blue-700 border-blue-300";
    case "epic": return "bg-purple-100 text-purple-700 border-purple-300";
    case "legendary": return "bg-yellow-100 text-yellow-700 border-yellow-300";
    default: return "bg-gray-100 text-gray-700 border-gray-300";
  }
};

// XP Calculation helpers
export const getXPForNextLevel = (currentLevel: number): number => {
  const thresholds = getLevelThresholds();
  return thresholds[currentLevel] || (thresholds[currentLevel - 1] + 1000);
};

export const getXPProgress = (currentXP: number, level: number): number => {
  const thresholds = getLevelThresholds();
  const currentLevelXP = thresholds[level - 1] || 0;
  const nextLevelXP = thresholds[level] || (currentLevelXP + 1000);
  
  const progressXP = currentXP - currentLevelXP;
  const totalXPNeeded = nextLevelXP - currentLevelXP;
  
  return Math.min(100, (progressXP / totalXPNeeded) * 100);
};
