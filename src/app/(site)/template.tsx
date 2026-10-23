// Un template est remonte a chaque navigation : l'animation d'entree rejoue sur chaque page du site
export default function SiteTemplate({ children }: { children: React.ReactNode }) {
  return <div className="entree-page">{children}</div>
}
