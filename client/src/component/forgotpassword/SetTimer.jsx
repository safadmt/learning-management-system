import React, { useEffect, useState } from 'react'

function SetTimer({ handleTimer }) {
    const [time, setTime] = useState(90);




    const startTimer = () => {
        const startTime = Date.now();

        const intervalId = setInterval(() => {
            const currentTime = Date.now();
            const elapsedSeconds = Math.floor((currentTime - startTime) / 1000);
            const remainingTime = Math.max(90 - elapsedSeconds, 0);

            setTime(remainingTime);

            if (remainingTime === 0) {
                clearInterval(intervalId);
                handleTimer(false);
            }
        }, 1000);

    }

    useEffect(() => {
        startTimer()
    }, [])
    return <h6 className='font-medium'>{time}</h6>
}

export default SetTimer