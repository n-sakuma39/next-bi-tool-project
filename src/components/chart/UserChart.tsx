import { BarElement, CategoryScale, Chart as ChartJS, Legend, LinearScale, SubTitle, TimeScale, Title, Tooltip } from 'chart.js'
import type { ChartOptions } from 'chart.js'
import 'chartjs-adapter-date-fns'
import { PRIORITY_MAP, STATUS_MAP } from '@/constants/maps'
import type { Task } from '@/types/type'
import annotationPlugin from 'chartjs-plugin-annotation'
import { Bar } from 'react-chartjs-2'
import styles from './UserChart.module.css'

ChartJS.register(CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend, TimeScale, annotationPlugin, SubTitle)

type UserChartProps = {
  userTasks: Task[]
  totalOccupancyRate: number
}

export const UserChart = ({ userTasks, totalOccupancyRate }: UserChartProps) => {
  const data = {
    labels: ['案件一覧'],
    datasets: userTasks.map((task, index) => ({
      label: task.name,
      data: [task.occupancyRate ?? 0],
      backgroundColor: [
        'rgba(144, 238, 144, 0.5)', // 薄い緑
        'rgba(255, 228, 181, 0.5)', // 薄い橙
        'rgba(255, 182, 193, 0.5)', // 薄い赤
        'rgba(173, 216, 230, 0.5)', // 薄い青
      ][index % 4],
      borderColor: ['rgba(144, 238, 144, 1)', 'rgba(255, 228, 181, 1)', 'rgba(255, 182, 193, 1)', 'rgba(173, 216, 230, 1)'][index % 4],
      borderWidth: 1,
      barPercentage: 0.85,
      categoryPercentage: 0.85,
    })),
  }

  const options: ChartOptions<'bar'> = {
    indexAxis: 'y',
    responsive: true,
    maintainAspectRatio: false,
    animation: {
      duration: 0,
    },
    plugins: {
      legend: {
        display: false,
      },
      title: {
        display: false,
      },
      subtitle: {
        display: false,
      },
      annotation: {
        annotations: {
          threshold: {
            type: 'line' as const,
            scaleID: 'x',
            value: 100,
            borderColor: totalOccupancyRate > 100 ? 'rgba(255, 0, 0, 0.5)' : 'rgba(0, 0, 0, 0.5)',
            borderWidth: 2,
            label: {
              display: true,
              content: '100%',
              backgroundColor: totalOccupancyRate > 100 ? '#ff0000' : '#000000',
              color: 'white',
              padding: 4,
              position: 'start' as const,
            },
            drawTime: 'beforeDatasetsDraw' as const,
          },
        },
      },
      tooltip: {
        enabled: true,
        mode: 'nearest',
        intersect: true,
        padding: {
          top: 10,
          right: 15,
          bottom: 10,
          left: 15,
        },
        bodySpacing: 3,
        callbacks: {
          title: () => '',
          label: (context) => {
            if (!context.raw) return ''

            const task = userTasks[context.datasetIndex]
            if (!task) return 'データなし'

            return [
              `${task.name}`,
              `優先度: ${PRIORITY_MAP[task.priority as keyof typeof PRIORITY_MAP]}`,
              `状態: ${STATUS_MAP[task.status as keyof typeof STATUS_MAP]}`,
              `開始日: ${new Date(task.startDate).toLocaleDateString('ja-JP')}　終了日: ${new Date(task.endDate).toLocaleDateString('ja-JP')}`,
            ]
          },
        },
        backgroundColor: 'rgba(0, 0, 0, 0.7)',
        position: 'nearest',
        displayColors: false,
      },
    },
    scales: {
      x: {
        stacked: true,
        beginAtZero: true,
        max: 120,
        ticks: {
          stepSize: 20,
          callback: (value) => `${value}%`,
        },
      },
      y: {
        stacked: true,
        ticks: {
          display: false,
        },
        grid: {
          display: false,
        },
      },
    },
  }

  return (
    <div className={styles.chartContainer}>
      {userTasks.length > 0 ? (
        <>
          <h2 className={styles.title}>➖ 割り当てられた案件一覧</h2>
          <p className={styles.subtitle}>
            割り当てられた案件の稼働率の合計：
            <span style={{ color: totalOccupancyRate > 100 ? '#ff0000' : 'inherit' }}>
              {totalOccupancyRate.toFixed(1)}%
            </span>
          </p>
          <div className={styles.chartWrapper}>
            <Bar data={data} options={options} />
          </div>
        </>
      ) : (
        <div className={styles.noTasksMessage}>
          <h2 className={styles.title}>➖ 割り当てられた案件一覧</h2>
          <p>まだ割り当てられた案件はありません</p>
        </div>
      )}
    </div>
  )
}
