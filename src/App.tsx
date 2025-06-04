import React, { useState, ChangeEvent } from 'react';
import {
  Container,
  Box,
  Typography,
  TextField,
  Button,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Paper,
  Grid,
  SelectChangeEvent,
} from '@mui/material';
import { calculateValues } from './utils/calculations';

interface WeightVector {
  weights: number[];
}

interface GameInput {
  k: number;
  quotas: number[];
  weightVectors: WeightVector[];
}

function App() {
  const [k, setK] = useState<number>(1);
  const [quotas, setQuotas] = useState<number[]>([0]);
  const [weightVectors, setWeightVectors] = useState<WeightVector[]>([{ weights: [0] }]);
  const [method, setMethod] = useState<'shapley' | 'banzhaf'>('shapley');
  const [results, setResults] = useState<number[]>([]);

  const handleKChange = (event: ChangeEvent<HTMLInputElement>) => {
    const newK = parseInt(event.target.value) || 1;
    setK(newK);
    
    // Update arrays to match new k
    setQuotas(Array(newK).fill(0));
    setWeightVectors(Array(newK).fill({ weights: [0] }));
  };

  const handleQuotaChange = (index: number, value: number) => {
    const newQuotas = [...quotas];
    newQuotas[index] = value;
    setQuotas(newQuotas);
  };

  const handleWeightChange = (vectorIndex: number, weightIndex: number, value: number) => {
    const newWeightVectors = [...weightVectors];
    if (!newWeightVectors[vectorIndex].weights[weightIndex]) {
      newWeightVectors[vectorIndex].weights[weightIndex] = 0;
    }
    newWeightVectors[vectorIndex].weights[weightIndex] = value;
    setWeightVectors(newWeightVectors);
  };

  const handleMethodChange = (event: SelectChangeEvent) => {
    setMethod(event.target.value as 'shapley' | 'banzhaf');
  };

  const handleCalculateValues = () => {
    const input: GameInput = {
      k,
      quotas,
      weightVectors,
    };
    const results = calculateValues(input, method);
    setResults(results);
  };

  return (
    <Container maxWidth="md">
      <Box sx={{ my: 4 }}>
        <Typography variant="h4" component="h1" gutterBottom align="center">
          Vector Weighted Voting Game Calculator
        </Typography>
        
        <Paper sx={{ p: 3, mb: 3 }}>
          <Grid container spacing={3}>
            <Grid item xs={12}>
              <TextField
                label="Number of Issues (k)"
                type="number"
                value={k}
                onChange={handleKChange}
                fullWidth
                inputProps={{ min: 1 }}
              />
            </Grid>

            <Grid item xs={12}>
              <FormControl fullWidth>
                <InputLabel>Method</InputLabel>
                <Select
                  value={method}
                  label="Method"
                  onChange={handleMethodChange}
                >
                  <MenuItem value="shapley">Shapley Value</MenuItem>
                  <MenuItem value="banzhaf">Banzhaf Value</MenuItem>
                </Select>
              </FormControl>
            </Grid>

            {Array.from({ length: k }).map((_, index) => (
              <Grid item xs={12} key={index}>
                <Paper sx={{ p: 2 }}>
                  <Typography variant="h6" gutterBottom>
                    Issue {index + 1}
                  </Typography>
                  <Grid container spacing={2}>
                    <Grid item xs={12}>
                      <TextField
                        label={`Quota ${index + 1}`}
                        type="number"
                        value={quotas[index]}
                        onChange={(e) => handleQuotaChange(index, parseInt(e.target.value) || 0)}
                        fullWidth
                        inputProps={{ min: 0 }}
                      />
                    </Grid>
                    <Grid item xs={12}>
                      <Typography variant="subtitle1" gutterBottom>
                        Weight Vector
                      </Typography>
                      <Grid container spacing={1}>
                        {weightVectors[index].weights.map((weight, wIndex) => (
                          <Grid item xs={3} key={wIndex}>
                            <TextField
                              label={`Weight ${wIndex + 1}`}
                              type="number"
                              value={weight}
                              onChange={(e) => handleWeightChange(index, wIndex, parseInt(e.target.value) || 0)}
                              fullWidth
                              inputProps={{ min: 0 }}
                            />
                          </Grid>
                        ))}
                      </Grid>
                    </Grid>
                  </Grid>
                </Paper>
              </Grid>
            ))}

            <Grid item xs={12}>
              <Button
                variant="contained"
                color="primary"
                onClick={handleCalculateValues}
                fullWidth
                size="large"
              >
                Calculate {method === 'shapley' ? 'Shapley' : 'Banzhaf'} Values
              </Button>
            </Grid>

            {results.length > 0 && (
              <Grid item xs={12}>
                <Paper sx={{ p: 2 }}>
                  <Typography variant="h6" gutterBottom>
                    Results
                  </Typography>
                  <Grid container spacing={2}>
                    {results.map((result, index) => (
                      <Grid item xs={12} key={index}>
                        <Typography>
                          Player {index + 1}: {result.toFixed(4)}
                        </Typography>
                      </Grid>
                    ))}
                  </Grid>
                </Paper>
              </Grid>
            )}
          </Grid>
        </Paper>
      </Box>
    </Container>
  );
}

export default App; 