import {Title} from '../../title';

export interface InputErrorsProps {
  error?: string;
}

function InputErrors({error}: InputErrorsProps) {
  return (
    <>
      {error && (
        <Title
          text={error || ''}
          color="error"
          size="xnano"
          family="regular"
          marginLeft="medium"
        />
      )}
    </>
  );
}

export default InputErrors;
