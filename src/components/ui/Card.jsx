export default function Card({ children, className = '', hover = true, as: Tag = 'div', ...props }) {
  return (
    <Tag
      className={`glass rounded-2xl p-6 ${hover ? 'card-hover' : ''} ${className}`}
      {...props}
    >
      {children}
    </Tag>
  )
}
