'use client'

import { useState } from 'react'
import { userApi } from '@/lib/api'
import { toast } from 'sonner'
import { useAuth } from '@/components/providers/auth-provider'

/**
 * 个人资料管理 Hook
 */
export function useProfile() {
  const { user, refreshUser } = useAuth()
  const [isEditing, setIsEditing] = useState(false)
  const [updating, setUpdating] = useState(false)

  const updateProfile = async (data: {
    username?: string
    email?: string
    phone?: string
    avatar?: string
  }) => {
    setUpdating(true)
    try {
      await userApi.updateProfile(data)
      toast.success('个人资料更新成功')
      // 刷新用户信息
      await refreshUser()
      setIsEditing(false)
      return true
    } catch (error) {
      console.error('更新失败:', error)
      return false
    } finally {
      setUpdating(false)
    }
  }

  const updatePassword = async (data: {
    currentPassword: string
    newPassword: string
  }) => {
    setUpdating(true)
    try {
      await userApi.updatePassword(data)
      toast.success('密码修改成功')
      return true
    } catch (error) {
      console.error('密码修改失败:', error)
      return false
    } finally {
      setUpdating(false)
    }
  }

  return {
    user,
    isEditing,
    setIsEditing,
    updating,
    updateProfile,
    updatePassword,
  }
}

