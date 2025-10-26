import React from 'react';
import { CheckCircle, Circle, Clock, X, Plus } from 'lucide-react';
import { Section } from './types';

interface ChecklistProps {
  sections: Section[];
  onSectionClick: (sectionId: string) => void;
  onDeleteSection: (sectionId: string) => void;
  onAddSection: () => void;
}

export function Checklist({ sections, onSectionClick, onDeleteSection, onAddSection }: ChecklistProps) {
  const completedCount = sections.filter(s => s.status === 'complete').length;
  const totalCount = sections.length;
  const progress = totalCount > 0 ? (completedCount / totalCount) * 100 : 0;

  const getStatusIcon = (status: Section['status']) => {
    switch (status) {
      case 'complete':
        return <CheckCircle className="w-4 h-4 text-emerald-600" />;
      case 'in-progress':
        return <Clock className="w-4 h-4 text-amber-600" />;
      case 'incomplete':
        return <Circle className="w-4 h-4 text-stone-400" />;
    }
  };

  const coreSections = sections.filter(s => !s.isCustom);
  const customSections = sections.filter(s => s.isCustom);

  return (
    <div className="bg-white rounded-xl border-2 border-stone-200 p-6 h-full overflow-y-auto">
      {/* Header */}
      <div className="mb-6">
        <h2 className="text-xl font-bold text-stone-900 mb-2">📋 Proposal Progress</h2>
        <div className="text-sm text-stone-600 mb-4">
          {completedCount} of {totalCount} sections complete
        </div>
        
        {/* Progress Bar */}
        <div className="relative">
          <div className="h-3 bg-stone-200 rounded-full overflow-hidden">
            <div
              className="h-full bg-gradient-to-r from-emerald-500 to-emerald-600 transition-all duration-500 rounded-full"
              style={{ width: `${progress}%` }}
            />
          </div>
          <div className="text-right mt-1">
            <span className="text-lg font-bold text-emerald-700">{Math.round(progress)}%</span>
          </div>
        </div>
      </div>

      {/* Core Sections */}
      <div className="mb-6">
        <h3 className="text-sm font-semibold text-stone-700 mb-3 uppercase tracking-wide">
          Standard Sections
        </h3>
        <div className="space-y-2">
          {coreSections.map((section, index) => (
            <button
              key={section.id}
              onClick={() => onSectionClick(section.id)}
              className={`w-full text-left p-3 rounded-lg border-2 transition-all hover:shadow-md ${
                section.status === 'complete'
                  ? 'bg-emerald-50 border-emerald-200 hover:border-emerald-300'
                  : section.status === 'in-progress'
                  ? 'bg-amber-50 border-amber-200 hover:border-amber-300'
                  : 'bg-stone-50 border-stone-200 hover:border-stone-300'
              }`}
            >
              <div className="flex items-center gap-3">
                {getStatusIcon(section.status)}
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2">
                    <span className="text-xs font-medium text-stone-500">
                      {index + 1}.
                    </span>
                    <span className="text-sm font-medium text-stone-900 truncate">
                      {section.title}
                    </span>
                  </div>
                </div>
              </div>
            </button>
          ))}
        </div>
      </div>

      {/* Custom Sections */}
      {customSections.length > 0 && (
        <div className="mb-6">
          <h3 className="text-sm font-semibold text-stone-700 mb-3 uppercase tracking-wide">
            Custom Sections
          </h3>
          <div className="space-y-2">
            {customSections.map((section, index) => (
              <div
                key={section.id}
                className={`p-3 rounded-lg border-2 transition-all ${
                  section.status === 'complete'
                    ? 'bg-purple-50 border-purple-200'
                    : section.status === 'in-progress'
                    ? 'bg-amber-50 border-amber-200'
                    : 'bg-stone-50 border-stone-200'
                }`}
              >
                <div className="flex items-center gap-3">
                  {getStatusIcon(section.status)}
                  <button
                    onClick={() => onSectionClick(section.id)}
                    className="flex-1 text-left min-w-0"
                  >
                    <div className="flex items-center gap-2">
                      <span className="text-xs font-medium text-stone-500">
                        {coreSections.length + index + 1}.
                      </span>
                      <span className="text-sm font-medium text-stone-900 truncate">
                        {section.title}
                      </span>
                    </div>
                  </button>
                  {section.canDelete && (
                    <button
                      onClick={() => onDeleteSection(section.id)}
                      className="p-1 hover:bg-red-100 rounded transition-colors"
                      title="Remove section"
                    >
                      <X className="w-4 h-4 text-red-600" />
                    </button>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Add Section Button */}
      <button
        onClick={onAddSection}
        className="w-full p-3 border-2 border-dashed border-stone-300 rounded-lg text-sm text-stone-600 hover:border-emerald-400 hover:text-emerald-700 hover:bg-emerald-50 transition-all flex items-center justify-center gap-2"
      >
        <Plus className="w-4 h-4" />
        Add custom section via chat
      </button>

      {/* Tips */}
      <div className="mt-6 p-4 bg-sky-50 rounded-lg border border-sky-200">
        <div className="flex items-start gap-2">
          <div className="text-lg">💡</div>
          <div className="text-xs text-sky-900">
            <p className="font-semibold mb-1">Tips:</p>
            <ul className="space-y-1 text-sky-800">
              <li>• Click sections to view/edit content</li>
              <li>• Tell AI to add custom sections</li>
              <li>• Sections auto-update as you chat</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
}
