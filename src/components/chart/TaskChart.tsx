import { BarElement, CategoryScale, Chart as ChartJS, Legend, LinearScale, TimeScale, Title, Tooltip } from 'chart.js'
import type { ChartOptions, ChartData, TooltipModel } from 'chart.js'
import 'chartjs-adapter-date-fns'
import { JOB_NAME_MAP, STATUS_MAP } from '@/constants/maps'
import type { Task, User, Assignment } from '@/types/type'
import annotationPlugin from 'chartjs-plugin-annotation'
import { ja } from 'date-fns/locale'
import { Bar } from 'react-chartjs-2'
import styles from './TaskChart.module.css'
import { useEffect, useRef, useState, useCallback } from 'react'
import { faker } from '@faker-js/faker/locale/ja'
import Image from 'next/image'

ChartJS.register(CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend, TimeScale, annotationPlugin)

type TaskChartProps = {
  task: Task
  users: User[]
}

type ChartDataPoint = {
  x: [Date, Date];
  y: string;
  assignment: Assignment & {
    userId: string;
  };
};

interface TooltipData {
  x: number;
  y: number;
  user: {
    id: string;
    username: string;
    avatar: string;
  } | null;
  assignment: Assignment;
}

interface TooltipContext {
  chart: ChartJS;
  tooltip: TooltipModel<"bar">;
}

