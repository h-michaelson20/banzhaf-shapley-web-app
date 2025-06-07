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
  const [n, setN] = useState<number>(1);
  const [quotas, setQuotas] = useState<number[]>(Array(1).fill(0));
  const [weightVectors, setWeightVectors] = useState<WeightVector[]>(
    Array(1)
      .fill(null)
      .map(() => ({ weights: Array(1).fill(0) }))
  );
  const [method, setMethod] = useState<'shapley' | 'banzhaf'>('shapley');
  const [results, setResults] = useState<number[]>([]);

  const handleKChange = (event: ChangeEvent<HTMLInputElement>) => {
    const value = event.target.value;
    if (value === '') {
      setK(0);
    } else {
      const newK = parseInt(value, 10);
      if (!isNaN(newK)) {
        setK(newK);
        // reset quotas and weight‐vectors to match new number of issues (k)
        setQuotas(Array(newK).fill(0));
        setWeightVectors(
          Array(newK)
            .fill(null)
            .map(() => ({ weights: Array(n).fill(0) }))
        );
      }
    }
  };

  const handleNChange = (event: ChangeEvent<HTMLInputElement>) => {
    const value = event.target.value;
    if (value === '') {
      setN(0);
    } else {
      const newN = parseInt(value, 10);
      if (!isNaN(newN)) {
        setN(newN);
        // reset every issue's weight vector to new length
        setWeightVectors(
          Array(k)
            .fill(null)
            .map(() => ({ weights: Array(newN).fill(0) }))
        );
      }
    }
  };

  const handleQuotaChange = (index: number, value: string) => {
    const newQuotas = [...quotas];
    if (value === '') {
      newQuotas[index] = 0;
    } else {
      const numValue = parseInt(value, 10);
      if (!isNaN(numValue)) {
        newQuotas[index] = numValue;
      }
    }
    setQuotas(newQuotas);
  };

  const handleWeightChange = (
    vectorIndex: number,
    weightIndex: number,
    value: string
  ) => {
    const newWeightVectors = [...weightVectors];
    // copy the inner array before mutating
    const weightsCopy = [...(newWeightVectors[vectorIndex]?.weights || [])];
    if (value === '') {
      weightsCopy[weightIndex] = 0;
    } else {
      const numValue = parseInt(value, 10);
      if (!isNaN(numValue)) {
        weightsCopy[weightIndex] = numValue;
      }
    }
    newWeightVectors[vectorIndex] = { weights: weightsCopy };
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
                type="text"
                value={k === 0 ? '' : k}
                onChange={handleKChange}
                fullWidth
                inputProps={{ inputMode: 'numeric', pattern: '[0-9]*' }}
              />
            </Grid>
            <Grid item xs={12}>
              <TextField
                label="Number of Players (n)"
                type="text"
                value={n === 0 ? '' : n}
                onChange={handleNChange}
                fullWidth
                inputProps={{ inputMode: 'numeric', pattern: '[0-9]*' }}
              />
            </Grid>
            <Grid item xs={12}>
              <FormControl fullWidth>
                <InputLabel>Method</InputLabel>
                <Select value={method} label="Method" onChange={handleMethodChange}>
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
                        type="text"
                        value={quotas[index] === 0 ? '' : quotas[index]}
                        onChange={(e) =>
                          handleQuotaChange(index, e.target.value)
                        }
                        fullWidth
                        inputProps={{ inputMode: 'numeric', pattern: '[0-9]*' }}
                      />
                    </Grid>
                    <Grid item xs={12}>
                      <Typography variant="subtitle1" gutterBottom>
                        Weight Vector
                      </Typography>
                      <Grid container spacing={1}>
                        {weightVectors[index].weights.map((w, wIndex) => (
                          <Grid item xs={3} key={wIndex}>
                            <TextField
                              label={`Weight ${wIndex + 1}`}
                              type="text"
                              value={w === 0 ? '' : w}
                              onChange={(e) =>
                                handleWeightChange(
                                  index,
                                  wIndex,
                                  e.target.value
                                )
                              }
                              fullWidth
                              inputProps={{ inputMode: 'numeric', pattern: '[0-9]*' }}
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
                    {results.map((res, idx) => (
                      <Grid item xs={12} key={idx}>
                        <Typography>
                          Player {idx + 1}: {res.toFixed(4)}
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
