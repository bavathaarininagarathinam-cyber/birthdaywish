import React, { useState, useRef } from 'react';
import { BirthdayConfig, ThemeColor, THEME_CONFIGS } from '../types';
import { DEFAULT_CONFIG, saveConfigToStorage } from '../utils/storage';
import { Calendar, User, Sparkles, Image as ImageIcon, Heart, ArrowRight, RotateCcw, Check } from 'lucide-react';

interface SetupScreenProps {
  initialConfig?: BirthdayConfig | null;
  onComplete: (config: BirthdayConfig) => void;
}

export const SetupScreen: React.FC<SetupScreenProps> = ({ initialConfig, onComplete }) => {
  const current = initialConfig || DEFAULT_CONFIG;

  const [name, setName] = useState(current.name || '');
  const [age, setAge] = useState<number | ''>(current.age || 20);
  const [birthdayDate, setBirthdayDate] = useState(current.birthdayDate || new Date().toISOString().split('T')[0]);
  const [message, setMessage] = useState(current.message || '');
  const [theme, setTheme] = useState<ThemeColor>(current.theme || 'Pink');
  const [photoUrl, setPhotoUrl] = useState<string | null>(current.photoUrl || null);
  const [isCompressing, setIsCompressing] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const fileInputRef = useRef<HTMLInputElement>(null);
  const themeStyle = THEME_CONFIGS[theme];

  // Image resize helper to ensure photo fits in localStorage comfortably
  const handlePhotoUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (!file.type.startsWith('image/')) {
      setErrorMessage('Please select a valid image file (PNG, JPG, WebP).');
      return;
    }

    setIsCompressing(true);
    setErrorMessage(null);

    const reader = new FileReader();
    reader.onload = (event) => {
      const img = new Image();
      img.onload = () => {
        try {
          const maxDim = 600;
          let w = img.width;
          let h = img.height;

          if (w > maxDim || h > maxDim) {
            if (w > h) {
              h = Math.round((h * maxDim) / w);
              w = maxDim;
            } else {
              w = Math.round((w * maxDim) / h);
              h = maxDim;
            }
          }

          const canvas = document.createElement('canvas');
          canvas.width = w;
          canvas.height = h;
          const ctx = canvas.getContext('2d');
          if (ctx) {
            ctx.drawImage(img, 0, 0, w, h);
            const compressed = canvas.toDataURL('image/jpeg', 0.82);
            setPhotoUrl(compressed);
          }
        } catch {
          setPhotoUrl(event.target?.result as string);
        } finally {
          setIsCompressing(false);
        }
      };
      img.onerror = () => {
        setIsCompressing(false);
        setErrorMessage('Failed to read selected image.');
      };
      img.src = event.target?.result as string;
    };
    reader.readAsDataURL(file);
  };

  const handleRemovePhoto = () => {
    setPhotoUrl(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) {
      setErrorMessage("Please enter your friend's name.");
      return;
    }
    const parsedAge = typeof age === 'number' ? age : parseInt(String(age), 10);
    if (isNaN(parsedAge) || parsedAge < 1 || parsedAge > 120) {
      setErrorMessage('Please enter a valid age between 1 and 120.');
      return;
    }

    const newConfig: BirthdayConfig = {
      name: name.trim(),
      age: parsedAge,
      birthdayDate,
      message: message.trim() || `Happy Birthday ${name.trim()}! Wishing you an incredible year ahead!`,
      photoUrl,
      theme,
    };

    saveConfigToStorage(newConfig);
    onComplete(newConfig);
  };

  const handleLoadSample = () => {
    setName('Maya Chen');
    setAge(21);
    setBirthdayDate(new Date().toISOString().split('T')[0]);
    setMessage(
      "To the kindest, funniest, and most inspiring friend anyone could ask for! May this 21st year be full of unforgettable concerts, late-night laughs, spontaneous road trips, and endless happiness. So grateful to celebrate another milestone with you! ✨🍰💖"
    );
    setTheme('Pink');
    setErrorMessage(null);
  };

  return (
    <div className={`min-h-screen bg-gradient-to-br ${themeStyle.gradientBg} py-8 px-4 sm:px-6 lg:px-8 flex items-center justify-center`}>
      <div className="w-full max-w-2xl bg-white/95 backdrop-blur-sm rounded-3xl shadow-xl shadow-slate-200/50 border border-slate-100 p-6 sm:p-10 transition-all">
        {/* Header */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-14 h-14 rounded-2xl bg-gradient-to-br from-pink-500 to-amber-500 text-white shadow-md shadow-pink-500/20 mb-4 animate-bounce">
            <Sparkles className="w-7 h-7" />
          </div>
          <h1 className="text-3xl sm:text-4xl font-extrabold text-slate-900 font-display tracking-tight">
            Create Birthday Surprise
          </h1>
          <p className="mt-2 text-sm sm:text-base text-slate-600 max-w-md mx-auto">
            Personalise an interactive celebration page with candles, balloons, music, and memories for your friend.
          </p>
        </div>

        {/* Error message */}
        {errorMessage && (
          <div className="mb-6 p-4 rounded-xl bg-rose-50 border border-rose-200 text-rose-800 text-sm flex items-center justify-between">
            <span>{errorMessage}</span>
            <button
              type="button"
              onClick={() => setErrorMessage(null)}
              className="text-rose-500 hover:text-rose-700 font-bold ml-2"
            >
              ×
            </button>
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Row 1: Friend's Name & Age */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div className="sm:col-span-2">
              <label htmlFor="friend-name" className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1.5">
                Friend's Name <span className="text-rose-500">*</span>
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400">
                  <User className="w-4 h-4" />
                </div>
                <input
                  id="friend-name"
                  type="text"
                  required
                  placeholder="e.g. Sarah, David, Alex"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="w-full pl-10 pr-4 py-3 bg-slate-50 border border-slate-200 rounded-xl text-slate-900 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-pink-500 focus:bg-white transition-all text-sm font-medium"
                />
              </div>
            </div>

            <div>
              <label htmlFor="friend-age" className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1.5">
                Age <span className="text-rose-500">*</span>
              </label>
              <input
                id="friend-age"
                type="number"
                min="1"
                max="120"
                required
                placeholder="20"
                value={age}
                onChange={(e) => setAge(e.target.value === '' ? '' : parseInt(e.target.value, 10))}
                className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl text-slate-900 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-pink-500 focus:bg-white transition-all text-sm font-medium"
              />
            </div>
          </div>

          {/* Row 2: Birthday Date */}
          <div>
            <label htmlFor="birthday-date" className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1.5">
              Birthday Date <span className="text-rose-500">*</span>
            </label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400">
                <Calendar className="w-4 h-4" />
              </div>
              <input
                id="birthday-date"
                type="date"
                required
                value={birthdayDate}
                onChange={(e) => setBirthdayDate(e.target.value)}
                className="w-full pl-10 pr-4 py-3 bg-slate-50 border border-slate-200 rounded-xl text-slate-900 focus:outline-none focus:ring-2 focus:ring-pink-500 focus:bg-white transition-all text-sm font-medium"
              />
            </div>
            <p className="mt-1 text-xs text-slate-500">
              Used for the live countdown and fun statistics like heartbeats and hours lived!
            </p>
          </div>

          {/* Row 3: Theme Color Choice */}
          <div>
            <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-2">
              Theme Colour Choice
            </label>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
              {(['Pink', 'Purple', 'Blue', 'Gold'] as ThemeColor[]).map((colorKey) => {
                const isSelected = theme === colorKey;
                const colors = {
                  Pink: 'from-rose-400 to-pink-500 border-rose-300 text-rose-900',
                  Purple: 'from-violet-400 to-purple-600 border-purple-300 text-purple-900',
                  Blue: 'from-sky-400 to-blue-600 border-sky-300 text-sky-900',
                  Gold: 'from-amber-400 to-yellow-600 border-amber-300 text-amber-900',
                }[colorKey];

                return (
                  <button
                    key={colorKey}
                    type="button"
                    onClick={() => setTheme(colorKey)}
                    className={`relative flex items-center justify-between p-3.5 rounded-2xl border-2 transition-all cursor-pointer ${
                      isSelected
                        ? 'border-slate-900 bg-slate-50 shadow-md ring-2 ring-slate-900/10'
                        : 'border-slate-200 bg-white hover:border-slate-300 hover:bg-slate-50/50'
                    }`}
                  >
                    <div className="flex items-center gap-2.5">
                      <span className={`w-5 h-5 rounded-full bg-gradient-to-tr ${colors} shadow-sm shrink-0`} />
                      <span className="text-xs font-bold text-slate-800">{colorKey}</span>
                    </div>
                    {isSelected && (
                      <span className="w-5 h-5 rounded-full bg-slate-900 text-white flex items-center justify-center shrink-0">
                        <Check className="w-3 h-3 stroke-[3]" />
                      </span>
                    )}
                  </button>
                );
              })}
            </div>
          </div>

          {/* Row 4: Personal Message */}
          <div>
            <label htmlFor="personal-msg" className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1.5 flex justify-between">
              <span>Personal Message <span className="text-rose-500">*</span></span>
              <span className="text-slate-400 font-normal">{message.length} characters</span>
            </label>
            <textarea
              id="personal-msg"
              rows={3}
              required
              placeholder="Write your heartfelt or fun birthday wish here. It will be revealed in a handwritten typewriter animation!"
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl text-slate-900 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-pink-500 focus:bg-white transition-all text-sm leading-relaxed"
            />
          </div>

          {/* Row 5: Optional Photo Upload */}
          <div>
            <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1.5">
              Photo of Friend (Optional)
            </label>
            <input
              ref={fileInputRef}
              type="file"
              accept="image/*"
              onChange={handlePhotoUpload}
              className="hidden"
              id="photo-upload-input"
            />

            {photoUrl ? (
              <div className="flex items-center gap-4 p-3 bg-slate-50 border border-slate-200 rounded-2xl">
                <img
                  src={photoUrl}
                  alt="Friend preview"
                  className="w-16 h-16 object-cover rounded-xl shadow-sm border border-white"
                />
                <div className="flex-1 min-w-0">
                  <p className="text-xs font-semibold text-slate-800 truncate">Photo uploaded!</p>
                  <p className="text-xs text-slate-500">Will be displayed in a tilted Polaroid frame.</p>
                </div>
                <button
                  type="button"
                  onClick={handleRemovePhoto}
                  className="px-3 py-1.5 text-xs font-medium text-rose-600 bg-rose-50 hover:bg-rose-100 rounded-lg transition-colors"
                >
                  Remove
                </button>
              </div>
            ) : (
              <button
                type="button"
                onClick={() => fileInputRef.current?.click()}
                disabled={isCompressing}
                className="w-full py-5 px-4 border-2 border-dashed border-slate-200 hover:border-slate-300 rounded-2xl bg-slate-50/50 hover:bg-slate-50 text-slate-600 flex flex-col items-center justify-center gap-2 transition-all cursor-pointer group"
              >
                <div className="w-10 h-10 rounded-xl bg-white shadow-sm flex items-center justify-center text-slate-500 group-hover:text-pink-500 group-hover:scale-105 transition-all">
                  <ImageIcon className="w-5 h-5" />
                </div>
                <div className="text-center">
                  <p className="text-xs font-medium text-slate-700">
                    {isCompressing ? 'Processing image...' : 'Click to upload a memorable photo'}
                  </p>
                  <p className="text-[11px] text-slate-400">PNG, JPG, or WebP from your phone or laptop</p>
                </div>
              </button>
            )}
          </div>

          {/* Action buttons */}
          <div className="pt-2 flex flex-col sm:flex-row items-center gap-3">
            <button
              type="submit"
              className={`w-full sm:flex-1 py-3.5 px-6 rounded-2xl text-white font-bold text-sm tracking-wide shadow-lg shadow-pink-500/25 bg-gradient-to-r from-rose-500 via-pink-500 to-amber-500 hover:brightness-105 active:scale-[0.99] transition-all flex items-center justify-center gap-2 cursor-pointer`}
            >
              <span>Create Birthday Surprise</span>
              <ArrowRight className="w-4 h-4" />
            </button>

            <button
              type="button"
              onClick={handleLoadSample}
              className="w-full sm:w-auto py-3.5 px-4 rounded-2xl bg-slate-100 hover:bg-slate-200 text-slate-700 font-semibold text-xs transition-colors flex items-center justify-center gap-1.5 cursor-pointer"
            >
              <RotateCcw className="w-3.5 h-3.5" />
              <span>Fill Sample Data</span>
            </button>
          </div>
        </form>

        <div className="mt-8 pt-6 border-t border-slate-100 flex items-center justify-between text-xs text-slate-400">
          <div className="flex items-center gap-1.5">
            <Heart className="w-3.5 h-3.5 text-rose-400 fill-rose-400" />
            <span>Saved in your browser</span>
          </div>
          <span>Easy to share with friends</span>
        </div>
      </div>
    </div>
  );
};
