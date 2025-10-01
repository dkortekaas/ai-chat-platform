'use client'

import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'

export function EmailSettingsTab() {
  const [newEmail, setNewEmail] = useState('dennis@psinfoodservice.com')
  const [currentPassword, setCurrentPassword] = useState('')

  const handleChangeEmail = () => {
    // Handle email change logic here
    console.log('Changing email:', { newEmail, currentPassword })
  }

  return (
    <div className="max-w-md space-y-6">
      <div>
        <h2 className="text-lg font-medium text-gray-900 mb-6">Email Settings</h2>
        
        <div className="space-y-4">
          <div>
            <Label htmlFor="newEmail" className="text-sm font-medium text-gray-700">
              New Email *
            </Label>
            <Input
              id="newEmail"
              type="email"
              value={newEmail}
              onChange={(e) => setNewEmail(e.target.value)}
              className="mt-1"
            />
          </div>
          
          <div>
            <Label htmlFor="currentPassword" className="text-sm font-medium text-gray-700">
              Current password *
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
            onClick={handleChangeEmail}
            className="bg-white border border-gray-300 text-gray-700 hover:bg-gray-50"
          >
            Change Email
          </Button>
        </div>
      </div>
    </div>
  )
}
