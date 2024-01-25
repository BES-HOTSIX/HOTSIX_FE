import Link from "next/link";

export default function page() {
  return (
    <section className="flex flex-col justify-center items-center max-w-[850px] mx-auto my-20 mt-10">
      <h1 className="flex items-center basis-1/12">메인페이지</h1>
      <div className="max-w-[500px] w-full flex flex-col justify-center gap-10 mt-10 lg:flex-row lg:gap-24 basis-11/12 ">
        <Link href="/hotel/reserve" className="btn lg:w-32">
          예약하기
        </Link>
        <Link href="/hotel/payment" className="btn lg:w-32 ">
          결제하기
        </Link>
        <Link href="/auth/signin" className="btn lg:w-32 ">
          로그인
        </Link>
        <Link href="/auth/signup" className="btn lg:w-32 ">
          회원가입
        </Link>
        <Link href="/mypage" className="btn lg:w-32 ">
          마이페이지
        </Link>
        <Link href="/hotel/register" className="btn lg:w-32 ">
          숙소 등록
        </Link>
      </div>
    </section>
  );
}
