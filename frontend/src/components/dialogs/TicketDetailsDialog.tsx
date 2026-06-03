import React from 'react';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  Typography,
  Chip,
  Box,
  Divider,
} from '@mui/material';
import EditIcon from '@mui/icons-material/Edit';
import {
  type Ticket,
  categoryLabel,
  priorityColor,
  priorityLabel,
  statusColor,
  statusLabel,
} from '../../models/Ticket';

interface Props {
  ticket: Ticket;
  open: boolean;
  onClose: () => void;
  onEdit: () => void;
}

const Row: React.FC<{ label: string; value: React.ReactNode }> = ({ label, value }) => (
  <Box display="flex" alignItems="flex-start" gap={2} py={1}>
    <Typography variant="body2" color="text.secondary" sx={{ minWidth: 120, fontWeight: 600 }}>
      {label}
    </Typography>
    <Box>{value}</Box>
  </Box>
);

const TicketDetailsDialog: React.FC<Props> = ({ ticket, open, onClose, onEdit }) => (
  <Dialog open={open} onClose={onClose} fullWidth maxWidth="sm">
    <DialogTitle>{ticket.title}</DialogTitle>
    <DialogContent>
      <Divider sx={{ mb: 1 }} />

      <Row label="Description" value={<Typography variant="body2">{ticket.description}</Typography>} />
      <Row
        label="Priority"
        value={
          <Chip
            label={priorityLabel[ticket.priority]}
            color={priorityColor[ticket.priority]}
            size="small"
          />
        }
      />
      <Row
        label="Category"
        value={<Chip label={categoryLabel[ticket.category]} size="small" variant="outlined" />}
      />
      <Row
        label="Status"
        value={
          <Chip
            label={statusLabel[ticket.status]}
            color={statusColor[ticket.status]}
            size="small"
          />
        }
      />
      <Row
        label="Assigned To"
        value={
          <Typography variant="body2">
            {ticket.assignedToId ?? 'Unassigned'}
          </Typography>
        }
      />
      <Row
        label="Created"
        value={
          <Typography variant="body2">
            {new Date(ticket.createdAt).toLocaleString()}
          </Typography>
        }
      />
    </DialogContent>
    <DialogActions>
      <Button onClick={onClose}>Close</Button>
      <Button variant="contained" startIcon={<EditIcon />} onClick={onEdit}>
        Edit
      </Button>
    </DialogActions>
  </Dialog>
);

export default TicketDetailsDialog;
