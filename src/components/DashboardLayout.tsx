import React from "react";
import { Timer } from "./Timer";
import { TodoList } from "./TodoList";
import SpotifyEmbed from "./SpotifyEmbed";

const GlassCard: React.FC<{
  children: React.ReactNode;
  className?: string;
}> = ({ children, className = "" }) => (
  <div
    className={`
      backdrop-blur-lg 
      bg-periwinkle-300 
      rounded-xl
      shadow-lg 
      transition-all 
      duration-300 
      hover:shadow-xl 
      hover:bg-periwinkle-300/95
      ${className}
    `}
  >
    {children}
  </div>
);

const DashboardLayout: React.FC = () => {
  return (
    <div
      className="h-full w-full bg-slate-900 sm:p-6"
      style={{
        backgroundImage: `
              radial-gradient(circle at 100% 100%, rgba(167, 139, 250, 0.1) 0%, transparent 70%),
              radial-gradient(circle at 0% 0%, rgba(96, 165, 250, 0.1) 0%, transparent 70%)
            `,
      }}
    >
      <div className="container mx-auto max-w-6xl">
        {/* Header Section */}
        <div className="mb-5">
          {/* <h1 className="text-3xl font-bold text-gray-50">DOROTODO</h1> */}
        </div>
        <div className="space-y-4 sm:space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-6">
            <GlassCard>
              <Timer />
            </GlassCard>

            <GlassCard>
              <SpotifyEmbed />
            </GlassCard>
          </div>
          <GlassCard>
            <TodoList />
          </GlassCard>
        </div>

        {/* Footer */}
        <div className="mt-8 text-center text-gray-50 text-sm">
          <p>23106050050_Arif Rahman</p>
        </div>
      </div>
    </div>
  );
};

export default DashboardLayout;
