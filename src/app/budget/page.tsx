'use client';

import { useState, useEffect } from 'react';
import { loadData, saveData, addCategory, AppData, Income, BudgetCategory } from '@/lib/storage';
import { v4 as uuidv4 } from 'uuid';
import Link from 'next/link';

import styles from './page.module.css';

export default function BudgetPage() {
    const [data, setData] = useState<AppData | null>(null);
    const [husbandIncome, setHusbandIncome] = useState<string>('');
    const [wifeIncome, setWifeIncome] = useState<string>('');
    const [categories, setCategories] = useState<BudgetCategory[]>([]);
    const [newCategoryName, setNewCategoryName] = useState('');

    const [saveStatus, setSaveStatus] = useState<'idle' | 'saving' | 'success'>('idle');

    useEffect(() => {
        const loadedData = loadData();
        setData(loadedData);
        setCategories(loadedData.categories);

        // Pre-fill income if exists for current month (simplified logic for now)
        const hIncome = loadedData.incomes.find(i => i.source === 'husband');
        const wIncome = loadedData.incomes.find(i => i.source === 'wife');
        if (hIncome) setHusbandIncome(hIncome.amount.toString());
        if (wIncome) setWifeIncome(wIncome.amount.toString());
    }, []);

    const handleSave = async () => {
        if (!data) return;
        setSaveStatus('saving');

        // Simulate a small delay for better UX
        await new Promise(resolve => setTimeout(resolve, 500));

        const newIncomes: Income[] = [];
        if (husbandIncome) {
            newIncomes.push({
                id: uuidv4(),
                source: 'husband',
                amount: Number(husbandIncome),
                date: new Date().toISOString(),
            });
        }
        if (wifeIncome) {
            newIncomes.push({
                id: uuidv4(),
                source: 'wife',
                amount: Number(wifeIncome),
                date: new Date().toISOString(),
            });
        }

        const newData = {
            ...data,
            incomes: newIncomes,
            categories: categories,
        };

        console.log('Saving data:', newData);
        saveData(newData);
        setSaveStatus('success');

        // Reset success message after 3 seconds
        setTimeout(() => setSaveStatus('idle'), 3000);
    };

    const handleCategoryChange = (id: string, amount: string) => {
        console.log('Category change:', id, amount);
        setCategories(prev => prev.map(c =>
            c.id === id ? { ...c, allocated: Number(amount) } : c
        ));
    };

    const handleAddCategory = () => {
        if (!newCategoryName.trim()) return;
        const newCategory = addCategory(newCategoryName);
        setCategories([...categories, newCategory]);
        setNewCategoryName('');
    };

    const totalIncome = Number(husbandIncome || 0) + Number(wifeIncome || 0);
    const totalAllocated = categories.reduce((sum, c) => sum + c.allocated, 0);
    const remaining = totalIncome - totalAllocated;

    if (!data) return <div className={styles.container}>Loading...</div>;

    return (
        <div className={styles.container}>
            <header className={styles.header}>
                <h1 className={styles.title}>
                    予算設定
                </h1>
                <Link href="/" className={styles.backLink}>
                    ← 戻る
                </Link>
            </header>

            <div className={styles.content}>
                {/* Income Section */}
                <section className={styles.section}>
                    <h2 className={styles.sectionTitle}>収入登録</h2>
                    <div className={styles.grid2}>
                        <div>
                            <label className={styles.label}>夫の収入</label>
                            <input
                                type="number"
                                value={husbandIncome}
                                onChange={(e) => setHusbandIncome(e.target.value)}
                                className="input-field"
                                placeholder="0"
                            />
                        </div>
                        <div>
                            <label className={styles.label}>妻の収入</label>
                            <input
                                type="number"
                                value={wifeIncome}
                                onChange={(e) => setWifeIncome(e.target.value)}
                                className="input-field"
                                placeholder="0"
                            />
                        </div>
                    </div>
                    <div className={styles.totalRow}>
                        <span className={styles.totalLabel}>合計収入</span>
                        <span className={styles.totalValue}>¥{totalIncome.toLocaleString()}</span>
                    </div>
                </section>

                {/* Allocation Section */}
                <section className={styles.section}>
                    <div className={styles.allocationHeader}>
                        <h2 className={styles.sectionTitleAmber}>予算振り分け</h2>
                        <div
                            className={styles.remainingBadge}
                            style={{
                                backgroundColor: remaining < 0 ? 'rgba(239, 68, 68, 0.2)' : 'rgba(16, 185, 129, 0.2)',
                                color: remaining < 0 ? '#fca5a5' : '#6ee7b7'
                            }}
                        >
                            残り: ¥{remaining.toLocaleString()}
                        </div>
                    </div>

                    <div className={styles.allocationList}>
                        {categories.map(category => (
                            <div key={category.id} className={styles.allocationItem}>
                                <label className={styles.categoryLabel}>{category.name}</label>
                                <div className={styles.inputWrapper}>
                                    <span className={styles.currencySymbol}>¥</span>
                                    <input
                                        type="number"
                                        value={category.allocated || ''}
                                        onChange={(e) => handleCategoryChange(category.id, e.target.value)}
                                        className="input-field"
                                        style={{ paddingLeft: '2rem' }}
                                        placeholder="0"
                                    />
                                </div>
                            </div>
                        ))}
                    </div>

                    <div className={styles.newCategoryForm}>
                        <input
                            type="text"
                            value={newCategoryName}
                            onChange={(e) => setNewCategoryName(e.target.value)}
                            className="input-field"
                            placeholder="新しい項目名"
                        />
                        <button
                            onClick={handleAddCategory}
                            className={`btn-primary ${styles.addCategoryButton}`}
                        >
                            追加
                        </button>
                    </div>
                </section>

                <div className={styles.footer}>
                    <button
                        onClick={handleSave}
                        className={`btn-primary ${styles.saveButton}`}
                        disabled={saveStatus === 'saving'}
                    >
                        {saveStatus === 'saving' ? '保存中...' : saveStatus === 'success' ? '保存しました！' : '保存する'}
                    </button>
                </div>
            </div>
        </div>
    );
}
