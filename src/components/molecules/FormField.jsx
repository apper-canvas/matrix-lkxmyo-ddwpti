import Input from '@/components/atoms/Input';
import Select from '@/components/atoms/Select';

const FormField = ({ type = 'input', ...props }) => {
  if (type === 'select') {
    return <Select {...props} />;
  }
  
  if (type === 'datepicker') {
    return <Input type="datepicker" {...props} />;
  }
  
  return <Input {...props} />;
};

export default FormField;