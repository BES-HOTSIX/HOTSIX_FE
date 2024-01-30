import HomeBanner from "@/components/HomeBanner";
import Link from "next/link";

export default function page() {
  return (
    <section className="flex flex-col justify-center items-center max-w-[850px] mx-auto my-20 mt-10">
      <div className="w-screen">
        <HomeBanner />
      </div>

      <div className="max-w-[500px] w-full flex flex-col justify-center gap-10 mt-10 lg:flex-row lg:gap-24 basis-11/12 ">
        <Link href="/hotel/reserve" className="btn lg:w-32">
          예약하기
        </Link>
        <Link href="/hotel/payment" className="btn lg:w-32 ">
          결제하기
        </Link>
      </div>
    </section>
  );
}
