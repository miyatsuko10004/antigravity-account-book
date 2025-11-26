'use client';

import { useState, useEffect } from 'react';
import { loadData, addTransaction, AppData, Transaction, BudgetCategory } from '@/lib/storage';
import Link from 'next/link';
import styles from './page.module.css';

export default function TransactionsPage() {
    const [data, setData] = useState<AppData | null>(null);
    const [amount, setAmount] = useState('');
    const [description, setDescription] = useState('');
    const [date, setDate] = useState(new Date().toISOString().split('T')[0]);
    const [categoryId, setCategoryId] = useState('');

    useEffect(() => {
        const loadedData = loadData();
        setData(loadedData);
        if (loadedData.categories.length > 0) {
            setCategoryId(loadedData.categories[0].id);
        }
    }, []);

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (!amount || !categoryId) return;

        addTransaction({
            amount: Number(amount),
            description,
            date,
            categoryId,
        });

        // Reload data to reflect changes
        setData(loadData());

        // Reset form
        setAmount('');
        setDescription('');
        alert('取引を登録しました');
    };

    if (!data) return <div className={styles.container}>Loading...</div>;

    const selectedCategory = data.categories.find(c => c.id === categoryId);
    const remaining = selectedCategory ? selectedCategory.allocated - selectedCategory.spent : 0;

    return (
        <div className={styles.container}>
            <header className={styles.header}>
                <h1 className={styles.title}>
                    取引履歴
                </h1>
                <Link href="/" className={styles.backLink}>
                    ← 戻る
                </Link>
            </header>

            <div className={styles.content}>
                {/* Add Transaction Form */}
                <section className={styles.section}>
                    <h2 className={styles.sectionTitle}>支出を記録</h2>
                    <form onSubmit={handleSubmit} className={styles.form}>
                        <div>
                            <label className={styles.label}>日付</label>
                            <input
                                type="date"
                                value={date}
                                onChange={(e) => setDate(e.target.value)}
                                className="input-field"
                                required
                            />
                        </div>

                        <div>
                            <label className={styles.label}>カテゴリー</label>
                            <select
                                value={categoryId}
                                onChange={(e) => setCategoryId(e.target.value)}
                                className="input-field"
                            >
                                {data.categories.map(c => (
                                    <option key={c.id} value={c.id}>
                                        {c.name} (残り: ¥{(c.allocated - c.spent).toLocaleString()})
                                    </option>
                                ))}
                            </select>
                        </div>

                        <div>
                            <label className={styles.label}>金額</label>
                            <div className={styles.inputWrapper}>
                                <span className={styles.currencySymbol}>¥</span>
                                <input
                                    type="number"
                                    value={amount}
                                    onChange={(e) => setAmount(e.target.value)}
                                    className="input-field"
                                    style={{ paddingLeft: '2rem' }}
                                    placeholder="0"
                                    required
                                />
                            </div>
                            {selectedCategory && (
                                <p
                                    className={styles.balanceText}
                                    style={{ color: remaining < Number(amount) ? '#f87171' : '#64748b' }}
                                >
                                    カテゴリー残高: ¥{remaining.toLocaleString()}
                                </p>
                            )}
                        </div>

                        <div>
                            <label className={styles.label}>内容（任意）</label>
                            <input
                                type="text"
                                value={description}
                                onChange={(e) => setDescription(e.target.value)}
                                className="input-field"
                                placeholder="例: スーパーでの買い物"
                            />
                        </div>

                        <button type="submit" className={`btn-primary ${styles.submitButton}`}>
                            登録する
                        </button>
                    </form>
                </section>

                {/* Recent Transactions List */}
                <section>
                    <h2 className={styles.sectionTitleSlate}>最近の履歴</h2>
                    <div className={styles.transactionList}>
                        {data.transactions.length === 0 ? (
                            <p className={styles.emptyState}>履歴はまだありません</p>
                        ) : (
                            [...data.transactions].reverse().map(tx => {
                                const category = data.categories.find(c => c.id === tx.categoryId);
                                return (
                                    <div key={tx.id} className={styles.transactionItem}>
                                        <div>
                                            <div className={styles.txMeta}>
                                                <span className={styles.txDate}>{tx.date}</span>
                                                <span className={styles.txCategory}>
                                                    {category?.name || '不明'}
                                                </span>
                                            </div>
                                            <p className={styles.txDesc}>{tx.description || '使途不明金'}</p>
                                        </div>
                                        <span className={styles.txAmount}>
                                            -¥{tx.amount.toLocaleString()}
                                        </span>
                                    </div>
                                );
                            })
                        )}
                    </div>
                </section>
            </div>
        </div>
    );
}
