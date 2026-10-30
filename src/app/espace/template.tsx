export default function Template({ children }: { children: React.ReactNode }) {
  // Remonte a chaque navigation : fondu-montee de 260 ms (voir .portail-entree dans globals.css)
  return <div className="portail-entree">{children}</div>
}
