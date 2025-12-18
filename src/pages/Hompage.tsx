import { Button } from '@/components/ui/button'
import { Link } from 'react-router-dom' 
import { ChevronRight, FileClock, ShieldCheck, Zap } from 'lucide-react';
import CardComponent from '@/components/CardComponent';
import TestimonialCard from '@/components/testimonialCard';


const Hompage = () => {
  return (
    <div className='w-full h-full'>
        <header className='relative text-center py-[60px] bg-[url(/grid.png)] bg-cover bg-center bg-no-repeat'>
            {/* OVERLAY */}
            <div className="absolute inset-0 bg-black/60"></div>
            {/* HERO CONTENT */}
            <div className='relative z-10'>

                <div className='bg-slate-700 p-1 rounded text-[12px] text-white flex justify-center items-center gap-1 max-w-max mx-auto'> <Zap size={16} strokeWidth={1}/>AI-Powered • Professional • ATS-Optimized</div>

                <h1 className='text-2xl md:text-4xl font-bold max-w-[95%] md:max-w-[73%] mx-auto'>Generate Perfect Cover Letters Automatically — From Just a Job Screenshot</h1>
                <p className='max-w-[80%]  mx-auto pt-5'>Upload any job description screenshot, and let AI craft a personalized, professional cover letter using your saved profile details. No typing, no stress — just apply instantly.</p>

                <div className='flex flex-row justify-center gap-10 py-10'>
                    <Button className='cursor-pointer bg-white text-black border-0 hover:text-white hover:bg-slate-700'>
                        <Link to='/get-started' className='flex items-center justify-around'><span>Get Started</span> <ChevronRight size={16} strokeWidth={1} /></Link>
                    </Button>
                    <Button variant='outline' className='cursor-pointer border-2 border-white bg-black'>
                        <Link to='/free-trial'>Try It Free</Link>
                    </Button>
                </div>
            </div>


        </header>
        <section className='p-[30px]'>
            <h2 className='text-center text-[24px] font-bold'>Why Choose Covr buildr?</h2>
            <p className='text-center text-[16px] py-2'>Get ahead of the competition with AI-powered cover letter generation</p>

            <div className='px-[30px] py-[60px] md:px-[60px]  bg-white rounded grid grid-rows-1 md:grid-cols-3  gap-4  '>
                <CardComponent 
                    icon={<Zap/>} 
                    title='AI-Powered Generation' 
                    bodyText='Advanced AI analyzes your experience and creates compelling, personalized content that highlights your strengths.'
                />
                <CardComponent 
                    icon={<ShieldCheck/>} 
                    title='ATS-Optimized' 
                    bodyText='Create cover letters optimized for Applicant Tracking Systems (ATS) so your application passes automated scans and gets seen by hiring managers.'
                />
                <CardComponent 
                    icon={<FileClock/>} 
                    title='Ready in Minutes' 
                    bodyText='Generate a polished, job-specific cover letter in just minutes—no templates, no stress, just fast, quality results.'
                />
            </div>
        </section>
        <section className='mt-12'>
                <h2 className='text-center text-[24px] font-bold'>Success Stories</h2>

                <p className='text-center text-[16px] py-2'>See how Covr Buildr helped professionals land their dream jobs</p>
            <div className='px-[30px] py-[60px] md:px-[60px] grid grid-rows-1 md:grid-cols-3 gap-4'>

                <TestimonialCard 
                    name='Aisha Bello' 
                    testimony='got a professional cover letter in under five minutes. It matched my tone perfectly and helped me land two interviews.' role='Marketing Assistant'
                />
                <TestimonialCard 
                    name='Daniel Obeng' 
                    testimony='This tool saved me hours. The cover letter was concise, tailored, and way better than anything I’ve written myself' 
                    role='Junior Software Developer'           
                />
                <TestimonialCard 
                    name='Sarah Johnson' 
                    testimony='It felt like having a personal career coach. The cover letter was clear, confident, and ready to send immediately.' 
                    role='HR Intern'
                />
            </div>
        </section>
        <section className='text-center py-14 border-t border-slate-600'>
            <h3 className='text-2xl mb-3'>Ready to Transform Your Career?</h3>
            <p className='mb-5'>Join thousands of professionals who've successfully landed their dream jobs with covr buildr</p>
            <Button className='cursor-pointer bg-white text-black border-0 hover:text-white hover:bg-slate-700'>
                <Link to='/get-started' className='flex items-center justify-around'><span>Get Started</span> <ChevronRight size={16} strokeWidth={1} /></Link>
            </Button>
        </section>
        <footer>

        </footer>
    </div>
  )
}

export default Hompage