export function MasonryImage({ props, className } : { props: React.ImgHTMLAttributes<HTMLImageElement>, className?: string}) {
  return (
    <div className={`mb-4 break-inside-avoid ${className}`}>
      <img className="w-full object-cover rounded-lg" {...props} />
    </div>
  )
}