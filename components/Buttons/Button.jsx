import styles from '../../styles/components/Buttons/Button.module.scss'

export const Button = ({type, style, disabled, children }) => {
    return (
        <button
            type={type}
            style={style}
            className={styles.btn}
            disabled={disabled}
        >{children}</button>
    )
}