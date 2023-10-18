
import Form from '../../../components/forms/Form';
import TextInput from '../../../components/forms/TextInput';
import { useCreateRoleForm } from '../hooks/useCreateRoleForm';

const CreateRoleForm = () => {
  const { form, requiredFields, isLoading, submitHandler } = useCreateRoleForm();

  const onSubmitSuccess = () => {
    console.info('submit')
  };

  return (
    <Form form={form} onSubmit={submitHandler} onSubmitSuccess={onSubmitSuccess}>
      <TextInput
        label="Nom du rôle"
        name="name"
        control={form.control}
        required={requiredFields.name}
        sx={{ mt: 2 }}
      />
      <TextInput
        label="Description"
        name="description"
        control={form.control}
        required={requiredFields.description}
        sx={{ mt: 2 }}
      />
    </Form>
  );
};
  
export default CreateRoleForm;
