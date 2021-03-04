import { createContext, useState, ReactNode, useEffect } from 'react'
import challenges from '../../challenges.json'
import Cookies from "js-cookie";
import { LevelUpModal } from '../components/LevelUpModal';




interface Challenge {
    type: 'body' | 'eye'
    description: string
    amount: number
}


interface ChallengesContextsData {
    level: number;
    currentExperience: number
    challengesCompleted: number
    experienceToNextLevel: number
    activeChallenge: Challenge
    resetChallenge: () => void
    levelUp:() => void
    startNewChallenge: () => void
    completeChallenge: () => void
    closeLevelUpModal: () => void

}

interface ChallengesProviderProps {
    children: ReactNode
    level: number;
    currentExperience: number;
    challengesCompleted: number;
}

export const ChallengesContext = createContext({} as ChallengesContextsData)

export function ChallengesProvider({
    children,
    ...rest
 } : ChallengesProviderProps) {
    const [level, setLevel] = useState(rest.level ?? 1)
    const [currentExperience, setCurrentExperience] = useState(rest.currentExperience ?? 0)
    const [challengesCompleted, setChallengesCompleted] = useState(rest.challengesCompleted ?? 0)
    const [activeChallenge, setActiveChallenge] = useState(null)

    const experienceToNextLevel = Math.pow((level + 1) * 4, 2)
    const [isLevelUpModalOpen, setisLevelUpModalOpen] = useState(false)

    useEffect(() => {
        Notification.requestPermission();
    }, [
    ])

    useEffect(() => {
        Cookies.set('level', String(level))
        Cookies.set('currentExperience', String(currentExperience))
        Cookies.set('challengesCompleted', String(challengesCompleted))
      }, [level, currentExperience, challengesCompleted])
    
    function levelUp () {
        setLevel(level + 1)
        setisLevelUpModalOpen(true)
    }

    function closeLevelUpModal() {
        setisLevelUpModalOpen(false)
    }

    function startNewChallenge() {
        const randomChallengesIndex = Math.floor(Math.random() * challenges.length)
        const challenge = challenges[randomChallengesIndex]

        setActiveChallenge(challenge)

        new Audio('/notification.mp3').play()

        if(Notification.permission === 'granted') {
            new Notification('Novo desafio!', {
                body : `Valendo ${challenge.amount}xp!`
            })
        }
    }

    function resetChallenge() {
        setActiveChallenge(null)
    }

    function completeChallenge() {
        if (!activeChallenge) {
            return
        }

        const {amount} = activeChallenge

        let finalExperience = currentExperience + amount

        if (finalExperience >=  experienceToNextLevel) {
            finalExperience = finalExperience - experienceToNextLevel
            levelUp()
        }

        setCurrentExperience(finalExperience)
        setActiveChallenge(null)
        setChallengesCompleted(challengesCompleted + 1)
    }

    return (
        <ChallengesContext.Provider value ={{
        level,
        currentExperience,
        challengesCompleted, 
        levelUp,
        startNewChallenge,
        activeChallenge,
        resetChallenge,
        completeChallenge,
        experienceToNextLevel,
        closeLevelUpModal,}}>
            {children}

       { isLevelUpModalOpen && <LevelUpModal />}

        </ChallengesContext.Provider>
    )
}