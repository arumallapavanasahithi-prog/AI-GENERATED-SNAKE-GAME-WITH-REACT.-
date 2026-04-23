/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */
import MusicPlayer from './components/MusicPlayer';
import SnakeGame from './components/SnakeGame';

export default function App() {
  return (
    <div className="min-h-screen bg-black text-white relative flex justify-center items-center overflow-hidden font-sans">
      {/* Immersive Background */}
      <div 
        className="absolute inset-0 pointer-events-none opacity-40 mix-blend-screen"
        style={{
          background: `
            radial-gradient(circle at 15% 50%, rgba(236, 72, 153, 0.4) 0%, transparent 40%),
            radial-gradient(circle at 85% 30%, rgba(6, 182, 212, 0.4) 0%, transparent 50%)
          `,
          filter: 'blur(60px)'
        }}
      />
      
      {/* Grid Overlay for aesthetic */}
      <div 
        className="absolute inset-0 z-0 opacity-10 pointer-events-none"
        style={{
           backgroundImage: `linear-gradient(rgba(236, 72, 153, 0.5) 1px, transparent 1px), linear-gradient(90deg, rgba(6, 182, 212, 0.5) 1px, transparent 1px)`,
           backgroundSize: '40px 40px',
           transform: 'perspective(500px) rotateX(60deg) translateY(-100px) scale(3)',
           transformOrigin: '50% 100%'
        }}
      />

      {/* Main Content */}
      <main className="relative z-10 w-full max-w-7xl mx-auto px-4 md:px-8 py-12 flex flex-col lg:flex-row items-center justify-between gap-12 lg:gap-8 min-h-screen">
        
        {/* Left/Center: Snake Game */}
        <div className="flex-1 w-full flex justify-center lg:justify-end lg:pr-8">
           <SnakeGame />
        </div>

        {/* Right/Bottom: Music Player & Info */}
        <div className="flex-1 w-full flex flex-col items-center lg:items-start lg:pl-8 sm:max-w-md mx-auto lg:mx-0">
           <div className="mb-10 text-center lg:text-left">
              <h1 className="font-bold text-5xl md:text-6xl tracking-tighter mb-2 text-transparent bg-gradient-to-r from-pink-500 to-cyan-400 drop-shadow-[0_0_15px_rgba(236,72,153,0.5)]">
                NEON SNAKE
              </h1>
              <p className="font-mono text-cyan-200 tracking-widest text-sm opacity-80 uppercase">
                 Retro Interactive Experience
              </p>
           </div>
           
           <MusicPlayer />

           <div className="mt-12 p-6 bg-cyan-950/20 border border-cyan-900/50 rounded-xl backdrop-blur-sm text-sm text-cyan-100/70 font-mono w-full max-w-md shadow-[0_4px_20px_rgba(0,0,0,0.5)]">
             <h3 className="text-cyan-400 mb-2 border-b border-cyan-900/50 pb-2 inline-block shadow-cyan-400">HOW TO PLAY</h3>
             <ul className="space-y-2 mt-4">
               <li><span className="text-pink-400">»</span> Eat the pink neon cubes to grow and increase your score.</li>
               <li><span className="text-pink-400">»</span> Avoid crashing into the glowing cyan walls.</li>
               <li><span className="text-pink-400">»</span> Avoid biting your own tail.</li>
               <li><span className="text-pink-400">»</span> Let the synthwave beats guide your movements.</li>
             </ul>
           </div>
        </div>

      </main>
    </div>
  );
}
