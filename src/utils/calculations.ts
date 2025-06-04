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
        const factorial = (n: number) => {
          let result = 1;
          for (let i = 2; i <= n; i++) result *= i;
          return result;
        };
        
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
  let banzhafValue = 0;

  for (const coalition of coalitions) {
    if (!coalition.includes(player)) {
      const coalitionWithoutPlayer = [...coalition];
      const coalitionWithPlayer = [...coalition, player];
      
      const isWinningWithout = isWinningCoalition(coalitionWithoutPlayer, quotas, weightVectors);
      const isWinningWith = isWinningCoalition(coalitionWithPlayer, quotas, weightVectors);
      
      if (isWinningWith && !isWinningWithout) {
        banzhafValue++;
      }
    }
  }

  return banzhafValue;
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

  return results;
} 