import { useState, useCallback } from 'react';
import {
  Braces, Minimize2, Copy, Check, Trash2, AlertCircle,
  ChevronDown, Lock, Code, Zap, Heart, Download, Mail
} from 'lucide-react';
import ContactModal from './ContactModal';
import BuyMeACoffee from './BuyMeACoffee';

const INDENT_OPTIONS = [2, 4, '\t'];
const INDENT_LABELS = { 2: '2 spaces', 4: '4 spaces', '\t': 'Tab' };

function filterJson(value, removeNulls, removeEmpty) {
  if (Array.isArray(value)) {
    return value
      .map(v => filterJson(v, removeNulls, removeEmpty))
      .filter(v => {
        if (removeNulls && v === null) return false;
        if (removeEmpty && v === '') return false;
        return true;
      });
  }
  if (value !== null && typeof value === 'object') {
    const result = {};
    for (const [k, v] of Object.entries(value)) {
      const filtered = filterJson(v, removeNulls, removeEmpty);
      if (removeNulls && filtered === null) continue;
      if (removeEmpty && filtered === '') continue;
      result[k] = filtered;
    }
    return result;
  }
  return value;
}

function getSize(str) {
  const bytes = new Blob([str]).size;
  if (bytes < 1024) return `${bytes} B`;
  return `${(bytes / 1024).toFixed(1)} KB`;
}

