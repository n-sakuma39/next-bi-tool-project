'use client'

import Link from 'next/link'
import { IoReload } from 'react-icons/io5'
import { Navigation } from 'swiper/modules'
import { Swiper, SwiperSlide } from 'swiper/react'
import { JOB_NAME_MAP } from '@/constants/maps'
import type { UserListProps } from '@/types/type'
import styles from './styles.module.css'
import 'swiper/css'
import 'swiper/css/navigation'
import '@/app/swiperCustom.css'

export function UserList({ users, selectedJob, onJobSelect, onReset }: UserListProps) {
  const filteredUsers = selectedJob 
    ? users.filter((user) => JOB_NAME_MAP[user.job as keyof typeof JOB_NAME_MAP] === selectedJob) 
    : users

  return (
    <>
      <div className={styles.usersFilterBox}>
        <div className={styles.useSelect}>
          <ul>
            <li>
              <span
                role="button"
                onClick={() => onJobSelect(null)}
                onKeyDown={(e) => e.key === 'Enter' && onJobSelect(null)}
                tabIndex={0}
                className={selectedJob === null ? styles.active : ''}
              >
                すべて
              </span>
            </li>
            {Object.values(JOB_NAME_MAP).map((jobName) => (
              <li key={jobName}>
                <span
                  role="button"
                  onClick={() => onJobSelect(jobName)}
                  onKeyDown={(e) => e.key === 'Enter' && onJobSelect(jobName)}
                  tabIndex={0}
                  className={selectedJob === jobName ? styles.active : ''}
                >
                  {jobName}
                </span>
              </li>
            ))}
            <li>
              <span
                role="button"
                onClick={onReset}
                onKeyDown={(e) => e.key === 'Enter' && onReset()}
                tabIndex={0}
              >
                <IoReload className={styles.reloadIcon} />
              </span>
            </li>
          </ul>
        </div>
      </div>

      <Swiper
        modules={[Navigation]}
        spaceBetween={20}
        slidesPerView={4}
        navigation
        className={styles.swiper}
      >
        {filteredUsers.map((user) => (
          <SwiperSlide key={user.id}>
            <Link
              href={`/users/${user.id}`}
              className={styles.userItem}
            >
              <img
                src={user.avatar}
                alt={user.username}
                width={180}
                height={180}
              />
              <div>
                <span>{user.username}</span>
                <span>{JOB_NAME_MAP[user.job as keyof typeof JOB_NAME_MAP]}</span>
              </div>
            </Link>
          </SwiperSlide>
        ))}
      </Swiper>
    </>
  )
}
