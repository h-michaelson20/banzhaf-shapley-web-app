interface WeightVector {
  weights: number[];
}

interface GameInput {
  k: number;
  quotas: number[];
  weightVectors: WeightVector[];
}

// Helper function to generate all possible coalitions
function generateCoalitions(n: number): number[][] {
  const coalitions: number[][] = [];
  const max = 1 << n;
  
  for (let i = 0; i < max; i++) {
    const coalition: number[] = [];
    for (let j = 0; j < n; j++) {
      if (i & (1 << j)) {
        coalition.push(j);
      }
    }
    coalitions.push(coalition);
  }
  
  return coalitions;
}

// Helper function to check if a coalition is winning
function isWinningCoalition(
  coalition: number[],
  quotas: number[],
  weightVectors: WeightVector[]
): boolean {
  for (let i = 0; i < quotas.length; i++) {
    const totalWeight = coalition.reduce((sum, player) => 
      sum + weightVectors[i].weights[player], 0);
    if (totalWeight < quotas[i]) {
      return false;
    }
  }
  return true;
}

// Helper function for factorial calculation
const factorial = (num: number): number => {
  let result = 1;
  for (let i = 2; i <= num; i++) result *= i;
  return result;
};

// Calculate Shapley value for a player
function calculateShapleyValue(
  player: number,
  quotas: number[],
  weightVectors: WeightVector[]
): number {
  const n = weightVectors[0].weights.length;
  const coalitions = generateCoalitions(n);
  let shapleyValue = 0;

  for (const coalition of coalitions) {
    if (!coalition.includes(player)) {
      const coalitionWithoutPlayer = [...coalition];
      const coalitionWithPlayer = [...coalition, player];
      
      const isWinningWithout = isWinningCoalition(coalitionWithoutPlayer, quotas, weightVectors);
      const isWinningWith = isWinningCoalition(coalitionWithPlayer, quotas, weightVectors);
      
      if (isWinningWith && !isWinningWithout) {
        const coalitionSize = coalition.length;
        // Coefficient for Shapley value: (|S|! * (n - |S| - 1)!) / n!
        shapleyValue += (factorial(coalitionSize) * factorial(n - coalitionSize - 1)) / factorial(n);
      }
    }
  }

  return shapleyValue;
}

// Calculate Banzhaf value for a player
function calculateBanzhafValue(
  player: number,
  quotas: number[],
  weightVectors: WeightVector[]
): number {
  const n = weightVectors[0].weights.length;
  const coalitions = generateCoalitions(n);
  let banzhafSwings = 0; // Count of times the player is a swing

  for (const coalition of coalitions) {
    // Consider coalitions S that do not include the player
    if (!coalition.includes(player)) {
      const coalitionWithoutPlayer = [...coalition]; // S
      const coalitionWithPlayer = [...coalition, player]; // S U {player}

      const isWinningWithout = isWinningCoalition(coalitionWithoutPlayer, quotas, weightVectors);
      const isWinningWith = isWinningCoalition(coalitionWithPlayer, quotas, weightVectors);

      // If S is losing and S U {player} is winning, player is a swing
      if (isWinningWith && !isWinningWithout) {
        banzhafSwings++;
      }
    }
  }

  // The Banzhaf power index is the number of swings divided by 2^(n-1)
  // where n is the total number of players. 2^(n-1) is the total number of
  // coalitions that do not include the player.
  const totalPossibleCoalitionsWithoutPlayer = Math.pow(2, n - 1);
  // Handle the case where n=0 or n=1 to avoid division by zero or incorrect normalization
  if (n === 0) return 0;
  if (n === 1) return banzhafSwings > 0 ? 1 : 0;

  return banzhafSwings / totalPossibleCoalitionsWithoutPlayer;
}

export function calculateValues(
  input: GameInput,
  method: 'shapley' | 'banzhaf'
): number[] {
  const n = input.weightVectors[0].weights.length;
  const results: number[] = [];

  for (let player = 0; player < n; player++) {
    const value = method === 'shapley'
      ? calculateShapleyValue(player, input.quotas, input.weightVectors)
      : calculateBanzhafValue(player, input.quotas, input.weightVectors);
    results.push(value);
  }

  // Normalize Banzhaf results to sum to 1
  if (method === 'banzhaf') {
    const sum = results.reduce((a, b) => a + b, 0);
    if (sum > 0) {  // Avoid division by zero
      return results.map(value => value / sum);
    }
  }

  return results;
}
