'use client';

import { useState, useRef, useCallback } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { profile, mediaUrl } from '@/lib/api';

interface ProfileEditClientProps {
  userData: Record<string, unknown> | null;
}

interface FormDataState {
  full_name: string;
  age: string;
  gender: string;
  phone_number: string;
  address: string;
  bio: string;
  social_link: string;
}

export default function ProfileEditClient({ userData }: ProfileEditClientProps) {
  const router = useRouter();
  const fileInputRef = useRef<HTMLInputElement>(null);

  const user = (userData?.user as Record<string, unknown>) || {};

  const [form, setForm] = useState<FormDataState>({
    full_name: (userData?.full_name as string) || '',
    age: (userData?.age as string) || '',
    gender: (userData?.gender as string) || 'female',
    phone_number: (userData?.phone_number as string) || '',
    address: (userData?.address as string) || '',
    bio: (userData?.bio as string) || '',
    social_link: (userData?.social_link as string) || '',
  });

  const [avatarPreview, setAvatarPreview] = useState<string | null>(
    userData?.profile_picture ? mediaUrl(userData.profile_picture as string) : null
  );
  const [avatarFile, setAvatarFile] = useState<File | null>(null);
  const [saving, setSaving] = useState(false);
  const [toastMsg, setToastMsg] = useState('');
  const [toastVisible, setToastVisible] = useState(false);
  const toastTimer = useRef<ReturnType<typeof setTimeout>>();

  const showToast = useCallback((msg: string) => {
    clearTimeout(toastTimer.current);
    setToastMsg(msg);
    setToastVisible(true);
    toastTimer.current = setTimeout(() => setToastVisible(false), 3000);
  }, []);

  const updateField = useCallback((field: keyof FormDataState, value: string) => {
    setForm((prev) => ({ ...prev, [field]: value }));
  }, []);

  const handleAvatarChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    if (file.size > 1024 * 1024) {
      showToast('Image exceeds 1MB limit. Please choose a smaller file.');
      return;
    }
    setAvatarFile(file);
    const reader = new FileReader();
    reader.onload = (ev) => {
      setAvatarPreview(ev.target?.result as string);
    };
    reader.readAsDataURL(file);
  }, [showToast]);

  const handleRemoveAvatar = useCallback(() => {
    if (confirm('Remove your profile photo?')) {
      setAvatarPreview(null);
      setAvatarFile(null);
      if (fileInputRef.current) fileInputRef.current.value = '';
      showToast('Profile photo removed');
    }
  }, [showToast]);

  const handleSubmit = useCallback(async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    try {
      const formData = new FormData();
      formData.append('full_name', form.full_name);
      if (form.age) formData.append('age', form.age);
      formData.append('gender', form.gender);
      formData.append('phone_number', form.phone_number);
      formData.append('address', form.address);
      formData.append('bio', form.bio);
      formData.append('social_link', form.social_link);
      if (avatarFile) {
        formData.append('profile_picture', avatarFile);
      }

      const res = await profile.update(formData);
      if (res.ok) {
        showToast('Profile updated successfully');
        setTimeout(() => router.push(`/profile/${user.username || ''}`), 1200);
      } else {
        showToast('Failed to update profile');
        setSaving(false);
      }
    } catch {
      showToast('An error occurred while saving');
      setSaving(false);
    }
  }, [form, avatarFile, router, showToast, user.username]);

  const charCount = form.bio.length;
  const charColor = charCount > 280 ? 'text-status-warning' : 'text-secondary';

  return (
    <main className="min-h-screen bg-canvas">
      <div className="max-w-7xl mx-auto w-full px-4 sm:px-6 lg:px-[1.5rem] py-8">
        <section className="flex flex-col md:flex-row md:items-end justify-between gap-4 mb-8">
          <div className="space-y-2">
            <nav aria-label="Breadcrumbs" className="flex items-center gap-2 font-mono text-[11px] uppercase tracking-widest text-text-muted">
              <Link className="hover:text-primary transition-colors" href="/">Home</Link>
              <span className="material-symbols-outlined text-[13px] text-border-hover">chevron_right</span>
              <Link className="hover:text-primary transition-colors" href={`/profile/${user.username || ''}`}>Profile</Link>
              <span className="material-symbols-outlined text-[13px] text-border-hover">chevron_right</span>
              <span className="text-secondary">Edit Profile</span>
            </nav>
            <h1 className="font-display text-headline-1 text-text-primary tracking-tight">Edit Profile</h1>
            <p className="font-body text-body-small text-text-secondary">
              Manage your personal details, reading persona, and guild sanctum presentation.
            </p>
          </div>
          <div className="hidden md:flex items-center gap-3 shrink-0">
            <Link href={`/profile/${user.username || ''}`} className="px-4 py-2 rounded-lg bg-surface-container hover:bg-surface-hover text-text-secondary hover:text-text-primary font-body text-sm font-medium transition-all shadow-sm">
              Cancel
            </Link>
            <button
              className="px-6 py-2 rounded-lg bg-primary-container hover:bg-primary-hover text-text-on-accent font-body text-sm font-semibold inline-flex items-center gap-2 shadow-md transition-all disabled:opacity-70"
              onClick={handleSubmit}
              disabled={saving}
            >
              <span className="material-symbols-outlined text-[18px]">{saving ? 'progress_activity' : 'check'}</span>
              <span>{saving ? 'Saving...' : 'Save Changes'}</span>
            </button>
          </div>
        </section>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          <aside className="lg:col-span-4 space-y-6">
            <div className="bg-surface-container rounded-xl p-6 shadow-md flex flex-col items-center text-center relative overflow-hidden">
              <div className="absolute -top-12 -left-12 w-48 h-48 bg-primary/10 rounded-full blur-3xl pointer-events-none" />
              <div className="absolute -bottom-10 -right-10 w-44 h-44 bg-secondary/10 rounded-full blur-2xl pointer-events-none" />

              <div className="relative group mt-2 mb-4">
                <div className="p-1 rounded-full bg-gradient-to-tr from-secondary via-primary to-surface-bright shadow-lg transition-transform duration-300 group-hover:scale-105">
                  <div
                    className="relative w-44 h-44 rounded-full overflow-hidden bg-surface-container-lowest cursor-pointer shadow-inner"
                    onClick={() => fileInputRef.current?.click()}
                  >
                    {avatarPreview ? (
                      <img alt="Profile" className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110" src={avatarPreview} />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center">
                        <span className="material-symbols-outlined text-[64px] text-text-muted">person</span>
                      </div>
                    )}
                    <div className="absolute inset-0 bg-canvas/80 backdrop-blur-[2px] opacity-0 group-hover:opacity-100 flex flex-col items-center justify-center gap-1.5 transition-all duration-300 transform translate-y-2 group-hover:translate-y-0 text-text-primary">
                      <span className="material-symbols-outlined text-primary text-[28px]">photo_camera</span>
                      <span className="font-mono text-[11px] uppercase tracking-wider text-text-primary">Change Photo</span>
                    </div>
                  </div>
                </div>
              </div>

              <input ref={fileInputRef} accept="image/png, image/jpeg, image/webp" className="hidden" type="file" onChange={handleAvatarChange} />

              <button
                className="absolute bottom-1 right-2 w-9 h-9 rounded-full bg-primary-container text-text-on-accent flex items-center justify-center shadow-md hover:bg-primary-hover transition-transform hover:scale-110"
                onClick={() => fileInputRef.current?.click()}
                title="Upload new photo"
                type="button"
              >
                <span className="material-symbols-outlined text-[18px]">edit</span>
              </button>

              <h2 className="font-display text-headline-3 text-text-primary">{form.full_name || 'Your Name'}</h2>
              <p className="font-mono text-[11px] text-secondary uppercase tracking-wider mt-0.5">Archivist</p>

              <p className="font-body text-xs text-text-muted mt-3 max-w-xs leading-relaxed">
                JPG, PNG or WEBP. Max 1MB.
              </p>

              <div className="flex flex-wrap items-center justify-center gap-2 mt-4">
                <span className="inline-flex items-center gap-1 px-3 py-1 rounded-full bg-surface-container-high text-secondary font-mono text-[11px] uppercase tracking-wide">
                  <span className="material-symbols-outlined text-[13px] text-secondary">verified</span>
                  Verified Scholar
                </span>
              </div>

              <div className="mt-4 pt-3 w-full flex items-center justify-center">
                <button className="text-xs font-body text-status-error hover:text-error transition-colors inline-flex items-center gap-1" onClick={handleRemoveAvatar} type="button">
                  <span className="material-symbols-outlined text-[15px]">delete</span>
                  Remove photo
                </button>
              </div>
            </div>

            <div className="bg-surface-container rounded-xl p-6 shadow-sm space-y-4">
              <div className="flex items-center justify-between">
                <h3 className="font-mono text-[11px] uppercase text-text-muted tracking-wider">Sanctum Ledger</h3>
                <span className="w-2 h-2 rounded-full bg-status-success shadow-[0_0_8px_currentColor]" />
              </div>
              <div className="space-y-2 font-mono text-xs text-text-secondary">
                <div className="flex items-center justify-between py-1 bg-surface-container-low px-3 rounded-lg">
                  <span className="text-text-muted text-xs">Folios Read</span>
                  <span className="text-text-primary font-semibold">{(userData?.folios_read as number) || 0} Works</span>
                </div>
                <div className="flex items-center justify-between py-1 bg-surface-container-low px-3 rounded-lg">
                  <span className="text-text-muted text-xs">Guild Tokens</span>
                  <span className="text-secondary font-semibold">{(userData?.token as number) || 0} GN</span>
                </div>
              </div>
            </div>
          </aside>

          <main className="lg:col-span-8">
            <div className="bg-surface-container rounded-xl p-6 sm:p-8 lg:p-10 shadow-md">
              <form className="space-y-6" onSubmit={handleSubmit}>
                <div className="space-y-4">
                  <div className="pb-2">
                    <h2 className="font-display text-headline-2 text-text-primary">Archivist Identity</h2>
                    <p className="font-body text-sm text-text-secondary">Personal records bound to the Sovereign Archive registry.</p>
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-12 gap-4">
                    <div className="md:col-span-8 space-y-1.5">
                      <label className="block font-body text-sm font-medium text-text-secondary" htmlFor="fullName">
                        Full Name <span className="text-primary">*</span>
                      </label>
                      <div className="relative flex items-center">
                        <span className="material-symbols-outlined text-text-muted text-[18px] absolute left-3.5 pointer-events-none">person</span>
                        <input
                          className="w-full bg-canvas rounded-lg pl-10 pr-3.5 py-2.5 font-body text-sm text-text-primary placeholder:text-text-muted focus:outline-none focus:ring-2 focus:ring-primary-container transition-all border-0"
                          id="fullName"
                          required
                          type="text"
                          value={form.full_name}
                          onChange={(e) => updateField('full_name', e.target.value)}
                        />
                      </div>
                      <p className="font-body text-xs text-text-muted">Visible on published annotations and folio marginalia.</p>
                    </div>
                    <div className="md:col-span-4 space-y-1.5">
                      <label className="block font-body text-sm font-medium text-text-secondary" htmlFor="age">Age</label>
                      <div className="relative flex items-center">
                        <span className="material-symbols-outlined text-text-muted text-[18px] absolute left-3.5 pointer-events-none">hourglass_empty</span>
                        <input
                          className="w-full bg-canvas rounded-lg pl-10 pr-3.5 py-2.5 font-mono text-xs text-text-primary placeholder:text-text-muted focus:outline-none focus:ring-2 focus:ring-primary-container transition-all border-0"
                          id="age"
                          max="130"
                          min="12"
                          type="number"
                          value={form.age}
                          onChange={(e) => updateField('age', e.target.value)}
                        />
                      </div>
                      <p className="font-body text-xs text-text-muted">Years on terrestrial timeline.</p>
                    </div>
                  </div>

                  <div className="space-y-2 pt-1">
                    <label className="block font-body text-sm font-medium text-text-secondary">Gender Designation</label>
                    <div aria-label="Gender selection" className="grid grid-cols-2 sm:grid-cols-4 gap-2.5" role="radiogroup">
                      {[
                        { value: 'female', label: 'Female', icon: 'female' },
                        { value: 'male', label: 'Male', icon: 'male' },
                        { value: 'non-binary', label: 'Non-binary', icon: 'transgender' },
                        { value: 'unspecified', label: 'Undisclosed', icon: 'visibility_off' },
                      ].map((opt) => {
                        const selected = form.gender === opt.value;
                        return (
                          <label
                            key={opt.value}
                            className={`cursor-pointer relative flex flex-col items-center justify-center p-3 rounded-lg transition-all group ${
                              selected ? 'bg-surface-container-high' : 'bg-canvas hover:bg-surface-hover'
                            }`}
                          >
                            <input
                              className="sr-only"
                              name="gender"
                              type="radio"
                              value={opt.value}
                              checked={selected}
                              onChange={(e) => updateField('gender', e.target.value)}
                            />
                            <span className={`material-symbols-outlined text-[20px] mb-1 ${selected ? 'text-primary' : 'text-text-muted group-hover:text-text-primary'}`}>{opt.icon}</span>
                            <span className={`font-body text-sm font-medium ${selected ? 'text-text-primary' : 'text-text-secondary group-hover:text-text-primary'}`}>{opt.label}</span>
                          </label>
                        );
                      })}
                    </div>
                  </div>
                </div>

                <div className="h-0.5 w-full bg-surface-container-high rounded-full" />

                <div className="space-y-4">
                  <div>
                    <h2 className="font-display text-headline-2 text-text-primary">Sanctum Transmission</h2>
                    <p className="font-body text-sm text-text-secondary">Direct pathways for scrolls, dispatches, and inter-library loan requests.</p>
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-1.5">
                      <label className="block font-body text-sm font-medium text-text-secondary" htmlFor="phone">Phone</label>
                      <div className="relative flex items-center">
                        <span className="material-symbols-outlined text-text-muted text-[18px] absolute left-3.5 pointer-events-none">phone</span>
                        <input
                          className="w-full bg-canvas rounded-lg pl-10 pr-3.5 py-2.5 font-mono text-xs text-text-primary placeholder:text-text-muted focus:outline-none focus:ring-2 focus:ring-primary-container transition-all border-0"
                          id="phone"
                          type="tel"
                          value={form.phone_number}
                          onChange={(e) => updateField('phone_number', e.target.value)}
                        />
                      </div>
                      <p className="font-body text-xs text-text-muted">SMS emergency recalls for illuminated folios.</p>
                    </div>
                    <div className="space-y-1.5">
                      <label className="block font-body text-sm font-medium text-text-secondary" htmlFor="website">Social Link</label>
                      <div className="relative flex items-center">
                        <span className="material-symbols-outlined text-text-muted text-[18px] absolute left-3.5 pointer-events-none">link</span>
                        <input
                          className="w-full bg-canvas rounded-lg pl-10 pr-3.5 py-2.5 font-mono text-xs text-text-primary placeholder:text-text-muted focus:outline-none focus:ring-2 focus:ring-primary-container transition-all border-0"
                          id="website"
                          type="url"
                          value={form.social_link}
                          onChange={(e) => updateField('social_link', e.target.value)}
                        />
                      </div>
                      <p className="font-body text-xs text-text-muted">External catalog or federated scholarly profile.</p>
                    </div>
                  </div>
                  <div className="space-y-1.5">
                    <label className="block font-body text-sm font-medium text-text-secondary" htmlFor="physicalAddress">Address</label>
                    <div className="relative">
                      <span className="material-symbols-outlined text-text-muted text-[18px] absolute left-3.5 top-3.5 pointer-events-none">pin_drop</span>
                      <textarea
                        className="w-full bg-canvas rounded-lg pl-10 pr-3.5 py-2.5 font-body text-sm text-text-primary placeholder:text-text-muted focus:outline-none focus:ring-2 focus:ring-primary-container transition-all resize-none border-0"
                        id="physicalAddress"
                        rows={2}
                        value={form.address}
                        onChange={(e) => updateField('address', e.target.value)}
                      />
                    </div>
                    <p className="font-body text-xs text-text-muted">Used for courier dispatches of rare printed materials.</p>
                  </div>
                </div>

                <div className="h-0.5 w-full bg-surface-container-high rounded-full" />

                <div className="space-y-4">
                  <div>
                    <h2 className="font-display text-headline-2 text-text-primary">Reader Philosophy</h2>
                    <p className="font-body text-sm text-text-secondary">Articulate your affinity for classical codices, binding methods, or auditory studies.</p>
                  </div>
                  <div className="space-y-1.5">
                    <div className="flex items-center justify-between">
                      <label className="block font-body text-sm font-medium text-text-secondary" htmlFor="readerBio">Personal Ex Libris Statement</label>
                      <span className={`font-mono text-[11px] ${charColor}`}>
                        {charCount} / 300
                      </span>
                    </div>
                    <div className="relative">
                      <textarea
                        className="w-full bg-canvas rounded-lg p-3.5 font-body text-sm text-text-primary placeholder:text-text-muted focus:outline-none focus:ring-2 focus:ring-primary-container transition-all leading-relaxed border-0"
                        id="readerBio"
                        maxLength={300}
                        rows={4}
                        value={form.bio}
                        onChange={(e) => updateField('bio', e.target.value)}
                      />
                    </div>
                    <p className="font-body text-xs text-text-muted">Summarized in catalog indexes and shared reading room directories.</p>
                  </div>
                </div>

                <div className="pt-4 flex flex-col sm:flex-row items-center justify-between gap-4">
                  <div className="flex items-center gap-2 text-text-muted font-mono text-[11px]">
                    <span className="w-2 h-2 rounded-full bg-status-warning/80" />
                    <span>{saving ? 'Saving...' : 'Ready to save'}</span>
                  </div>
                  <div className="flex items-center gap-3 w-full sm:w-auto justify-end">
                    <Link href={`/profile/${user.username || ''}`} className="px-4 py-2.5 rounded-lg bg-surface-container hover:bg-surface-hover text-text-secondary hover:text-text-primary font-body text-sm font-medium transition-all">
                      Cancel
                    </Link>
                    <button
                      className="px-8 py-2.5 rounded-lg bg-primary-container hover:bg-primary-hover text-text-on-accent font-body text-sm font-semibold inline-flex items-center justify-center gap-2 shadow-md hover:shadow-primary/20 transition-all min-w-[160px] disabled:opacity-70"
                      type="submit"
                      disabled={saving}
                    >
                      <span className="material-symbols-outlined text-[18px]">{saving ? 'progress_activity' : 'check'}</span>
                      <span>{saving ? 'Saving...' : 'Save Changes'}</span>
                    </button>
                  </div>
                </div>
              </form>
            </div>
          </main>
        </div>
      </div>

      <div className={`fixed bottom-6 right-6 transform transition-all duration-300 z-50 ${toastVisible ? 'translate-y-0 opacity-100' : 'translate-y-24 opacity-0 pointer-events-none'}`}>
        <div className="bg-surface-container-highest px-4 py-3 rounded-xl shadow-xl flex items-center gap-3">
          <div className="w-8 h-8 rounded-full bg-status-success/20 flex items-center justify-center text-status-success">
            <span className="material-symbols-outlined text-[18px]">verified</span>
          </div>
          <div>
            <p className="font-body text-sm font-semibold text-text-primary">Profile Updated</p>
            <p className="font-mono text-[10px] text-text-muted">{toastMsg}</p>
          </div>
          <button className="ml-2 text-text-muted hover:text-text-primary" onClick={() => setToastVisible(false)} type="button">
            <span className="material-symbols-outlined text-[16px]">close</span>
          </button>
        </div>
      </div>
    </main>
  );
}
