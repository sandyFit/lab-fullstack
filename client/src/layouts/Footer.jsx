import React from 'react'

const Footer = () => {
    return (
        <footer className='w-full h-12 bg-emerald-500 mt-24 py-12 flex justify-center 
            items-center text-white'>
            <p>{`© ${new Date().getFullYear()} | made by Sandra Ramos`}</p>

        </footer>
    )
}

export default Footer
