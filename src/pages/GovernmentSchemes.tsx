import { useMemo, useState } from 'react';
import { governmentSchemes } from '@/data/schemes';
import { useLanguage } from '@/contexts/LanguageContext';

type Category = 'all' | 'pregnant' | 'child' | 'senior' | 'general';

const categoryLabels: Record<Category, { en: string; hi: string }> = {
  all: { en: 'All', hi: 'सभी' },
  pregnant: { en: 'Pregnant Women', hi: 'गर्भवती महिलाएँ' },
  child: { en: 'Child Health', hi: 'बच्चों का स्वास्थ्य' },
  senior: { en: 'Senior Citizens', hi: 'वरिष्ठ नागरिक' },
  general: { en: 'General Health', hi: 'सामान्य स्वास्थ्य' },
};

export default function GovernmentSchemes() {
  const { language } = useLanguage();

  const [query, setQuery] = useState('');
  const [category, setCategory] = useState<Category>('all');
  const [selectedId, setSelectedId] = useState<string | null>(null);

  // 🔎 SEARCH + CATEGORY FILTER
  const filteredSchemes = useMemo(() => {
    return governmentSchemes.filter(scheme => {
      const matchesCategory =
        category === 'all' || scheme.category === category;

      const searchText = query.toLowerCase();
      const matchesSearch =
        scheme.name.toLowerCase().includes(searchText) ||
        scheme.nameHi.includes(query);

      return matchesCategory && matchesSearch;
    });
  }, [query, category]);

  return (
    <div className="max-w-6xl mx-auto p-4 space-y-6">
      {/* 🔍 SEARCH BAR */}
      <input
        className="
          w-full p-3 rounded-lg
          bg-green-500/10
          border border-green-500/30
          text-green-900 dark:text-green-100
          placeholder:text-green-700 dark:placeholder:text-green-300
          focus:outline-none focus:ring-2 focus:ring-green-500
        "
        placeholder="योजना खोजें / Search scheme"
        value={query}
        onChange={e => {
          setQuery(e.target.value);
          setSelectedId(null);
        }}
      />

      {/* 📂 CATEGORY FILTER */}
      <div className="flex flex-wrap gap-2">
        {(Object.keys(categoryLabels) as Category[]).map(cat => (
          <button
            key={cat}
            onClick={() => {
              setCategory(cat);
              setSelectedId(null);
            }}
            className={`
              px-4 py-2 rounded-full text-sm border
              ${
                category === cat
                  ? 'bg-green-500 text-white border-green-500'
                  : 'bg-green-500/10 text-green-800 dark:text-green-200 border-green-500/30'
              }
            `}
          >
            {language === 'hi'
              ? categoryLabels[cat].hi
              : categoryLabels[cat].en}
          </button>
        ))}
      </div>

      {/* 🟩 SCHEME CARDS */}
      {filteredSchemes.length === 0 ? (
        <p className="text-center text-green-700 dark:text-green-300">
          कोई योजना नहीं मिली / No scheme found
        </p>
      ) : (
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
          {filteredSchemes.map(scheme => (
            <div
              key={scheme.id}
              onClick={() => {
  setSelectedId(scheme.id);
  window.open(scheme.link, '_blank');
}}

              className={`
                  cursor-pointer rounded-xl p-4 border transition-all duration-300
                  bg-white dark:bg-neutral-900
                  relative
                  ${
                    selectedId === scheme.id
                      ? 'border-green-500 shadow-[0_0_25px_rgba(34,197,94,0.35)]'
                      : 'border-neutral-200 dark:border-neutral-700 hover:border-green-500 hover:shadow-[0_0_30px_rgba(34,197,94,0.45)]'
                  }
                `}

            >
              <div className="flex items-center gap-3 mb-2">
                <span className="text-2xl">{scheme.icon}</span>
                <h3 className="font-semibold text-green-900 dark:text-green-100">
                  {language === 'hi' ? scheme.nameHi : scheme.name}
                </h3>
              </div>

              <p className="text-sm text-green-800 dark:text-green-200 mb-2">
                {language === 'hi'
                  ? scheme.descriptionHi
                  : scheme.description}
              </p>

              <p className="text-xs text-green-700 dark:text-green-300">
                <strong>
                  {language === 'hi' ? 'पात्रता:' : 'Eligibility:'}
                </strong>{' '}
                {language === 'hi'
                  ? scheme.eligibilityHi
                  : scheme.eligibility}
              </p>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
