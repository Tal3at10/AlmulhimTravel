/**
 * Empty State Component
 * Shows when no data is available
 */

import { Package } from 'lucide-react';

const EmptyState = ({ 
  icon: Icon = Package, 
  title = 'لا توجد بيانات', 
  message = 'لم يتم العثور على أي نتائج',
  action = null 
}) => {
  return (
    <div className="flex flex-col items-center justify-center py-16 px-4">
      <div className="w-20 h-20 bg-slate-100 rounded-full flex items-center justify-center mb-4">
        <Icon className="w-10 h-10 text-slate-600 font-medium" />
      </div>
      
      <h3 className="text-xl font-bold text-[#071428] mb-2">{title}</h3>
      <p className="text-slate-700 font-medium text-center mb-6 max-w-md">{message}</p>
      
      {action && action}
    </div>
  );
};

export default EmptyState;
