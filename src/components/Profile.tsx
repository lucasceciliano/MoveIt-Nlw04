import { useContext } from 'react';
import { ChallengesContext } from '../contexts/ChallengesContext';
import styles from '../styles/components/Profile.module.css';

export function Profile() {
const {level} = useContext(ChallengesContext)

    return (
        <div className={styles.profileContainer}>
           <img src="https://github.com/lucasceciliano.png" alt="lucas ceciliano"/>
           <div>
               <strong> Lucas Ceciliano</strong>
                <p>
                <img src="icons/level.svg" alt="level" />
                    Level {level}
                </p>
            </div> 
        </div>
    )
}