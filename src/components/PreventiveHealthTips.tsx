import { preventiveHealthCategories } from "@/data/preventiveHealthTips";

export default function PreventiveHealthTips() {
  return (
    <section className="space-y-10">
      <h2 className="text-2xl font-bold text-center">
        Preventive Health & Wellness Guidelines
      </h2>

      {preventiveHealthCategories.map((category) => (
        <div key={category.id} className="space-y-4">
          <h3 className="text-xl font-semibold">{category.name}</h3>

          <div className="grid gap-4 sm:grid-cols-2">
            {category.tips.map((tip) => (
              <div
                key={tip.id}
                className="rounded-lg border p-4 bg-white shadow-sm"
              >
                <div className="flex gap-3">
                  <span className="text-2xl">{tip.icon}</span>
                  <div>
                    <h4 className="font-medium">{tip.title}</h4>
                    <p className="text-sm text-gray-600">
                      {tip.description}
                    </p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      ))}
    </section>
  );
}
