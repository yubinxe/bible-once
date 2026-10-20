/** 경로가 바뀔 때마다 새 페이지가 빛 속에서 조용히 떠오른다 */
export default function Template({ children }: { children: React.ReactNode }) {
  return <div className="page-enter">{children}</div>;
}
