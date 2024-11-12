'use client'

import { useState } from 'react'
import { PlusCircle, Trash2 } from 'lucide-react'
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Switch } from "@/components/ui/switch"

type PredefinedSetting = {
  key: string
  value: string | boolean
  type: 'text' | 'boolean'
  placeholder?: string
}

type DynamicSetting = {
  key: string
  value: string
}

export default function SettingsPage() {
  const [predefinedSettings, setPredefinedSettings] = useState<PredefinedSetting[]>([
    { key: 'Email Notifications', value: true, type: 'boolean' },
    { key: 'OpenAI API Key', value: '', type: 'text', placeholder: "sk-**********" },
  ])

  const [dynamicSettings, setDynamicSettings] = useState<DynamicSetting[]>([])
  const [newKey, setNewKey] = useState('')
  const [newValue, setNewValue] = useState('')

  const handlePredefinedSettingChange = (index: number, value: string | boolean) => {
    const updatedSettings = [...predefinedSettings]
    updatedSettings[index].value = value
    setPredefinedSettings(updatedSettings)
  }

  const handleDynamicSettingChange = (index: number, key: string, value: string) => {
    const updatedSettings = [...dynamicSettings]
    updatedSettings[index] = { key, value }
    setDynamicSettings(updatedSettings)
  }

  const handleAddDynamicSetting = () => {
    if (newKey && newValue) {
      setDynamicSettings([...dynamicSettings, { key: newKey, value: newValue }])
      setNewKey('')
      setNewValue('')
    }
  }

  const handleRemoveDynamicSetting = (index: number) => {
    const updatedSettings = dynamicSettings.filter((_, i) => i !== index)
    setDynamicSettings(updatedSettings)
  }

  const handleSaveSettings = () => {
    // Here you would typically send the settings to your backend
    console.log('Predefined Settings:', predefinedSettings)
    console.log('Dynamic Settings:', dynamicSettings)
    alert('Settings saved successfully!')
  }

  return (
    <div className="container mx-auto p-4 space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className='text-2xl'>Settings</CardTitle>
          <CardDescription>Manage your application settings here.</CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="space-y-4">
            <h3 className="text-lg font-semibold">Predefined Settings</h3>
            {predefinedSettings.map((setting, index) => (
              <div key={setting.key} className="flex items-center justify-between">
                <Label htmlFor={setting.key} className="flex-grow">{setting.key}</Label>
                {setting.type === 'text' ? (
                  <Input
                    id={setting.key}
                    value={setting.value as string}
                    onChange={(e) => handlePredefinedSettingChange(index, e.target.value)}
                    className="w-1/2"
                    placeholder={setting.placeholder}
                  />
                ) : (
                  <Switch
                    id={setting.key}
                    checked={setting.value as boolean}
                    onCheckedChange={(checked) => handlePredefinedSettingChange(index, checked)}
                  />
                )}
              </div>
            ))}
          </div>

          <div className="space-y-4">
            <h3 className="text-lg font-semibold">Dynamic Settings</h3>
            {dynamicSettings.map((setting, index) => (
              <div key={index} className="flex items-center space-x-2">
                <Input
                  value={setting.key}
                  onChange={(e) => handleDynamicSettingChange(index, e.target.value, setting.value)}
                  placeholder="Key"
                  className="w-1/3"
                />
                <Input
                  value={setting.value}
                  onChange={(e) => handleDynamicSettingChange(index, setting.key, e.target.value)}
                  placeholder="Value"
                  className="w-1/3"
                />
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={() => handleRemoveDynamicSetting(index)}
                >
                  <Trash2 className="h-4 w-4" />
                </Button>
              </div>
            ))}
          </div>

          <div className="space-y-2">
            <h4 className="text-sm font-medium">Add New Setting</h4>
            <div className="flex items-center space-x-2">
              <Input
                value={newKey}
                onChange={(e) => setNewKey(e.target.value)}
                placeholder="New Key"
                className="w-1/3"
              />
              <Input
                value={newValue}
                onChange={(e) => setNewValue(e.target.value)}
                placeholder="New Value"
                className="w-1/3"
              />
              <Button onClick={handleAddDynamicSetting} variant='secondary'>
                <PlusCircle className="h-4 w-4 mr-2" />
                Add
              </Button>
            </div>
          </div>
        </CardContent>
        <CardFooter>
          <Button onClick={handleSaveSettings} className="ml-auto">Save Settings</Button>
        </CardFooter>
      </Card>
    </div>
  )
}