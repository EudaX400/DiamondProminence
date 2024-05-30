import styles from '../../styles/components/Forms/textarea.module.scss'

export const Textarea = ({ id, name, value, onChange, placeholder = "", className = "", required = false }) => {
  return (
    <textarea
      id={id}
      name={name}
      value={value}
      onChange={onChange}
      placeholder={placeholder}
      className={`${styles.textarea} ${className}`}
      required={required}
    />
  );
};
