'use client';

import React, { useState } from 'react';
import { Appointment, AppointmentStatus } from '@/types/clinic';
import {
  updateAppointmentStatus,
  updateAppointmentNotes,
  deleteAppointment,
} from '@/lib/actions/appointments';
import { cleanPhoneForTel } from '@/lib/utils/formatters';
import {
  Search,
  Phone,
  MessageCircle,
  Download,
  Calendar,
  Clock,
  Trash2,
  Edit3,
  Check,
  CheckCircle2,
  XCircle,
  AlertCircle,
} from 'lucide-react';

interface AppointmentsTableProps {
  initialAppointments: Appointment[];
}

export function AppointmentsTable({ initialAppointments }: AppointmentsTableProps) {
  const [appointments, setAppointments] = useState<Appointment[]>(initialAppointments);
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [editingNotesId, setEditingNotesId] = useState<string | null>(null);
  const [tempNotes, setTempNotes] = useState<string>('');
  const [isUpdating, setIsUpdating] = useState(false);

  // Filter appointments
  const filteredAppointments = appointments.filter((item) => {
    const matchesSearch =
      item.patient_name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.phone.includes(searchQuery) ||
      (item.treatment_name &&
        item.treatment_name.toLowerCase().includes(searchQuery.toLowerCase()));

    const matchesStatus =
      statusFilter === 'all' ? true : item.status === statusFilter;

    return matchesSearch && matchesStatus;
  });

  // Handle status update
  const handleStatusChange = async (id: string, newStatus: AppointmentStatus) => {
    setIsUpdating(true);
    setAppointments((prev) =>
      prev.map((app) => (app.id === id ? { ...app, status: newStatus } : app))
    );

    await updateAppointmentStatus(id, newStatus);
    setIsUpdating(false);
  };

  // Handle saving internal notes
  const saveNotes = async (id: string) => {
    setAppointments((prev) =>
      prev.map((app) =>
        app.id === id ? { ...app, internal_notes: tempNotes } : app
      )
    );
    setEditingNotesId(null);
    await updateAppointmentNotes(id, tempNotes);
  };

  // Handle delete
  const handleDelete = async (id: string) => {
    if (confirm('Are you sure you want to delete this booking record?')) {
      setAppointments((prev) => prev.filter((app) => app.id !== id));
      await deleteAppointment(id);
    }
  };

  // Export to CSV
  const exportToCSV = () => {
    const headers = [
      'Patient Name',
      'Phone',
      'Treatment',
      'Preferred Date',
      'Preferred Time',
      'Status',
      'Patient Notes',
      'Internal Clinic Notes',
      'Created At',
    ];

    const rows = filteredAppointments.map((app) => [
      `"${app.patient_name}"`,
      `"${app.phone}"`,
      `"${app.treatment_name || 'General Consultation'}"`,
      `"${app.preferred_date}"`,
      `"${app.preferred_time}"`,
      `"${app.status}"`,
      `"${(app.patient_notes || '').replace(/"/g, '""')}"`,
      `"${(app.internal_notes || '').replace(/"/g, '""')}"`,
      `"${new Date(app.created_at).toLocaleString()}"`,
    ]);

    const csvContent =
      'data:text/csv;charset=utf-8,' +
      [headers.join(','), ...rows.map((e) => e.join(','))].join('\n');

    const encodedUri = encodeURI(csvContent);
    const link = document.createElement('a');
    link.setAttribute('href', encodedUri);
    link.setAttribute(
      'download',
      `clinic_appointments_${new Date().toISOString().split('T')[0]}.csv`
    );
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const getStatusBadge = (status: AppointmentStatus) => {
    switch (status) {
      case 'new':
        return 'bg-blue-50 text-blue-700 border-blue-200';
      case 'confirmed':
        return 'bg-emerald-50 text-emerald-700 border-emerald-200';
      case 'completed':
        return 'bg-neutral-100 text-neutral-800 border-neutral-300';
      case 'cancelled':
        return 'bg-red-50 text-red-700 border-red-200';
    }
  };

  return (
    <div className="space-y-6">
      {/* Controls Bar: Search, Status Filter, CSV Export */}
      <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3 bg-surface p-4 rounded-2xl border border-border shadow-soft">
        <div className="flex-1 relative">
          <Search className="w-4 h-4 text-ink-muted absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            placeholder="Search by patient name, phone, or treatment..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-9 pr-4 py-2 bg-canvas border border-border rounded-xl text-xs sm:text-sm text-ink focus:outline-none focus:ring-2 focus:ring-accent/20 focus:border-accent"
          />
        </div>

        <div className="flex items-center space-x-2">
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="px-3 py-2 bg-canvas border border-border rounded-xl text-xs sm:text-sm text-ink focus:outline-none focus:ring-2 focus:ring-accent/20"
          >
            <option value="all">All Statuses ({appointments.length})</option>
            <option value="new">New Requests</option>
            <option value="confirmed">Confirmed</option>
            <option value="completed">Completed</option>
            <option value="cancelled">Cancelled</option>
          </select>

          <button
            onClick={exportToCSV}
            className="inline-flex items-center space-x-1.5 px-3.5 py-2 rounded-xl bg-canvas hover:bg-surface border border-border text-xs font-medium text-ink transition-colors shadow-sm"
            title="Download CSV"
          >
            <Download className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">Export CSV</span>
          </button>
        </div>
      </div>

      {/* Appointment Cards (Responsive List for Mobile & Desktop) */}
      {filteredAppointments.length === 0 ? (
        <div className="bg-surface rounded-2xl p-12 text-center border border-border space-y-3">
          <div className="w-12 h-12 rounded-full bg-canvas flex items-center justify-center mx-auto text-ink-muted">
            <Calendar className="w-6 h-6" />
          </div>
          <h3 className="text-base font-semibold text-ink">
            No booking requests found
          </h3>
          <p className="text-xs text-ink-muted max-w-sm mx-auto">
            {searchQuery || statusFilter !== 'all'
              ? 'Try adjusting your search query or status filter.'
              : 'New appointment submissions from the website will appear here in real time.'}
          </p>
        </div>
      ) : (
        <div className="space-y-4">
          {filteredAppointments.map((app) => (
            <div
              key={app.id}
              className="bg-surface rounded-2xl p-5 sm:p-6 border border-border shadow-soft space-y-4 hover:border-border/80 transition-all"
            >
              {/* Header: Name, Treatment, Status dropdown */}
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-3 border-b border-border/60">
                <div>
                  <div className="flex items-center space-x-2">
                    <span className="text-base font-bold text-ink">
                      {app.patient_name}
                    </span>
                    <span
                      className={`text-[10px] uppercase font-semibold px-2 py-0.5 rounded-full border ${getStatusBadge(
                        app.status
                      )}`}
                    >
                      {app.status}
                    </span>
                  </div>
                  <div className="text-xs text-accent font-medium mt-0.5">
                    {app.treatment_name || 'General Consultation'}
                  </div>
                </div>

                <div className="flex items-center space-x-2">
                  <span className="text-xs text-ink-muted hidden sm:inline">
                    Status:
                  </span>
                  <select
                    value={app.status}
                    onChange={(e) =>
                      handleStatusChange(
                        app.id,
                        e.target.value as AppointmentStatus
                      )
                    }
                    className="px-2.5 py-1 text-xs font-semibold rounded-lg bg-canvas border border-border text-ink focus:outline-none"
                  >
                    <option value="new">New</option>
                    <option value="confirmed">Confirmed</option>
                    <option value="completed">Completed</option>
                    <option value="cancelled">Cancelled</option>
                  </select>
                </div>
              </div>

              {/* Schedule, Contact & Quick-action Buttons */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-xs">
                {/* Date & Time */}
                <div className="space-y-1">
                  <div className="text-[10px] uppercase tracking-wider font-semibold text-ink-muted">
                    Requested Slot
                  </div>
                  <div className="flex items-center space-x-1.5 font-medium text-ink">
                    <Calendar className="w-3.5 h-3.5 text-accent" />
                    <span>{app.preferred_date}</span>
                  </div>
                  <div className="flex items-center space-x-1.5 text-ink-muted">
                    <Clock className="w-3.5 h-3.5" />
                    <span>{app.preferred_time}</span>
                  </div>
                </div>

                {/* Patient Notes */}
                <div className="space-y-1 md:col-span-2">
                  <div className="text-[10px] uppercase tracking-wider font-semibold text-ink-muted">
                    Patient Symptoms / Notes
                  </div>
                  <p className="text-xs text-ink bg-canvas p-2 rounded-lg border border-border/60">
                    {app.patient_notes || 'No symptoms noted by patient.'}
                  </p>
                </div>
              </div>

              {/* Internal Clinic Notes */}
              <div className="pt-2 border-t border-border/60">
                <div className="flex items-center justify-between text-xs mb-1">
                  <span className="text-[10px] uppercase tracking-wider font-semibold text-ink-muted">
                    Internal Clinic Notes (Private)
                  </span>
                  {editingNotesId !== app.id && (
                    <button
                      onClick={() => {
                        setEditingNotesId(app.id);
                        setTempNotes(app.internal_notes || '');
                      }}
                      className="inline-flex items-center space-x-1 text-[11px] text-accent hover:underline"
                    >
                      <Edit3 className="w-3 h-3" />
                      <span>{app.internal_notes ? 'Edit note' : 'Add note'}</span>
                    </button>
                  )}
                </div>

                {editingNotesId === app.id ? (
                  <div className="flex items-center space-x-2 mt-1">
                    <input
                      type="text"
                      value={tempNotes}
                      onChange={(e) => setTempNotes(e.target.value)}
                      placeholder="e.g. Confirmed slot with Dr. Senthil for 10:30 AM"
                      className="flex-1 px-3 py-1.5 bg-canvas border border-border rounded-lg text-xs text-ink focus:outline-none focus:ring-1 focus:ring-accent"
                    />
                    <button
                      onClick={() => saveNotes(app.id)}
                      className="p-1.5 rounded-lg bg-accent text-white"
                      title="Save note"
                    >
                      <Check className="w-3.5 h-3.5" />
                    </button>
                    <button
                      onClick={() => setEditingNotesId(null)}
                      className="p-1.5 rounded-lg bg-canvas text-ink-muted border border-border"
                      title="Cancel"
                    >
                      <XCircle className="w-3.5 h-3.5" />
                    </button>
                  </div>
                ) : (
                  app.internal_notes && (
                    <p className="text-xs text-amber-900 bg-amber-50/70 p-2 rounded-lg border border-amber-200">
                      {app.internal_notes}
                    </p>
                  )
                )}
              </div>

              {/* Bottom Actions: Call, WhatsApp, Delete */}
              <div className="pt-3 border-t border-border/60 flex flex-wrap items-center justify-between gap-3">
                <div className="flex items-center space-x-2">
                  <a
                    href={`tel:${cleanPhoneForTel(app.phone)}`}
                    className="inline-flex items-center space-x-1.5 px-3 py-1.5 rounded-xl bg-canvas hover:bg-surface border border-border text-xs font-semibold text-ink transition-colors"
                  >
                    <Phone className="w-3.5 h-3.5 text-accent" />
                    <span>Call ({app.phone})</span>
                  </a>

                  <a
                    href={`https://wa.me/${cleanPhoneForTel(
                      app.phone
                    )}?text=Hello%20${encodeURIComponent(
                      app.patient_name
                    )},%20this%20is%20from%20Vriksham%20Dental%20Care%20regarding%20your%20appointment%20request%20for%20${encodeURIComponent(
                      app.preferred_date
                    )}.`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center space-x-1.5 px-3 py-1.5 rounded-xl bg-emerald-50 hover:bg-emerald-100 border border-emerald-200 text-xs font-semibold text-emerald-800 transition-colors"
                  >
                    <MessageCircle className="w-3.5 h-3.5 text-emerald-600" />
                    <span>Reply on WhatsApp</span>
                  </a>
                </div>

                <div className="flex items-center space-x-3">
                  <span className="text-[10px] text-ink-muted">
                    Received: {new Date(app.created_at).toLocaleDateString()}
                  </span>
                  <button
                    onClick={() => handleDelete(app.id)}
                    className="p-1.5 rounded-lg text-ink-muted hover:text-red-600 hover:bg-red-50 transition-colors"
                    title="Delete record"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
