import { useMemo, useState, useEffect } from 'react'
import { Box, Button, TextField, Switch, FormControlLabel, Paper, Typography, TableContainer, Table, TableHead, TableRow, TableCell, TableBody, Alert } from '@mui/material';
import UploadIcon from '@mui/icons-material/Upload';
import FilterIcon from '@mui/icons-material/FilterList';
import RefreshIcon from '@mui/icons-material/Refresh';


interface SampleRow {
  id: string;
  sampleId: string;
  moisture: number;
  dryDensity: number;
  correctionFactor: number;
  porosity: number;
}

const SamplesPage = ({ setHeaderText }: { setHeaderText: (callback: () => string) => void }) => {
  const [filterText, setFilterText] = useState<string>('');
  const [autoRecalc, setAutoRecalc] = useState<boolean>(true);
  const [samples, setSamples] = useState<SampleRow[]>([]);
  const [fileName, setFileName] = useState<string>('');
  const [computedSamples, setComputedSamples] = useState<SampleRow[]>([]);

  setHeaderText(() => {
    let title = 'Samples';
    if (fileName) title += ` - file: ${fileName}`;
    if (samples.length > 0) {
      title += ` - ${samples.length} rows`;
      if (filterText) title += ` (filtered: ${filteredSamples.length})`;
    }
    return title;
  });

  const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    setFileName(file.name);
    const reader = new FileReader();
    reader.onload = (e) => {
      const text = e.target?.result as string;
      const lines = text.trim().split('\n');
      const parsed: SampleRow[] = lines.map((line, idx) => {
        const [sampleId, moisture, dryDensity, correctionFactor, porosity] = line.split(',');
        return {
          id: `row-${idx}`,
          sampleId: sampleId?.trim() || '',
          moisture: parseFloat(moisture) || 0,
          dryDensity: parseFloat(dryDensity) || 0,
          correctionFactor: correctionFactor?.trim() ? parseFloat(correctionFactor) : 5,
          porosity: porosity?.trim() ? parseFloat(porosity) : 30,
        };
      });
      setSamples(parsed);
      setComputedSamples(parsed);
    };
    reader.readAsText(file);
  };

  const generateMockData = () => {
    const mockSamples: SampleRow[] = [
      { id: 'mock-1', sampleId: '001234-12', moisture: 12.5, dryDensity: 1.85, correctionFactor: 5, porosity: 30 },
      { id: 'mock-2', sampleId: '001234-13', moisture: 9.8, dryDensity: 1.92, correctionFactor: 5, porosity: 28 },
      { id: 'mock-3', sampleId: '003212-01', moisture: 15.2, dryDensity: 1.77, correctionFactor: 6, porosity: 31 },
      { id: 'mock-4', sampleId: '004123-05', moisture: 11.3, dryDensity: 1.88, correctionFactor: 5, porosity: 29 },
      { id: 'mock-5', sampleId: '005678-22', moisture: 13.7, dryDensity: 1.82, correctionFactor: 4, porosity: 32 },
    ];
    setSamples(mockSamples);
    setFileName('mock_data.csv');
    setComputedSamples(mockSamples);
  };

  useEffect(() => {
    if (autoRecalc) {
      setComputedSamples(samples);
    }
  }, [samples, autoRecalc]);

  useEffect(() => {
    if (samples.length > 0 && computedSamples.length === 0) {
      setComputedSamples(samples);
    }
  }, [samples, computedSamples.length]);

  const filteredSamples = useMemo(() => {
    if (!filterText.trim()) return samples;
    return samples.filter(s => s.sampleId.toLowerCase().includes(filterText.toLowerCase()));
  }, [samples, filterText]);

  const computedFiltered = useMemo(() => {
    if (!filterText.trim()) return computedSamples;
    return computedSamples.filter(s => s.sampleId.toLowerCase().includes(filterText.toLowerCase()));
  }, [computedSamples, filterText]);

  const calculateAdjusted = (row: SampleRow) => {
    const adjustedMoisture = row.moisture * (1 + row.correctionFactor / 100);
    const adjustedDensity = row.dryDensity * (1 - row.porosity / 100);
    return { adjustedMoisture, adjustedDensity };
  };

  const summary = useMemo(() => {
    if (computedFiltered.length === 0) return { avgMoisture: 0, avgDensity: 0, totalSamples: 0 };

    const totals = computedFiltered.reduce(
      (acc, row) => {
        const { adjustedMoisture, adjustedDensity } = calculateAdjusted(row);
        return {
          moisture: acc.moisture + adjustedMoisture,
          density: acc.density + adjustedDensity,
        };
      },
      { moisture: 0, density: 0 }
    );

    return {
      avgMoisture: totals.moisture / computedFiltered.length,
      avgDensity: totals.density / computedFiltered.length,
      totalSamples: computedFiltered.length,
    };
  }, [computedFiltered]);

  const updateSample = (id: string, field: keyof SampleRow, value: any) => {
    setSamples(prev => prev.map(s => s.id === id ? { ...s, [field]: value } : s));
  };

  const handleRecalculate = () => {
    setComputedSamples(samples);
  };

  return (
    <Box>
      <Box sx={{ mb: 3, display: 'flex', gap: 2, flexWrap: 'wrap', alignItems: 'center' }}>
        <Button variant="contained" component="label" startIcon={<UploadIcon />}>
          Upload CSV
          <input type="file" accept=".csv" hidden onChange={handleFileUpload} />
        </Button>
        <Button variant="outlined" onClick={generateMockData}>
          Generate Mock Data
        </Button>
        <TextField
          size="small"
          placeholder="Filter by Sample ID"
          value={filterText}
          onChange={(e) => setFilterText(e.target.value)}
          slotProps={{ input: { startAdornment: <FilterIcon sx={{ mr: 1, color: 'action.active' }} /> } }}
        />
        <FormControlLabel
          control={<Switch checked={autoRecalc} onChange={(e) => setAutoRecalc(e.target.checked)} />}
          label="Auto Recalculate"
        />
        {!autoRecalc && (
          <Button variant="outlined" startIcon={<RefreshIcon />} onClick={handleRecalculate}>
            Recalculate
          </Button>
        )}
      </Box>

      {samples.length > 0 && (
        <>
          <Paper sx={{ mb: 3, p: 2 }}>
            <Typography variant="h6" gutterBottom>Summary</Typography>
            <Box sx={{ display: 'flex', gap: 4, flexWrap: 'wrap' }}>
              <Box>
                <Typography variant="caption" color="text.secondary">Avg Adjusted Moisture</Typography>
                <Typography variant="h6">{summary.avgMoisture.toFixed(2)}%</Typography>
              </Box>
              <Box>
                <Typography variant="caption" color="text.secondary">Avg Adjusted Density</Typography>
                <Typography variant="h6">{summary.avgDensity.toFixed(3)} g/cm³</Typography>
              </Box>
              <Box>
                <Typography variant="caption" color="text.secondary">Total Samples</Typography>
                <Typography variant="h6">{summary.totalSamples}</Typography>
              </Box>
            </Box>
          </Paper>

          <TableContainer component={Paper}>
            <Table size="small">
              <TableHead>
                <TableRow>
                  <TableCell>Sample ID</TableCell>
                  <TableCell align="right">Moisture (%)</TableCell>
                  <TableCell align="right">Dry Density (g/cm³)</TableCell>
                  <TableCell align="right">Correction Factor (%)</TableCell>
                  <TableCell align="right">Porosity (%)</TableCell>
                  <TableCell align="right" sx={{ bgcolor: 'action.hover' }}>Adj. Moisture (%)</TableCell>
                  <TableCell align="right" sx={{ bgcolor: 'action.hover' }}>Adj. Density (g/cm³)</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {filteredSamples.map((row) => {
                  const snapshot = computedSamples.find(s => s.id === row.id) || row;
                  const { adjustedMoisture, adjustedDensity } = calculateAdjusted(snapshot);
                  return (
                    <TableRow key={row.id}>
                      <TableCell>
                        <TextField
                          size="small"
                          value={row.sampleId}
                          onChange={(e) => updateSample(row.id, 'sampleId', e.target.value as any)}
                          fullWidth
                        />
                      </TableCell>
                      <TableCell align="right">
                        <TextField
                          size="small"
                          type="number"
                          value={row.moisture}
                          onChange={(e) => updateSample(row.id, 'moisture', parseFloat(e.target.value) || 0)}
                           slotProps={{ htmlInput: { min: 0, step: 0.01 } }}
                        />
                      </TableCell>
                      <TableCell align="right">
                        <TextField
                          size="small"
                          type="number"
                          value={row.dryDensity}
                          onChange={(e) => updateSample(row.id, 'dryDensity', parseFloat(e.target.value) || 0)}
                          slotProps={{ htmlInput: { min: 0, step: 0.01 } }}
                        />
                      </TableCell>
                      <TableCell align="right">
                        <TextField
                          size="small"
                          type="number"
                          value={row.correctionFactor}
                          onChange={(e) => updateSample(row.id, 'correctionFactor', parseFloat(e.target.value) || 5)}
                          slotProps={{ htmlInput: { min: 0, step: 0.01 } }}
                        />
                      </TableCell>
                      <TableCell align="right">
                        <TextField
                          size="small"
                          type="number"
                          value={row.porosity}
                          onChange={(e) => updateSample(row.id, 'porosity', parseFloat(e.target.value) || 30)}
                          slotProps={{ htmlInput: { min: 0, step: 0.01 } }}
                        />
                      </TableCell>
                      <TableCell align="right" sx={{ bgcolor: 'action.hover', fontWeight: 'bold' }}>
                        {adjustedMoisture.toFixed(2)}
                      </TableCell>
                      <TableCell align="right" sx={{ bgcolor: 'action.hover', fontWeight: 'bold' }}>
                        {adjustedDensity.toFixed(3)}
                      </TableCell>
                    </TableRow>
                  );
                })}
              </TableBody>
            </Table>
          </TableContainer>
        </>
      )}

      {samples.length === 0 && (
        <Alert severity="info">
          Upload a CSV file or generate mock data to get started.
        </Alert>
      )}
    </Box>
  )
}

export default SamplesPage;