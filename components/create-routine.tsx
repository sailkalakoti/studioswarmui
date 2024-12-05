import React, { useState } from "react";
import { Input } from "@/components/ui/input";
import { Hash, Zap, X } from "lucide-react";
// ... other imports

export function CreateRoutineComponent({ id }) {
  // ... existing state
  const [tags, setTags] = useState<string[]>([]);
  const [tagInput, setTagInput] = useState('');
  const [relatedSwarms] = useState([]);

  // Add tag handlers
  const addTag = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter' && tagInput.trim() !== '') {
      if (!tags.includes(tagInput.trim())) {
        setTags([...tags, tagInput.trim()]);
      }
      setTagInput('');
    }
  };

  const removeTag = (tagToRemove: string) => {
    setTags(tags.filter(tag => tag !== tagToRemove));
  };

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col w-full">
      <div className="flex-1 p-8">
        <div className="max-w-6xl mx-auto">
          {/* Existing breadcrumbs and title */}
          
          <div className="flex gap-6">
            {/* Left section - Form */}
            <div className="flex-1">
              <div className="bg-white rounded-lg shadow-sm">
                {/* Your existing form content */}
              </div>
            </div>

            {/* Right section */}
            <div className="space-y-5 w-80">
              {/* Tags Panel */}
              <div className="bg-white rounded-lg shadow-sm p-5">
                <h3 className="text-lg font-semibold mb-4">Tags</h3>
                <div className="space-y-3">
                  <div>
                    <Input
                      placeholder="Add a tag..."
                      value={tagInput}
                      onChange={(e) => setTagInput(e.target.value)}
                      onKeyDown={addTag}
                      className="w-full bg-transparent"
                    />
                    <p className="text-sm text-gray-500 mt-2">
                      Press enter to add a tag
                    </p>
                  </div>
                  
                  {tags.length > 0 ? (
                    <div className="flex flex-wrap gap-2">
                      {tags.map((tag) => (
                        <span
                          key={tag}
                          className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-full 
                            bg-gray-50 text-gray-900 text-sm font-medium hover:bg-gray-100 transition-colors"
                        >
                          {tag}
                          <button
                            onClick={() => removeTag(tag)}
                            className="text-gray-500 hover:text-gray-700 ml-0.5"
                          >
                            <X className="h-4 w-4" />
                          </button>
                        </span>
                      ))}
                    </div>
                  ) : (
                    <div className="text-center py-6 px-4">
                      <div className="inline-flex h-10 w-10 items-center justify-center rounded-full bg-gray-50 mb-3">
                        <Hash className="h-5 w-5 text-gray-400" />
                      </div>
                      <h3 className="text-sm font-medium text-gray-900 mb-1">
                        No Tags Added
                      </h3>
                      <p className="text-sm text-gray-500 max-w-[200px] mx-auto">
                        Add tags to help organize and find this routine easily
                      </p>
                    </div>
                  )}
                </div>
              </div>

              {/* Connected Swarms Panel */}
              <div className="bg-white rounded-lg shadow-sm p-5">
                <h3 className="text-lg font-semibold mb-4">Connected Swarms</h3>
                <div className="space-y-3">
                  {relatedSwarms.length > 0 ? (
                    relatedSwarms.map((swarm) => (
                      <div 
                        key={swarm.id}
                        className="p-3 rounded-lg border border-gray-100 hover:border-[#002856]/10 
                          hover:bg-gray-50 transition-all group cursor-pointer"
                      >
                        <div className="font-medium text-gray-900 mb-1 group-hover:text-[#002856]">
                          {swarm.name}
                        </div>
                        <p className="text-sm text-gray-500 line-clamp-2">
                          {swarm.description}
                        </p>
                      </div>
                    ))
                  ) : (
                    <div className="text-center py-6 px-4">
                      <div className="inline-flex h-10 w-10 items-center justify-center rounded-full bg-gray-50 mb-3">
                        <Zap className="h-5 w-5 text-gray-400" />
                      </div>
                      <h3 className="text-sm font-medium text-gray-900 mb-1">
                        No Swarms Yet
                      </h3>
                      <p className="text-sm text-gray-500 max-w-[200px] mx-auto">
                        This routine isn&apos;t part of any swarms yet. Add it to a swarm to see it here.
                      </p>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
} 