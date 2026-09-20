import React from 'react';
import { useTranslation } from '../context/LanguageContext';
import { useValuation } from '../context/ValuationContext';
import { useVoiceInput } from '../hooks/useVoiceInput';
import {
  Mic,
  X,
  Sparkles,
  Check,
  Volume2,
  PlayCircle,
} from 'lucide-react';

export const VoiceInputModal: React.FC = () => {
  const { language, t } = useTranslation();
  const { isVoiceModalOpen, setIsVoiceModalOpen, updatePropertyInput } = useValuation();
  const {
    isListening,
    transcript,
    extractedData,
    startListening,
    stopListening,
    simulateVoiceInput,
  } = useVoiceInput(language);

  if (!isVoiceModalOpen) return null;

  const handleApply = () => {
    if (extractedData) {
      const { rawTranscript: _, ...fieldsToUpdate } = extractedData;
      updatePropertyInput(fieldsToUpdate);
    }
    setIsVoiceModalOpen(false);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/75 backdrop-blur-md animate-in fade-in duration-200">
      <div className="bg-slate-900 border border-slate-800 rounded-3xl w-full max-w-lg shadow-2xl overflow-hidden text-white animate-in zoom-in-95 duration-150">
        {/* Header */}
        <div className="px-6 py-4 border-b border-slate-800 flex items-center justify-between bg-slate-900/50">
          <div className="flex items-center gap-2.5">
            <div className="p-2 rounded-xl bg-orange-500/10 text-orange-400">
              <Mic className="w-5 h-5" />
            </div>
            <div>
              <h3 className="font-bold text-lg text-slate-100">
                {t('voice.title')}
              </h3>
              <p className="text-xs text-slate-400">{t('intake.voice_hint')}</p>
            </div>
          </div>
          <button
            onClick={() => {
              stopListening();
              setIsVoiceModalOpen(false);
            }}
            className="p-1.5 rounded-lg text-slate-400 hover:text-slate-200 hover:bg-slate-800 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Body */}
        <div className="p-6 space-y-6">
          {/* Animated Microphone Area */}
          <div className="flex flex-col items-center justify-center py-4">
            <button
              type="button"
              onClick={isListening ? stopListening : startListening}
              className={`relative w-24 h-24 rounded-full flex items-center justify-center transition-all transform active:scale-95 shadow-xl ${
                isListening
                  ? 'bg-gradient-to-tr from-red-600 to-orange-500 shadow-red-500/40 ring-8 ring-red-500/20 animate-pulse'
                  : 'bg-gradient-to-tr from-brand-600 to-emerald-500 shadow-brand-500/30 hover:scale-105'
              }`}
            >
              <Mic className="w-10 h-10 text-white" />
            </button>

            {/* Pulsing Audio Waveform Animation */}
            {isListening ? (
              <div className="flex items-center justify-center gap-1.5 mt-5 h-10">
                <span className="w-1.5 bg-orange-400 rounded-full wave-bar-1" />
                <span className="w-1.5 bg-orange-400 rounded-full wave-bar-2" />
                <span className="w-1.5 bg-orange-400 rounded-full wave-bar-3" />
                <span className="w-1.5 bg-orange-400 rounded-full wave-bar-4" />
                <span className="w-1.5 bg-orange-400 rounded-full wave-bar-5" />
                <span className="text-xs font-semibold text-orange-400 ml-2 animate-pulse">
                  {t('voice.listening')}
                </span>
              </div>
            ) : (
              <div className="mt-4 text-center">
                <span className="text-xs font-semibold text-slate-400">
                  Tap microphone to start speaking
                </span>
              </div>
            )}
          </div>

          {/* Prompt Suggestion Card */}
          <div className="p-3.5 rounded-2xl bg-slate-800/80 border border-slate-700/70 text-xs text-slate-300 flex items-start gap-2.5">
            <Volume2 className="w-4 h-4 text-amber-400 shrink-0 mt-0.5" />
            <div>
              <span className="font-semibold text-amber-400">Example phrase:</span>
              <p className="italic text-slate-300 mt-0.5">
                "{t('voice.speak_prompt')}"
              </p>
            </div>
          </div>

          {/* Transcript Preview */}
          {transcript && (
            <div className="p-4 rounded-2xl bg-slate-950 border border-slate-800">
              <div className="text-[11px] font-bold text-slate-400 uppercase tracking-wider mb-1">
                {t('voice.transcript_label')}
              </div>
              <p className="text-sm font-medium text-slate-200">
                "{transcript}"
              </p>
            </div>
          )}

          {/* Extracted Entity Tags Preview */}
          {extractedData && (
            <div className="p-4 rounded-2xl bg-brand-950/40 border border-brand-500/30 space-y-2.5">
              <div className="flex items-center gap-1.5 text-xs font-bold text-brand-300">
                <Sparkles className="w-3.5 h-3.5 text-brand-400" />
                <span>{t('voice.extracted_preview')}</span>
              </div>
              <div className="flex flex-wrap gap-2">
                {extractedData.location && (
                  <span className="px-2.5 py-1 rounded-lg bg-brand-500/20 text-brand-300 text-xs font-semibold border border-brand-500/30">
                    📍 Location: {extractedData.location}
                  </span>
                )}
                {extractedData.propertyType && (
                  <span className="px-2.5 py-1 rounded-lg bg-brand-500/20 text-brand-300 text-xs font-semibold border border-brand-500/30">
                    🏡 Type: {extractedData.propertyType.toUpperCase()}
                  </span>
                )}
                {extractedData.area && (
                  <span className="px-2.5 py-1 rounded-lg bg-brand-500/20 text-brand-300 text-xs font-semibold border border-brand-500/30">
                    📐 Area: {extractedData.area} {extractedData.areaUnit || 'sqft'}
                  </span>
                )}
                {extractedData.roadWidth && (
                  <span className="px-2.5 py-1 rounded-lg bg-brand-500/20 text-brand-300 text-xs font-semibold border border-brand-500/30">
                    🛣️ Road: {extractedData.roadWidth}
                  </span>
                )}
                {extractedData.isCornerPlot !== undefined && (
                  <span className="px-2.5 py-1 rounded-lg bg-brand-500/20 text-brand-300 text-xs font-semibold border border-brand-500/30">
                    ✨ Corner Plot: {extractedData.isCornerPlot ? 'Yes' : 'No'}
                  </span>
                )}
              </div>
            </div>
          )}

          {/* Quick Demo Voice Simulation Trigger */}
          <div className="text-center pt-1">
            <button
              type="button"
              onClick={() =>
                simulateVoiceInput(
                  'Mera 150 gaj ka corner plot hai Alwar bypass road par 30 foot road ke sath mujhe bechna hai'
                )
              }
              className="inline-flex items-center gap-1.5 text-xs text-slate-400 hover:text-brand-300 underline underline-offset-4 transition-colors"
            >
              <PlayCircle className="w-3.5 h-3.5" />
              <span>Simulate Sample Voice (Instant Test)</span>
            </button>
          </div>
        </div>

        {/* Footer Actions */}
        <div className="px-6 py-4 bg-slate-950/70 border-t border-slate-800 flex items-center justify-between gap-3">
          <button
            type="button"
            onClick={() => {
              stopListening();
              setIsVoiceModalOpen(false);
            }}
            className="px-4 py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs font-bold transition-colors"
          >
            {t('voice.close')}
          </button>

          {extractedData && (
            <button
              type="button"
              onClick={handleApply}
              className="flex-1 px-4 py-2.5 rounded-xl bg-brand-600 hover:bg-brand-500 text-white text-xs font-bold flex items-center justify-center gap-2 shadow-lg shadow-brand-600/30 transition-all active:scale-95"
            >
              <Check className="w-4 h-4 stroke-[3]" />
              <span>{t('voice.apply_button')}</span>
            </button>
          )}
        </div>
      </div>
    </div>
  );
};
