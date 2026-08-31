"use client";

import React, { useState } from "react";
import { Modal } from "@/components/ui/modal";
import { Button } from "@/components/ui/button";
import { useDashboard } from "@/context/dashboard-context";
import { ProjectHealth, ProjectStatus, ProjectCategory } from "@/types";
import { TEAM_MEMBERS } from "@/data/mock-data";
import { Sparkles, Calendar, Tag, AlertCircle } from "lucide-react";

interface CreateProjectModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export function CreateProjectModal({ isOpen, onClose }: CreateProjectModalProps) {
  const { addProject } = useDashboard();

  const [name, setName] = useState("");
  const [key, setKey] = useState("");
  const [description, setDescription] = useState("");
  const [category, setCategory] = useState<ProjectCategory>("Core Infrastructure");
  const [status, setStatus] = useState<ProjectStatus>("Active");
  const [health, setHealth] = useState<ProjectHealth>("On Track");
  const [selectedLead, setSelectedLead] = useState(TEAM_MEMBERS[0]);
  const [dueDate, setDueDate] = useState("2026-10-15");
  const [tagInput, setTagInput] = useState("");
  const [tags, setTags] = useState<string[]>(["TypeScript", "V2"]);
  const [errors, setErrors] = useState<{ [key: string]: string }>({});

  const handleNameChange = (val: string) => {
    setName(val);
    if (!key || key.startsWith("PROJ-") || key.trim() === "") {
      const initials = val
        .trim()
        .split(/\s+/)
        .map((w) => w.substring(0, 3).toUpperCase())
        .filter(Boolean)
        .join("")
        .substring(0, 4);
      if (initials) {
        setKey(`${initials}-01`);
      }
    }
  };

  const handleAddTag = () => {
    if (tagInput.trim() && !tags.includes(tagInput.trim())) {
      setTags([...tags, tagInput.trim()]);
      setTagInput("");
    }
  };

  const handleRemoveTag = (tagToRemove: string) => {
    setTags(tags.filter((t) => t !== tagToRemove));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const newErrors: { [key: string]: string } = {};

    if (!name.trim()) newErrors.name = "Project name is required";
    if (!key.trim()) newErrors.key = "Project key/identifier is required";
    if (!description.trim()) newErrors.description = "Please provide a brief description";
    if (!dueDate) newErrors.dueDate = "Target due date is required";

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }

    addProject({
      name: name.trim(),
      key: key.trim().toUpperCase(),
      category,
      description: description.trim(),
      status,
      health,
      lead: selectedLead,
      dueDate,
      tags,
    });

