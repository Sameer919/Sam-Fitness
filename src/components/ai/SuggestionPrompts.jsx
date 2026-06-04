
const SUGGESTIONS = [
  { text: 'Which membership tier fits me?', label: 'Memberships' },
  { text: 'Tell me about the elite gym trainers', label: 'Trainers' },
  { text: 'What fitness classes do you offer?', label: 'Classes' },
  { text: 'Give me a 5-minute core routine', label: 'Fitness' }
]

export default function SuggestionPrompts({ onSelect }) {
  return (
    <div className="py-2">
      <p className="text-[10px] uppercase tracking-wider font-extrabold text-slate-400 mb-2 select-none">
        Suggested Inquiries
      </p>
      <div className="grid grid-cols-2 gap-2">
        {SUGGESTIONS.map((s, idx) => (
          <button
            key={idx}
            onClick={() => onSelect(s.text)}
            className="flex flex-col text-left p-2.5 rounded-xl border border-slate-150 bg-slate-50/50 hover:bg-cyan-50/30 hover:border-cyan-200 transition-all duration-200 group text-[11px] cursor-pointer"
          >
            <span className="text-[8px] uppercase font-black text-cyan-500 mb-0.5 tracking-wide group-hover:text-cyan-600">
              {s.label}
            </span>
            <span className="text-slate-600 font-semibold leading-tight group-hover:text-slate-900">
              {s.text}
            </span>
          </button>
        ))}
      </div>
    </div>
  )
}
