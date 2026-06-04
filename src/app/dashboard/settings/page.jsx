"use client";

import { useState } from "react";
import Header from "@/components/Header";
import { Button } from "@/components/ui";
import { useSettings } from "@/contexts/SettingsContext";
import { useNotifications } from "@/contexts/NotificationContext";
import { useUser } from "@/context/UserContext";
import Modal from "@/components/Modal";

function Toggle({ checked, onChange }) {
  return (
    <button
      type="button"
      onClick={() => onChange(!checked)}
      className={`relative inline-flex w-11 h-6 rounded-full transition-colors duration-200 focus:outline-none ${
        checked ? "bg-cyan-600" : "bg-gray-400 dark:bg-gray-600"
      }`}
    >
      <span
        className={`inline-block w-5 h-5 bg-white rounded-full shadow transform transition-transform duration-200 mt-0.5 ${
          checked ? "translate-x-5" : "translate-x-0.5"
        }`}
      />
    </button>
  );
}

function ToggleRow({ label, description, checked, onChange }) {
  return (
    <div className="flex items-center justify-between py-3 border-b border-gray-200 dark:border-white/10 last:border-0">
      <div>
        <p className="text-sm font-medium text-gray-800 dark:text-gray-100">{label}</p>
        {description && <p className="text-xs text-gray-500 dark:text-gray-400 mt-0.5">{description}</p>}
      </div>
      <Toggle checked={checked} onChange={onChange} />
    </div>
  );
}

function SectionCard({ title, icon, children }) {
  return (
    <div className="mb-6 bg-white dark:bg-white/5 rounded-xl shadow-sm dark:shadow-none border border-gray-100 dark:border-white/10 overflow-hidden">
      <div className="flex items-center gap-2 px-5 py-3 border-b border-gray-100 dark:border-white/10 bg-gray-50 dark:bg-white/5">
        <span className="text-cyan-600 dark:text-cyan-400">{icon}</span>
        <h2 className="text-base font-semibold text-gray-800 dark:text-white">{title}</h2>
      </div>
      <div className="px-5 py-4">{children}</div>
    </div>
  );
}

const CARD_STYLES = [
  { id: "default",  label: "Ocean",    body: "bg-cyan-600",    header: "bg-cyan-700" },
  { id: "slate",    label: "Slate",    body: "bg-slate-600",   header: "bg-slate-700" },
  { id: "rose",     label: "Rose",     body: "bg-rose-500",    header: "bg-rose-600" },
  { id: "emerald",  label: "Emerald",  body: "bg-emerald-600", header: "bg-emerald-700" },
  { id: "midnight", label: "Midnight", body: "bg-indigo-900",  header: "bg-indigo-950" },
];

