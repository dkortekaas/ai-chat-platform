'use client'

import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'

export function ChangePasswordTab() {
  const [newPassword, setNewPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')
  const [currentPassword, setCurrentPassword] = useState('')

  const handleChangePassword = () => {
    // Handle password change logic here
    console.log('Changing password:', { newPassword, confirmPassword, currentPassword })
  }

  return (
    <div className="max-w-md space-y-6">
      <div>
        <h2 className="text-lg font-medium text-gray-900 mb-6">Change Password</h2>
        
        <div className="space-y-4">
          <div>
            <Label htmlFor="newPassword" className="text-sm font-medium text-gray-700">
              New password *
            </Label>
            <Input
              id="newPassword"
              type="password"
              value={newPassword}
              onChange={(e) => setNewPassword(e.target.value)}
              className="mt-1"
            />
          </div>
          
          <div>
            <Label htmlFor="confirmPassword" className="text-sm font-medium text-gray-700">
              Confirm new password
            </Label>
            <Input
              id="confirmPassword"
              type="password"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              className="mt-1"
            />
          </div>
          
          <div>
            <Label htmlFor="currentPassword" className="text-sm font-medium text-gray-700">
              Current password
            </Label>
            <Input
              id="currentPassword"
              type="password"
              value={currentPassword}
              onChange={(e) => setCurrentPassword(e.target.value)}
              className="mt-1"
            />
          </div>
        </div>
        
        <div className="pt-4">
          <Button 
            onClick={handleChangePassword}
            className="bg-white border border-gray-300 text-gray-700 hover:bg-gray-50"
          >
            Change Password
          </Button>
        </div>
      </div>
    </div>
  )
}
