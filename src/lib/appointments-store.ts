import fs from 'fs';
import path from 'path';
import { Appointment } from '@/types/clinic';
import { fallbackAppointments } from './supabase/mock-data';

const CACHE_FILE = path.join(process.cwd(), '.appointments-cache.json');

function ensureCache(): Appointment[] {
  try {
    if (!fs.existsSync(CACHE_FILE)) {
      fs.writeFileSync(CACHE_FILE, JSON.stringify(fallbackAppointments, null, 2), 'utf-8');
      return fallbackAppointments;
    }
    const data = fs.readFileSync(CACHE_FILE, 'utf-8');
    return JSON.parse(data) as Appointment[];
  } catch {
    return fallbackAppointments;
  }
}

export function getLocalAppointments(): Appointment[] {
  return ensureCache();
}

export function addLocalAppointment(appointment: Appointment): void {
  const current = ensureCache();
  current.unshift(appointment);
  try {
    fs.writeFileSync(CACHE_FILE, JSON.stringify(current, null, 2), 'utf-8');
  } catch (err) {
    console.error('Failed to write appointments cache:', err);
  }
}

export function updateLocalAppointmentStatus(id: string, status: Appointment['status']): void {
  const current = ensureCache();
  const target = current.find((a) => a.id === id);
  if (target) {
    target.status = status;
    target.updated_at = new Date().toISOString();
    try {
      fs.writeFileSync(CACHE_FILE, JSON.stringify(current, null, 2), 'utf-8');
    } catch (err) {
      console.error('Failed to update appointments cache:', err);
    }
  }
}

export function updateLocalAppointmentNotes(id: string, notes: string): void {
  const current = ensureCache();
  const target = current.find((a) => a.id === id);
  if (target) {
    target.internal_notes = notes;
    target.updated_at = new Date().toISOString();
    try {
      fs.writeFileSync(CACHE_FILE, JSON.stringify(current, null, 2), 'utf-8');
    } catch (err) {
      console.error('Failed to update appointments cache notes:', err);
    }
  }
}

export function deleteLocalAppointment(id: string): void {
  const current = ensureCache();
  const filtered = current.filter((a) => a.id !== id);
  try {
    fs.writeFileSync(CACHE_FILE, JSON.stringify(filtered, null, 2), 'utf-8');
  } catch (err) {
    console.error('Failed to delete appointment from cache:', err);
  }
}
