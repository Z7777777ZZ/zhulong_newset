"use client"

export function TrustedBySection() {
  const companies = [
    { name: "OpenAI", logo: "OpenAI" },
    { name: "Microsoft", logo: "Microsoft" },
    { name: "Google", logo: "Google" },
    { name: "Meta", logo: "Meta" },
    { name: "Amazon", logo: "Amazon" },
    { name: "Salesforce", logo: "Salesforce" },
  ]

  return (
    <section className="py-20 px-6 border-t border-white/10 bg-black">
      <div className="max-w-7xl mx-auto">
        <p className="text-center text-sm text-neutral-500 mb-12">全球领先企业的信赖之选</p>
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-12 items-center justify-items-center">
          {companies.map((company) => (
            <div key={company.name} className="text-lg font-medium text-neutral-400 hover:text-white transition-colors">
              {company.logo}
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
