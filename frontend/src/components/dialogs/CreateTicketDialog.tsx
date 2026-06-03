import React, { useState } from 'react';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  Button,
  Select,
  MenuItem,
  FormControl,
  InputLabel,
  CircularProgress,
  Alert,
} from '@mui/material';
import { useForm, Controller } from 'react-hook-form';
import { createTicket } from '../../api/ticketApi';
import { TicketCategory, TicketPriority, categoryLabel, priorityLabel } from '../../models/Ticket';

interface FormValues {
  title: string;
  description: string;
  priority: TicketPriority;
  category: TicketCategory;
}

interface Props {
  open: boolean;
  onClose: () => void;
  onCreated: () => void;
}

const CreateTicketDialog: React.FC<Props> = ({ open, onClose, onCreated }) => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const {
    register,
    handleSubmit,
    control,
    reset,
    formState: { errors },
  } = useForm<FormValues>({
    defaultValues: {
      priority: TicketPriority.Medium,
      category: TicketCategory.Bug,
    },
  });

  const handleClose = () => {
    reset();
    setError('');
    onClose();
  };

  const onSubmit = async (data: FormValues) => {
    setError('');
    setLoading(true);
    try {
      await createTicket(data);
      onCreated();
      handleClose();
    } catch {
      setError('Failed to create ticket.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Dialog open={open} onClose={handleClose} fullWidth maxWidth="sm">
      <DialogTitle>Create Ticket</DialogTitle>
      <DialogContent>
        {error && <Alert severity="error" sx={{ mb: 2 }}>{error}</Alert>}

        <TextField
          label="Title"
          fullWidth
          margin="normal"
          {...register('title', { required: 'Title is required' })}
          error={!!errors.title}
          helperText={errors.title?.message}
        />

        <TextField
          label="Description"
          fullWidth
          multiline
          rows={4}
          margin="normal"
          {...register('description', { required: 'Description is required' })}
          error={!!errors.description}
          helperText={errors.description?.message}
        />

        <FormControl fullWidth margin="normal">
          <InputLabel>Priority</InputLabel>
          <Controller
            name="priority"
            control={control}
            render={({ field }) => (
              <Select label="Priority" {...field}>
                {(Object.values(TicketPriority).filter((v): v is number => typeof v === 'number')).map((v) => (
                  <MenuItem key={v} value={v}>
                    {priorityLabel[v as TicketPriority]}
                  </MenuItem>
                ))}
              </Select>
            )}
          />
        </FormControl>

        <FormControl fullWidth margin="normal">
          <InputLabel>Category</InputLabel>
          <Controller
            name="category"
            control={control}
            render={({ field }) => (
              <Select label="Category" {...field}>
                {(Object.values(TicketCategory).filter((v): v is number => typeof v === 'number')).map((v) => (
                  <MenuItem key={v} value={v}>
                    {categoryLabel[v as TicketCategory]}
                  </MenuItem>
                ))}
              </Select>
            )}
          />
        </FormControl>
      </DialogContent>
      <DialogActions>
        <Button onClick={handleClose} disabled={loading}>
          Cancel
        </Button>
        <Button variant="contained" onClick={handleSubmit(onSubmit)} disabled={loading}>
          {loading ? <CircularProgress size={20} /> : 'Create'}
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default CreateTicketDialog;
