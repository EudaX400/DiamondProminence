import styles from '../../styles/components/Forms/input.module.scss'

export const Input = ({type, name, value, onChange, placeholder}) => {
    return (
        <input
            required
            type={type}
            name={name}
            value={value}
            onChange={onChange}
            placeholder={placeholder}
            className={styles.input}
        />
    )
}