export default function Settings() {
  const { settings, updateSettings, resetSettings } = useSettings();
  const { addNotification } = useNotifications();
  const { user } = useUser();
  const [showResetModal, setShowResetModal] = useState(false);

  const confirmReset = () => {
    resetSettings();
    addNotification("Settings reset to default!", "success");
    setShowResetModal(false);
  };

  const selectClass = "text-sm w-full px-3 py-2 border border-gray-200 dark:border-white/20 dark:bg-black/50 dark:text-white rounded-lg focus:ring-2 focus:ring-cyan-600 outline-none bg-white/90 text-gray-800";

  return (
    <div className="bg-gray-50 dark:bg-black min-h-screen">
      <Header />
      <section className="max-w-2xl mx-auto px-4 pt-20 pb-10">

        {/* Profile */}
        <SectionCard title="Profile" icon={
          <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
            <path fillRule="evenodd" d="M10 9a3 3 0 100-6 3 3 0 000 6zm-7 9a7 7 0 1114 0H3z" clipRule="evenodd" />
          </svg>
        }>
          <div className="flex items-center gap-4">
            <div className="w-14 h-14 shrink-0 bg-cyan-600 text-white rounded-full flex items-center justify-center font-bold text-xl">
              {user?.email ? user.email.charAt(0).toUpperCase() : "U"}
            </div>
            <div className="min-w-0">
              <p className="font-medium text-gray-800 dark:text-white break-all">{user?.email || "No email"}</p>
              <p className="text-xs text-gray-500 dark:text-gray-400 mt-0.5">User Account</p>
            </div>
          </div>
        </SectionCard>

        {/* Card Style */}
        <SectionCard title="Card Style" icon={
          <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
            <path d="M4 3a1 1 0 000 2h12a1 1 0 100-2H4zM2 7a1 1 0 011-1h14a1 1 0 110 2H3a1 1 0 01-1-1zM4 11a1 1 0 000 2h12a1 1 0 100-2H4z" />
          </svg>
        }>
          <div className="grid grid-cols-5 gap-2">
            {CARD_STYLES.map(style => (
              <button
                key={style.id}
                onClick={() => updateSettings({ cardStyle: style.id })}
                className={`rounded-xl overflow-hidden border-[3px] transition-all duration-150 ${
                  settings.cardStyle === style.id
                    ? "border-cyan-500 scale-105 shadow-md"
                    : "border-transparent opacity-60 hover:opacity-90"
                }`}
              >
                <div className={`${style.header} px-1 py-1.5`}>
                  <div className="h-1.5 bg-white/40 rounded w-3/4 mx-auto" />
                </div>
                <div className={`${style.body} p-1.5 space-y-1`}>
                  <div className="h-1 bg-white/30 rounded w-full" />
                  <div className="h-1 bg-white/30 rounded w-4/5" />
                  <div className="h-1 bg-white/30 rounded w-3/5" />
                </div>
                <p className={`${style.body} text-white text-[10px] text-center py-0.5 font-medium`}>{style.label}</p>
              </button>
            ))}
          </div>
        </SectionCard>

        {/* Appearance */}
        <SectionCard title="Appearance" icon={
          <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
            <path d="M17.293 13.293A8 8 0 016.707 2.707a8.001 8.001 0 1010.586 10.586z" />
          </svg>
        }>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-medium text-gray-500 dark:text-gray-400 mb-1.5 uppercase tracking-wide">Theme</label>
              <select value={settings.theme} onChange={(e) => updateSettings({ theme: e.target.value })} className={selectClass}>
                <option value="light">Light</option>
                <option value="dark">Dark</option>
              </select>
            </div>
            <div>
              <label className="block text-xs font-medium text-gray-500 dark:text-gray-400 mb-1.5 uppercase tracking-wide">Font Size</label>
              <select value={settings.fontSize} onChange={(e) => updateSettings({ fontSize: e.target.value })} className={selectClass}>
                <option value="small">Small</option>
                <option value="medium">Medium</option>
                <option value="large">Large</option>
              </select>
            </div>
          </div>
        </SectionCard>

        {/* Feed */}
        <SectionCard title="Feed" icon={
          <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
            <path fillRule="evenodd" d="M3 4a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zm0 4a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zm0 4a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1z" clipRule="evenodd" />
          </svg>
        }>
          <div className="mb-4">
            <label className="block text-xs font-medium text-gray-500 dark:text-gray-400 mb-1.5 uppercase tracking-wide">Sort Posts By</label>
            <select value={settings.sortOrder} onChange={(e) => updateSettings({ sortOrder: e.target.value })} className={selectClass}>
              <option value="newest">Newest First</option>
              <option value="oldest">Oldest First</option>
            </select>
          </div>
          <div className="mb-4">
            <label className="block text-xs font-medium text-gray-500 dark:text-gray-400 mb-1.5 uppercase tracking-wide">Preview Lines</label>
            <select value={settings.lineClamp} onChange={(e) => updateSettings({ lineClamp: e.target.value })} className={selectClass}>
              <option value="1">1 line</option>
              <option value="2">2 lines</option>
              <option value="3">3 lines</option>
              <option value="4">4 lines</option>
            </select>
          </div>
          <ToggleRow
            label="Show Images"
            description="Display cover images on blog cards"
            checked={settings.showImages}
            onChange={(v) => updateSettings({ showImages: v })}
          />
          <ToggleRow
            label="Show Timestamps"
            description="Display time ago on each post"
            checked={settings.showTimestamps}
            onChange={(v) => updateSettings({ showTimestamps: v })}
          />
        </SectionCard>

        {/* Behaviour */}
        <SectionCard title="Behaviour" icon={
          <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
            <path fillRule="evenodd" d="M11.49 3.17c-.38-1.56-2.6-1.56-2.98 0a1.532 1.532 0 01-2.286.948c-1.372-.836-2.942.734-2.106 2.106.54.886.061 2.042-.947 2.287-1.561.379-1.561 2.6 0 2.978a1.532 1.532 0 01.947 2.287c-.836 1.372.734 2.942 2.106 2.106a1.532 1.532 0 012.287.947c.379 1.561 2.6 1.561 2.978 0a1.533 1.533 0 012.287-.947c1.372.836 2.942-.734 2.106-2.106a1.533 1.533 0 01.947-2.287c1.561-.379 1.561-2.6 0-2.978a1.532 1.532 0 01-.947-2.287c.836-1.372-.734-2.942-2.106-2.106a1.532 1.532 0 01-2.287-.947zM10 13a3 3 0 100-6 3 3 0 000 6z" clipRule="evenodd" />
          </svg>
        }>
          <ToggleRow
            label="Auto-save Drafts"
            description="Saves your work every 2 seconds while writing"
            checked={settings.autoSave}
            onChange={(v) => updateSettings({ autoSave: v })}
          />
          <ToggleRow
            label="Confirm Before Delete"
            description="Show a confirmation popup before deleting a post"
            checked={settings.confirmDelete}
            onChange={(v) => updateSettings({ confirmDelete: v })}
          />
          <ToggleRow
            label="Enable Notifications"
            description="Show in-app alerts for actions"
            checked={settings.notifications}
            onChange={(v) => updateSettings({ notifications: v })}
          />
        </SectionCard>

        {/* Reset */}
        <Button onClick={() => setShowResetModal(true)} variant="destructive" className="w-full bg-red-600 dark:bg-red-800 mt-2">
          Reset to Default
        </Button>

        <p className="text-center text-xs text-gray-400 dark:text-gray-600 mt-6">JotFul v1.0.0 · Settings save automatically</p>
      </section>

      <Modal
        open={showResetModal}
        message="Are you sure you want to reset all settings to default?"
        onConfirm={confirmReset}
        onCancel={() => setShowResetModal(false)}
      />
    </div>
  );
}
