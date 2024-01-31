import HomeBanner from '@/components/HomeBanner'

export default function page() {
  return (
    <section className='flex flex-col justify-center items-center max-w-[850px] mx-auto my-20 mt-10'>
      <div className='w-screen'>
        <HomeBanner />
      </div>

      <div className='max-w-[500px] w-full flex flex-col justify-center gap-10 mt-10 lg:flex-row lg:gap-24 basis-11/12 '></div>
    </section>
  )
}
