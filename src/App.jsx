import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { LanguageProvider } from './context/LanguageContext';
import { GameProvider } from './context/GameContext';
import { AppLayout } from './components/layout/AppLayout';

import { WelcomePage } from './pages/WelcomePage';
import { RegisterPage } from './pages/RegisterPage';
import { AvatarPage } from './pages/AvatarPage';
import { ProloguePage } from './pages/ProloguePage';
import { GamePage } from './pages/GamePage';
import { EndingPage } from './pages/EndingPage';
import { ReflectionPage } from './pages/ReflectionPage';
import { CompletionPage } from './pages/CompletionPage';
import { LeaderboardPage } from './pages/LeaderboardPage';
import { AdminPage } from './pages/AdminPage';

function App() {
  return (
    <BrowserRouter>
      <LanguageProvider>
        <GameProvider>
          <AppLayout>
            <Routes>
              <Route path="/" element={<WelcomePage />} />
              <Route path="/register" element={<RegisterPage />} />
              <Route path="/avatar" element={<AvatarPage />} />
              <Route path="/prologue" element={<ProloguePage />} />
              <Route path="/game" element={<GamePage />} />
              <Route path="/ending" element={<EndingPage />} />
              <Route path="/reflection" element={<ReflectionPage />} />
              <Route path="/completion" element={<CompletionPage />} />
              <Route path="/leaderboard" element={<LeaderboardPage />} />
              <Route path="/admin" element={<AdminPage />} />
              <Route path="*" element={<Navigate to="/" replace />} />
            </Routes>
          </AppLayout>
        </GameProvider>
      </LanguageProvider>
    </BrowserRouter>
  );
}

export default App;