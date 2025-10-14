'use client'

import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Camera } from 'lucide-react'
import { useProfile } from '@/hooks/useProfile'

export function SettingsPanel() {
  const { user, isEditing, setIsEditing, updating, updateProfile, updatePassword } = useProfile()

  const [profileData, setProfileData] = useState({
    username: user?.username || '',
    email: user?.email || '',
    phone: user?.phone || '',
  })

  const [passwordData, setPasswordData] = useState({
    currentPassword: '',
    newPassword: '',
    confirmPassword: '',
  })

  const handleSaveProfile = async () => {
    await updateProfile(profileData)
  }

  const handleUpdatePassword = async () => {
    if (passwordData.newPassword !== passwordData.confirmPassword) {
      return
    }
    const success = await updatePassword({
      currentPassword: passwordData.currentPassword,
      newPassword: passwordData.newPassword,
    })
    if (success) {
      setPasswordData({
        currentPassword: '',
        newPassword: '',
        confirmPassword: '',
      })
    }
  }

  if (!user) return null

  return (
    <div className="space-y-6 max-w-4xl">
      {/* 个人资料 */}
      <div className="bg-white/5 backdrop-blur-sm rounded-2xl p-6 border border-white/10">
        <div className="flex items-center justify-between mb-6">
          <h3 className="text-lg font-semibold text-white">个人资料</h3>
          {!isEditing ? (
            <Button onClick={() => setIsEditing(true)} className="bg-orange-500 hover:bg-orange-600">
              编辑
            </Button>
          ) : (
            <div className="flex gap-2">
              <Button
                onClick={() => setIsEditing(false)}
                variant="outline"
                className="bg-white/5 border-white/10 text-white"
              >
                取消
              </Button>
              <Button onClick={handleSaveProfile} disabled={updating} className="bg-orange-500 hover:bg-orange-600">
                {updating ? '保存中...' : '保存'}
              </Button>
            </div>
          )}
        </div>

        <div className="flex items-center gap-6 mb-6">
          <div className="relative">
            <img
              src={user.avatar || 'https://api.dicebear.com/7.x/avataaars/svg?seed=Felix'}
              alt="Avatar"
              className="w-20 h-20 rounded-full border-2 border-orange-400"
            />
            {isEditing && (
              <button className="absolute bottom-0 right-0 w-7 h-7 bg-orange-500 rounded-full flex items-center justify-center">
                <Camera className="w-4 h-4 text-white" />
              </button>
            )}
          </div>
          <div>
            <h4 className="text-lg font-semibold text-white">{user.username}</h4>
            <p className="text-white/60">{user.email}</p>
          </div>
        </div>

        <div className="space-y-4">
          <div>
            <label className="block text-sm text-white/80 mb-2">用户名</label>
            <Input
              value={profileData.username}
              onChange={(e) => setProfileData({ ...profileData, username: e.target.value })}
              disabled={!isEditing}
              className="bg-white/5 border-white/10 text-white"
            />
          </div>
          <div>
            <label className="block text-sm text-white/80 mb-2">邮箱</label>
            <Input
              value={profileData.email}
              onChange={(e) => setProfileData({ ...profileData, email: e.target.value })}
              disabled={!isEditing}
              className="bg-white/5 border-white/10 text-white"
            />
          </div>
          <div>
            <label className="block text-sm text-white/80 mb-2">手机号</label>
            <Input
              value={profileData.phone}
              onChange={(e) => setProfileData({ ...profileData, phone: e.target.value })}
              disabled={!isEditing}
              className="bg-white/5 border-white/10 text-white"
            />
          </div>
        </div>
      </div>

      {/* 安全设置 */}
      <div className="bg-white/5 backdrop-blur-sm rounded-2xl p-6 border border-white/10">
        <h3 className="text-lg font-semibold text-white mb-6">安全设置</h3>
        <div className="space-y-4">
          <div>
            <label className="block text-sm text-white/80 mb-2">当前密码</label>
            <Input
              type="password"
              placeholder="请输入当前密码"
              value={passwordData.currentPassword}
              onChange={(e) => setPasswordData({ ...passwordData, currentPassword: e.target.value })}
              className="bg-white/5 border-white/10 text-white"
            />
          </div>
          <div>
            <label className="block text-sm text-white/80 mb-2">新密码</label>
            <Input
              type="password"
              placeholder="请输入新密码"
              value={passwordData.newPassword}
              onChange={(e) => setPasswordData({ ...passwordData, newPassword: e.target.value })}
              className="bg-white/5 border-white/10 text-white"
            />
          </div>
          <div>
            <label className="block text-sm text-white/80 mb-2">确认新密码</label>
            <Input
              type="password"
              placeholder="请再次输入新密码"
              value={passwordData.confirmPassword}
              onChange={(e) => setPasswordData({ ...passwordData, confirmPassword: e.target.value })}
              className="bg-white/5 border-white/10 text-white"
            />
          </div>
          <Button
            onClick={handleUpdatePassword}
            disabled={updating}
            className="w-full bg-orange-500 hover:bg-orange-600"
          >
            {updating ? '修改中...' : '修改密码'}
          </Button>
        </div>
      </div>
    </div>
  )
}

