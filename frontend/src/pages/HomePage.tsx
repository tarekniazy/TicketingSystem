import React, { useEffect, useState, useCallback } from 'react';
import {
  Box,
  AppBar,
  Toolbar,
  Typography,
  Button,
  Tabs,
  Tab,
  TextField,
  Select,
  MenuItem,
  FormControl,
  InputLabel,
  Grid,
  CircularProgress,
  Alert,
} from '@mui/material';
import AddIcon from '@mui/icons-material/Add';
import LogoutIcon from '@mui/icons-material/Logout';
import { useAuth } from '../hooks/useAuth';
import { useNavigate } from 'react-router-dom';
import { getAllTickets, getTicketsForUser } from '../api/ticketApi';
import { type Ticket, TicketCategory, TicketPriority, TicketStatus, categoryLabel, priorityLabel, statusLabel } from '../models/Ticket';
import TicketCard from '../components/TicketCard';
import CreateTicketDialog from '../components/dialogs/CreateTicketDialog';
import EditTicketDialog from '../components/dialogs/EditTicketDialog';
import TicketDetailsDialog from '../components/dialogs/TicketDetailsDialog';

const PRIORITY_OPTIONS = [0, ...Object.values(TicketPriority).filter((v): v is number => typeof v === 'number')];
const STATUS_OPTIONS = [0, ...Object.values(TicketStatus).filter((v): v is number => typeof v === 'number')];
const CATEGORY_OPTIONS = [0, ...Object.values(TicketCategory).filter((v): v is number => typeof v === 'number')];

const HomePage: React.FC = () => {
  const { userId, logout } = useAuth();
  const navigate = useNavigate();

  const [tab, setTab] = useState(0);
  const [allTickets, setAllTickets] = useState<Ticket[]>([]);
  const [assignedTickets, setAssignedTickets] = useState<Ticket[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const [search, setSearch] = useState('');
  const [filterPriority, setFilterPriority] = useState(0);
  const [filterStatus, setFilterStatus] = useState(0);
  const [filterCategory, setFilterCategory] = useState(0);

  const [createOpen, setCreateOpen] = useState(false);
  const [detailsTicket, setDetailsTicket] = useState<Ticket | null>(null);
  const [editTicket, setEditTicket] = useState<Ticket | null>(null);

  const fetchTickets = useCallback(async () => {
    if (!userId) return;
    setLoading(true);
    setError('');
    try {
      const [allRes, assignedRes] = await Promise.all([
        getAllTickets(),
        getTicketsForUser(userId),
      ]);
      setAllTickets(allRes.data);
      setAssignedTickets(assignedRes.data);
    } catch {
      setError('Failed to load tickets.');
    } finally {
      setLoading(false);
    }
  }, [userId]);

  useEffect(() => {
    fetchTickets();
  }, [fetchTickets]);

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  const createdTickets = allTickets.filter((t) => t.createdById === userId);
  const activeTickets = tab === 0 ? assignedTickets : createdTickets;

  const filtered = activeTickets.filter((t) => {
    if (search && !t.title.toLowerCase().includes(search.toLowerCase())) return false;
    if (filterPriority && t.priority !== filterPriority) return false;
    if (filterStatus && t.status !== filterStatus) return false;
    if (filterCategory && t.category !== filterCategory) return false;
    return true;
  });

  return (
    <Box minHeight="100vh" bgcolor="grey.100">
      <AppBar position="static">
        <Toolbar>
          <Typography variant="h6" sx={{ flexGrow: 1 }}>
            Ticketing System
          </Typography>
          <Button
            color="inherit"
            startIcon={<AddIcon />}
            onClick={() => setCreateOpen(true)}
            sx={{ mr: 1 }}
          >
            Create Ticket
          </Button>
          <Button color="inherit" startIcon={<LogoutIcon />} onClick={handleLogout}>
            Logout
          </Button>
        </Toolbar>
      </AppBar>

      <Box sx={{ padding: '40px' }}>
        <Tabs value={tab} onChange={(_, v) => setTab(v)} sx={{ marginBottom: '32px' }}>
          <Tab label="My Assigned Tickets" />
          <Tab label="My Created Tickets" />
        </Tabs>

        <Box sx={{ display: 'flex', gap: '16px', marginBottom: '32px', flexWrap: 'wrap' }}>
          <TextField
            label="Search"
            size="small"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            sx={{ minWidth: 200 }}
          />
          <FormControl size="small" sx={{ minWidth: 140 }}>
            <InputLabel>Priority</InputLabel>
            <Select
              label="Priority"
              value={filterPriority}
              onChange={(e) => setFilterPriority(Number(e.target.value))}
            >
              <MenuItem value={0}>All</MenuItem>
              {PRIORITY_OPTIONS.slice(1).map((v) => (
                <MenuItem key={v} value={v}>
                  {priorityLabel[v as TicketPriority]}
                </MenuItem>
              ))}
            </Select>
          </FormControl>
          <FormControl size="small" sx={{ minWidth: 140 }}>
            <InputLabel>Status</InputLabel>
            <Select
              label="Status"
              value={filterStatus}
              onChange={(e) => setFilterStatus(Number(e.target.value))}
            >
              <MenuItem value={0}>All</MenuItem>
              {STATUS_OPTIONS.slice(1).map((v) => (
                <MenuItem key={v} value={v}>
                  {statusLabel[v as TicketStatus]}
                </MenuItem>
              ))}
            </Select>
          </FormControl>
          <FormControl size="small" sx={{ minWidth: 160 }}>
            <InputLabel>Category</InputLabel>
            <Select
              label="Category"
              value={filterCategory}
              onChange={(e) => setFilterCategory(Number(e.target.value))}
            >
              <MenuItem value={0}>All</MenuItem>
              {CATEGORY_OPTIONS.slice(1).map((v) => (
                <MenuItem key={v} value={v}>
                  {categoryLabel[v as TicketCategory]}
                </MenuItem>
              ))}
            </Select>
          </FormControl>
        </Box>

        {loading && (
          <Box display="flex" justifyContent="center" py={6}>
            <CircularProgress />
          </Box>
        )}

        {error && <Alert severity="error">{error}</Alert>}

        {!loading && !error && filtered.length === 0 && (
          <Typography color="text.secondary" textAlign="center" py={6}>
            No tickets found.
          </Typography>
        )}

        {!loading && (
          <Grid container spacing={3}>
            {filtered.map((ticket) => (
              <Grid key={ticket.id} size={{ xs: 12, sm: 6, md: 4 }}>
                <TicketCard
                  ticket={ticket}
                  onView={() => setDetailsTicket(ticket)}
                  onEdit={() => setEditTicket(ticket)}
                />
              </Grid>
            ))}
          </Grid>
        )}
      </Box>

      <CreateTicketDialog
        open={createOpen}
        onClose={() => setCreateOpen(false)}
        onCreated={fetchTickets}
      />

      {detailsTicket && (
        <TicketDetailsDialog
          ticket={detailsTicket}
          open
          onClose={() => setDetailsTicket(null)}
          onEdit={() => {
            setEditTicket(detailsTicket);
            setDetailsTicket(null);
          }}
        />
      )}

      {editTicket && (
        <EditTicketDialog
          ticket={editTicket}
          open
          onClose={() => setEditTicket(null)}
          onUpdated={fetchTickets}
        />
      )}
    </Box>
  );
};

export default HomePage;
