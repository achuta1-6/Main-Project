"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Switch } from "@/components/ui/switch"
import { Shield, Smartphone, Key, Bell } from "lucide-react"

export function SecuritySettings() {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center space-x-2">
          <Shield className="h-5 w-5" />
          <span>Security & Privacy</span>
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* Two-Factor Authentication */}
        <div className="flex items-center justify-between p-4 border border-gray-200 rounded-lg">
          <div className="flex items-center space-x-4">
            <div className="h-10 w-10 rounded-lg bg-green-100 flex items-center justify-center">
              <Smartphone className="h-5 w-5 text-green-600" />
            </div>
            <div>
              <p className="font-medium text-gray-900">Two-Factor Authentication</p>
              <p className="text-sm text-gray-500">Add an extra layer of security to your account</p>
            </div>
          </div>
          <div className="flex items-center space-x-2">
            <Switch />
            <Button variant="outline" size="sm">
              Setup
            </Button>
          </div>
        </div>

        {/* Password */}
        <div className="flex items-center justify-between p-4 border border-gray-200 rounded-lg">
          <div className="flex items-center space-x-4">
            <div className="h-10 w-10 rounded-lg bg-blue-100 flex items-center justify-center">
              <Key className="h-5 w-5 text-blue-600" />
            </div>
            <div>
              <p className="font-medium text-gray-900">Password</p>
              <p className="text-sm text-gray-500">Last changed 3 months ago</p>
            </div>
          </div>
          <Button variant="outline" size="sm">
            Change Password
          </Button>
        </div>

        {/* Notifications */}
        <div className="flex items-center justify-between p-4 border border-gray-200 rounded-lg">
          <div className="flex items-center space-x-4">
            <div className="h-10 w-10 rounded-lg bg-purple-100 flex items-center justify-center">
              <Bell className="h-5 w-5 text-purple-600" />
            </div>
            <div>
              <p className="font-medium text-gray-900">Security Notifications</p>
              <p className="text-sm text-gray-500">Get notified about account security events</p>
            </div>
          </div>
          <Switch defaultChecked />
        </div>

        {/* Login Activity */}
        <div className="space-y-4">
          <h4 className="font-medium text-gray-900">Recent Login Activity</h4>
          <div className="space-y-2">
            <div className="flex items-center justify-between text-sm">
              <span className="text-gray-600">Chrome on Windows • New York, NY</span>
              <span className="text-gray-500">2 hours ago</span>
            </div>
            <div className="flex items-center justify-between text-sm">
              <span className="text-gray-600">Mobile App • Los Angeles, CA</span>
              <span className="text-gray-500">1 day ago</span>
            </div>
            <div className="flex items-center justify-between text-sm">
              <span className="text-gray-600">Safari on macOS • San Francisco, CA</span>
              <span className="text-gray-500">3 days ago</span>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
