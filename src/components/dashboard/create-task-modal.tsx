"use client";

import React, { useState, useEffect } from "react";
import { Modal } from "@/components/ui/modal";
import { Button } from "@/components/ui/button";
import { useDashboard } from "@/context/dashboard-context";
import { TaskPriority, TaskStatus } from "@/types";
import { TEAM_MEMBERS } from "@/data/mock-data";
import { CheckSquare, AlertCircle } from "lucide-react";

interface CreateTaskModalProps {
  isOpen: boolean;
  onClose: () => void;
  defaultProjectId?: string;
}

export function CreateTaskModal({
  isOpen,
  onClose,
  defaultProjectId,
}: CreateTaskModalProps) {
  const { projects, addTask } = useDashboard();

  const [title, setTitle] = useState("");
  const [projectId, setProjectId] = useState(defaultProjectId || (projects[0]?.id || ""));
  const [priority, setPriority] = useState<TaskPriority>("Medium");
  const [status, setStatus] = useState<TaskStatus>("Todo");
  const [selectedAssignee, setSelectedAssignee] = useState(TEAM_MEMBERS[0]);
  const [estimateHours, setEstimateHours] = useState(4);
  const [error, setError] = useState("");

  useEffect(() => {
    if (defaultProjectId) {
      setProjectId(defaultProjectId);
    } else if (projects.length > 0 && !projectId) {
      setProjectId(projects[0].id);
    }
  }, [defaultProjectId, projects, projectId]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim()) {
      setError("Task title is required");
      return;
    }
    if (!projectId) {
      setError("Please select a project");
      return;
    }

    addTask({
      title: title.trim(),
      projectId,
      priority,
      status,
      assignee: selectedAssignee,
      estimateHours: Number(estimateHours) || 1,
    });

    setTitle("");
    setEstimateHours(4);
    setError("");
    onClose();
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title="Create New Task"
      description="Add an issue or engineering task to a project backlog."
      maxWidth="md"
    >
      <form onSubmit={handleSubmit} className="space-y-4 text-xs">
        {/* Project Selector */}
        <div className="space-y-1.5">
          <label className="font-semibold text-zinc-300">Target Project</label>
          <select
            value={projectId}
            onChange={(e) => setProjectId(e.target.value)}
            className="w-full px-3 py-2 bg-zinc-950/80 border border-zinc-800 rounded-lg text-white focus:outline-none focus:border-indigo-500"
          >
            {projects.map((p) => (
              <option key={p.id} value={p.id}>
                [{p.key}] {p.name}
              </option>
            ))}
          </select>
        </div>

        {/* Task Title */}
        <div className="space-y-1.5">
          <label className="font-semibold text-zinc-300">
            Task Title <span className="text-rose-400">*</span>
          </label>
          <input
            type="text"
            value={title}
            onChange={(e) => {
              setTitle(e.target.value);
              setError("");
            }}
            placeholder="e.g. Implement WebAuthn passkey registration flow"
            className="w-full px-3 py-2 bg-zinc-950/80 border border-zinc-800 rounded-lg text-white placeholder-zinc-500 focus:outline-none focus:border-indigo-500"
          />
          {error && (
            <p className="text-rose-400 text-[11px] flex items-center gap-1">
              <AlertCircle className="w-3 h-3" /> {error}
            </p>
          )}
        </div>

        {/* Priority & Status */}
        <div className="grid grid-cols-2 gap-3">
          <div className="space-y-1.5">
            <label className="font-semibold text-zinc-300">Priority</label>
            <select
              value={priority}
              onChange={(e) => setPriority(e.target.value as TaskPriority)}
              className="w-full px-3 py-2 bg-zinc-950/80 border border-zinc-800 rounded-lg text-white focus:outline-none focus:border-indigo-500"
            >
              <option value="Urgent">🔥 Urgent</option>
              <option value="High">⚡ High</option>
              <option value="Medium">✦ Medium</option>
              <option value="Low">☕ Low</option>
            </select>
          </div>

          <div className="space-y-1.5">
            <label className="font-semibold text-zinc-300">Status</label>
            <select
              value={status}
              onChange={(e) => setStatus(e.target.value as TaskStatus)}
              className="w-full px-3 py-2 bg-zinc-950/80 border border-zinc-800 rounded-lg text-white focus:outline-none focus:border-indigo-500"
            >
              <option value="Todo">Todo</option>
              <option value="In Progress">In Progress</option>
              <option value="In Review">In Review</option>
              <option value="Done">Done</option>
            </select>
          </div>
        </div>

        {/* Assignee & Estimate Hours */}
        <div className="grid grid-cols-2 gap-3">
          <div className="space-y-1.5">
            <label className="font-semibold text-zinc-300">Assignee</label>
            <select
              value={selectedAssignee.name}
              onChange={(e) => {
                const member = TEAM_MEMBERS.find((m) => m.name === e.target.value);
                if (member) setSelectedAssignee(member);
              }}
              className="w-full px-3 py-2 bg-zinc-950/80 border border-zinc-800 rounded-lg text-white focus:outline-none focus:border-indigo-500"
            >
              {TEAM_MEMBERS.map((member) => (
                <option key={member.name} value={member.name}>
                  {member.name}
                </option>
              ))}
            </select>
          </div>

          <div className="space-y-1.5">
            <label className="font-semibold text-zinc-300">Estimate (Hours)</label>
            <input
              type="number"
              min={1}
              max={100}
              value={estimateHours}
              onChange={(e) => setEstimateHours(Number(e.target.value))}
              className="w-full px-3 py-2 bg-zinc-950/80 border border-zinc-800 rounded-lg text-white focus:outline-none focus:border-indigo-500"
            />
          </div>
        </div>

        {/* Footer Buttons */}
        <div className="pt-4 border-t border-zinc-800/80 flex items-center justify-end gap-2.5">
          <Button type="button" variant="ghost" size="sm" onClick={onClose}>
            Cancel
          </Button>
          <Button type="submit" variant="primary" size="sm" leftIcon={<CheckSquare className="w-3.5 h-3.5" />}>
            Create Task
          </Button>
        </div>
      </form>
    </Modal>
  );
}
