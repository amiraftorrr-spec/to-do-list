'use client';

import React, { useState, useEffect } from 'react';
import { useTodo } from '@/context/TodoContext';
import { Priority, Category } from '@/types/todo';
import { getTodayString, getTomorrowString, addDays, getSaturdayOfWeek, getLocalDateString } from '@/lib/date-utils';
import { X, Calendar, Clock, Plus, Trash2 } from 'lucide-react';

export function TaskFormModal() {
  const {
    isTaskModalOpen,
    closeTaskModal,
    editingTask,
    modalDefaultDate,
    addTask,
    editTask,
    todayStr,
    tomorrowStr,
    t,
  } = useTodo();

  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [dueDate, setDueDate] = useState('');
  const [dueTime, setDueTime] = useState('');
  const [priority, setPriority] = useState<Priority>('medium');
  const [category, setCategory] = useState<Category>('General');
  const [subtasks, setSubtasks] = useState<{ title: string }[]>([]);
  const [newSubtask, setNewSubtask] = useState('');

  const nextSatStr = todayStr ? getLocalDateString(getSaturdayOfWeek(new Date(todayStr))) : '';

  useEffect(() => {
    if (editingTask) {
      setTitle(editingTask.title);
      setDescription(editingTask.description || '');
      setDueDate(editingTask.dueDate);
      setDueTime(editingTask.dueTime || '');
      setPriority(editingTask.priority);
      setCategory(editingTask.category);
      setSubtasks(editingTask.subtasks.map((s) => ({ title: s.title })));
    } else {
      setTitle('');
      setDescription('');
      setDueDate(modalDefaultDate || todayStr || '');
      setDueTime('');
      setPriority('medium');
      setCategory('General');
      setSubtasks([]);
      setNewSubtask('');
    }
  }, [editingTask, modalDefaultDate, todayStr, isTaskModalOpen]);

  // Handle escape key
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && isTaskModalOpen) {
        closeTaskModal();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isTaskModalOpen, closeTaskModal]);

  if (!isTaskModalOpen) return null;

  const handleAddSubtask = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newSubtask.trim()) return;
    setSubtasks([...subtasks, { title: newSubtask.trim() }]);
    setNewSubtask('');
  };

  const handleRemoveSubtask = (index: number) => {
    setSubtasks(subtasks.filter((_, i) => i !== index));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim()) return;

    if (editingTask) {
      editTask(editingTask.id, {
        title: title.trim(),
        description: description.trim() || undefined,
        dueDate,
        dueTime: dueTime || undefined,
        priority,
        category,
      });
    } else {
      addTask({
        title: title.trim(),
        description: description.trim() || undefined,
        dueDate,
        dueTime: dueTime || undefined,
        priority,
        category,
        subtasks,
      });
    }

    closeTaskModal();
  };

  const categories: { key: Category; label: string }[] = [
    { key: 'General', label: t.catGeneral },
    { key: 'Personal', label: t.catPersonal },
    { key: 'Work', label: t.catWork },
    { key: 'Habits', label: t.catHabits },
    { key: 'Learning', label: t.catLearning },
    { key: 'Health', label: t.catHealth },
  ];

  const priorities: { value: Priority; label: string; desc: string }[] = [
    { value: 'urgent', label: t.priorityUrgent, desc: t.priorityUrgentDesc },
    { value: 'high', label: t.priorityHigh, desc: t.priorityHighDesc },
    { value: 'medium', label: t.priorityMedium, desc: t.priorityMediumDesc },
    { value: 'low', label: t.priorityLow, desc: t.priorityLowDesc },
  ];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-stone-900/40 backdrop-blur-xs animate-in fade-in duration-150">
      <div
        className="w-full max-w-lg rounded-2xl bg-[var(--color-card)] border border-[var(--color-border)] shadow-xl overflow-hidden flex flex-col max-h-[90vh]"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex items-center justify-between px-5 py-3.5 border-b border-[var(--color-border)] bg-stone-50/50 dark:bg-stone-800/40">
          <h2 className="text-sm font-semibold text-stone-900 dark:text-stone-100">
            {editingTask ? t.editTaskTitle : t.newTaskTitle}
          </h2>
          <button
            onClick={closeTaskModal}
            className="p-1 rounded-md text-stone-400 hover:text-stone-700 dark:hover:text-stone-200 hover:bg-stone-100 dark:hover:bg-stone-700 cursor-pointer"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Scrollable Form Body */}
        <form onSubmit={handleSubmit} className="p-5 space-y-4 overflow-y-auto">
          {/* Title Input */}
          <div>
            <label className="block text-[11px] font-semibold text-stone-400 uppercase tracking-wider mb-1">
              {t.titleLabel}
            </label>
            <input
              type="text"
              required
              autoFocus
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder={t.titlePlaceholder}
              className="w-full text-sm font-medium px-3 py-2 rounded-lg bg-stone-50 dark:bg-stone-800/60 border border-stone-200 dark:border-stone-700 focus:bg-white dark:focus:bg-stone-900 focus:outline-hidden focus:border-stone-400 dark:focus:border-stone-500 text-stone-900 dark:text-stone-100"
            />
          </div>

          {/* Description / Notes */}
          <div>
            <label className="block text-[11px] font-semibold text-stone-400 uppercase tracking-wider mb-1">
              {t.notesLabel}
            </label>
            <textarea
              rows={2}
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder={t.notesPlaceholder}
              className="w-full text-xs px-3 py-2 rounded-lg bg-stone-50 dark:bg-stone-800/60 border border-stone-200 dark:border-stone-700 focus:bg-white dark:focus:bg-stone-900 focus:outline-hidden focus:border-stone-400 dark:focus:border-stone-500 text-stone-800 dark:text-stone-200 resize-none"
            />
          </div>

          {/* Date & Time Scheduling */}
          <div>
            <label className="block text-[11px] font-semibold text-stone-400 uppercase tracking-wider mb-1.5">
              {t.whenLabel}
            </label>

            {/* Quick date suggestion chips */}
            <div className="flex flex-wrap gap-1.5 mb-2.5">
              <button
                type="button"
                onClick={() => setDueDate(todayStr)}
                className={`px-2.5 py-1 rounded-md text-xs font-medium cursor-pointer transition-colors ${
                  dueDate === todayStr
                    ? 'bg-stone-900 text-white dark:bg-stone-100 dark:text-stone-900'
                    : 'bg-stone-100 text-stone-700 dark:bg-stone-800 dark:text-stone-300 hover:bg-stone-200'
                }`}
              >
                {t.today}
              </button>
              <button
                type="button"
                onClick={() => setDueDate(tomorrowStr)}
                className={`px-2.5 py-1 rounded-md text-xs font-medium cursor-pointer transition-colors ${
                  dueDate === tomorrowStr
                    ? 'bg-stone-900 text-white dark:bg-stone-100 dark:text-stone-900'
                    : 'bg-stone-100 text-stone-700 dark:bg-stone-800 dark:text-stone-300 hover:bg-stone-200'
                }`}
              >
                {t.moveTomorrow}
              </button>
              <button
                type="button"
                onClick={() => setDueDate(addDays(todayStr, 2))}
                className={`px-2.5 py-1 rounded-md text-xs font-medium cursor-pointer transition-colors ${
                  dueDate === addDays(todayStr, 2)
                    ? 'bg-stone-900 text-white dark:bg-stone-100 dark:text-stone-900'
                    : 'bg-stone-100 text-stone-700 dark:bg-stone-800 dark:text-stone-300 hover:bg-stone-200'
                }`}
              >
                {t.in2Days}
              </button>
              <button
                type="button"
                onClick={() => setDueDate(nextSatStr)}
                className={`px-2.5 py-1 rounded-md text-xs font-medium cursor-pointer transition-colors ${
                  dueDate === nextSatStr
                    ? 'bg-stone-900 text-white dark:bg-stone-100 dark:text-stone-900'
                    : 'bg-stone-100 text-stone-700 dark:bg-stone-800 dark:text-stone-300 hover:bg-stone-200'
                }`}
              >
                {t.saturday}
              </button>
            </div>

            {/* Custom Date & Time Inputs */}
            <div className="grid grid-cols-2 gap-2">
              <div className="relative">
                <Calendar className="w-3.5 h-3.5 text-stone-400 absolute left-2.5 rtl:left-auto rtl:right-2.5 top-1/2 -translate-y-1/2 pointer-events-none" />
                <input
                  type="date"
                  required
                  value={dueDate}
                  onChange={(e) => setDueDate(e.target.value)}
                  className="w-full text-xs pl-8 rtl:pl-2 rtl:pr-8 pr-2 py-1.5 rounded-lg bg-stone-50 dark:bg-stone-800/60 border border-stone-200 dark:border-stone-700 text-stone-800 dark:text-stone-200"
                />
              </div>

              <div className="relative">
                <Clock className="w-3.5 h-3.5 text-stone-400 absolute left-2.5 rtl:left-auto rtl:right-2.5 top-1/2 -translate-y-1/2 pointer-events-none" />
                <input
                  type="time"
                  value={dueTime}
                  onChange={(e) => setDueTime(e.target.value)}
                  placeholder="Optional time"
                  className="w-full text-xs pl-8 rtl:pl-2 rtl:pr-8 pr-2 py-1.5 rounded-lg bg-stone-50 dark:bg-stone-800/60 border border-stone-200 dark:border-stone-700 text-stone-800 dark:text-stone-200"
                />
              </div>
            </div>
          </div>

          {/* Priority */}
          <div>
            <label className="block text-[11px] font-semibold text-stone-400 uppercase tracking-wider mb-1.5">
              {t.priorityLabel}
            </label>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-1.5">
              {priorities.map((p) => (
                <button
                  type="button"
                  key={p.value}
                  onClick={() => setPriority(p.value)}
                  className={`p-2 rounded-lg border text-left rtl:text-right cursor-pointer transition-all ${
                    priority === p.value
                      ? 'border-stone-900 bg-stone-900 text-white dark:border-stone-100 dark:bg-stone-100 dark:text-stone-900 shadow-xs'
                      : 'border-stone-200 dark:border-stone-700 bg-stone-50 dark:bg-stone-800/40 text-stone-700 dark:text-stone-300 hover:border-stone-300'
                  }`}
                >
                  <p className="text-xs font-semibold">{p.label}</p>
                  <p className="text-[10px] opacity-75">{p.desc}</p>
                </button>
              ))}
            </div>
          </div>

          {/* Space / Category */}
          <div>
            <label className="block text-[11px] font-semibold text-stone-400 uppercase tracking-wider mb-1.5">
              {t.spaceLabel}
            </label>
            <div className="flex flex-wrap gap-1.5">
              {categories.map((cat) => (
                <button
                  type="button"
                  key={cat.key}
                  onClick={() => setCategory(cat.key)}
                  className={`px-2.5 py-1 rounded-md text-xs font-medium cursor-pointer transition-colors ${
                    category === cat.key
                      ? 'bg-stone-800 text-white dark:bg-stone-200 dark:text-stone-900'
                      : 'bg-stone-100 dark:bg-stone-800 text-stone-600 dark:text-stone-300 hover:bg-stone-200'
                  }`}
                >
                  {cat.label}
                </button>
              ))}
            </div>
          </div>

          {/* Subtasks Builder (Only for new tasks or editing) */}
          <div>
            <label className="block text-[11px] font-semibold text-stone-400 uppercase tracking-wider mb-1">
              {t.stepsLabel}
            </label>

            {subtasks.length > 0 && (
              <div className="space-y-1 mb-2">
                {subtasks.map((sub, i) => (
                  <div
                    key={i}
                    className="flex items-center justify-between text-xs px-2.5 py-1 rounded bg-stone-100/70 dark:bg-stone-800/50"
                  >
                    <span className="text-stone-700 dark:text-stone-300">• {sub.title}</span>
                    <button
                      type="button"
                      onClick={() => handleRemoveSubtask(i)}
                      className="text-stone-400 hover:text-rose-500"
                    >
                      <Trash2 className="w-3 h-3" />
                    </button>
                  </div>
                ))}
              </div>
            )}

            <div className="flex gap-2">
              <input
                type="text"
                value={newSubtask}
                onChange={(e) => setNewSubtask(e.target.value)}
                placeholder={t.stepPlaceholder}
                onKeyDown={(e) => {
                  if (e.key === 'Enter') {
                    e.preventDefault();
                    handleAddSubtask(e);
                  }
                }}
                className="flex-1 text-xs px-2.5 py-1.5 rounded-lg bg-stone-50 dark:bg-stone-800/60 border border-stone-200 dark:border-stone-700 focus:outline-hidden focus:border-stone-400 text-stone-800 dark:text-stone-200"
              />
              <button
                type="button"
                onClick={handleAddSubtask}
                className="px-2.5 py-1.5 text-xs font-medium rounded-lg bg-stone-200 dark:bg-stone-700 hover:bg-stone-300 dark:hover:bg-stone-600 text-stone-700 dark:text-stone-200 flex items-center gap-1 cursor-pointer"
              >
                <Plus className="w-3 h-3" />
                <span>{t.addBtn}</span>
              </button>
            </div>
          </div>

          {/* Footer Submit Buttons */}
          <div className="pt-3 border-t border-[var(--color-border)] flex items-center justify-end gap-2">
            <button
              type="button"
              onClick={closeTaskModal}
              className="px-3 py-1.5 rounded-lg text-xs font-medium text-stone-600 dark:text-stone-400 hover:bg-stone-100 dark:hover:bg-stone-800 cursor-pointer"
            >
              {t.cancelBtn}
            </button>
            <button
              type="submit"
              className="px-4 py-1.5 rounded-lg text-xs font-medium bg-stone-900 text-white hover:bg-stone-800 dark:bg-stone-100 dark:text-stone-900 dark:hover:bg-white shadow-xs cursor-pointer active:scale-95 transition-all"
            >
              {editingTask ? t.saveChangesBtn : t.createTaskBtn}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
