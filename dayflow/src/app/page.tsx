import styles from './page.module.css'

const baseElements = [
  { title: 'Sunlight', icon: '☀️' },
  { title: 'Long Walks', icon: '🚶' },
  { title: 'Long Sleeps', icon: '😴' },
  { title: 'Meditate', icon: '🧘' },
  { title: 'Eat Plants', icon: '🌱' },
  { title: 'Build Friendships', icon: '🤝' },
  { title: 'Yoga', icon: '🧘‍♀️' },
  { title: 'Hydration', icon: '💧' },
]

const buildElements = [
  { title: 'Finance', icon: '💰' },
  { title: 'Friendships', icon: '👥' },
  { title: 'Strength', icon: '💪' },
  { title: 'Microbiome', icon: '🦠' },
  { title: 'Endurance', icon: '🏃' },
  { title: 'Craft', icon: '🎯' },
]

const reflectionMetrics = [
  { title: 'Sleep Quality', icon: '🌙', type: 'rating', max: 5 },
  { title: 'Pages Read', icon: '📚', type: 'number' },
  { title: 'GitHub Commits', icon: '💻', type: 'number' },
  { title: 'Good Deeds', icon: '💝', type: 'number' },
]

const microbiomeChecklist = [
  { title: 'Plants with every meal', icon: '🥬' },
  { title: 'No dairy', icon: '🚫' },
  { title: 'No added sugar', icon: '🍯' },
  { title: 'No gluten', icon: '🌾' },
]

export default function Home() {
  return (
    <main className={styles.main}>
      <div className={styles.container}>
        <h1 className={styles.title}>DayFlow</h1>
        <p className={styles.subtitle}>
          Go placidly amongst the noise and the haste, establish your base, relentlessly build up your life.
        </p>
        <div className={styles.version}>DayFlow 1.0+</div>

        <section className={styles.baseSection}>
          <h2 className={styles.sectionTitle}>Establish and protect the base</h2>
          <div className={styles.baseGrid}>
            {baseElements.map((element) => (
              <div key={element.title} className={styles.baseCard}>
                <span className={styles.icon}>{element.icon}</span>
                <span className={styles.elementTitle}>{element.title}</span>
              </div>
            ))}
          </div>
        </section>

        <section className={styles.buildSection}>
          <h2 className={styles.sectionTitle}>Build upon the base</h2>
          <div className={styles.buildGrid}>
            {buildElements.map((element) => (
              <div key={element.title} className={styles.buildCard}>
                <span className={styles.icon}>{element.icon}</span>
                <span className={styles.elementTitle}>{element.title}</span>
                <span className={styles.comingSoon}>Coming soon</span>
              </div>
            ))}
          </div>
        </section>

        <section className={styles.reflectSection}>
          <h2 className={styles.sectionTitle}>Reflect on Yesterday</h2>
          <div className={styles.reflectGrid}>
            {reflectionMetrics.map((metric) => (
              <div key={metric.title} className={styles.reflectCard}>
                <div className={styles.metricHeader}>
                  <span className={styles.icon}>{metric.icon}</span>
                  <span className={styles.metricTitle}>{metric.title}</span>
                </div>
                {metric.type === 'rating' ? (
                  <div className={styles.ratingInput}>
                    {[...Array(metric.max)].map((_, i) => (
                      <span key={i} className={styles.star}>⭐️</span>
                    ))}
                  </div>
                ) : (
                  <input 
                    type="number" 
                    className={styles.numberInput}
                    placeholder="0"
                    min="0"
                  />
                )}
              </div>
            ))}
          </div>

          <div className={styles.microbiomeSection}>
            <h3 className={styles.subsectionTitle}>Microbiome Checklist</h3>
            <div className={styles.checklistGrid}>
              {microbiomeChecklist.map((item) => (
                <div key={item.title} className={styles.checklistCard}>
                  <label className={styles.checklistLabel}>
                    <input type="checkbox" className={styles.checkbox} />
                    <span className={styles.checkIcon}>{item.icon}</span>
                    <span className={styles.checklistText}>{item.title}</span>
                  </label>
                </div>
              ))}
            </div>
          </div>
        </section>
      </div>
    </main>
  )
}
