import styles from '../../styles/components/Buttons/LinkButton.module.scss'
import Link from "next/link";


export const LinkButton = ({ href, children }) => {
    return (
        <Link href={href}>
        <button 
            className={styles.btn}
        >{children}</button>
        </Link>
    )
}