export default function JsonFormatter() {
  const [input, setInput] = useState('');
  const [output, setOutput] = useState('');
  const [mode, setMode] = useState('beautify'); // 'beautify' | 'minify'
  const [indent, setIndent] = useState(2);
  const [error, setError] = useState('');
  const [copied, setCopied] = useState(false);
  const [showContact, setShowContact] = useState(false);
  const [showIndentMenu, setShowIndentMenu] = useState(false);
  const [removeNulls, setRemoveNulls] = useState(false);
  const [removeEmpty, setRemoveEmpty] = useState(false);

  const process = useCallback((raw, currentMode, currentIndent, curRemoveNulls, curRemoveEmpty) => {
    if (!raw.trim()) {
      setOutput('');
      setError('');
      return;
    }
    try {
      let parsed = JSON.parse(raw);
      if (curRemoveNulls || curRemoveEmpty) {
        parsed = filterJson(parsed, curRemoveNulls, curRemoveEmpty);
      }
      if (currentMode === 'beautify') {
        setOutput(JSON.stringify(parsed, null, currentIndent));
      } else {
        setOutput(JSON.stringify(parsed));
      }
      setError('');
    } catch (e) {
      setError(e.message);
      setOutput('');
    }
  }, []);

  const handleInput = (e) => {
    const val = e.target.value;
    setInput(val);
    process(val, mode, indent, removeNulls, removeEmpty);
  };

  const handleMode = (m) => {
    setMode(m);
    process(input, m, indent, removeNulls, removeEmpty);
  };

  const handleIndent = (val) => {
    setIndent(val);
    setShowIndentMenu(false);
    process(input, mode, val, removeNulls, removeEmpty);
  };

  const handleToggleNulls = () => {
    const next = !removeNulls;
    setRemoveNulls(next);
    process(input, mode, indent, next, removeEmpty);
  };

  const handleToggleEmpty = () => {
    const next = !removeEmpty;
    setRemoveEmpty(next);
    process(input, mode, indent, removeNulls, next);
  };

  const handleCopy = () => {
    if (!output) return;
    navigator.clipboard.writeText(output).then(() => {
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    });
  };

  const handleClear = () => {
    setInput('');
    setOutput('');
    setError('');
  };

  const handleSampleLoad = () => {
    const sample = JSON.stringify({
      name: "Daryl John Tadeo",
      role: "Full Stack Developer",
      skills: ["React", "Node.js", "TypeScript", "AWS"],
      contact: {
        email: "daryltadss.workemail@gmail.com",
        portfolio: "https://daryltadeo.netlify.app"
      },
      available: true,
      yearsOfExperience: 4
    });
    setInput(sample);
    process(sample, mode, indent, removeNulls, removeEmpty);
  };

  const handleDownload = () => {
    if (!output) return;
    const blob = new Blob([output], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = mode === 'minify' ? 'minified.json' : 'formatted.json';
    a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div className="min-h-screen bg-slate-900 text-white flex flex-col">

      {/* Header */}
      <header className="sticky top-0 z-40 bg-slate-950 border-b border-slate-800">
        <div className="max-w-screen-2xl mx-auto px-4 py-3 flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 bg-purple-600 rounded-lg flex items-center justify-center">
              <Braces className="w-4 h-4 text-white" />
            </div>
            <div>
              <h1 className="text-base font-bold text-white leading-tight">Free JSON Formatter</h1>
              <p className="text-xs text-slate-500 leading-tight">& Beautifier</p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <span className="hidden sm:flex items-center gap-1.5 text-xs text-emerald-400 bg-emerald-400/10 px-2.5 py-1 rounded-full">
              <Lock className="w-3 h-3" /> Your data stays in your browser
            </span>
          </div>
        </div>
      </header>

      {/* Main */}
      <main className="flex-1 max-w-screen-2xl mx-auto w-full px-4 py-6 flex flex-col gap-4">

        {/* Mode + Indent controls */}
        <div className="flex flex-wrap items-center gap-3">
          {/* Mode tabs */}
          <div className="flex bg-slate-800 rounded-xl p-1 gap-1">
            <button
              onClick={() => handleMode('beautify')}
              className={`flex items-center gap-1.5 px-4 py-2 rounded-lg text-sm font-semibold transition-all ${
                mode === 'beautify'
                  ? 'bg-purple-600 text-white shadow'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              <Braces className="w-4 h-4" />
              Beautify
            </button>
            <button
              onClick={() => handleMode('minify')}
              className={`flex items-center gap-1.5 px-4 py-2 rounded-lg text-sm font-semibold transition-all ${
                mode === 'minify'
                  ? 'bg-purple-600 text-white shadow'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              <Minimize2 className="w-4 h-4" />
              Minify
            </button>
          </div>

          {/* Indent selector — only relevant in beautify mode */}
          {mode === 'beautify' && (
            <div className="relative">
              <button
                onClick={() => setShowIndentMenu(v => !v)}
                className="flex items-center gap-1.5 bg-slate-800 hover:bg-slate-700 border border-slate-700 text-slate-300 hover:text-white px-3 py-2 rounded-xl text-sm transition-colors"
              >
                Indent: {INDENT_LABELS[indent]}
                <ChevronDown className="w-3.5 h-3.5" />
              </button>
              {showIndentMenu && (
                <div className="absolute top-full mt-1 left-0 bg-slate-800 border border-slate-700 rounded-xl shadow-xl z-10 overflow-hidden min-w-[140px]">
                  {INDENT_OPTIONS.map(opt => (
                    <button
                      key={opt}
                      onClick={() => handleIndent(opt)}
                      className={`w-full text-left px-4 py-2.5 text-sm transition-colors ${
                        indent === opt
                          ? 'bg-purple-600/20 text-purple-300'
                          : 'text-slate-300 hover:bg-slate-700'
                      }`}
                    >
                      {INDENT_LABELS[opt]}
                    </button>
                  ))}
                </div>
              )}
            </div>
          )}

          {/* Filter toggles */}
          <div className="flex gap-2">
            <button
              onClick={handleToggleNulls}
              className={`flex items-center gap-1.5 text-xs px-3 py-2 rounded-xl border transition-colors ${
                removeNulls
                  ? 'bg-purple-600/20 border-purple-500 text-purple-300'
                  : 'bg-slate-800 border-slate-700 text-slate-400 hover:text-white hover:bg-slate-700'
              }`}
            >
              {removeNulls ? <Check className="w-3 h-3" /> : null}
              Remove null
            </button>
            <button
              onClick={handleToggleEmpty}
              className={`flex items-center gap-1.5 text-xs px-3 py-2 rounded-xl border transition-colors ${
                removeEmpty
                  ? 'bg-purple-600/20 border-purple-500 text-purple-300'
                  : 'bg-slate-800 border-slate-700 text-slate-400 hover:text-white hover:bg-slate-700'
              }`}
            >
              {removeEmpty ? <Check className="w-3 h-3" /> : null}
              Remove ""
            </button>
          </div>

          {/* Utility buttons */}
          <div className="flex gap-2 ml-auto">
            <button
              onClick={handleSampleLoad}
              className="text-xs text-slate-400 hover:text-white bg-slate-800 hover:bg-slate-700 px-3 py-2 rounded-xl transition-colors border border-slate-700"
            >
              Load sample
            </button>
            <button
              onClick={handleClear}
              className="flex items-center gap-1.5 text-xs text-slate-400 hover:text-red-400 bg-slate-800 hover:bg-slate-700 px-3 py-2 rounded-xl transition-colors border border-slate-700"
            >
              <Trash2 className="w-3.5 h-3.5" />
              Clear
            </button>
          </div>
        </div>

        {/* Editor panes */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 flex-1">

          {/* Input */}
          <div className="flex flex-col bg-slate-800 rounded-2xl border border-slate-700 overflow-hidden">
            <div className="flex items-center justify-between px-4 h-11 border-b border-slate-700 bg-slate-800/80">
              <span className="text-xs font-semibold text-slate-400 uppercase tracking-wide">Input</span>
              {input && (
                <span className="text-xs text-slate-500">{getSize(input)}</span>
              )}
            </div>
            <textarea
              value={input}
              onChange={handleInput}
              placeholder={'Paste your JSON here…\n\n{\n  "key": "value"\n}'}
              spellCheck={false}
              className="flex-1 w-full bg-transparent px-4 py-3 text-sm text-slate-200 placeholder:text-slate-600 font-mono resize-none focus:outline-none min-h-[70vh]"
            />
          </div>

          {/* Output */}
          <div className="flex flex-col bg-slate-800 rounded-2xl border border-slate-700 overflow-hidden">
            <div className="flex items-center justify-between px-4 h-11 border-b border-slate-700 bg-slate-800/80">
              <span className="text-xs font-semibold text-slate-400 uppercase tracking-wide">Output</span>
              <div className="flex items-center gap-2">
                {output && (
                  <span className="text-xs text-slate-500">{getSize(output)}</span>
                )}
                <button
                  onClick={handleDownload}
                  disabled={!output}
                  className="flex items-center gap-1.5 text-xs px-3 py-1.5 rounded-lg font-semibold transition-all bg-slate-700 hover:bg-slate-600 text-slate-300 disabled:opacity-40 disabled:cursor-not-allowed"
                >
                  <Download className="w-3.5 h-3.5" /> Download
                </button>
                <button
                  onClick={handleCopy}
                  disabled={!output}
                  className={`flex items-center gap-1.5 text-xs px-3 py-1.5 rounded-lg font-semibold transition-all ${
                    copied
                      ? 'bg-emerald-600/20 text-emerald-400'
                      : 'bg-purple-600 hover:bg-purple-700 text-white disabled:bg-slate-700 disabled:text-slate-500'
                  }`}
                >
                  {copied ? <><Check className="w-3.5 h-3.5" /> Copied!</> : <><Copy className="w-3.5 h-3.5" /> Copy</>}
                </button>
              </div>
            </div>

            {error ? (
              <div className="flex-1 flex flex-col items-center justify-center gap-3 px-6 py-8 text-center">
                <AlertCircle className="w-10 h-10 text-red-400" />
                <p className="text-sm font-semibold text-red-400">Invalid JSON</p>
                <p className="text-xs text-slate-500 font-mono bg-slate-900 px-3 py-2 rounded-lg max-w-full break-all">{error}</p>
              </div>
            ) : (
              <textarea
                readOnly
                value={output}
                placeholder="Formatted output will appear here…"
                spellCheck={false}
                className="flex-1 w-full bg-transparent px-4 py-3 text-sm text-slate-200 placeholder:text-slate-600 font-mono resize-none focus:outline-none min-h-[70vh]"
              />
            )}
          </div>
        </div>

        {/* Info strip */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
          {[
            { icon: '🔒', title: '100% Private', desc: 'Your JSON never leaves your browser. No servers, no storage.' },
            { icon: '⚡', title: 'Instant', desc: 'Formats as you type — no button to press.' },
            { icon: '🆓', title: 'Always Free', desc: 'No sign-up, no limits, no ads. Just paste and format.' },
          ].map(({ icon, title, desc }) => (
            <div key={title} className="bg-slate-800/50 border border-slate-700/50 rounded-xl px-4 py-3 flex items-start gap-3">
              <span className="text-xl">{icon}</span>
              <div>
                <p className="text-sm font-semibold text-white">{title}</p>
                <p className="text-xs text-slate-400 mt-0.5">{desc}</p>
              </div>
            </div>
          ))}
        </div>

        {/* Collab CTA */}
        <div className="rounded-2xl border border-purple-500/30 bg-gradient-to-r from-purple-900/30 to-pink-900/20 px-6 py-5 flex flex-col sm:flex-row items-center justify-between gap-4">
          <div>
            <p className="text-white font-semibold text-base">👋 Got an idea or need a developer?</p>
            <p className="text-slate-400 text-sm mt-0.5">I'm open to freelance work, collaborations, and full-time opportunities.</p>
          </div>
          <button
            onClick={() => setShowContact(true)}
            className="flex-shrink-0 flex items-center gap-2 px-5 py-2.5 rounded-xl bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-500 hover:to-pink-500 text-white font-bold text-sm shadow-lg shadow-purple-900/40 transition-all"
          >
            <Mail className="w-4 h-4" />
            Get in Touch
          </button>
        </div>

        <BuyMeACoffee />
      </main>

      {/* Footer */}
      <footer className="bg-slate-950 border-t border-slate-800 mt-8">
        <div className="max-w-screen-2xl mx-auto px-6 py-8">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">

            {/* Developer */}
            <div className="text-center md:text-left">
              <div className="flex items-center justify-center md:justify-start gap-2 mb-3">
                <Code className="w-5 h-5 text-purple-400" />
                <span className="text-lg font-semibold text-slate-200">Developed by</span>
              </div>
              <a
                href="https://daryltadeo.netlify.app"
                target="_blank"
                rel="noopener noreferrer"
                className="text-xl font-bold text-purple-400 mb-2 hover:text-purple-300 transition-colors inline-block"
              >
                Daryl John Tadeo
              </a>
              <p className="text-slate-400 text-sm">Full Stack Developer & UI/UX Enthusiast</p>
            </div>

            {/* Built with */}
            <div className="text-center">
              <div className="flex items-center justify-center gap-2 mb-3">
                <Zap className="w-5 h-5 text-pink-400" />
                <span className="text-lg font-semibold text-slate-200">Built with</span>
              </div>
              <div className="flex flex-wrap justify-center gap-2">
                <span className="bg-blue-600 text-white px-3 py-1 rounded-full text-sm font-medium">React</span>
                <span className="bg-cyan-600 text-white px-3 py-1 rounded-full text-sm font-medium">Tailwind CSS</span>
                <span className="bg-purple-600 text-white px-3 py-1 rounded-full text-sm font-medium">Lucide Icons</span>
                <span className="bg-yellow-600 text-white px-3 py-1 rounded-full text-sm font-medium">Vite</span>
                <span className="bg-teal-600 text-white px-3 py-1 rounded-full text-sm font-medium">Netlify</span>
              </div>
            </div>

            {/* Copyright */}
            <div className="text-center md:text-right">
              <div className="flex items-center justify-center md:justify-end gap-2 mb-3">
                <Heart className="w-5 h-5 text-red-400" />
                <span className="text-lg font-semibold text-slate-200">Made with Care</span>
              </div>
              <p className="text-slate-400 text-sm mb-2">© {new Date().getFullYear()} Daryl John Tadeo</p>
              <p className="text-slate-500 text-xs">🔒 Your data never leaves your browser, ever</p>
            </div>
          </div>

          <div className="mt-8 pt-6 border-t border-slate-800">
            <div className="flex flex-col md:flex-row items-center justify-between gap-4">
              <div className="text-slate-400 text-sm">
                Free JSON formatter & beautifier — zero uploads, zero tracking, zero data leakage
              </div>
              <div className="text-slate-500 text-xs">
                Version 1.0 · Open Source
              </div>
            </div>
          </div>
        </div>
      </footer>

      <ContactModal isOpen={showContact} onClose={() => setShowContact(false)} />
    </div>
  );
}
