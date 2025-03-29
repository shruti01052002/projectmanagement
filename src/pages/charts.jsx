'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/router';
import { auth } from '../services/firebase';
import { signOut } from 'firebase/auth';
import styles from './charts.module.css';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
  Filler
} from 'chart.js';
import { Line } from 'react-chartjs-2';
import withAuth from '../components/withAuth';
import Navbar from '../components/Navbar';

// Register ChartJS components
ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
  Filler
);

// Sample data for the chart
const projectProgress = {
  labels: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun'],
  datasets: [
    {
      label: 'Smart City Development',
      data: [10, 25, 35, 45, 55, 65],
      borderColor: '#3b82f6',
      backgroundColor: 'rgba(59, 130, 246, 0.1)',
      fill: true,
      tension: 0.4
    },
    {
      label: 'Green Energy Park',
      data: [5, 10, 15, 20, 22, 25],
      borderColor: '#10b981',
      backgroundColor: 'rgba(16, 185, 129, 0.1)',
      fill: true,
      tension: 0.4
    },
    {
      label: 'Harbor Bridge Renovation',
      data: [30, 45, 65, 80, 90, 100],
      borderColor: '#6366f1',
      backgroundColor: 'rgba(99, 102, 241, 0.1)',
      fill: true,
      tension: 0.4
    }
  ]
};

const options = {
  responsive: true,
  maintainAspectRatio: false,
  plugins: {
    legend: {
      position: 'top',
    },
    title: {
      display: true,
      text: 'Project Progress Over Time',
      font: {
        size: 16,
        weight: 'bold'
      }
    }
  },
  scales: {
    y: {
      beginAtZero: true,
      max: 100,
      title: {
        display: true,
        text: 'Completion (%)'
      }
    },
    x: {
      title: {
        display: true,
        text: 'Month'
      }
    }
  }
};

function Charts() {
  const [mounted, setMounted] = useState(false);
  const router = useRouter();

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) {
    return null;
  }

  return (
    <div className={styles.container}>
      <Navbar title="Project Analytics" />

      <div className={styles.content}>
        <div className={styles.chartCard}>
          <div className={styles.chartContainer}>
            <Line data={projectProgress} options={options} />
          </div>
        </div>

        <div className={styles.statsGrid}>
          <div className={styles.statCard}>
            <h3>Total Projects</h3>
            <p className={styles.statValue}>3</p>
            <span className={styles.statLabel}>Active Projects</span>
          </div>
          <div className={styles.statCard}>
            <h3>Average Progress</h3>
            <p className={styles.statValue}>63%</p>
            <span className={styles.statLabel}>Completion Rate</span>
          </div>
          <div className={styles.statCard}>
            <h3>Completed Tasks</h3>
            <p className={styles.statValue}>45</p>
            <span className={styles.statLabel}>This Month</span>
          </div>
        </div>
      </div>
    </div>
  );
}

export default withAuth(Charts); 