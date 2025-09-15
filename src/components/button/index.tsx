
import styles from './index.module.scss'

const ButtonN = ({children, onPress}) => {

    return <>

        <div
            role={"button"}
            className={styles.stackButton}
            style={{display: 'flex',}}
            onClick={onPress}
        >
            <p style={{fontFamily: 'vangard', flexShrink: 0, display: 'flex', zIndex: 12}}> {children} </p>

        </div>

    </>

}

export default ButtonN;