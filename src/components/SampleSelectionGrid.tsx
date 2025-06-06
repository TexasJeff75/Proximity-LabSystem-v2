import React from 'react';
import { Sample } from '../types';
import { CheckIcon, AlertTriangleIcon, MessageSquareIcon } from 'lucide-react';
import { useMessaging } from './MessagingContext';
interface SampleSelectionGridProps {
  samples: Sample[];
  selectedSamples: string[];
  onSampleToggle: (sampleId: string) => void;
  maxSamples: number;
}
export function SampleSelectionGrid({
  samples,
  selectedSamples,
  onSampleToggle,
  maxSamples
}: SampleSelectionGridProps) {
  // Sort samples by collection date (oldest first)
  const sortedSamples = [...samples].sort((a, b) => new Date(a.collection_date).getTime() - new Date(b.collection_date).getTime());
  const {
    setIsOpen,
    setActiveSampleId,
    messages
  } = useMessaging();
  // Check if sample has unread messages
  const getUnreadMessageCount = (sampleId: string) => {
    return messages.filter(m => m.sampleId === sampleId && !m.read).length;
  };
  // Open messaging panel for a specific sample
  const handleMessageClick = (sampleId: string) => {
    setActiveSampleId(sampleId);
    setIsOpen(true);
  };
  return <div className="bg-white rounded-xl border border-gray-200 overflow-hidden">
      <div className="p-4 border-b border-gray-200 bg-gray-50">
        <div className="flex justify-between items-center">
          <h3 className="text-lg font-semibold text-gray-900">
            Sample Selection
          </h3>
          <div className="text-sm text-gray-600">
            Selected: {selectedSamples.length} / {maxSamples}
          </div>
        </div>
      </div>
      <div className="overflow-x-auto">
        <table className="w-full">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Select
              </th>
              <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Sample ID
              </th>
              <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Collection Date
              </th>
              <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Test Types
              </th>
              <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Status
              </th>
              <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Actions
              </th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-200">
            {sortedSamples.map(sample => {
            const isMultiTest = sample.test_types.length > 1;
            const isSelected = selectedSamples.includes(sample.sample_id);
            const isSelectable = isSelected || selectedSamples.length < maxSamples;
            const unreadCount = getUnreadMessageCount(sample.sample_id);
            return <tr key={sample.sample_id} className={`${isMultiTest ? 'bg-yellow-50' : ''} hover:bg-gray-50`}>
                  <td className="px-4 py-3">
                    <label className="flex items-center">
                      <input type="checkbox" checked={isSelected} onChange={() => onSampleToggle(sample.sample_id)} disabled={!isSelectable && !isSelected} className="rounded border-gray-300 text-blue-600 focus:ring-blue-500" />
                    </label>
                  </td>
                  <td className="px-4 py-3">
                    <div className="flex items-center">
                      <span className="text-sm font-medium text-gray-900">
                        {sample.sample_id}
                      </span>
                      {isMultiTest && <AlertTriangleIcon className="h-4 w-4 text-yellow-500 ml-2" />}
                    </div>
                  </td>
                  <td className="px-4 py-3 text-sm text-gray-900">
                    {new Date(sample.collection_date).toLocaleDateString()}
                  </td>
                  <td className="px-4 py-3">
                    <div className="flex flex-wrap gap-1">
                      {sample.test_types.map(type => <span key={type} className="px-2 py-1 text-xs rounded-full bg-blue-100 text-blue-800">
                          {type}
                        </span>)}
                    </div>
                  </td>
                  <td className="px-4 py-3">
                    <span className={`px-2 py-1 text-xs rounded-full ${sample.status === 'completed' ? 'bg-green-100 text-green-800' : sample.status === 'processing' ? 'bg-blue-100 text-blue-800' : 'bg-gray-100 text-gray-800'}`}>
                      {sample.status}
                    </span>
                  </td>
                  <td className="px-4 py-3">
                    <button onClick={() => handleMessageClick(sample.sample_id)} className="relative p-2 text-gray-500 hover:text-blue-600 hover:bg-blue-50 rounded-full" title="Messages">
                      <MessageSquareIcon className="h-5 w-5" />
                      {unreadCount > 0 && <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full h-4 w-4 flex items-center justify-center">
                          {unreadCount}
                        </span>}
                    </button>
                  </td>
                </tr>;
          })}
          </tbody>
        </table>
      </div>
    </div>;
}