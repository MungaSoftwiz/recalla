"use client";

import React, { useEffect, useState, memo } from "react";
import { Box } from "@mui/material";
import { motion } from "framer-motion";
import { supabase } from "@/lib/supabase";
import { rightNavBarStyles, SHARED_STYLES } from "@/styles/theme";

const SessionCard = memo(({ session, isActive, onSessionSelect }) => {
  const progress =
    session.total_cards > 0
      ? (session.completed_cards / session.total_cards) * 100
      : 0;

  return (
    <motion.div
      whileHover={{ scale: 1.01 }}
      onClick={() => onSessionSelect?.(session)}
      className={`mb-2 mx-2 p-4 rounded-lg cursor-pointer transition-all ${
        isActive ? "bg-[#4A1E6A]" : "bg-[#2a2438]"
      }`}
      style={{
        background: isActive
          ? "rgba(74, 30, 106, 0.9)"
          : "rgba(42, 36, 56, 0.9)",
        border: isActive
          ? `1px solid ${SHARED_STYLES.colors.primary}`
          : "1px solid rgba(156, 85, 255, 0.3)",
        color: isActive ? "#FFFFFF" : "#D4C8FF",
      }}
    >
      <h3 className="text-white font-medium text-sm mb-2">{session.topic}</h3>
      <div className="flex justify-between items-center text-xs mb-2">
        <span>{new Date(session.created_at).toLocaleDateString()}</span>
        <span>
          {session.completed_cards}/{session.total_cards}
        </span>
      </div>
      <div className="h-1 bg-[#1a1625] rounded-full overflow-hidden">
        <div
          className="h-full bg-purple-500"
          style={{ width: `${progress}%` }}
        />
      </div>
    </motion.div>
  );
});

SessionCard.displayName = "SessionCard";

const FlashcardSidebar = ({
  sessions: propSessions = [],
  onSessionSelect,
  activeSessionId,
}) => {
  const [sessions, setSessions] = useState(propSessions);
  const [loading, setLoading] = useState(!propSessions.length);

  useEffect(() => {
    if (propSessions.length) {
      setSessions(propSessions);
      setLoading(false);
      return;
    }

    const fetchSessions = async () => {
      try {
        const {
          data: { user },
        } = await supabase.auth.getUser();
        if (!user) return;

        const { data, error } = await supabase
          .from("study_sessions")
          .select("*")
          .eq("user_id", user.id)
          .order("created_at", { ascending: false });

        if (error) throw error;
        setSessions(data || []);
      } catch (error) {
        console.error("Error fetching sessions:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchSessions();

    const subscription = supabase
      .channel("study_sessions")
      .on(
        "postgres_changes",
        { event: "*", schema: "public", table: "study_sessions" },
        (payload) => {
          fetchSessions();
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(subscription);
    };
  }, [propSessions, onSessionSelect]);

  const handleSessionSelect = (session) => {
    onSessionSelect(session);
  };

  return (
    <Box
      sx={{
        ...rightNavBarStyles,
        display: "flex",
        flexDirection: "column",
      }}
    >
      <Box
        sx={{
          p: 2,
          borderBottom: "1px solid rgba(156,85,255,0.3)",
          flexShrink: 0,
        }}
      >
        <h2 className="text-lg font-semibold text-white">Study Sets</h2>
      </Box>

      <Box
        sx={{
          flex: 1,
          overflowY: "auto",
          "&::-webkit-scrollbar": {
            width: "8px",
            background: "transparent",
          },
          "&::-webkit-scrollbar-thumb": {
            background: SHARED_STYLES.gradients.primary,
            borderRadius: "4px",
          },
          "&::-webkit-scrollbar-thumb:hover": {
            background: SHARED_STYLES.gradients.primaryHover,
          },
          "&::-webkit-scrollbar-track": {
            background: "rgba(42,36,56,0.5)",
            borderRadius: "4px",
          },
          scrollbarWidth: "thin",
          scrollbarColor: "rgba(156,85,255,0.5) rgba(42,36,56,0.5)",
        }}
      >
        {loading ? (
          <div className="flex justify-center items-center h-32">
            <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-purple-500"></div>
          </div>
        ) : sessions.length === 0 ? (
          <div className="text-center text-gray-400 mt-8">
            <p>No study sets yet.</p>
            <p className="text-xs">Create one to get started!</p>
          </div>
        ) : (
          sessions.map((session) => (
            <SessionCard
              key={session.id}
              session={session}
              isActive={session.id === activeSessionId}
              onSessionSelect={handleSessionSelect}
            />
          ))
        )}
      </Box>
    </Box>
  );
};

export default FlashcardSidebar;
