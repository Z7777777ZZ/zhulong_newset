"use client"

export function StatsSection() {
  const stats = [
    {
      value: "99.8%",
      label: "检测准确率",
      company: "基于百万级测试数据",
    },
    {
      value: "10M+",
      label: "文本已处理",
      company: "服务全球用户",
    },
    {
      value: "50K+",
      label: "活跃用户",
      company: "来自180+国家",
    },
    {
      value: "<100ms",
      label: "平均响应时间",
      company: "极速处理体验",
    },
  ]

  return (
    <section className="py-20 px-6 bg-black border-y border-white/10">
      <div className="max-w-7xl mx-auto">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {stats.map((stat, index) => (
            <div
              key={index}
              className="border-l border-white/10 pl-6 animate-fade-in-up"
              style={{ animationDelay: `${index * 0.1}s` }}
            >
              <div className="text-4xl md:text-5xl font-bold mb-2 text-white">{stat.value}</div>
              <div className="text-sm font-medium mb-1 text-neutral-300">{stat.label}</div>
              <div className="text-sm text-neutral-500">{stat.company}</div>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
