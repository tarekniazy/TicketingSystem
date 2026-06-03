import React from 'react';
import {
  Card,
  CardContent,
  CardActions,
  Typography,
  Chip,
  Box,
  Button,
} from '@mui/material';
import VisibilityIcon from '@mui/icons-material/Visibility';
import EditIcon from '@mui/icons-material/Edit';
import { type Ticket, categoryLabel, priorityColor, priorityLabel, statusColor, statusLabel } from '../models/Ticket';

interface Props {
  ticket: Ticket;
  onView: () => void;
  onEdit: () => void;
}

const TicketCard: React.FC<Props> = ({ ticket, onView, onEdit }) => (
  <Card variant="outlined" sx={{ height: '100%', display: 'flex', flexDirection: 'column' }}>
    <CardContent sx={{ flexGrow: 1, padding: '24px' }}>
      <Typography variant="subtitle1" fontWeight="bold" noWrap sx={{ marginBottom: '16px' }}>
        {ticket.title}
      </Typography>
      <Box sx={{ display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
        <Chip
          label={priorityLabel[ticket.priority]}
          color={priorityColor[ticket.priority]}
          size="small"
        />
        <Chip label={categoryLabel[ticket.category]} size="small" variant="outlined" />
        <Chip
          label={statusLabel[ticket.status]}
          color={statusColor[ticket.status]}
          size="small"
        />
      </Box>
    </CardContent>
    <CardActions sx={{ padding: '16px 24px' }}>
      <Button size="small" startIcon={<VisibilityIcon />} onClick={onView}>
        View
      </Button>
      <Button size="small" startIcon={<EditIcon />} onClick={onEdit}>
        Edit
      </Button>
    </CardActions>
  </Card>
);

export default TicketCard;
