import Link from "next/link";

export default function NotFound() {
  return (
    <div className="wrap flex min-h-[60vh] flex-col justify-center py-24">
      <p className="numeral text-6xl text-gold">404</p>
      <h1 className="display-ko mt-6 text-[length:var(--text-h2)]">찾으시는 페이지가 없습니다.</h1>
      <p className="mt-4 text-stone-deep">주소를 다시 확인하시거나 여섯 날의 여정에서 다시 시작해 주십시오.</p>
      <div className="mt-10">
        <Link href="/revival" className="btn btn-line">특새 여정으로</Link>
      </div>
    </div>
  );
}
