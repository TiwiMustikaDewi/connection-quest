import React, { useReducer, useEffect } from 'react';
import { GameContext } from './gameContextDef';
import { sound } from '../lib/sound';

const STORAGE_KEY = 'connection_quest_game_state_v1';

const INITIAL_STATE = {
  participant: {
    name: '',
    homegroup: '',
    avatarId: null, // 'milo' | 'lumi' | 'kiko'
  },
  currentChapter: 1,
  currentSceneId: 'prologue_intro',
  choices: [], // Array<{ sceneId: string, choiceId: string, timestamp: number }>
  indicators: {
    initiative: 0,
    empathy: 0,
    adaptability: 0,
    authenticity: 0,
  },
  relationships: {
    pikoTrust: 0,
    noriComfort: 0,
    festivalPlan: 0,
  },
  ending: null, // 'bridge_builder' | 'growing_connector' | 'curious_explorer'
  isCompleted: false,
  soundEnabled: true,
};

function loadInitialState() {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (raw) {
      const parsed = JSON.parse(raw);
      return {
        ...INITIAL_STATE,
        ...parsed,
        participant: {
          ...INITIAL_STATE.participant,
          ...(parsed.participant || {}),
        },
        indicators: {
          ...INITIAL_STATE.indicators,
          ...(parsed.indicators || {}),
        },
        relationships: {
          ...INITIAL_STATE.relationships,
          ...(parsed.relationships || {}),
        },
        soundEnabled: true,
      };
    }
  } catch (err) {
    console.warn('Failed to parse saved game state from localStorage:', err);
  }
  return INITIAL_STATE;
}

function gameReducer(state, action) {
  switch (action.type) {
    case 'SET_PARTICIPANT':
      return {
        ...state,
        participant: {
          ...state.participant,
          name: action.payload.name ?? state.participant.name,
          homegroup: action.payload.homegroup ?? state.participant.homegroup,
        },
      };

    case 'SELECT_AVATAR':
      return {
        ...state,
        participant: {
          ...state.participant,
          avatarId: action.payload.avatarId,
        },
      };

    case 'SET_SCENE':
      return {
        ...state,
        currentSceneId: action.payload.sceneId,
        currentChapter: action.payload.chapter ?? state.currentChapter,
      };

    case 'RECORD_CHOICE': {
      const { sceneId, choiceId, indicatorDeltas = {}, relationshipDeltas = {}, nextSceneId, nextChapter } = action.payload;
      
      const newIndicators = { ...state.indicators };
      for (const [key, delta] of Object.entries(indicatorDeltas)) {
        if (key in newIndicators) {
          newIndicators[key] = (newIndicators[key] || 0) + delta;
        }
      }

      const newRelationships = { ...state.relationships };
      for (const [key, delta] of Object.entries(relationshipDeltas)) {
        if (key in newRelationships) {
          newRelationships[key] = (newRelationships[key] || 0) + delta;
        }
      }

      const newChoiceEntry = {
        sceneId,
        choiceId,
        timestamp: Date.now(),
      };

      return {
        ...state,
        choices: [...state.choices, newChoiceEntry],
        indicators: newIndicators,
        relationships: newRelationships,
        currentSceneId: nextSceneId ?? state.currentSceneId,
        currentChapter: nextChapter ?? state.currentChapter,
      };
    }

    case 'SET_ENDING':
      return {
        ...state,
        ending: action.payload.ending,
        isCompleted: true,
      };

    case 'TOGGLE_SOUND': {
      const nextSound = action.payload?.soundEnabled ?? !state.soundEnabled;
      if (!nextSound) {
        sound.stopBgm(true);
      } else {
        sound.init();
        sound.startBgm();
      }
      return {
        ...state,
        soundEnabled: nextSound,
      };
    }

    case 'RESET_GAME':
      return {
        ...INITIAL_STATE,
        soundEnabled: state.soundEnabled, // preserve audio preference
      };

    default:
      return state;
  }
}

export function GameProvider({ children }) {
  const [state, dispatch] = useReducer(gameReducer, undefined, loadInitialState);

  // Sync to localStorage on state changes
  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
    } catch (err) {
      console.warn('Could not persist game state to localStorage:', err);
    }
  }, [state]);

  const setParticipant = (participantData) => {
    dispatch({ type: 'SET_PARTICIPANT', payload: participantData });
  };

  const selectAvatar = (avatarId) => {
    dispatch({ type: 'SELECT_AVATAR', payload: { avatarId } });
  };

  const setScene = (sceneId, chapter) => {
    dispatch({ type: 'SET_SCENE', payload: { sceneId, chapter } });
  };

  const recordChoice = (choicePayload) => {
    dispatch({ type: 'RECORD_CHOICE', payload: choicePayload });
  };

  const setEnding = (ending) => {
    dispatch({ type: 'SET_ENDING', payload: { ending } });
  };

  const toggleSound = () => {
    dispatch({ type: 'TOGGLE_SOUND' });
  };

  const resetGame = () => {
    try {
      localStorage.removeItem(STORAGE_KEY);
      localStorage.removeItem('connection_quest_reflection_v1');
    } catch (err) {
      console.warn('Could not clear game state from localStorage:', err);
    }
    dispatch({ type: 'RESET_GAME' });
  };

  const hasStarted = Boolean(state.participant.name && state.participant.avatarId);

  return (
    <GameContext.Provider
      value={{
        state,
        dispatch,
        hasStarted,
        setParticipant,
        selectAvatar,
        setScene,
        recordChoice,
        setEnding,
        toggleSound,
        resetGame,
      }}
    >
      {children}
    </GameContext.Provider>
  );
}
