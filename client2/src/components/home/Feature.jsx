import React from 'react';

const Feature = () => {
        const features = [
    {
        title: "Make your resume ATS friendly",
        description: "check your resume score and get suggestions to improve it.",
        image: "ATS.png",
        alt: "graph",
        hasTrending: true,
        url: "https://www.myperfectresume.com/resume/ats-resume-checker",
        imageClass: "max-w-60"
    },
    {
        title: "play bird game!",
        description: "Be calm and let's play bird game while we are improving your resume.",
        image: "bird.png",
        alt: "dash",
        hasTrending: false,
        url: "https://flappybird.io/",
    },
    {
        title: "Seamless Integration",
        description: "Works effortlessly with React, Next.js, Vue and modern technologies.",
        image: "https://assets.prebuiltui.com/images/components/feature-sections/features-social-image.png",
        alt: "socialCircle",
        hasTrending: true,
        url: "https://www.example.com/integration",
        imageClass: "max-w-60"
    }

    ]
    return (
         <div>
            <style>
                {`
                    @import url("https://fonts.googleapis.com/css2?family=Poppins:wght@300;400;500;600;700&display=swap");
                    *{
                        font-family: "Poppins", sans-serif;
                    }
                `}
            </style>
            <section className='bg-black py-16 px-4'>
                <div className='flex items-center flex-col justify-center text-center'>
                    <button className='bg-neutral-800 text-sm text-white/80 px-6 py-2.5 rounded-full'>Our core features</button>
                    <h2 className='text-white font-medium text-4xl md:text-[40px] mt-6'>Every product needs consistency.</h2>
                    <p className='text-base text-white/60 max-w-lg mt-2'>Our Tailwind CSS components help you ship beautiful interfaces without reinventing the wheel.</p>
                    <div className='w-full max-w-6xl grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mt-10'>
                     
                        {features.map((feature, index) => (
                            feature.url ? (
                                <a key={index} href={feature.url} target="_blank" rel="noopener noreferrer" className='bg-neutral-900 border border-neutral-800 rounded-2xl hover:-translate-y-3 transition duration-300 p-6 flex flex-col'>
                                    <div className={`flex-1 flex items-center justify-center ${feature.imageContainerClass}`}>
                                        <img className={`w-full object-contain ${feature.imageClass}`} src={feature.image} alt={feature.alt} />
                                    </div>
                                    <h3 className='text-base font-medium text-white mt-8 text-left'>{feature.title}</h3>
                                    <p className='text-sm text-white/50 mt-2 text-left max-w-2xs mb-4'>{feature.description}</p>
                                </a>
                            ) : (
                                <div key={index} className='bg-neutral-900 border border-neutral-800 rounded-2xl hover:-translate-y-3 transition duration-300 p-6 flex flex-col'>
                                    <div className={`flex-1 flex items-center justify-center ${feature.imageContainerClass}`}>
                                        <img className={`w-full object-contain ${feature.imageClass}`} src={feature.image} alt={feature.alt} />
                                    </div>
                                    <h3 className='text-base font-medium text-white mt-8 text-left'>{feature.title}</h3>
                                    <p className='text-sm text-white/50 mt-2 text-left max-w-2xs mb-4'>{feature.description}</p>
                                </div>
                            )
                        ))}
                        
                    </div>
                </div>
            </section>
        </div>
    );
};

export default Feature;