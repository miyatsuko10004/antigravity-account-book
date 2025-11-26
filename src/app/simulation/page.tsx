'use client';

import { useState, useEffect } from 'react';
import { loadData, AppData } from '@/lib/storage';
import Link from 'next/link';

import styles from './page.module.css';

export default function SimulationPage() {
    const [data, setData] = useState<AppData | null>(null);
    const [monthlySavings, setMonthlySavings] = useState<number>(0);
    const [currentSavings, setCurrentSavings] = useState<number>(0);

    useEffect(() => {
        const loadedData = loadData();
        setData(loadedData);

        // Calculate initial values
        const totalIncome = loadedData.incomes.reduce((sum, i) => sum + i.amount, 0);
        const totalAllocated = loadedData.categories.reduce((sum, c) => sum + c.allocated, 0);
        const calculatedMonthlySavings = Math.max(0, totalIncome - totalAllocated);

        // Assume current savings is what's left unspent + specifically allocated "Savings" category
        // For this simulation, let's just use the "Savings" category balance if it exists, or 0.
        const savingsCategory = loadedData.categories.find(c => c.name === '貯金');
        const currentBalance = savingsCategory ? savingsCategory.allocated - savingsCategory.spent : 0;

        setMonthlySavings(calculatedMonthlySavings);
        setCurrentSavings(currentBalance);
    }, []);

    if (!data) return <div className={styles.container}>Loading...</div>;

    const years = [1, 3, 5, 10, 20];

    return (
        <div className={styles.container}>
            <header className={styles.header}>
                <h1 className={styles.title}>
                    貯金シミュレーション
                </h1>
                <Link href="/" className={styles.backLink}>
                    ← 戻る
                </Link>
            </header>

            <div className={styles.content}>
                {/* Settings Section */}
                <section className={styles.section}>
                    <h2 className={styles.sectionTitle}>シミュレーション設定</h2>
                    <div className={styles.grid2}>
                        <div>
                            <label className={styles.label}>現在の貯蓄額</label>
                            <div className={styles.inputWrapper}>
                                <span className={styles.currencySymbol}>¥</span>
                                <input
                                    type="number"
                                    value={currentSavings}
                                    onChange={(e) => setCurrentSavings(Number(e.target.value))}
                                    className="input-field"
                                    style={{ paddingLeft: '2rem' }}
                                />
                            </div>
                        </div>
                        <div>
                            <label className={styles.label}>毎月の積立額</label>
                            <div className={styles.inputWrapper}>
                                <span className={styles.currencySymbol}>¥</span>
                                <input
                                    type="number"
                                    value={monthlySavings}
                                    onChange={(e) => setMonthlySavings(Number(e.target.value))}
                                    className="input-field"
                                    style={{ paddingLeft: '2rem' }}
                                />
                            </div>
                            <p className={styles.hintText}>
                                ※現在の予算設定に基づく推奨額: ¥{(data.incomes.reduce((s, i) => s + i.amount, 0) - data.categories.reduce((s, c) => s + c.allocated, 0)).toLocaleString()}
                            </p>
                        </div>
                    </div>
                </section>

                {/* Projection Section */}
                <section className={styles.projectionGrid}>
                    <h2 className={styles.sectionTitleSlate}>将来の予測</h2>
                    <div className={styles.projectionGrid}>
                        {years.map(year => {
                            const totalMonths = year * 12;
                            const futureValue = currentSavings + (monthlySavings * totalMonths);

                            return (
                                <div key={year} className={styles.projectionCard}>
                                    <div style={{ display: 'flex', alignItems: 'center' }}>
                                        <div className={styles.yearBadge}>
                                            {year}年
                                        </div>
                                        <div>
                                            <p className={styles.projectionLabel}>後の貯蓄額</p>
                                        </div>
                                    </div>
                                    <div>
                                        <p className={styles.projectionValue}>¥{futureValue.toLocaleString()}</p>
                                        <p className={styles.projectionGain}>
                                            (+¥{(monthlySavings * totalMonths).toLocaleString()})
                                        </p>
                                    </div>
                                </div>
                            );
                        })}
                    </div>
                </section>
            </div>
        </div>
    );
}
