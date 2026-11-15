'use client';

import React, { useState } from 'react';
import Image from 'next/image';
import { Doctor } from '@/types/clinic';
import { createDoctor, updateDoctor, deleteDoctor } from '@/lib/actions/doctors';
import { formatINR } from '@/lib/utils/formatters';
import { Plus, Edit2, Trash2, Eye, EyeOff, ShieldCheck, CheckCircle2 } from 'lucide-react';

interface DoctorsManagerProps {
  initialDoctors: Doctor[];
}

export function DoctorsManager({ initialDoctors }: DoctorsManagerProps) {
  const [doctors, setDoctors] = useState<Doctor[]>(initialDoctors);
  const [editingDoctor, setEditingDoctor] = useState<Doctor | null>(null);
  const [isCreating, setIsCreating] = useState(false);
  const [feedback, setFeedback] = useState<string | null>(null);

  const [formData, setFormData] = useState<Partial<Doctor>>({
    name: '',
    name_ta: '',
    qualifications: '',
    registration_number: '',
    designation: 'Consultant Dental Surgeon',
    designation_ta: 'பல் மருத்துவர்',
    experience_years: 5,
    languages_spoken: ['Tamil', 'English'],
    bio: '',
    photo_url: '',
    consultation_fee: 200,
    availability_days: 'Mon - Sat',
    is_active: true,
  });

  const handleEditClick = (doc: Doctor) => {
    setEditingDoctor(doc);
    setFormData(doc);
    setIsCreating(false);
  };

  const handleCreateClick = () => {
    setIsCreating(true);
    setEditingDoctor(null);
    setFormData({
      name: 'Dr. ',
      name_ta: 'டாக்டர் ',
      qualifications: 'BDS',
      registration_number: 'TN-DENT-',
      designation: 'Consultant Dental Surgeon',
      experience_years: 5,
      languages_spoken: ['Tamil', 'English'],
      bio: '',
      photo_url:
        'https://images.unsplash.com/photo-1622253692010-333f2da6031d?q=80&w=800&auto=format&fit=crop',
      consultation_fee: 200,
      availability_days: 'Mon - Sat (9:30 AM - 1:30 PM)',
      is_active: true,
      display_order: doctors.length + 1,
    });
  };

  const handleToggleActive = async (id: string, current: boolean) => {
    setDoctors((prev) =>
      prev.map((d) => (d.id === id ? { ...d, is_active: !current } : d))
    );
    await updateDoctor(id, { is_active: !current });
    setFeedback(`Doctor profile ${!current ? 'activated' : 'hidden'}.`);
  };

  const handleDelete = async (id: string) => {
    if (confirm('Are you sure you want to delete this doctor profile?')) {
      setDoctors((prev) => prev.filter((d) => d.id !== id));
      await deleteDoctor(id);
      setFeedback('Doctor profile removed.');
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (isCreating) {
      const newDoc = {
        ...formData,
      } as Doctor;
      await createDoctor(newDoc);
      setDoctors((prev) => [...prev, newDoc]);
      setFeedback('New doctor profile added.');
      setIsCreating(false);
    } else if (editingDoctor) {
      await updateDoctor(editingDoctor.id, formData);
      setDoctors((prev) =>
        prev.map((d) =>
          d.id === editingDoctor.id ? ({ ...d, ...formData } as Doctor) : d
        )
      );
      setFeedback('Doctor profile updated.');
      setEditingDoctor(null);
    }
  };

  return (
    <div className="space-y-6">
      {feedback && (
        <div className="p-4 rounded-2xl bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs flex items-center space-x-2">
          <CheckCircle2 className="w-4 h-4 text-emerald-600 flex-shrink-0" />
          <span>{feedback}</span>
        </div>
      )}

      <div className="flex justify-between items-center">
        <div className="text-xs text-ink-muted">
          Showing {doctors.length} clinician profiles
        </div>
        {!isCreating && !editingDoctor && (
          <button
            onClick={handleCreateClick}
            className="inline-flex items-center space-x-1.5 bg-ink hover:bg-black text-white px-4 py-2 rounded-pill text-xs font-semibold shadow-soft transition-all"
          >
            <Plus className="w-3.5 h-3.5" />
            <span>Add Doctor Profile</span>
          </button>
        )}
      </div>

      {(isCreating || editingDoctor) && (
        <form
          onSubmit={handleSubmit}
          className="bg-surface rounded-3xl p-6 sm:p-8 border border-border shadow-card space-y-4 animate-in fade-in"
        >
          <div className="flex justify-between items-center pb-3 border-b border-border">
            <h3 className="font-editorial text-lg font-bold text-ink">
              {isCreating ? 'Add New Doctor Profile' : `Edit: ${editingDoctor?.name}`}
            </h3>
            <button
              type="button"
              onClick={() => {
                setIsCreating(false);
                setEditingDoctor(null);
              }}
              className="text-xs text-ink-muted hover:text-ink"
            >
              Cancel
            </button>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="space-y-1">
              <label className="text-[11px] uppercase font-bold text-ink">
                Full Name (English) *
              </label>
              <input
                type="text"
                required
                value={formData.name || ''}
                onChange={(e) =>
                  setFormData((prev) => ({ ...prev, name: e.target.value }))
                }
                placeholder="Dr. K. Senthil Kumar"
                className="w-full px-3 py-2 bg-canvas border border-border rounded-xl text-xs sm:text-sm text-ink focus:outline-none"
              />
            </div>

            <div className="space-y-1">
              <label className="text-[11px] uppercase font-bold text-ink">
                Qualifications & Degrees *
              </label>
              <input
                type="text"
                required
                value={formData.qualifications || ''}
                onChange={(e) =>
                  setFormData((prev) => ({
                    ...prev,
                    qualifications: e.target.value,
                  }))
                }
                placeholder="BDS, MDS (Endodontics)"
                className="w-full px-3 py-2 bg-canvas border border-border rounded-xl text-xs sm:text-sm text-ink focus:outline-none"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div className="space-y-1">
              <label className="text-[11px] uppercase font-bold text-ink">
                Council Registration Number *
              </label>
              <input
                type="text"
                required
                value={formData.registration_number || ''}
                onChange={(e) =>
                  setFormData((prev) => ({
                    ...prev,
                    registration_number: e.target.value,
                  }))
                }
                placeholder="TN-DENT-14892"
                className="w-full px-3 py-2 bg-canvas border border-border rounded-xl text-xs sm:text-sm text-ink focus:outline-none font-mono"
              />
            </div>

            <div className="space-y-1">
              <label className="text-[11px] uppercase font-bold text-ink">
                Clinical Experience (Years)
              </label>
              <input
                type="number"
                value={formData.experience_years || ''}
                onChange={(e) =>
                  setFormData((prev) => ({
                    ...prev,
                    experience_years: Number(e.target.value),
                  }))
                }
                placeholder="14"
                className="w-full px-3 py-2 bg-canvas border border-border rounded-xl text-xs sm:text-sm text-ink focus:outline-none"
              />
            </div>

            <div className="space-y-1">
              <label className="text-[11px] uppercase font-bold text-ink">
                Consultation Fee (₹ INR)
              </label>
              <input
                type="number"
                value={formData.consultation_fee || ''}
                onChange={(e) =>
                  setFormData((prev) => ({
                    ...prev,
                    consultation_fee: Number(e.target.value),
                  }))
                }
                placeholder="200"
                className="w-full px-3 py-2 bg-canvas border border-border rounded-xl text-xs sm:text-sm text-ink focus:outline-none"
              />
            </div>
          </div>

          <div className="space-y-1">
            <label className="text-[11px] uppercase font-bold text-ink">
              Clinical Bio & Focus *
            </label>
            <textarea
              required
              rows={3}
              value={formData.bio || ''}
              onChange={(e) =>
                setFormData((prev) => ({ ...prev, bio: e.target.value }))
              }
              placeholder="Factual clinical background, specialized focus, university details..."
              className="w-full px-3 py-2 bg-canvas border border-border rounded-xl text-xs sm:text-sm text-ink focus:outline-none"
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="space-y-1">
              <label className="text-[11px] uppercase font-bold text-ink">
                Consultation Timings / Days
              </label>
              <input
                type="text"
                value={formData.availability_days || ''}
                onChange={(e) =>
                  setFormData((prev) => ({
                    ...prev,
                    availability_days: e.target.value,
                  }))
                }
                placeholder="Mon - Sat (9:30 AM - 1:30 PM & 4:30 PM - 8:30 PM)"
                className="w-full px-3 py-2 bg-canvas border border-border rounded-xl text-xs sm:text-sm text-ink focus:outline-none"
              />
            </div>

            <div className="space-y-1">
              <label className="text-[11px] uppercase font-bold text-ink">
                Portrait Photo URL
              </label>
              <input
                type="text"
                value={formData.photo_url || ''}
                onChange={(e) =>
                  setFormData((prev) => ({ ...prev, photo_url: e.target.value }))
                }
                placeholder="https://..."
                className="w-full px-3 py-2 bg-canvas border border-border rounded-xl text-xs sm:text-sm text-ink focus:outline-none"
              />
            </div>
          </div>

          <div className="pt-3 flex justify-end space-x-2">
            <button
              type="button"
              onClick={() => {
                setIsCreating(false);
                setEditingDoctor(null);
              }}
              className="px-4 py-2 rounded-pill bg-canvas text-xs font-semibold text-ink-muted border border-border"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-6 py-2 rounded-pill bg-accent hover:bg-accent-hover text-white text-xs font-semibold shadow-soft"
            >
              {isCreating ? 'Save Doctor' : 'Update Profile'}
            </button>
          </div>
        </form>
      )}

      {/* Doctors List */}
      <div className="bg-surface rounded-2xl border border-border overflow-hidden shadow-soft">
        <div className="divide-y divide-border">
          {doctors.map((doc) => (
            <div
              key={doc.id}
              className={`p-4 sm:p-5 flex flex-col sm:flex-row sm:items-center justify-between gap-4 transition-colors ${
                !doc.is_active ? 'opacity-50 bg-canvas/40' : 'hover:bg-canvas/30'
              }`}
            >
              <div className="flex items-center space-x-4">
                <div className="relative w-12 h-12 rounded-xl overflow-hidden border border-border bg-[#ecece8] flex-shrink-0">
                  {doc.photo_url ? (
                    <Image
                      src={doc.photo_url}
                      alt={doc.name}
                      fill
                      className="object-cover"
                    />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center text-[10px] text-ink-muted">
                      Photo
                    </div>
                  )}
                </div>
                <div>
                  <div className="text-sm font-bold text-ink">{doc.name}</div>
                  <div className="text-xs text-accent font-medium">
                    {doc.qualifications}
                  </div>
                  <div className="flex items-center space-x-3 text-[11px] text-ink-muted mt-1">
                    <span>Reg: {doc.registration_number}</span>
                    <span>•</span>
                    <span>{doc.experience_years} yrs exp</span>
                    {doc.consultation_fee && (
                      <>
                        <span>•</span>
                        <span>Fee: {formatINR(doc.consultation_fee)}</span>
                      </>
                    )}
                  </div>
                </div>
              </div>

              <div className="flex items-center space-x-2 self-end sm:self-center">
                <button
                  onClick={() => handleToggleActive(doc.id, doc.is_active)}
                  className="p-2 rounded-lg bg-canvas text-ink-muted hover:text-ink border border-border"
                  title={doc.is_active ? 'Hide profile' : 'Show profile'}
                >
                  {doc.is_active ? (
                    <Eye className="w-3.5 h-3.5 text-accent" />
                  ) : (
                    <EyeOff className="w-3.5 h-3.5 text-ink-muted" />
                  )}
                </button>
                <button
                  onClick={() => handleEditClick(doc)}
                  className="p-2 rounded-lg bg-canvas text-ink-muted hover:text-ink border border-border"
                  title="Edit"
                >
                  <Edit2 className="w-3.5 h-3.5" />
                </button>
                <button
                  onClick={() => handleDelete(doc.id)}
                  className="p-2 rounded-lg bg-canvas text-ink-muted hover:text-red-600 border border-border"
                  title="Delete"
                >
                  <Trash2 className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