    // Reset and close
    setName("");
    setKey("");
    setDescription("");
    setStatus("Active");
    setHealth("On Track");
    setTags(["TypeScript"]);
    setErrors({});
    onClose();
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title="Create New Project"
      description="Initialize a new initiative, define scope, assign leads, and track sprint execution."
      maxWidth="lg"
    >
      <form onSubmit={handleSubmit} className="space-y-4 text-xs">
        {/* Project Name & Key */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
          <div className="sm:col-span-2 space-y-1.5">
            <label className="font-semibold text-zinc-300">
              Project Name <span className="text-rose-400">*</span>
            </label>
            <input
              type="text"
              value={name}
              onChange={(e) => handleNameChange(e.target.value)}
              placeholder="e.g. Hyperion Storage Gateway"
              className="w-full px-3 py-2 bg-zinc-950/80 border border-zinc-800 rounded-lg text-white placeholder-zinc-500 focus:outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500"
            />
            {errors.name && (
              <p className="text-rose-400 text-[11px] flex items-center gap-1">
                <AlertCircle className="w-3 h-3" /> {errors.name}
              </p>
            )}
          </div>

          <div className="space-y-1.5">
            <label className="font-semibold text-zinc-300">
              Key <span className="text-rose-400">*</span>
            </label>
            <input
              type="text"
              value={key}
              onChange={(e) => setKey(e.target.value)}
              placeholder="e.g. HYP-01"
              className="w-full px-3 py-2 bg-zinc-950/80 border border-zinc-800 rounded-lg text-white font-mono placeholder-zinc-500 uppercase focus:outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500"
            />
            {errors.key && (
              <p className="text-rose-400 text-[11px] flex items-center gap-1">
                <AlertCircle className="w-3 h-3" /> {errors.key}
              </p>
            )}
          </div>
        </div>

        {/* Description */}
        <div className="space-y-1.5">
          <label className="font-semibold text-zinc-300">
            Description <span className="text-rose-400">*</span>
          </label>
          <textarea
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            rows={3}
            placeholder="Outline goals, architecture decisions, and deliverables..."
            className="w-full px-3 py-2 bg-zinc-950/80 border border-zinc-800 rounded-lg text-white placeholder-zinc-500 focus:outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 resize-none"
          />
          {errors.description && (
            <p className="text-rose-400 text-[11px] flex items-center gap-1">
              <AlertCircle className="w-3 h-3" /> {errors.description}
            </p>
          )}
        </div>

        {/* Lead Selector & Due Date */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          <div className="space-y-1.5">
            <label className="font-semibold text-zinc-300">Engineering Lead</label>
            <select
              value={selectedLead.name}
              onChange={(e) => {
                const lead = TEAM_MEMBERS.find((m) => m.name === e.target.value);
                if (lead) setSelectedLead(lead);
              }}
              className="w-full px-3 py-2 bg-zinc-950/80 border border-zinc-800 rounded-lg text-white focus:outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500"
            >
              {TEAM_MEMBERS.map((member) => (
                <option key={member.name} value={member.name}>
                  {member.name} ({member.role})
                </option>
              ))}
            </select>
          </div>

          <div className="space-y-1.5">
            <label className="font-semibold text-zinc-300">Target Delivery Date</label>
            <div className="relative">
              <input
                type="date"
                value={dueDate}
                onChange={(e) => setDueDate(e.target.value)}
                className="w-full px-3 py-2 bg-zinc-950/80 border border-zinc-800 rounded-lg text-white focus:outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500"
              />
            </div>
            {errors.dueDate && (
              <p className="text-rose-400 text-[11px] flex items-center gap-1">
                <AlertCircle className="w-3 h-3" /> {errors.dueDate}
              </p>
            )}
          </div>
        </div>

        {/* Category & Status & Health */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
          <div className="space-y-1.5">
            <label className="font-semibold text-zinc-300">Domain Category</label>
            <select
              value={category}
              onChange={(e) => setCategory(e.target.value as ProjectCategory)}
              className="w-full px-3 py-2 bg-zinc-950/80 border border-zinc-800 rounded-lg text-white focus:outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500"
            >
              <option value="Core Infrastructure">Core Infrastructure</option>
              <option value="Frontend & Design Systems">Frontend & Design</option>
              <option value="Security & Identity">Security & Identity</option>
              <option value="DevOps & Observability">DevOps & SRE</option>
              <option value="AI & Machine Learning">AI & ML</option>
            </select>
          </div>

          <div className="space-y-1.5">
            <label className="font-semibold text-zinc-300">Initial Status</label>
            <select
              value={status}
              onChange={(e) => setStatus(e.target.value as ProjectStatus)}
              className="w-full px-3 py-2 bg-zinc-950/80 border border-zinc-800 rounded-lg text-white focus:outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500"
            >
              <option value="Active">Active (In Sprint)</option>
              <option value="Planning">Planning (Backlog)</option>
              <option value="On Hold">On Hold (Blocked)</option>
              <option value="Completed">Completed</option>
            </select>
          </div>

          <div className="space-y-1.5">
            <label className="font-semibold text-zinc-300">Health State</label>
            <select
              value={health}
              onChange={(e) => setHealth(e.target.value as ProjectHealth)}
              className="w-full px-3 py-2 bg-zinc-950/80 border border-zinc-800 rounded-lg text-white focus:outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500"
            >
              <option value="On Track">🟢 On Track</option>
              <option value="At Risk">🟡 At Risk</option>
              <option value="Delayed">🔴 Delayed</option>
            </select>
          </div>
        </div>

        {/* Tags */}
        <div className="space-y-1.5">
          <label className="font-semibold text-zinc-300">Tags / Tech Stack</label>
          <div className="flex gap-2">
            <input
              type="text"
              value={tagInput}
              onChange={(e) => setTagInput(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === "Enter") {
                  e.preventDefault();
                  handleAddTag();
                }
              }}
              placeholder="e.g. Next.js, WebGL, ClickHouse (Press Enter)"
              className="flex-1 px-3 py-1.5 bg-zinc-950/80 border border-zinc-800 rounded-lg text-white placeholder-zinc-500 focus:outline-none focus:border-indigo-500"
            />
            <Button type="button" variant="secondary" size="sm" onClick={handleAddTag}>
              Add Tag
            </Button>
          </div>

          <div className="flex flex-wrap gap-1.5 mt-2">
            {tags.map((tag) => (
              <span
                key={tag}
                className="inline-flex items-center gap-1.5 px-2 py-0.5 rounded bg-zinc-800 text-zinc-300 border border-zinc-700 text-[11px]"
              >
                <Tag className="w-2.5 h-2.5 text-zinc-400" />
                <span>{tag}</span>
                <button
                  type="button"
                  onClick={() => handleRemoveTag(tag)}
                  className="text-zinc-400 hover:text-rose-400 ml-0.5"
                >
                  ×
                </button>
              </span>
            ))}
          </div>
        </div>

        {/* Footer Actions */}
        <div className="pt-4 border-t border-zinc-800/80 flex items-center justify-end gap-2.5">
          <Button type="button" variant="ghost" size="sm" onClick={onClose}>
            Cancel
          </Button>
          <Button type="submit" variant="primary" size="sm" leftIcon={<Sparkles className="w-3.5 h-3.5" />}>
            Create Project
          </Button>
        </div>
      </form>
    </Modal>
  );
}
