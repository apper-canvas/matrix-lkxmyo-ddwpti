import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { toast } from 'react-toastify';
import ApperIcon from '@/components/ApperIcon';
import Button from '@/components/atoms/Button';
import FormField from '@/components/molecules/FormField';

const AddEditModal = ({ 
  isOpen, 
  onClose, 
  onSubmit, 
  title,
  fields = [],
  initialData = {},
  loading = false
}) => {
  const [formData, setFormData] = useState({});
  const [errors, setErrors] = useState({});

  useEffect(() => {
    if (isOpen) {
      setFormData(initialData);
      setErrors({});
    }
  }, [isOpen, initialData]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    // Basic validation
    const newErrors = {};
    fields.forEach(field => {
      if (field.required && !formData[field.name]) {
        newErrors[field.name] = `${field.label} is required`;
      }
    });

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }

    try {
      await onSubmit(formData);
      onClose();
      toast.success(`${title.split(' ')[0]} ${initialData.Id ? 'updated' : 'created'} successfully!`);
    } catch (error) {
      toast.error(`Failed to ${initialData.Id ? 'update' : 'create'} ${title.toLowerCase()}`);
    }
  };

  const handleInputChange = (field, value) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    // Clear error when user starts typing
    if (errors[field]) {
      setErrors(prev => ({ ...prev, [field]: '' }));
    }
  };

  const renderField = (field) => {
    const commonProps = {
      key: field.name,
      label: field.label,
      value: formData[field.name] || '',
      onChange: (e) => handleInputChange(field.name, e.target.value),
      error: errors[field.name],
      required: field.required,
      placeholder: field.placeholder
    };

    if (field.type === 'select') {
      return (
        <FormField
          type="select"
          options={field.options}
          {...commonProps}
        />
      );
    }

    if (field.type === 'textarea') {
      return (
        <div key={field.name} className="space-y-1">
          <label className="block text-sm font-medium text-gray-700">
            {field.label}
            {field.required && <span className="text-error ml-1">*</span>}
          </label>
          <textarea
            rows={3}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary"
            value={formData[field.name] || ''}
            onChange={(e) => handleInputChange(field.name, e.target.value)}
            placeholder={field.placeholder}
          />
          {errors[field.name] && (
            <p className="text-sm text-error flex items-center gap-1">
              <ApperIcon name="AlertCircle" size={14} />
              {errors[field.name]}
            </p>
          )}
        </div>
      );
    }

    return (
      <FormField
        type={field.inputType || 'text'}
        icon={field.icon}
        {...commonProps}
      />
    );
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/50 z-40"
            onClick={onClose}
          />
          
          {/* Modal */}
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.95 }}
            className="fixed inset-0 z-50 flex items-center justify-center p-4"
          >
            <div className="bg-white rounded-lg shadow-xl max-w-md w-full max-h-[90vh] overflow-y-auto">
              {/* Header */}
              <div className="flex items-center justify-between p-6 border-b border-gray-200">
                <h2 className="text-lg font-semibold text-gray-900">{title}</h2>
                <Button
                  variant="ghost"
                  size="sm"
                  icon="X"
                  onClick={onClose}
                  disabled={loading}
                />
              </div>

              {/* Form */}
              <form onSubmit={handleSubmit} className="p-6 space-y-4">
                {fields.map(renderField)}

                {/* Actions */}
                <div className="flex gap-3 pt-4">
                  <Button
                    type="button"
                    variant="outline"
                    onClick={onClose}
                    disabled={loading}
                    className="flex-1"
                  >
                    Cancel
                  </Button>
                  <Button
                    type="submit"
                    loading={loading}
                    className="flex-1"
                  >
                    {initialData.Id ? 'Update' : 'Create'}
                  </Button>
                </div>
              </form>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
};

export default AddEditModal;