'use client';

import { useState, useEffect } from 'react';
import { loadData, AppData } from '@/lib/storage';
import Link from 'next/link';

import styles from './page.module.css';

export default function Dashboard() {
  const [data, setData] = useState<AppData | null>(null);

  useEffect(() => {
    setData(loadData());
  }, []);

  if (!data) return <div className={styles.container}>Loading...</div>;

  const totalIncome = data.incomes.reduce((sum, i) => sum + i.amount, 0);
  const totalSpent = data.categories.reduce((sum, c) => sum + c.spent, 0);
  const currentSavings = totalIncome - totalSpent;

  return (
    <div className={styles.container}>
      <header className={styles.header}>
        <h1 className={styles.title}>
          Antigravity Account Book
        </h1>
        <p className={styles.subtitle}>家計の状況を一目で確認</p>
      </header>

      <div style={{ maxWidth: '42rem', margin: '0 auto' }}>
        {/* Summary Cards */}
        <div className={styles.summaryGrid}>
          <div className={styles.summaryCard} style={{ borderLeftColor: '#0ea5e9' }}>
            <h3 className={styles.summaryLabel}>総収入</h3>
            <p className={styles.summaryValue}>¥{totalIncome.toLocaleString()}</p>
          </div>
          <div className={styles.summaryCard} style={{ borderLeftColor: '#f59e0b' }}>
            <h3 className={styles.summaryLabel}>総支出</h3>
            <p className={styles.summaryValue}>¥{totalSpent.toLocaleString()}</p>
          </div>
          <div className={styles.summaryCard} style={{ borderLeftColor: '#10b981' }}>
            <h3 className={styles.summaryLabel}>現在の残高</h3>
            <p className={styles.summaryValue} style={{ color: '#34d399' }}>¥{currentSavings.toLocaleString()}</p>
          </div>
        </div>

        {/* Navigation Grid */}
        <div className={styles.navGrid}>
          <Link href="/budget" className={styles.navItem}>
            <div>
              <h3 className={styles.navTitle} style={{ color: '#7dd3fc' }}>予算設定</h3>
              <p className={styles.navDesc}>収入の登録と予算の振り分けを行います</p>
            </div>
            <span className={styles.navIcon}>💰</span>
          </Link>

          <Link href="/transactions" className={styles.navItem}>
            <div>
              <h3 className={styles.navTitle} style={{ color: '#fcd34d' }}>取引履歴</h3>
              <p className={styles.navDesc}>日々の支出を記録・確認します</p>
            </div>
            <span className={styles.navIcon}>📝</span>
          </Link>

          <Link href="/simulation" className={styles.navItem}>
            <div>
              <h3 className={styles.navTitle} style={{ color: '#f9a8d4' }}>貯金シミュレーション</h3>
              <p className={styles.navDesc}>将来の貯金推移を予測します</p>
            </div>
            <span className={styles.navIcon}>📈</span>
          </Link>
        </div>

        {/* Recent Activity Preview */}
        <div className={styles.progressSection}>
          <h2 className={styles.progressTitle}>予算の状況</h2>
          <div>
            {data.categories.map(cat => {
              const percent = cat.allocated > 0 ? (cat.spent / cat.allocated) * 100 : 0;
              const isOver = cat.spent > cat.allocated;
              return (
                <div key={cat.id} className={styles.progressItem}>
                  <div className={styles.progressHeader}>
                    <span>{cat.name}</span>
                    <span style={{ color: isOver ? '#f87171' : '#94a3b8' }}>
                      ¥{cat.spent.toLocaleString()} / ¥{cat.allocated.toLocaleString()}
                    </span>
                  </div>
                  <div className={styles.progressBarBg}>
                    <div
                      className={styles.progressBarFill}
                      style={{
                        width: `${Math.min(percent, 100)}%`,
                        backgroundColor: isOver ? '#ef4444' : '#0ea5e9'
                      }}
                    />
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
}
