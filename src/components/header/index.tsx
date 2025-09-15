import {FunctionComponent, memo} from "react";
import styles from './index.module.scss'

const Header = () => {

    return <>

        <header role={"banner"} className={styles.mainHeader}>

            <section className={styles.headerTitleSection}>

                <div className={styles.headerTitle}>

                    Extrude To 3D Drawing

                </div>

            </section>

        </header>

    </>

}

export default memo(Header as FunctionComponent);