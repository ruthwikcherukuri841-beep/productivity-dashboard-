"use client";

import React, { useState, useRef, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Bell,
  GitCommit,
  GitPullRequest,
  AlertTriangle,
  AtSign,
  Check,
  CheckCheck,
  Trash2,
  ExternalLink,
} from "lucide-react";
import { useDashboard } from "@/context/dashboard-context";
import { NotificationItem, NotificationType } from "@/types";
import { formatRelativeTime, cn } from "@/lib/utils";

export function NotificationDropdown() {
  const {
    notifications,
    unreadNotificationCount,
    markNotificationRead,
    markAllNotificationsRead,
    clearNotifications,
  } = useDashboard();

  const [isOpen, setIsOpen] = useState(false);
  const [filter, setFilter] = useState<"all" | "unread">("all");
  const dropdownRef = useRef<HTMLDivElement>(null);

  // Close on outside click
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    }

    if (isOpen) {
      document.addEventListener("mousedown", handleClickOutside);
    }
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [isOpen]);

  const filteredNotifications = notifications.filter((n) =>
    filter === "unread" ? !n.read : true
  );

  const getIcon = (type: NotificationType) => {
    switch (type) {
      case "commit":
        return <GitCommit className="w-4 h-4 text-sky-400" />;
      case "pr":
        return <GitPullRequest className="w-4 h-4 text-purple-400" />;
      case "alert":
        return <AlertTriangle className="w-4 h-4 text-amber-400" />;
      case "mention":
        return <AtSign className="w-4 h-4 text-emerald-400" />;
      default:
        return <Bell className="w-4 h-4 text-zinc-400" />;
    }
  };

  const getIconBg = (type: NotificationType) => {
    switch (type) {
      case "commit":
        return "bg-sky-500/10 border-sky-500/20";
      case "pr":
        return "bg-purple-500/10 border-purple-500/20";
      case "alert":
        return "bg-amber-500/10 border-amber-500/20";
      case "mention":
        return "bg-emerald-500/10 border-emerald-500/20";
      default:
        return "bg-zinc-800 border-zinc-700";
    }
  };

  return (
    <div className="relative" ref={dropdownRef}>
      {/* Bell Trigger Button */}
      <button
        type="button"
        onClick={() => setIsOpen(!isOpen)}
        aria-label="View notifications"
        className={cn(
          "relative p-2 rounded-lg text-zinc-400 hover:text-zinc-100 hover:bg-zinc-850/80 transition-colors border border-transparent hover:border-zinc-800 focus:outline-none focus:ring-2 focus:ring-zinc-400",
          isOpen && "bg-zinc-850 text-zinc-100 border-zinc-800"
        )}
      >
        <Bell className="w-5 h-5" />
        {unreadNotificationCount > 0 && (
          <span className="absolute top-1.5 right-1.5 flex h-4 min-w-[16px] items-center justify-center rounded-full bg-indigo-500 px-1 text-[10px] font-bold text-white shadow-[0_0_8px_rgba(99,102,241,0.6)]">
            {unreadNotificationCount > 9 ? "9+" : unreadNotificationCount}
          </span>
        )}
      </button>

      {/* Popover Dropdown */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: 8, scale: 0.96 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 8, scale: 0.96 }}
            transition={{ duration: 0.15, ease: "easeOut" }}
            className="absolute right-0 mt-2 w-80 sm:w-96 rounded-2xl bg-zinc-900/95 backdrop-blur-xl border border-zinc-800 shadow-2xl z-50 overflow-hidden"
          >
            {/* Header */}
            <div className="p-4 border-b border-zinc-800/80">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <h4 className="text-sm font-semibold text-white">Notifications</h4>
                  {unreadNotificationCount > 0 && (
                    <span className="text-[11px] font-mono px-1.5 py-0.5 rounded bg-indigo-500/20 text-indigo-300 border border-indigo-500/30">
                      {unreadNotificationCount} new
                    </span>
                  )}
                </div>
                <div className="flex items-center gap-1">
                  {unreadNotificationCount > 0 && (
                    <button
                      type="button"
                      onClick={markAllNotificationsRead}
                      title="Mark all as read"
                      className="p-1 rounded text-zinc-400 hover:text-zinc-200 hover:bg-zinc-800 transition-colors text-xs flex items-center gap-1"
                    >
                      <CheckCheck className="w-3.5 h-3.5" />
                      <span className="hidden sm:inline">Mark read</span>
                    </button>
                  )}
                  {notifications.length > 0 && (
                    <button
                      type="button"
                      onClick={clearNotifications}
                      title="Clear all"
                      className="p-1 rounded text-zinc-500 hover:text-rose-400 hover:bg-zinc-800 transition-colors"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  )}
                </div>
              </div>

              {/* Filter Tabs */}
              <div className="flex gap-2 mt-3">
                <button
                  type="button"
                  onClick={() => setFilter("all")}
                  className={cn(
                    "text-xs px-2.5 py-1 rounded-md font-medium transition-colors",
                    filter === "all"
                      ? "bg-zinc-800 text-white"
                      : "text-zinc-400 hover:text-zinc-200"
                  )}
                >
                  All ({notifications.length})
                </button>
                <button
                  type="button"
                  onClick={() => setFilter("unread")}
                  className={cn(
                    "text-xs px-2.5 py-1 rounded-md font-medium transition-colors",
                    filter === "unread"
                      ? "bg-zinc-800 text-white"
                      : "text-zinc-400 hover:text-zinc-200"
                  )}
                >
                  Unread ({unreadNotificationCount})
                </button>
              </div>
            </div>

            {/* Notification List */}
            <div className="max-h-[380px] overflow-y-auto divide-y divide-zinc-800/40">
              {filteredNotifications.length === 0 ? (
                <div className="p-8 text-center">
                  <Bell className="w-8 h-8 mx-auto text-zinc-600 mb-2 opacity-60" />
                  <p className="text-sm font-medium text-zinc-300">All caught up!</p>
                  <p className="text-xs text-zinc-500 mt-1">
                    {filter === "unread"
                      ? "No unread notifications left."
                      : "No activity to show right now."}
                  </p>
                </div>
              ) : (
                filteredNotifications.map((item) => (
                  <motion.div
                    key={item.id}
                    layout
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    className={cn(
                      "p-3.5 sm:p-4 hover:bg-zinc-850/50 transition-colors flex items-start gap-3 group relative cursor-pointer",
                      !item.read && "bg-indigo-950/15"
                    )}
                    onClick={() => !item.read && markNotificationRead(item.id)}
                  >
                    <div
                      className={cn(
                        "w-8 h-8 rounded-lg border flex items-center justify-center shrink-0 mt-0.5",
                        getIconBg(item.type)
                      )}
                    >
                      {getIcon(item.type)}
                    </div>

                    <div className="flex-1 min-w-0 pr-4">
                      <div className="flex items-center gap-2">
                        <p className={cn("text-xs font-semibold truncate text-zinc-200", !item.read && "text-white")}>
                          {item.title}
                        </p>
                        {!item.read && (
                          <span className="w-1.5 h-1.5 rounded-full bg-indigo-400 shrink-0 shadow-[0_0_6px_rgba(129,140,248,0.8)]" />
                        )}
                      </div>
                      <p className="text-xs text-zinc-400 mt-0.5 line-clamp-2 leading-relaxed">
                        {item.description}
                      </p>
                      <span className="text-[11px] text-zinc-500 mt-1.5 block font-mono">
                        {formatRelativeTime(item.timestamp)}
                      </span>
                    </div>

                    {!item.read && (
                      <button
                        type="button"
                        onClick={(e) => {
                          e.stopPropagation();
                          markNotificationRead(item.id);
                        }}
                        title="Mark as read"
                        className="opacity-0 group-hover:opacity-100 p-1 text-zinc-400 hover:text-white rounded hover:bg-zinc-800 transition-all absolute right-3 top-3.5"
                      >
                        <Check className="w-3.5 h-3.5" />
                      </button>
                    )}
                  </motion.div>
                ))
              )}
            </div>

            {/* Footer */}
            <div className="p-3 bg-zinc-950/60 border-t border-zinc-800/80 text-center">
              <span className="text-[11px] text-zinc-500 flex items-center justify-center gap-1">
                Connected to Realtime Webhook Stream <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
              </span>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
