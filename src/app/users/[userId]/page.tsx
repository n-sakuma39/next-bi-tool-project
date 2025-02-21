'use client'

import '@/app/common.css'
import Button from '@/components/elements/button'
import { JOB_NAME_MAP } from '@/constants/maps'
import type { Task, UserDetails } from '@/types/type'
import Image from 'next/image'
import { useParams } from 'next/navigation'
import { useEffect, useState } from 'react'
import styles from './styles.module.css'
import Loading from '@/components/elements/loading'
import { UserChart } from '@/components/chart/UserChart'

const UserDetailsPage = () => {
  const params = useParams()
  const [user, setUser] = useState<UserDetails | null>(null)
  const [userTasks, setUserTasks] = useState<Task[]>([])
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    const fetchData = async () => {
      try {
        const userResponse = await fetch(`${process.env.NEXT_PUBLIC_API_ENDPOINT}/user/${params.userId}`)
        const userData: UserDetails = await userResponse.json()
        setUser(userData)

        if (userData.taskIds && userData.taskIds.length > 0) {
          const tasksResponse = await fetch(`${process.env.NEXT_PUBLIC_API_ENDPOINT}/task`, {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
            },
            body: JSON.stringify({
              userId: params.userId,
              taskIds: userData.taskIds,
            }),
          })
          const tasksData = await tasksResponse.json()
          setUserTasks(tasksData.tasks)
        }
      } catch (error) {
        console.error('Error fetching data:', error)
      } finally {
        setIsLoading(false)
      }
    }

    if (params.userId) {
      fetchData()
    }
  }, [params.userId])

  const totalOccupancyRate = userTasks.reduce((sum, task) => sum + (task.occupancyRate ?? 0), 0)

  if (isLoading) {
    return <Loading />
  }

  if (!user) {
    return (
      <main>
        <div>ユーザーが見つかりません</div>
        <Button />
      </main>
    )
  }

  return (
    <main>
      <div className={styles.container}>
        <h1 className={styles.userName}>{user.username}</h1>
        <div className={styles.content}>
          <div className={styles.imageContainer}>
            <Image
              src={user.avatar || '/default-avatar.png'}
              alt={user.username || 'User avatar'}
              width={300}
              height={300}
              className={styles.image}
            />
          </div>
          <div className={styles.details}>
            <div className={styles.info}>
              <p>{JOB_NAME_MAP[user.job as keyof typeof JOB_NAME_MAP]}</p>
              <p>説明: {user.description}</p>
            </div>
          </div>
        </div>

        <UserChart 
          userTasks={userTasks}
          totalOccupancyRate={totalOccupancyRate}
        />
      </div>
      <Button />
    </main>
  )
}

export default UserDetailsPage
