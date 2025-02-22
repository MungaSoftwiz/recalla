"use cient";

import { motion } from "framer-motion";
import { Trophy, Target, Clock, Calendar } from "lucide-react";
import { formattedTimeSpent } from "@/utils/timeUtils";

export default function ProgressSection({
  studyStreak,
  completedCards,
  totalCards,
  timeSpent,
}) {
  const averageTimeSpent = timeSpent / (studyStreak || 1);
  const weeklyIncrease = 0;

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-12 p-6"
      style={{ backgroundColor: "#4A1E6A", borderRadius: "8px" }}
    >
      <motion.div
        whileHover={{ scale: 1.05 }}
        className="bg-purple-800 p-6 rounded-lg shadow-xl border border-purple-500/30 hover:border-purple-500 transition-all duration-200"
      >
        <div className="flex flex-col items-center gap-4">
          <Trophy className="w-10 h-10 text-purple-300" />
          <div className="text-center">
            <p className="text-purple-200 text-sm font-medium">Study Streak</p>
            <p className="text-white text-2xl font-bold">{studyStreak} days</p>
            <p className="text-purple-400 text-xs mt-2">
              Keep it up for a reward at 7 days!
            </p>
          </div>
        </div>
      </motion.div>

      <motion.div
        whileHover={{ scale: 1.05 }}
        className="bg-purple-800 p-6 rounded-lg shadow-xl border border-purple-500/30 hover:border-purple-500 transition-all duration-200"
      >
        <div className="flex flex-col items-center gap-4">
          <Target className="w-10 h-10 text-purple-300" />
          <div className="text-center w-full">
            <p className="text-purple-200 text-sm font-medium">Progress</p>
            <p className="text-white text-2xl font-bold">
              {totalCards > 0
                ? Math.round((completedCards / totalCards) * 100)
                : 0}
              %
            </p>
            <div className="w-full bg-purple-700 rounded-full h-2.5 mt-2">
              <div
                className="bg-purple-300 h-2.5 rounded-full"
                style={{
                  width: `${
                    totalCards > 0
                      ? Math.round((completedCards / totalCards) * 100)
                      : 0
                  }%`,
                }}
              ></div>
            </div>
            <p className="text-purple-400 text-xs mt-2">
              {completedCards}/{totalCards} cards completed
            </p>
          </div>
        </div>
      </motion.div>

      <motion.div
        whileHover={{ scale: 1.05 }}
        className="bg-purple-800 p-6 rounded-lg shadow-xl border border-purple-500/30 hover:border-purple-500 transition-all duration-200"
      >
        <div className="flex flex-col items-center gap-4">
          <Clock className="w-10 h-10 text-purple-300" />
          <div className="text-center">
            <p className="text-purple-200 text-sm font-medium">Time Spent</p>
            <p className="text-white text-2xl font-bold">
              {formattedTimeSpent(timeSpent)}
            </p>
            <p className="text-purple-400 text-xs mt-2">
              Avg: {formattedTimeSpent(averageTimeSpent)}/day
            </p>
            <button className="mt-4 bg-purple-600 text-white text-sm px-4 py-2 rounded-lg hover:bg-purple-500 transition-colors">
              View History
            </button>
          </div>
        </div>
      </motion.div>

      <motion.div
        whileHover={{ scale: 1.05 }}
        className="bg-purple-800 p-6 rounded-lg shadow-xl border border-purple-500/30 hover:border-purple-500 transition-all duration-200"
      >
        <div className="flex flex-col items-center gap-4">
          <Calendar className="w-10 h-10 text-purple-300" />
          <div className="text-center">
            <p className="text-purple-200 text-sm font-medium">
              Cards Mastered
            </p>
            <p className="text-white text-2xl font-bold">{completedCards}</p>
            <p className="text-purple-400 text-xs mt-2">
              +{weeklyIncrease} this week
            </p>
            <span className="text-green-400 text-xs">Trending Up!</span>
          </div>
        </div>
      </motion.div>
    </motion.div>
  );
}
