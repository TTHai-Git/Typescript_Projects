import React, { useState } from "react";
import { TextField, IconButton, Box } from "@mui/material";
import AddIcon from "@mui/icons-material/Add";
import RemoveIcon from "@mui/icons-material/Remove";

interface NumberInputProps {
  min?: number;
  max?: number;
  step?: number;
  defaultValue?: number;
  onChange?: (value: number) => void;
}

const NumberInput: React.FC<NumberInputProps> = ({
  min = 0,
  max = 100,
  step = 1,
  defaultValue = 1,
  onChange,
}) => {
  const [value, setValue] = useState<number>(defaultValue);

  const handleChange = (newValue: number) => {
    if (newValue >= min && newValue <= max) {
      setValue(newValue);
      if (onChange) onChange(newValue);
    }
  };

  return (
    <Box display="flex" alignItems="center">
      <IconButton
        onClick={() => handleChange(value - step)}
        disabled={value <= min}
      >
        <RemoveIcon />
      </IconButton>
      <TextField
        type="number"
        value={value}
        onChange={(e) => handleChange(Number(e.target.value))}
        inputProps={{ min, max, step }}
        size="small"
        sx={{ width: 70, textAlign: "center" }}
      />
      <IconButton
        onClick={() => handleChange(value + step)}
        disabled={value >= max}
      >
        <AddIcon />
      </IconButton>
    </Box>
  );
};

export default NumberInput;
