'use client'

import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'

export function PersonalDetailsTab() {
  const [firstName, setFirstName] = useState('Dennis')
  const [lastName, setLastName] = useState('Kortekaas')

  const handleSave = () => {
    // Handle save logic here
    console.log('Saving personal details:', { firstName, lastName })
  }

  return (
    <div className="max-w-md space-y-6">
      <div>
        <h2 className="text-lg font-medium text-gray-900 mb-6">Personal Details</h2>
        
        <div className="space-y-4">
          <div>
            <Label htmlFor="firstName" className="text-sm font-medium text-gray-700">
              First Name *
            </Label>
            <Input
              id="firstName"
              type="text"
              value={firstName}
              onChange={(e) => setFirstName(e.target.value)}
              className="mt-1"
            />
          </div>
          
          <div>
            <Label htmlFor="lastName" className="text-sm font-medium text-gray-700">
              Last Name *
            </Label>
            <Input
              id="lastName"
              type="text"
              value={lastName}
              onChange={(e) => setLastName(e.target.value)}
              className="mt-1"
            />
          </div>
        </div>
        
        <div className="pt-4">
          <Button 
            onClick={handleSave}
            className="bg-white border border-gray-300 text-gray-700 hover:bg-gray-50"
          >
            Save
          </Button>
        </div>
      </div>
    </div>
  )
}
