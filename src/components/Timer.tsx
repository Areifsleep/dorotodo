import React, { useState, useEffect } from "react";
import { useLocalStorage } from "@/hooks/useLocalStorage";
import { TimerData } from "@/types/storage";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Timer as TimerIcon,
  Coffee,
  RotateCcw,
  Bell,
  Settings,
} from "lucide-react";

const STORAGE_KEY = "pomodoro-timer";

const DEFAULT_TIMER_STATE: TimerData = {
  time: 25 * 60,
  mode: "focus",
  sessions: 0,
  isRunning: false,
  focusDuration: 25 * 60,
  breakDuration: 5 * 60,
  goalSessions: 4,
  totalFocusTime: 0,
  lastActiveDate: new Date().toDateString(),
};

export const Timer: React.FC = () => {
  const [timerData, setTimerData] = useLocalStorage<TimerData>(
    STORAGE_KEY,
    DEFAULT_TIMER_STATE
  );
  const [error, setError] = useState<string>("");
  const [showSettings, setShowSettings] = useState(false);

  // Previous timer logic remains the same...
  // (Keep all the existing useEffect and handler functions)
  useEffect(() => {
    const today = new Date().toDateString();
    if (timerData.lastActiveDate !== today) {
      setTimerData((prev) => ({
        ...prev,
        sessions: 0,
        totalFocusTime: 0,
        lastActiveDate: today,
      }));
    }
  }, [timerData.lastActiveDate, setTimerData]);

  // Timer countdown effect
  useEffect(() => {
    let interval: NodeJS.Timeout;

    if (timerData.isRunning && timerData.time > 0) {
      interval = setInterval(() => {
        setTimerData((prev) => {
          const newTime = prev.time - 1;
          // Update total focus time if in focus mode
          const newTotalFocusTime =
            prev.mode === "focus"
              ? prev.totalFocusTime + 1
              : prev.totalFocusTime;

          return {
            ...prev,
            time: newTime,
            totalFocusTime: newTotalFocusTime,
          };
        });
      }, 1000);
    } else if (timerData.time === 0) {
      playNotificationSound();
      handleTimerComplete();
    }

    return () => clearInterval(interval);
  }, [timerData.isRunning, timerData.time]);

  const handleTimerComplete = () => {
    if (timerData.mode === "focus") {
      setTimerData((prev) => ({
        ...prev,
        mode: "break",
        time: prev.breakDuration,
        isRunning: false,
        sessions: prev.sessions + 1,
      }));
    } else {
      setTimerData((prev) => ({
        ...prev,
        mode: "focus",
        time: prev.focusDuration,
        isRunning: false,
      }));
    }
  };

  const formatTime = (timeInSeconds: number): string => {
    const minutes = Math.floor(timeInSeconds / 60);
    const seconds = timeInSeconds % 60;
    return `${minutes}:${seconds.toString().padStart(2, "0")}`;
  };

  const playNotificationSound = () => {
    try {
      const audio = new Audio("/notification.wav");
      audio.play().catch(console.error);
      // Vibrate if available
      if ("vibrate" in navigator) {
        navigator.vibrate([200, 100, 200]);
      }
    } catch (error) {
      console.error("Error playing notification:", error);
    }
  };

  const toggleTimer = () => {
    setTimerData((prev) => ({ ...prev, isRunning: !prev.isRunning }));
    setError("");
  };

  const resetTimer = () => {
    setTimerData((prev) => ({
      ...prev,
      time: prev.mode === "focus" ? prev.focusDuration : prev.breakDuration,
      isRunning: false,
    }));
  };

  const updateSettings = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    const focusMinutes = parseInt(formData.get("focusDuration") as string);
    const breakMinutes = parseInt(formData.get("breakDuration") as string);
    const goal = parseInt(formData.get("goalSessions") as string);

    if (focusMinutes < 1 || breakMinutes < 1 || goal < 1) {
      setError("All values must be greater than 0");
      return;
    }

    setTimerData((prev) => ({
      ...prev,
      focusDuration: focusMinutes * 60,
      breakDuration: breakMinutes * 60,
      goalSessions: goal,
      time: prev.mode === "focus" ? focusMinutes * 60 : breakMinutes * 60,
      isRunning: false,
    }));
    setShowSettings(false);
    setError("");
  };

  return (
    <Card className="border-0 shadow-none bg-transparent">
      <CardHeader>
        <CardTitle className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            {timerData.mode === "focus" ? (
              <div className="p-2 bg-blue-100 rounded-lg">
                <TimerIcon className="w-6 h-6 text-blue-600" />
              </div>
            ) : (
              <div className="p-2 bg-green-100 rounded-lg">
                <Coffee className="w-6 h-6 text-green-600" />
              </div>
            )}
            <span className="text-xl">
              {timerData.mode === "focus" ? "Focus Time" : "Break Time"}
            </span>
          </div>
          <div className="flex items-center gap-3">
            <span className="text-sm font-medium px-3 py-1 bg-blue-100 rounded-full">
              {timerData.sessions}/{timerData.goalSessions} Sessions
            </span>
            <Button
              variant="ghost"
              size="sm"
              onClick={playNotificationSound}
              className="rounded-xl hover:bg-gray-100"
            >
              <Bell className="w-4 h-4" />
            </Button>
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setShowSettings(!showSettings)}
              className="hover:bg-blue-100/50"
            >
              <Settings className="w-4 h-4" />
            </Button>
          </div>
        </CardTitle>
      </CardHeader>

      <CardContent>
        {error && (
          <Alert variant="destructive" className="mb-4">
            <AlertDescription>{error}</AlertDescription>
          </Alert>
        )}

        {showSettings ? (
          <div className="bg-white/50 backdrop-blur-sm rounded-xl p-6 space-y-4">
            <form onSubmit={updateSettings} className="space-y-4">
              <div>
                <label className="block text-sm font-medium mb-1">
                  Focus Duration (minutes)
                </label>
                <input
                  type="number"
                  name="focusDuration"
                  defaultValue={timerData.focusDuration / 60}
                  className="w-full px-3 py-2 border rounded-lg"
                  min="1"
                  max="60"
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">
                  Break Duration (minutes)
                </label>
                <input
                  type="number"
                  name="breakDuration"
                  defaultValue={timerData.breakDuration / 60}
                  className="w-full px-3 py-2 border rounded-lg"
                  min="1"
                  max="30"
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">
                  Goal Sessions
                </label>
                <input
                  type="number"
                  name="goalSessions"
                  defaultValue={timerData.goalSessions}
                  className="w-full px-3 py-2 border rounded-lg"
                  min="1"
                  max="10"
                />
              </div>
              <div className="flex gap-2">
                <Button type="submit" className="flex-1">
                  Save Settings
                </Button>
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => setShowSettings(false)}
                >
                  Cancel
                </Button>
              </div>
            </form>
          </div>
        ) : (
          <div className="flex flex-col items-center">
            <h2 className="text-7xl font-mono mb-8 font-bold bg-gradient-to-r from-gray-700 to-gray-800 bg-clip-text text-transparent">
              {formatTime(timerData.time)}
            </h2>

            <div className="flex gap-4 mb-6">
              <Button
                variant={timerData.isRunning ? "destructive" : "default"}
                onClick={toggleTimer}
                className="w-32 h-12 rounded-xl font-medium text-lg transition-all duration-300 hover:scale-105"
              >
                {timerData.isRunning ? "Pause" : "Start"}
              </Button>
              <Button
                variant="outline"
                onClick={resetTimer}
                className="rounded-xl w-32 h-12 transition-all duration-300 hover:scale-105"
              >
                <RotateCcw className="w-4 h-4 mr-2" />
                Reset
              </Button>
            </div>

            <div className="text-sm text-gray-600 mb-5">
              {timerData.mode === "focus" ? (
                <p>
                  Focus until{" "}
                  {new Date(
                    Date.now() + timerData.time * 1000
                  ).toLocaleTimeString()}
                </p>
              ) : (
                <p>
                  Break until{" "}
                  {new Date(
                    Date.now() + timerData.time * 1000
                  ).toLocaleTimeString()}
                </p>
              )}
            </div>

            <div className="w-full p-4 sm:p-6 bg-pink2-300 backdrop-blur-sm rounded-xl">
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-4">
                <div className="text-center p-4 bg-white/50 rounded-lg">
                  <div className="text-sm text-gray-600">Daily Progress</div>
                  <div className="text-xl font-semibold text-gray-800 mt-1">
                    {Math.round(
                      (timerData.sessions / timerData.goalSessions) * 100
                    )}
                    %
                  </div>
                </div>
                <div className="text-center p-4 bg-white/50 rounded-lg">
                  <div className="text-sm text-gray-600">Focus Time</div>
                  <div className="text-xl font-semibold text-gray-800 mt-1">
                    {Math.floor(timerData.totalFocusTime / 60)}m
                  </div>
                </div>
                <div className="text-center p-4 bg-white/50 rounded-lg">
                  <div className="text-sm text-gray-600">Sessions</div>
                  <div className="text-xl font-semibold text-gray-800 mt-1">
                    {timerData.sessions}/{timerData.goalSessions}
                  </div>
                </div>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-2">
                <div
                  className="bg-gradient-to-r from-blue-400 to-blue-700 h-2 rounded-full transition-all duration-300"
                  style={{
                    width: `${Math.min(
                      (timerData.sessions / timerData.goalSessions) * 100,
                      100
                    )}%`,
                  }}
                />
              </div>
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default Timer;
