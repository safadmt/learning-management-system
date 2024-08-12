import React from 'react'
import { CgProfile } from 'react-icons/cg'

function AboutInstructor() {
    return (
    <div className='aboutInstructor'>
        <div>
            <h2 className='font-medium text-xl text-zinc-500'>About Instructor</h2>

            <div className='instructor-profile-image'>
                <CgProfile size={100} />
            </div>
           
            <h1 className='font-medium text-4xl text-zinc-800'>Safad MT</h1>
            <h2 className='font-medium text-base text-zinc-800'>Developer and Lead Instructor</h2>
            <div>
                <h6 className='font-medium text-sm bg-cyan-300 px-2 py-2 w-fit text-zinc-800'>CodeFreak Instructor</h6>
            </div>

            <div className='mt-6'>
                <div>
                    <div className='font-medium text-sm text-zinc-800'>Total Studenets</div>
                    <div className='font-medium text-xl text-zinc-800'>2.383,53</div>
                </div>

            </div>
            <h2 className='font-medium text-2xl mt-4 text-zinc-800'>About me</h2>
            <div>
                <div>
                    I'm Angela, I'm a developer with a passion for teaching. I'm the lead instructor at the London App Brewery, London's leading Programming Bootcamp. I've helped hundreds of thousands of students learn to code and change their lives by becoming a developer. I've been invited by companies such as Twitter, Facebook and Google to teach their employees.

                    My first foray into programming was when I was just 12 years old, wanting to build my own Space Invader game. Since then, I've made hundred of websites, apps and games. But most importantly, I realised that my greatest passion is teaching.

                    I spend most of my time researching how to make learning to code fun and make hard concepts easy to understand. I apply everything I discover into my bootcamp courses. In my courses, you'll find lots of geeky humour but also lots of explanations and animations to make sure everything is easy to understand.

                    I'll be there for you every step of the way.
                </div>
            </div>
        </div>

    </div >
  )
}

export default AboutInstructor