export const TaskChart = ({ task, users }: TaskChartProps) => {
  const chartRef = useRef<ChartJS<"bar", ChartDataPoint[], unknown>>();
  const [tooltipVisible, setTooltipVisible] = useState(false);
  const [tooltipData, setTooltipData] = useState<TooltipData>({
    x: 0,
    y: 0,
    user: null,
    assignment: {} as Assignment
  });

  // ダミーユーザーデータを生成する関数
  const generateDummyUser = useCallback(() => ({
    id: faker.string.uuid(),
    username: faker.person.fullName(),
    avatar: faker.image.urlLoremFlickr({ category: 'people' })
  }), []);

  const data = {
    labels: task?.assignments?.map((a) => a.assignmentName) || [],
    datasets: [
      {
        label: STATUS_MAP.waiting,
        data: task?.assignments
          ?.filter((a) => a.status === 'waiting')
          .map((a) => ({
            x: [new Date(a.startDate), new Date(a.endDate)],
            y: a.assignmentName,
            assignment: a,
          })) || [],
        backgroundColor: 'rgba(135, 206, 235, 0.5)',
        borderColor: 'rgba(135, 206, 235, 1)',
        borderWidth: 1,
        barThickness: 65,
        minBarLength: 10,
        barPercentage: 1.0,
        categoryPercentage: 1.0,
      },
      {
        label: STATUS_MAP.processing,
        data: task?.assignments
          ?.filter((a) => a.status === 'processing')
          .map((a) => ({
            x: [new Date(a.startDate), new Date(a.endDate)],
            y: a.assignmentName,
            assignment: a,
          })) || [],
        backgroundColor: 'rgba(144, 238, 144, 0.5)',
        borderColor: 'rgba(144, 238, 144, 1)',
        borderWidth: 1,
        barThickness: 65,
        minBarLength: 10,
        barPercentage: 1.0,
        categoryPercentage: 1.0,
      },
      {
        label: STATUS_MAP.completed,
        data: task?.assignments
          ?.filter((a) => a.status === 'completed')
          .map((a) => ({
            x: [new Date(a.startDate), new Date(a.endDate)],
            y: a.assignmentName,
            assignment: a,
          })) || [],
        backgroundColor: 'rgba(255, 0, 0, 0.5)',
        borderColor: 'rgba(255, 0, 0, 1)',
        borderWidth: 1,
        barThickness: 65,
        minBarLength: 10,
        barPercentage: 1.0,
        categoryPercentage: 1.0,
      },
      {
        label: STATUS_MAP.done,
        data: task?.assignments
          ?.filter((a) => a.status === 'done')
          .map((a) => ({
            x: [new Date(a.startDate), new Date(a.endDate)],
            y: a.assignmentName,
            assignment: a,
          })) || [],
        backgroundColor: 'rgba(144, 238, 144, 0.8)',
        borderColor: 'rgba(144, 238, 144, 1)',
        borderWidth: 1,
        barThickness: 65,
        minBarLength: 40,
        barPercentage: 1.0,
        categoryPercentage: 1.0,
      },
    ],
  }

  const options: ChartOptions<'bar'> = {
    indexAxis: 'y',
    responsive: true,
    maintainAspectRatio: false,
    animation: {
      duration: 0,
    },
    layout: {
      padding: {
        left: 0,
        right: 20,
        top: 20,
        bottom: 60,
      },
    },
    plugins: {
      title: {
        display: true,
        text: '➖ 子課題一覧',
        font: {
          size: 19,
          weight: 'bold',
        },
        padding: {
          bottom: 25,
        },
        align: 'start',
      },
      legend: {
        position: 'bottom',
        align: 'start',
        labels: {
          padding: 30,
          boxWidth: 15,
          boxHeight: 15,
          generateLabels: (chart) => {
            const labels = ChartJS.defaults.plugins.legend.labels.generateLabels(chart)
            if (labels.length > 0) {
              labels[0].lineWidth = 0
            }
            return labels
          },
        },
      },
      annotation: {
        annotations: {
          today: {
            type: 'line' as const,
            scaleID: 'x',
            value: new Date().getTime(),
            borderColor: 'rgba(0, 0, 0, 0.5)',
            borderWidth: 1,
            label: {
              display: true,
              content: 'Today',
              backgroundColor: 'black',
              color: 'white',
              padding: 4,
              position: 'start' as const,
            },
            drawTime: 'beforeDatasetsDraw' as const,
          },
        },
      },
      tooltip: {
        enabled: false,
        external: useCallback((context: TooltipContext) => {
          const { chart, tooltip } = context;
          
          if (tooltip.opacity === 0) {
            if (tooltipVisible) {
              setTooltipVisible(false);
            }
            return;
          }

          const position = chart.canvas.getBoundingClientRect();
          const dataPoint = tooltip.dataPoints[0].raw as ChartDataPoint;
          
          // 現在のtooltipDataと新しいデータを比較
          const newX = position.left + tooltip.caretX;
          const newY = position.top + tooltip.caretY;
          
          if (
            !tooltipVisible || 
            tooltipData.x !== newX || 
            tooltipData.y !== newY || 
            tooltipData.assignment !== dataPoint.assignment
          ) {
            setTooltipData({
              x: newX,
              y: newY,
              user: generateDummyUser(),
              assignment: dataPoint.assignment
            });
            setTooltipVisible(true);
          }
        }, [tooltipVisible, tooltipData, generateDummyUser])
      },
    },
    scales: {
      y: {
        beginAtZero: true,
        offset: true,
        position: 'left',
        ticks: {
          callback: (value: string | number, index: number) => {
            const assignment = task?.assignments?.[index]
            return assignment?.assignmentName || ''
          },
          color: '#000000',
          font: {
            size: 14,
            weight: 'normal',
          },
          padding: 25,
          align: 'center',
          crossAlign: 'center',
        },
        grid: {
          display: true,
          drawTicks: false,
          lineWidth: 1,
          color: 'rgba(0, 0, 0, 0.1)',
          z: -1,
        },
        border: {
          display: true,
          color: 'rgba(0, 0, 0, 0.1)',
          width: 1,
          dash: [0],
        },
        afterFit: (scale) => {
          scale.width = 150
        },
        min: -0.5,
        max: (task?.assignments?.length || 1) - 0.5,
        stacked: true,
      },
      x: {
        position: 'top',
        type: 'time',
        time: {
          unit: 'day',
          displayFormats: {
            day: 'MM/dd',
          },
          tooltipFormat: 'yyyy/MM/dd',
        },
        adapters: {
          date: {
            locale: ja,
          },
        },
        min: task ? new Date(task.startDate).getTime() - 3 * 24 * 60 * 60 * 1000 : undefined,
        max: task ? new Date(task.endDate).getTime() + 3 * 24 * 60 * 60 * 1000 : undefined,
        ticks: {
          source: 'auto',
          autoSkip: false,
          maxRotation: 0,
          align: 'center',
        },
        grid: {
          display: true,
          drawTicks: true,
          lineWidth: 1,
          color: 'rgba(0, 0, 0, 0.1)',
          z: -1,
          offset: false,
          drawOnChartArea: true,
        },
        border: {
          display: true,
          color: 'rgba(0, 0, 0, 0.1)',
          width: 1,
          dash: [0],
        },
        offset: false,
        bounds: 'ticks',
      },
    },
    datasets: {
      bar: {
        barThickness: 15,
        barPercentage: 0.5,
        categoryPercentage: 0.8,
      }
    },
  }

  return (
    <div className={styles.chartContainer}>
      {task.assignments && task.assignments.length > 0 ? (
        <>
          <Bar ref={chartRef} data={data} options={options} />
        </>
      ) : (
        <>
          <h2 className={styles.chartTitle}>➖ 子課題一覧</h2>
          <p className={styles.noAssignments}>子課題はありません</p>
        </>
      )}
      
      {tooltipVisible && tooltipData.assignment && (
        <div 
          className={styles.tooltip}
          style={{
            left: `${tooltipData.x}px`,
            top: `${tooltipData.y}px`,
            transform: 'translate(-50%, -100%)'
          }}
        >
          <div className={styles.tooltipContent}>
            <div className={styles.tooltipHeader}>
              {tooltipData.user && (
                <>
                  <div className={styles.userAvatar}>
                    <Image
                      src={tooltipData.user.avatar || '/images/default-avatar.png'}
                      alt={`${tooltipData.user.username}のアバター`}
                      width={30}
                      height={30}
                      className={styles.avatar}
                    />
                  </div>
                  <span className={styles.tooltipUsername}>
                    {tooltipData.user.username}
                  </span>
                </>
              )}
            </div>
            <div className={styles.tooltipDetails}>
              <p className={styles.tooltipDetail}>
                職種: {JOB_NAME_MAP[tooltipData.assignment.jobType as keyof typeof JOB_NAME_MAP]}
              </p>
              <p className={styles.tooltipDetail}>
                状態: {STATUS_MAP[tooltipData.assignment.status as keyof typeof STATUS_MAP]}
              </p>
              <p className={styles.tooltipDetail}>
                開始日: {new Date(tooltipData.assignment.startDate).toLocaleDateString('ja-JP')}
                　期限日: {new Date(tooltipData.assignment.endDate).toLocaleDateString('ja-JP')}
              </p>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
