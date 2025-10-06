'use client'

import { useState, useEffect } from 'react'
import { Card, CardContent } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table'
import { 
  Dialog, 
  DialogContent, 
  DialogDescription, 
  DialogFooter, 
  DialogHeader, 
  DialogTitle 
} from '@/components/ui/dialog'
import { 
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { 
  Edit, 
  Trash2, 
  Loader2, 
  Users,
  UserPlus,
  Shield,
  User,
  Crown
} from 'lucide-react'
import SaveButton from '@/components/ui/save-button'
import { useToast } from '@/hooks/use-toast'
import { useSession } from 'next-auth/react'
import { useRouter } from 'next/navigation'

interface User {
  id: string
  name: string
  email: string
  role: 'SUPERUSER' | 'ADMIN' | 'USER'
  createdAt: string
  updatedAt: string
  _count: {
    assistants: number
    createdNotifications: number
  }
}

const roleColors = {
  SUPERUSER: 'bg-purple-100 text-purple-800 border-purple-200',
  ADMIN: 'bg-blue-100 text-blue-800 border-blue-200',
  USER: 'bg-gray-100 text-gray-800 border-gray-200'
}

const roleIcons = {
  SUPERUSER: Crown,
  ADMIN: Shield,
  USER: User
}

export default function AdminUsersPage() {
  const [users, setUsers] = useState<User[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [isDialogOpen, setIsDialogOpen] = useState(false)
  const [editingUser, setEditingUser] = useState<User | null>(null)
  const [isSaving, setIsSaving] = useState(false)
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    role: 'USER' as 'SUPERUSER' | 'ADMIN' | 'USER'
  })
  
  const { toast } = useToast()
  const { data: session } = useSession()
  const router = useRouter()

  const fetchUsers = async () => {
    try {
      setIsLoading(true)
      const response = await fetch('/api/admin/users')
      if (response.ok) {
        const data = await response.json()
        setUsers(data.users)
      } else {
        toast({
          title: "Error",
          description: "Failed to fetch users",
          variant: "destructive"
        })
      }
    } catch (error) {
      console.error('Error fetching users:', error)
      toast({
        title: "Error",
        description: "Failed to fetch users",
        variant: "destructive"
      })
    } finally {
      setIsLoading(false)
    }
  }

 

  const handleAddUser = () => {
    setEditingUser(null)
    setFormData({
      name: '',
      email: '',
      password: '',
      role: 'USER'
    })
    setIsDialogOpen(true)
  }

  const handleEditUser = (user: User) => {
    setEditingUser(user)
    setFormData({
      name: user.name,
      email: user.email,
      password: '',
      role: user.role
    })
    setIsDialogOpen(true)
  }

  const handleSaveUser = async () => {
    if (!formData.name.trim() || !formData.email.trim()) {
      toast({
        title: "Error",
        description: "Name and email are required",
        variant: "destructive"
      })
      return
    }

    if (!editingUser && !formData.password.trim()) {
      toast({
        title: "Error",
        description: "Password is required for new users",
        variant: "destructive"
      })
      return
    }

    setIsSaving(true)
    try {
      const url = editingUser 
        ? `/api/admin/users/${editingUser.id}`
        : '/api/admin/users'
      
      const method = editingUser ? 'PUT' : 'POST'
      
      const response = await fetch(url, {
        method,
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          ...formData,
          ...(editingUser && !formData.password.trim() && { password: undefined })
        })
      })

      if (response.ok) {
        toast({
          title: "Success",
          description: `User ${editingUser ? 'updated' : 'created'} successfully`,
        })
        setIsDialogOpen(false)
        fetchUsers()
      } else {
        const error = await response.json()
        toast({
          title: "Error",
          description: error.error || `Failed to ${editingUser ? 'update' : 'create'} user`,
          variant: "destructive"
        })
      }
    } catch (error) {
      console.error('Error saving user:', error)
      toast({
        title: "Error",
        description: `Failed to ${editingUser ? 'update' : 'create'} user`,
        variant: "destructive"
      })
    } finally {
      setIsSaving(false)
    }
  }

  const handleDeleteUser = async (id: string) => {
    if (!confirm('Are you sure you want to delete this user? This action cannot be undone.')) return
    
    try {
      const response = await fetch(`/api/admin/users/${id}`, {
        method: 'DELETE'
      })

      if (response.ok) {
        toast({
          title: "Success",
          description: "User deleted successfully",
        })
        fetchUsers()
      } else {
        const error = await response.json()
        toast({
          title: "Error",
          description: error.error || "Failed to delete user",
          variant: "destructive"
        })
      }
    } catch (error) {
      console.error('Error deleting user:', error)
      toast({
        title: "Error",
        description: "Failed to delete user",
        variant: "destructive"
      })
    }
  }

  useEffect(() => {
    // Check if user is superuser
    if (session?.user?.role !== 'SUPERUSER') {
      router.push('/dashboard')
      return
    }
    
    fetchUsers()
  }, [session, router, fetchUsers])

  if (isLoading) {
    return (
      <div className="flex items-center justify-center py-8">
        <Loader2 className="w-6 h-6 animate-spin" />
        <span className="ml-2">Loading users...</span>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-semibold text-gray-900">User Management</h1>
          <p className="mt-1 text-sm text-gray-500">
            Manage all users in the system
          </p>
        </div>
        
        <Button onClick={handleAddUser} className="bg-indigo-500 hover:bg-indigo-600">
          <UserPlus className="w-4 h-4 mr-2" />
          Add User
        </Button>
      </div>

      {/* Users Table */}
      <Card>
        <CardContent className="p-0">
          {users.length === 0 ? (
            <div className="text-center py-8">
              <Users className="w-12 h-12 text-gray-400 mx-auto mb-4" />
              <p className="text-gray-500">No users found</p>
            </div>
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>User</TableHead>
                  <TableHead>Email</TableHead>
                  <TableHead>Role</TableHead>
                  <TableHead>Assistants</TableHead>
                  <TableHead>Created</TableHead>
                  <TableHead>Last Updated</TableHead>
                  <TableHead>Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {users.map((user) => {
                  const RoleIcon = roleIcons[user.role]
                  return (
                    <TableRow key={user.id} className="hover:bg-gray-50">
                      <TableCell>
                        <div className="flex items-center gap-3">
                          <div className="w-8 h-8 bg-gray-100 rounded-full flex items-center justify-center">
                            <RoleIcon className="w-4 h-4 text-gray-600" />
                          </div>
                          <div>
                            <div className="font-medium text-gray-900">{user.name}</div>
                          </div>
                        </div>
                      </TableCell>
                      <TableCell>
                        <span className="text-gray-600">{user.email}</span>
                      </TableCell>
                      <TableCell>
                        <Badge className={roleColors[user.role]}>
                          {user.role}
                        </Badge>
                      </TableCell>
                      <TableCell>
                        <span className="text-sm text-gray-600">
                          {user._count.assistants}
                        </span>
                      </TableCell>
                      <TableCell>
                        <span className="text-sm text-gray-500">
                          {new Date(user.createdAt).toLocaleDateString()}
                        </span>
                      </TableCell>
                      <TableCell>
                        <span className="text-sm text-gray-500">
                          {new Date(user.updatedAt).toLocaleDateString()}
                        </span>
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center gap-2">
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => handleEditUser(user)}
                          >
                            <Edit className="w-4 h-4" />
                          </Button>
                          {user.id !== session?.user?.id && (
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => handleDeleteUser(user.id)}
                              className="text-red-600 hover:text-red-700"
                            >
                              <Trash2 className="w-4 h-4" />
                            </Button>
                          )}
                        </div>
                      </TableCell>
                    </TableRow>
                  )
                })}
              </TableBody>
            </Table>
          )}
        </CardContent>
      </Card>

      {/* Create/Edit Dialog */}
      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle>
              {editingUser ? 'Edit User' : 'Create User'}
            </DialogTitle>
            <DialogDescription>
              {editingUser ? 'Update user information' : 'Create a new user account'}
            </DialogDescription>
          </DialogHeader>
          
          <div className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="name">Name *</Label>
              <Input
                id="name"
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                placeholder="Enter user name"
                disabled={isSaving}
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="email">Email *</Label>
              <Input
                id="email"
                type="email"
                value={formData.email}
                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                placeholder="Enter user email"
                disabled={isSaving}
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="password">
                Password {editingUser ? '(leave empty to keep current)' : '*'}
              </Label>
              <Input
                id="password"
                type="password"
                value={formData.password}
                onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                placeholder={editingUser ? "Enter new password" : "Enter password"}
                disabled={isSaving}
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="role">Role</Label>
              <Select value={formData.role} onValueChange={(value: string) => setFormData({ ...formData, role: value as 'SUPERUSER' | 'ADMIN' | 'USER' })}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="USER">User</SelectItem>
                  <SelectItem value="ADMIN">Admin</SelectItem>
                  <SelectItem value="SUPERUSER">Superuser</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
          
          <DialogFooter>
            <Button 
              variant="outline" 
              onClick={() => setIsDialogOpen(false)}
              disabled={isSaving}
            >
              Cancel
            </Button>
            <SaveButton 
              onClick={handleSaveUser}
              isLoading={isSaving}
              disabled={!formData.name.trim() || !formData.email.trim() || (!editingUser && !formData.password.trim())}
            >
              {editingUser ? 'Update' : 'Create'}
            </SaveButton>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
}
