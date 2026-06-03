import React, { useEffect, useState } from 'react';
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
import { assignTicket, updateTicket, updateTicketStatus } from '../../api/ticketApi';
import { getUsers } from '../../api/userApi';
import {
  type Ticket,
  TicketCategory,
  TicketPriority,
  TicketStatus,
  categoryLabel,
  priorityLabel,
  statusLabel,
} from '../../models/Ticket';
import { type User } from '../../models/User';

interface FormValues {
  title: string;
  description: string;
  priority: TicketPriority;
  category: TicketCategory;
  status: TicketStatus;
  assignedToId: string;
}

interface Props {
  ticket: Ticket;
  open: boolean;
  onClose: () => void;
  onUpdated: () => void;
}

const EditTicketDialog: React.FC<Props> = ({ ticket, open, onClose, onUpdated }) => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [users, setUsers] = useState<User[]>([]);

  const {
    register,
    handleSubmit,
    control,
    reset,
    formState: { errors },
  } = useForm<FormValues>();

  useEffect(() => {
    if (open) {
      getUsers().then((res) => setUsers(res.data)).catch(() => setUsers([]));
    }
  }, [open]);

  useEffect(() => {
    reset({
      title: ticket.title,
      description: ticket.description,
      priority: ticket.priority,
      category: ticket.category,
      status: ticket.status,
      assignedToId: ticket.assignedToId ?? '',
    });
  }, [ticket, reset]);

  const handleClose = () => {
    setError('');
    onClose();
  };

  const onSubmit = async (data: FormValues) => {
    setError('');
    setLoading(true);
    try {
      await updateTicket(ticket.id, {
        ticketId: ticket.id,
        title: data.title,
        description: data.description,
        priority: data.priority,
        category: data.category,
      });

      if (data.status !== ticket.status) {
        await updateTicketStatus(ticket.id, {
          ticketId: ticket.id,
          status: data.status,
        });
      }

      if (data.assignedToId && data.assignedToId !== ticket.assignedToId) {
        await assignTicket(ticket.id, {
          ticketId: ticket.id,
          userId: data.assignedToId,
        });
      }

      onUpdated();
      handleClose();
    } catch {
      setError('Failed to update ticket.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Dialog open={open} onClose={handleClose} fullWidth maxWidth="sm">
      <DialogTitle>Edit Ticket</DialogTitle>
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

        <FormControl fullWidth margin="normal">
          <InputLabel>Status</InputLabel>
          <Controller
            name="status"
            control={control}
            render={({ field }) => (
              <Select label="Status" {...field}>
                {(Object.values(TicketStatus).filter((v): v is number => typeof v === 'number')).map((v) => (
                  <MenuItem key={v} value={v}>
                    {statusLabel[v as TicketStatus]}
                  </MenuItem>
                ))}
              </Select>
            )}
          />
        </FormControl>

        <FormControl fullWidth margin="normal">
          <InputLabel>Assignee</InputLabel>
          <Controller
            name="assignedToId"
            control={control}
            render={({ field }) => (
              <Select label="Assignee" {...field}>
                <MenuItem value="">Unassigned</MenuItem>
                {users.map((u) => (
                  <MenuItem key={u.id} value={u.id}>
                    {u.fullName}
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
          {loading ? <CircularProgress size={20} /> : 'Save'}
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default EditTicketDialog;
