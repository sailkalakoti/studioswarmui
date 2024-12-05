'use client'

import { useEffect, useState } from 'react'
import { PlusCircle, Trash2, Save, InfoIcon } from 'lucide-react'
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Switch } from "@/components/ui/switch"
import { useApiMutation, useFetchData } from '@/lib/utils'
import toast, { Toaster } from 'react-hot-toast'
import { Separator } from "@/components/ui/separator"

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

type GenericObject = { [key: string]: any };

export default function SettingsPage() {
  const [dynamicSettings, setDynamicSettings] = useState<DynamicSetting[]>([])
  const [newKey, setNewKey] = useState('')
  const [newValue, setNewValue] = useState('')

  const { data, isLoading } = useFetchData("/settings/");
  const { settings }: any = data || {};
  const settingsMutate = useApiMutation("/settings/", "PUT", {
    onSuccess: () => {
      toast.success("Settings updated")
    }
  })

  useEffect(() => {
    if (Object.keys(settings || {}).length > 0) {
      const dynamicKeys = Object.keys(settings)
        ?.map(key => ({
          key,
          value: settings[key]
        }));
      setDynamicSettings(dynamicKeys);
    }
  }, [settings]);

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
    const payloadSetting = dynamicSettings?.reduce((acc, item) => {
      return {
        ...acc,
        [item.key]: item.value,
      }
    }, {});
    settingsMutate.mutate({
      settings: payloadSetting,
      user_id: 1
    })
  }

  return (
    <div className="container mx-auto p-8">
      <Toaster toastOptions={{ position: "bottom-right" }} />
      <Card className="max-w-4xl mx-auto">
        <CardHeader>
          <CardTitle className='text-2xl font-bold'>Settings</CardTitle>
          <CardDescription className="text-muted-foreground">
            Manage your application settings here.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-8">
          <div className="space-y-6">
            <div>
              <h3 className="text-lg font-semibold">Environment Variables</h3>
              <p className="text-sm text-muted-foreground mb-4">
                Configure your application environment variables and API keys.
              </p>
              <div className="flex items-center gap-2 text-sm text-muted-foreground mb-6">
                <InfoIcon className="h-4 w-4" />
                <p>These environment variables will be automatically configured when testing your swarm.</p>
              </div>
            </div>
            
            <Separator className="my-4" />
           
            {dynamicSettings.map((setting, index) => (
              <div key={index} className="flex items-center space-x-3 group">
                <Input
                  value={setting.key}
                  onChange={(e) => handleDynamicSettingChange(index, e.target.value, setting.value)}
                  placeholder="Key"
                  className="w-1/3 font-mono text-sm"
                />
                <Input
                  value={setting.value}
                  onChange={(e) => handleDynamicSettingChange(index, setting.key, e.target.value)}
                  placeholder="Value"
                  className="w-1/2 font-mono text-sm"
                  type="password"
                />
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={() => handleRemoveDynamicSetting(index)}
                  className="opacity-0 group-hover:opacity-100 transition-opacity"
                >
                  <Trash2 className="h-4 w-4 text-muted-foreground hover:text-destructive" />
                </Button>
              </div>
            ))}
          </div>

          <div className="space-y-4">
            <div>
              <h4 className="text-sm font-semibold mb-2">Add New Variable</h4>
              <div className="flex items-center space-x-3">
                <Input
                  value={newKey}
                  onChange={(e) => setNewKey(e.target.value)}
                  placeholder="New Key"
                  className="w-1/3 font-mono text-sm"
                />
                <Input
                  value={newValue}
                  onChange={(e) => setNewValue(e.target.value)}
                  placeholder="New Value"
                  className="w-1/2 font-mono text-sm"
                />
                <Button onClick={handleAddDynamicSetting} variant='secondary' className="px-4">
                  <PlusCircle className="h-4 w-4 mr-2" />
                  Add
                </Button>
              </div>
            </div>
          </div>
        </CardContent>
        <CardFooter className="border-t pt-6">
          <Button onClick={handleSaveSettings} className="ml-auto">
            <Save className="h-4 w-4 mr-2" />
            Save Changes
          </Button>
        </CardFooter>
      </Card>
    </div>
  );
}