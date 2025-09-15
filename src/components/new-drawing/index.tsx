
import styles from './index.module.scss';
import ButtonN from "../button";


const NewDrawing = ({onPress}) => {

    return <>

        <div className={styles.newDrawing}>

            <div className={styles.description} >

                Click Below to Start a New Drawing

            </div>

            <ButtonN onPress={onPress} >
                Start Drawing
            </ButtonN>

        </div>

    </>

}

export default NewDrawing;